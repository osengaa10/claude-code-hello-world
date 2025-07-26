#!/usr/bin/env node

/**
 * Affiliate URL and ASIN Validation Script
 * 
 * This script validates affiliate URLs and ASINs in the affiliate-products.csv file
 * and checks if they point to valid Amazon products.
 * 
 * Usage: node scripts/validate-asins.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CSV_PATH = path.join(process.cwd(), 'affiliate-products.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'affiliate-reports');

/**
 * Validate ASIN format
 */
function isValidAsinFormat(asin) {
  // ASIN format: B followed by 9 alphanumeric characters
  const asinPattern = /^B[0-9A-Z]{9}$/;
  return asinPattern.test(asin);
}

/**
 * Check if ASIN exists on Amazon (enhanced check)
 */
function checkAsinExists(asin) {
  return new Promise((resolve) => {
    const url = `https://www.amazon.com/dp/${asin}`;
    
    const req = https.request(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AffiliateValidator/1.0)'
      }
    }, (res) => {
      // Amazon returns 200 for valid products, 404 for invalid
      const exists = res.statusCode === 200;
      const rateLimited = res.statusCode === 503;
      resolve({ 
        asin, 
        exists, 
        statusCode: res.statusCode,
        rateLimited,
        warning: rateLimited ? 'Rate limited - status unknown' : null
      });
    });
    
    req.on('error', (error) => {
      resolve({ asin, exists: false, error: error.message });
    });
    
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ asin, exists: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

/**
 * Load and parse CSV file
 */
function loadCsvData() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error('affiliate-products.csv not found');
  }
  
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV line (handle quoted values)
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
    
    const product = {};
    headers.forEach((header, index) => {
      product[header] = columns[index]?.replace(/"/g, '') || '';
    });
    
    products.push(product);
  }
  
  return products;
}

/**
 * Generate ASIN validation report
 */
