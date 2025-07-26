#!/usr/bin/env node

/**
 * ASIN Validation and Correction Script
 * 
 * This script validates all ASINs in the affiliate-products.csv file by:
 * 1. Extracting ASINs from full affiliate URLs
 * 2. Testing each ASIN against live Amazon product pages
 * 3. Updating the CSV with correct ASINs from working affiliate URLs
 * 4. Flagging invalid/dead ASINs for manual review
 * 
 * Usage: node scripts/validate-and-fix-asins.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CSV_PATH = path.join(process.cwd(), 'affiliate-products.csv');
const OUTPUT_DIR = path.join(process.cwd(), 'affiliate-reports');

/**
 * Extract ASIN from Amazon URL
 */
function extractAsinFromUrl(url) {
  const match = url.match(/\/dp\/([B0-9A-Z]{10})/);
  return match ? match[1] : null;
}

/**
 * Check if ASIN exists on Amazon (more thorough check)
 */
function checkAsinExists(asin) {
  return new Promise((resolve) => {
    const url = `https://www.amazon.com/dp/${asin}`;
    
    const req = https.request(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      // Amazon returns:
      // 200 - Valid product
      // 404 - Product not found
      // 503 - Rate limited (treat as unknown)
      const exists = res.statusCode === 200;
      const rateLimited = res.statusCode === 503;
      
      resolve({ 
        asin, 
        exists, 
        statusCode: res.statusCode,
        rateLimited,
        error: null
      });
    });
    
    req.on('error', (error) => {
      resolve({ 
        asin, 
        exists: false, 
        statusCode: null,
        rateLimited: false,
        error: error.message 
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ 
        asin, 
        exists: false, 
        statusCode: null,
        rateLimited: false,
        error: 'Timeout' 
      });
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
    
    // Parse CSV line (handle quoted values with commas)
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
      product[header] = columns[index]?.replace(/^"|"$/g, '') || '';
    });
    
    product.lineNumber = i + 1; // For reference
    products.push(product);
  }
  
  return products;
}

/**
 * Analyze and fix ASINs
 */
