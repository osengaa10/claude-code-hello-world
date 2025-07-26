#!/usr/bin/env node

/**
 * Affiliate Products Audit Script
 * 
 * This script scans all MDX files to find AmazonButton components,
 * extracts product names, and generates reports on missing ASINs.
 * 
 * Usage: node scripts/audit-affiliate-products.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');
const CSV_PATH = path.join(process.cwd(), 'affiliate-products.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'affiliate-reports');

/**
 * Find all MDX files in content directory
 */
function findMdxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Extract AmazonButton product names from MDX content
 */
function extractAmazonProducts(content, filePath) {
  const products = [];
  
  // Regex to match AmazonButton components
  const amazonButtonRegex = /<AmazonButton\s+[^>]*productName=["']([^"']+)["'][^>]*(?:asin=["']([^"']+)["'][^>]*)?>/g;
  
  let match;
  while ((match = amazonButtonRegex.exec(content)) !== null) {
    const productName = match[1];
    const asin = match[2] || null;
    
    products.push({
      productName,
      asin,
      filePath: path.relative(process.cwd(), filePath),
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return products;
}

/**
 * Load existing affiliate products from CSV
 */
function loadAffiliateProductsCsv() {
  const products = new Map();
  
  if (!fs.existsSync(CSV_PATH)) {
    console.warn('affiliate-products.csv not found');
    return products;
  }
  
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Simple CSV parsing (handles quoted values)
    const columns = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        columns.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    columns.push(current.trim());
    
    if (columns.length >= 2) {
      const productName = columns[0].replace(/"/g, '');
      const affiliateUrl = columns[1].replace(/"/g, '');
      const status = columns[2]?.replace(/"/g, '') || 'unknown';
      
      // Extract ASIN from affiliate URL for backward compatibility
      let asin = affiliateUrl;
      if (affiliateUrl.includes('/dp/')) {
        const match = affiliateUrl.match(/\/dp\/([B0-9A-Z]{10})/);
        if (match) {
          asin = match[1];
        }
      }
      
      products.set(productName, { asin, affiliateUrl, status });
    }
  }
  
  return products;
}

/**
 * Generate audit report
 */
function generateAuditReport() {
  console.log('🔍 Starting affiliate products audit...\n');
  
  // Find all MDX files
  const mdxFiles = findMdxFiles(CONTENT_DIR);
  console.log(`Found ${mdxFiles.length} MDX files`);
  
  // Extract all products from articles
  const allProducts = [];
  const productsByFile = new Map();
  
  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const products = extractAmazonProducts(content, file);
    
    if (products.length > 0) {
      allProducts.push(...products);
      productsByFile.set(file, products);
    }
  }
  
  console.log(`Found ${allProducts.length} AmazonButton instances across ${productsByFile.size} articles`);
  
  // Load existing CSV data
  const csvProducts = loadAffiliateProductsCsv();
  console.log(`Loaded ${csvProducts.size} products from CSV\n`);
  
  // Analysis
  const uniqueProducts = new Map();
  const productsWithAsins = new Set();
  const productsNeedingAsins = new Set();
  const missingFromCsv = new Set();
  
  // Analyze each product usage
  for (const product of allProducts) {
    const { productName, asin } = product;
    
    if (!uniqueProducts.has(productName)) {
      uniqueProducts.set(productName, []);
    }
    uniqueProducts.get(productName).push(product);
    
    // Check if product has ASIN (from component or CSV)
    const csvData = csvProducts.get(productName);
    const hasAsin = asin || (csvData && csvData.asin && csvData.asin !== 'pending');
    
    if (hasAsin) {
      productsWithAsins.add(productName);
    } else {
      productsNeedingAsins.add(productName);
    }
    
    if (!csvProducts.has(productName)) {
      missingFromCsv.add(productName);
    }
  }
  
  // Generate reports
  const reports = {
    summary: {
      totalProducts: uniqueProducts.size,
      totalUsages: allProducts.length,
      productsWithAsins: productsWithAsins.size,
      productsNeedingAsins: productsNeedingAsins.size,
      missingFromCsv: missingFromCsv.size,
      articlesWithProducts: productsByFile.size
    },
    productsNeedingAsins: Array.from(productsNeedingAsins).map(name => {
      const usages = uniqueProducts.get(name);
      const csvData = csvProducts.get(name);
      
      return {
        productName: name,
        usageCount: usages.length,
        files: usages.map(u => u.filePath),
        csvStatus: csvData?.status || 'missing',
        csvAsin: csvData?.asin || 'none'
      };
    }),
    missingFromCsv: Array.from(missingFromCsv).map(name => {
      const usages = uniqueProducts.get(name);
      const hasInlineAsin = usages.some(u => u.asin);
      
      return {
        productName: name,
        usageCount: usages.length,
        files: usages.map(u => u.filePath),
        hasInlineAsin,
        suggestedCategory: categorizeProduct(name)
      };
    }),
    allProducts: Array.from(uniqueProducts.entries()).map(([name, usages]) => {
      const csvData = csvProducts.get(name);
      const hasAsin = usages.some(u => u.asin) || (csvData && csvData.asin && csvData.asin !== 'pending');
      
      return {
        productName: name,
        usageCount: usages.length,
        files: usages.map(u => u.filePath),
        hasAsin,
        csvStatus: csvData?.status || 'missing',
        inlineAsins: usages.filter(u => u.asin).map(u => u.asin)
      };
    })
  };
  
  // Display summary
  console.log('📊 AUDIT SUMMARY');
  console.log('================');
  console.log(`Total unique products: ${reports.summary.totalProducts}`);
  console.log(`Total product usages: ${reports.summary.totalUsages}`);
  console.log(`Articles with products: ${reports.summary.articlesWithProducts}`);
  console.log(`Products with ASINs: ${reports.summary.productsWithAsins}`);
  console.log(`Products needing ASINs: ${reports.summary.productsNeedingAsins}`);
  console.log(`Products missing from CSV: ${reports.summary.missingFromCsv}\n`);
  
  // Show high-priority missing ASINs
  if (reports.productsNeedingAsins.length > 0) {
    console.log('🚨 HIGH PRIORITY: Products needing ASINs');
    console.log('=========================================');
    
    reports.productsNeedingAsins
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)
      .forEach(product => {
        console.log(`• ${product.productName} (used ${product.usageCount} times)`);
        console.log(`  Files: ${product.files.join(', ')}`);
        console.log(`  CSV Status: ${product.csvStatus}\n`);
      });
  }
  
  return reports;
}

/**
 * Categorize product based on name
 */
function categorizeProduct(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('keyboard') || name.includes('mouse') || name.includes('webcam')) return 'peripherals';
  if (name.includes('headphone') || name.includes('earbud') || name.includes('speaker') || name.includes('microphone')) return 'audio';
  if (name.includes('monitor') || name.includes('display')) return 'monitors';
  if (name.includes('power bank') || name.includes('battery') || name.includes('charger')) return 'power';
  if (name.includes('chair') || name.includes('desk')) return 'office';
  if (name.includes('camera') || name.includes('webcam')) return 'cameras';
  if (name.includes('storage') || name.includes('ssd') || name.includes('drive')) return 'storage';
  if (name.includes('smart') || name.includes('thermostat') || name.includes('home')) return 'smart-home';
  if (name.includes('car') || name.includes('automotive') || name.includes('dash')) return 'automotive';
  if (name.includes('meditation') || name.includes('yoga') || name.includes('fitness')) return 'health';
  
  return 'miscellaneous';
}

/**
 * Generate missing products CSV template
 */
function generateMissingProductsCsv(missingProducts) {
  const csvHeader = 'product_name,affiliate_url,status,article_slug,category,last_updated,notes\n';
  
  const csvRows = missingProducts.map(product => {
    const slug = product.files[0]?.replace(/^content\//, '').replace(/\.mdx$/, '') || 'unknown';
    const category = product.suggestedCategory;
    const date = new Date().toISOString().split('T')[0];
    
    return `"${product.productName}",pending,pending,${slug},${category},${date},"Need affiliate URL - used ${product.usageCount} times"`;
  });
  
  return csvHeader + csvRows.join('\n');
}

/**
 * Save reports to files
 */
function saveReports(reports) {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save full report as JSON
  const fullReportPath = path.join(OUTPUT_DIR, `affiliate-audit-${timestamp}.json`);
  fs.writeFileSync(fullReportPath, JSON.stringify(reports, null, 2));
  console.log(`📄 Full report saved: ${fullReportPath}`);
  
  // Save missing products CSV template
  if (reports.missingFromCsv.length > 0) {
    const csvTemplate = generateMissingProductsCsv(reports.missingFromCsv);
    const csvTemplatePath = path.join(OUTPUT_DIR, `missing-products-${timestamp}.csv`);
    fs.writeFileSync(csvTemplatePath, csvTemplate);
    console.log(`📋 Missing products CSV template: ${csvTemplatePath}`);
  }
  
  // Save prioritized ASIN collection list
  const priorityList = reports.productsNeedingAsins
    .sort((a, b) => b.usageCount - a.usageCount)
    .map(p => `${p.productName} (${p.usageCount} usages) - ${p.files.join(', ')}`)
    .join('\n');
  
  const priorityPath = path.join(OUTPUT_DIR, `priority-asins-${timestamp}.txt`);
  fs.writeFileSync(priorityPath, priorityList);
  console.log(`⭐ Priority ASIN collection list: ${priorityPath}`);
}

// Main execution
function main() {
  try {
    const reports = generateAuditReport();
    saveReports(reports);
    
    console.log('\n✅ Audit complete!');
    console.log('\nNext steps:');
    console.log('1. Review the priority ASIN collection list');
    console.log('2. Manually collect Amazon ASINs for high-priority products');
    console.log('3. Update affiliate-products.csv with new ASINs');
    console.log('4. Re-run this audit to verify completeness');
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateAuditReport,
  extractAmazonProducts,
  findMdxFiles,
  categorizeProduct
};