async function validateAsins(options = {}) {
  const { liveValidation = false } = options;
  console.log('🔍 Starting ASIN validation...\n');
  
  const products = loadCsvData();
  console.log(`Loaded ${products.length} products from CSV`);
  
  const validationResults = {
    total: products.length,
    withAsins: 0,
    validFormat: 0,
    invalidFormat: 0,
    pending: 0,
    verified: [],
    formatIssues: [],
    pendingAsins: [],
    networkChecks: []
  };
  
  // Validate affiliate URLs and ASINs
  for (const product of products) {
    const { product_name, affiliate_url, status } = product;
    
    if (!affiliate_url || affiliate_url === 'pending') {
      validationResults.pending++;
      validationResults.pendingAsins.push({
        productName: product_name,
        status: status || 'unknown',
        category: product.category || 'unknown'
      });
      continue;
    }
    
    validationResults.withAsins++;
    
    // Check if it's a full URL or just an ASIN
    let asin = affiliate_url;
    let isValidFormat = false;
    
    if (affiliate_url.startsWith('https://')) {
      // Extract ASIN from URL
      const match = affiliate_url.match(/\/dp\/([B0-9A-Z]{10})/);
      if (match) {
        asin = match[1];
        isValidFormat = isValidAsinFormat(asin);
      } else {
        validationResults.invalidFormat++;
        validationResults.formatIssues.push({
          productName: product_name,
          asin: affiliate_url,
          issue: 'Unable to extract ASIN from affiliate URL'
        });
        continue;
      }
    } else {
      // Direct ASIN
      isValidFormat = isValidAsinFormat(affiliate_url);
    }
    
    if (isValidFormat) {
      validationResults.validFormat++;
      validationResults.verified.push({
        productName: product_name,
        asin,
        affiliateUrl: affiliate_url,
        status: status || 'unknown'
      });
    } else {
      validationResults.invalidFormat++;
      validationResults.formatIssues.push({
        productName: product_name,
        asin: affiliate_url,
        issue: 'Invalid ASIN format (should be B + 9 alphanumeric chars)'
      });
    }
  }
  
  // Live validation if requested
  if (liveValidation && validationResults.verified.length > 0) {
    console.log('\n🌐 Running live Amazon validation...');
    console.log('(This may take a few minutes)\n');
    
    const liveResults = [];
    const asinsToCheck = validationResults.verified
      .filter(item => item.asin && item.asin.match(/^B[0-9A-Z]{9}$/))
      .slice(0, 15); // Limit to avoid rate limiting
    
    for (let i = 0; i < asinsToCheck.length; i++) {
      const item = asinsToCheck[i];
      
      if (i > 0 && i % 3 === 0) {
        console.log(`\nChecked ${i}/${asinsToCheck.length} ASINs... (pausing)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const result = await checkAsinExists(item.asin);
      liveResults.push({
        ...item,
        liveValidation: result
      });
      
      process.stdout.write(result.exists ? '✓' : (result.rateLimited ? '?' : '✗'));
    }
    
    validationResults.liveValidation = liveResults;
    
    const deadAsins = liveResults.filter(r => !r.liveValidation.exists && !r.liveValidation.rateLimited);
    const rateLimited = liveResults.filter(r => r.liveValidation.rateLimited).length;
    console.log(`\n\nLive validation complete!`);
    console.log(`Dead/invalid ASINs found: ${deadAsins.length}`);
    
    if (deadAsins.length > 0) {
      console.log('\n❌ DEAD ASINS FOUND:');
      deadAsins.forEach(item => {
        console.log(`• ${item.productName}: ${item.asin} (${item.liveValidation.statusCode || 'error'})`);
      });
      console.log('\n⚠️  These ASINs will send users to dead pages!');
    }
    
    if (rateLimited > 0) {
      console.log(`\n⏳ ${rateLimited} ASINs were rate limited (status unknown)`);
    }
  }
  
  console.log('\n📊 VALIDATION SUMMARY');
  console.log('====================');
  console.log(`Total products: ${validationResults.total}`);
  console.log(`Products with URLs/ASINs: ${validationResults.withAsins}`);
  console.log(`Valid format: ${validationResults.validFormat}`);
  console.log(`Invalid format: ${validationResults.invalidFormat}`);
  console.log(`Pending affiliate URLs: ${validationResults.pending}`);
  
  if (liveValidation && validationResults.liveValidation) {
    const liveResults = validationResults.liveValidation;
    const workingCount = liveResults.filter(r => r.liveValidation.exists).length;
    const deadCount = liveResults.filter(r => !r.liveValidation.exists && !r.liveValidation.rateLimited).length;
    console.log(`Live validation: ${workingCount}/${liveResults.length} ASINs working, ${deadCount} dead`);
  }
  
  console.log();
  
  // Show format issues
  if (validationResults.formatIssues.length > 0) {
    console.log('🚨 ASIN FORMAT ISSUES');
    console.log('=====================');
    validationResults.formatIssues.forEach(issue => {
      console.log(`• ${issue.productName}: ${issue.asin}`);
      console.log(`  Issue: ${issue.issue}\n`);
    });
  }
  
  // Show pending ASINs (high priority)
  if (validationResults.pendingAsins.length > 0) {
    console.log('⏳ PENDING ASINs (Need manual collection)');
    console.log('=========================================');
    
    // Group by category for easier collection
    const byCategory = {};
    validationResults.pendingAsins.forEach(item => {
      const cat = item.category || 'miscellaneous';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    });
    
    Object.entries(byCategory).forEach(([category, items]) => {
      console.log(`\n${category.toUpperCase()}:`);
      items.forEach(item => {
        console.log(`  • ${item.productName} (${item.status})`);
      });
    });
    console.log();
  }
  
  return validationResults;
}

/**
 * Generate Amazon search URLs for pending products
 */
function generateSearchUrls(pendingProducts) {
  return pendingProducts.map(product => {
    const searchQuery = product.productName.replace(/\s+/g, '+');
    const url = `https://amazon.com/s?k=${encodeURIComponent(searchQuery)}`;
    
    return {
      productName: product.productName,
      searchUrl: url,
      category: product.category
    };
  });
}

/**
 * Save validation report
 */
function saveValidationReport(results) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save full validation report
  const reportPath = path.join(OUTPUT_DIR, `asin-validation-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Validation report saved: ${reportPath}`);
  
  // Generate ASIN collection worksheet
  if (results.pendingAsins.length > 0) {
    const searchUrls = generateSearchUrls(results.pendingAsins);
    
    let worksheet = 'ASIN COLLECTION WORKSHEET\\n';
    worksheet += '=========================\\n\\n';
    worksheet += 'Instructions:\\n';
    worksheet += '1. Click the Amazon search URL for each product\\n';
    worksheet += '2. Find the correct product on Amazon\\n';
    worksheet += '3. Copy the ASIN from the product URL (format: /dp/ASIN)\\n';
    worksheet += '4. Update the affiliate-products.csv file\\n\\n';
    
    // Group by category
    const byCategory = {};
    searchUrls.forEach(item => {
      const cat = item.category || 'miscellaneous';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    });
    
    Object.entries(byCategory).forEach(([category, items]) => {
      worksheet += `${category.toUpperCase()}:\\n`;
      worksheet += '='.repeat(category.length + 1) + '\\n';
      
      items.forEach((item, index) => {
        worksheet += `\\n${index + 1}. ${item.productName}\\n`;
        worksheet += `   Search: ${item.searchUrl}\\n`;
        worksheet += `   ASIN: ____________\\n`;
      });
      
      worksheet += '\\n';
    });
    
    const worksheetPath = path.join(OUTPUT_DIR, `asin-collection-worksheet-${timestamp}.txt`);
    fs.writeFileSync(worksheetPath, worksheet);
    console.log(`📋 ASIN collection worksheet: ${worksheetPath}`);
  }
  
  // Generate CSV update template
  if (results.pendingAsins.length > 0) {
    const csvHeader = 'product_name,current_asin,new_asin,notes\\n';
    const csvRows = results.pendingAsins.map(product => {
      return `"${product.productName}",pending,,"TODO: Add ASIN"`;
    }).join('\\n');
    
    const updateTemplatePath = path.join(OUTPUT_DIR, `csv-update-template-${timestamp}.csv`);
    fs.writeFileSync(updateTemplatePath, csvHeader + csvRows);
    console.log(`📝 CSV update template: ${updateTemplatePath}`);
  }
}

/**
 * Main validation function
 */
async function main() {
  try {
    // Check for live validation flag
    const liveValidation = process.argv.includes('--live') || process.argv.includes('-l');
    
    if (liveValidation) {
      console.log('🌐 Live validation mode enabled');
      console.log('This will check ASINs against Amazon\'s servers\n');
    }
    
    const results = await validateAsins({ liveValidation });
    saveValidationReport(results);
    
    console.log('\\n✅ ASIN validation complete!');
    
    if (results.pendingAsins.length > 0) {
      console.log('\\n📝 Next steps:');
      console.log('1. Use the ASIN collection worksheet to find product ASINs');
      console.log('2. Update affiliate-products.csv with the new ASINs');
      console.log('3. Re-run validation to verify updates');
      console.log('4. Deploy to apply changes to live site');
    } else {
      console.log('\\n🎉 All products have valid ASINs!');
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateAsins,
  isValidAsinFormat,
  generateSearchUrls
};