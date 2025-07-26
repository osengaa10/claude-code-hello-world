#!/usr/bin/env node

/**
 * Affiliate Products Manager
 * 
 * Unified script for managing affiliate products and ASINs
 * 
 * Usage: 
 *   node scripts/affiliate-manager.js audit     - Audit all products
 *   node scripts/affiliate-manager.js validate  - Validate existing ASINs
 *   node scripts/affiliate-manager.js report    - Generate comprehensive report
 *   node scripts/affiliate-manager.js stats     - Show quick statistics
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(process.cwd(), 'affiliate-products.csv');

/**
 * Display usage information
 */
function showUsage() {
  console.log('Affiliate Products Manager');
  console.log('=========================');
  console.log();
  console.log('Usage: node scripts/affiliate-manager.js <command>');
  console.log();
  console.log('Commands:');
  console.log('  audit     - Scan all articles and find products missing ASINs');
  console.log('  validate  - Validate ASIN formats in CSV file');
  console.log('  report    - Generate comprehensive report of all products');
  console.log('  stats     - Show quick statistics');
  console.log('  help      - Show this help message');
  console.log();
}

/**
 * Show quick statistics
 */
function showStats() {
  if (!fs.existsSync(CSV_PATH)) {
    console.log('❌ affiliate-products.csv not found');
    console.log('Run "npm run affiliate:audit" to generate initial data');
    return;
  }
  
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const products = lines.slice(1).filter(line => line.trim());
  
  let verified = 0;
  let pending = 0;
  let withAsins = 0;
  
  const categories = new Set();
  
  for (const line of products) {
    const columns = line.split(',');
    const asin = columns[1]?.replace(/"/g, '').trim();
    const status = columns[2]?.replace(/"/g, '').trim();
    const category = columns[4]?.replace(/"/g, '').trim();
    
    if (category) categories.add(category);
    
    if (status === 'verified') verified++;
    if (status === 'pending') pending++;
    if (asin && asin !== 'pending') withAsins++;
  }
  
  console.log('📊 AFFILIATE PRODUCTS OVERVIEW');
  console.log('==============================');
  console.log(`Total products: ${products.length}`);
  console.log(`Products with ASINs: ${withAsins}`);
  console.log(`Verified products: ${verified}`);
  console.log(`Pending ASINs: ${pending}`);
  console.log(`Categories: ${categories.size} (${Array.from(categories).join(', ')})`);
  console.log();
  
  const completion = Math.round((withAsins / products.length) * 100);
  console.log(`🎯 Completion: ${completion}%`);
  
  if (pending > 0) {
    console.log();
    console.log('📝 Next steps:');
    console.log('  1. Run "npm run affiliate:validate" to see pending products');
    console.log('  2. Collect ASINs for pending products');
    console.log('  3. Update affiliate-products.csv');
  }
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'audit':
      console.log('🔍 Running affiliate products audit...\n');
      require('./audit-affiliate-products.js');
      break;
      
    case 'validate':
      console.log('✅ Validating ASINs...\n');
      require('./validate-asins.js');
      break;
      
    case 'report':
      console.log('📊 Generating comprehensive report...\n');
      await require('./audit-affiliate-products.js');
      console.log('\n' + '='.repeat(50) + '\n');
      await require('./validate-asins.js');
      break;
      
    case 'stats':
      showStats();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showUsage();
      break;
      
    default:
      console.log('❌ Unknown command:', command || '(none)');
      console.log();
      showUsage();
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { showStats, showUsage };