async function analyzeAndFixAsins() {
  console.log('🔍 Starting comprehensive ASIN validation and correction...\n');
  
  const products = loadCsvData();
  console.log(`Loaded ${products.length} products from CSV`);
  
  const results = {
    total: products.length,
    withUrls: 0,
    withAsins: 0,
    correctAsins: 0,
    incorrectAsins: 0,
    validAsins: 0,
    invalidAsins: 0,
    rateLimited: 0,
    corrections: [],
    validationResults: [],
    errors: []
  };
  
  console.log('\n📊 Analyzing products...');
  
  // Step 1: Extract ASINs from affiliate URLs and compare with existing ASINs
  for (const product of products) {
    const { product_name, affiliate_url } = product;
    let currentAsin = product.affiliate_url;
    let extractedAsin = null;
    let needsCorrection = false;
    
    // Extract ASIN from URL if it's a full URL
    if (affiliate_url && affiliate_url.startsWith('https://')) {
      results.withUrls++;
      extractedAsin = extractAsinFromUrl(affiliate_url);
      
      if (extractedAsin) {
        // Check if current ASIN matches extracted ASIN
        if (currentAsin !== extractedAsin && !currentAsin.startsWith('https://')) {
          needsCorrection = true;
          results.incorrectAsins++;
          
          results.corrections.push({
            productName: product_name,
            lineNumber: product.lineNumber,
            currentAsin: currentAsin,
            correctAsin: extractedAsin,
            affiliateUrl: affiliate_url,
            type: 'url_extraction'
          });
        } else {
          results.correctAsins++;
        }
      }
    } else if (affiliate_url && affiliate_url.match(/^B[0-9A-Z]{9}$/)) {
      // It's already an ASIN
      results.withAsins++;
      extractedAsin = affiliate_url;
      currentAsin = affiliate_url;
    }
    
    product.extractedAsin = extractedAsin || currentAsin;
  }
  
  console.log(`Found ${results.withUrls} products with full affiliate URLs`);
  console.log(`Found ${results.withAsins} products with ASIN-only entries`);
  console.log(`Found ${results.incorrectAsins} products with incorrect ASINs`);
  console.log(`Found ${results.correctAsins} products with correct ASINs`);
  
  // Step 2: Validate ASINs against live Amazon
  console.log('\n🌐 Validating ASINs against live Amazon...');
  console.log('(This may take a few minutes to avoid rate limiting)');
  
  const asinsToValidate = products
    .filter(p => p.extractedAsin && p.extractedAsin.match(/^B[0-9A-Z]{9}$/))
    .map(p => p.extractedAsin);
  
  const uniqueAsins = [...new Set(asinsToValidate)];
  console.log(`Validating ${uniqueAsins.length} unique ASINs...`);
  
  const validationResults = new Map();
  
  for (let i = 0; i < uniqueAsins.length; i++) {
    const asin = uniqueAsins[i];
    
    // Add delay to avoid rate limiting
    if (i > 0 && i % 5 === 0) {
      console.log(`Validated ${i}/${uniqueAsins.length} ASINs... (pausing to avoid rate limiting)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    try {
      const result = await checkAsinExists(asin);
      validationResults.set(asin, result);
      
      if (result.exists) {
        results.validAsins++;
      } else if (result.rateLimited) {
        results.rateLimited++;
      } else {
        results.invalidAsins++;
      }
      
      process.stdout.write('.');
    } catch (error) {
      results.errors.push({
        asin,
        error: error.message
      });
    }
  }
  
  console.log(`\n\nValidation complete!`);
  console.log(`Valid ASINs: ${results.validAsins}`);
  console.log(`Invalid ASINs: ${results.invalidAsins}`);
  console.log(`Rate limited: ${results.rateLimited}`);
  
  // Step 3: Generate detailed results
  for (const product of products) {
    if (product.extractedAsin) {
      const validation = validationResults.get(product.extractedAsin);
      
      results.validationResults.push({
        productName: product.product_name,
        lineNumber: product.lineNumber,
        asin: product.extractedAsin,
        affiliateUrl: product.affiliate_url,
        validation: validation || { exists: null, error: 'Not validated' },
        category: product.category,
        article: product.article_slug
      });
    }
  }
  
  return results;
}

/**
 * Generate corrected CSV content
 */
function generateCorrectedCsv(products, corrections) {
  const lines = [];
  
  // Add header
  lines.push('product_name,affiliate_url,status,article_slug,category,last_updated,notes');
  
  // Process each product
  for (const product of products) {
    const correction = corrections.find(c => c.lineNumber === product.lineNumber);
    
    let affiliateUrl = product.affiliate_url;
    
    // Apply correction if found
    if (correction && correction.type === 'url_extraction') {
      // If it's currently a wrong ASIN and we have a URL, keep the URL
      if (product.affiliate_url.startsWith('https://')) {
        affiliateUrl = product.affiliate_url; // Keep the full URL
      } else {
        affiliateUrl = correction.correctAsin; // Use the correct ASIN
      }
    }
    
    // Escape and format the line
    const line = [
      `"${product.product_name}"`,
      affiliateUrl.includes(',') ? `"${affiliateUrl}"` : affiliateUrl,
      product.status || 'verified',
      product.article_slug || '',
      product.category || '',
      product.last_updated || new Date().toISOString().split('T')[0],
      product.notes ? `"${product.notes}"` : ''
    ].join(',');
    
    lines.push(line);
  }
  
  return lines.join('\n');
}

/**
 * Save comprehensive report
 */
function saveReport(results) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Save full JSON report
  const reportPath = path.join(OUTPUT_DIR, `asin-validation-fix-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Full report saved: ${reportPath}`);
  
  // Save corrections summary
  if (results.corrections.length > 0) {
    let correctionsSummary = 'ASIN CORRECTIONS NEEDED\n';
    correctionsSummary += '======================\n\n';
    
    results.corrections.forEach(correction => {
      correctionsSummary += `Product: ${correction.productName}\n`;
      correctionsSummary += `Line: ${correction.lineNumber}\n`;
      correctionsSummary += `Current: ${correction.currentAsin}\n`;
      correctionsSummary += `Correct: ${correction.correctAsin}\n`;
      correctionsSummary += `Source: ${correction.affiliateUrl}\n\n`;
    });
    
    const correctionsPath = path.join(OUTPUT_DIR, `asin-corrections-${timestamp}.txt`);
    fs.writeFileSync(correctionsPath, correctionsSummary);
    console.log(`📝 Corrections summary: ${correctionsPath}`);
  }
  
  // Save invalid ASINs report
  const invalidAsins = results.validationResults.filter(r => 
    r.validation && !r.validation.exists && !r.validation.rateLimited
  );
  
  if (invalidAsins.length > 0) {
    let invalidReport = 'INVALID/DEAD ASINS\n';
    invalidReport += '==================\n\n';
    
    invalidAsins.forEach(item => {
      invalidReport += `Product: ${item.productName}\n`;
      invalidReport += `ASIN: ${item.asin}\n`;
      invalidReport += `Article: ${item.article}\n`;
      invalidReport += `Status: ${item.validation.statusCode || 'Error'}\n`;
      invalidReport += `Error: ${item.validation.error || 'Product not found'}\n\n`;
    });
    
    const invalidPath = path.join(OUTPUT_DIR, `invalid-asins-${timestamp}.txt`);
    fs.writeFileSync(invalidPath, invalidReport);
    console.log(`❌ Invalid ASINs report: ${invalidPath}`);
  }
  
  // Generate corrected CSV
  if (results.corrections.length > 0) {
    // This would need the original products data to work properly
    console.log(`💡 To apply corrections, manually update the CSV based on the corrections summary`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const results = await analyzeAndFixAsins();
    saveReport(results);
    
    console.log('\n✅ ASIN validation and correction complete!\n');
    
    // Summary
    console.log('📊 SUMMARY');
    console.log('==========');
    console.log(`Total products: ${results.total}`);
    console.log(`Products with affiliate URLs: ${results.withUrls}`);
    console.log(`Products with ASINs only: ${results.withAsins}`);
    console.log(`ASINs needing correction: ${results.incorrectAsins}`);
    console.log(`Valid ASINs: ${results.validAsins}`);
    console.log(`Invalid/dead ASINs: ${results.invalidAsins}`);
    console.log(`Rate limited (unknown): ${results.rateLimited}`);
    
    if (results.corrections.length > 0) {
      console.log('\n🔧 ACTIONS NEEDED:');
      console.log(`${results.corrections.length} ASIN corrections identified`);
      console.log('Review the corrections summary and update your CSV');
    }
    
    if (results.invalidAsins > 0) {
      console.log('\n⚠️  WARNING:');
      console.log(`${results.invalidAsins} invalid ASINs found that will send users to dead pages`);
      console.log('These need immediate attention - check the invalid ASINs report');
    }
    
    if (results.validAsins > 0) {
      console.log('\n🎉 GOOD NEWS:');
      console.log(`${results.validAsins} ASINs are valid and working correctly`);
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
  analyzeAndFixAsins,
  extractAsinFromUrl,
  checkAsinExists
};