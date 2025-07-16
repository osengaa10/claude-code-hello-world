#!/usr/bin/env node

/**
 * Script to add Amazon affiliate links to all articles
 * This script processes MDX files and adds ProductLink components and AmazonButton CTAs
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../content');
const AFFILIATE_TAG = 'unbiasedtechr-20';

// Product mappings with ASINs
const PRODUCT_ASINS = {
  // Power Banks
  'Anker PowerCore 10000': 'B019GJLER8',
  'RAVPower 20000': 'B019IFIJW8',
  'Aukey 10000mAh': 'B01F8IRIN0',
  
  // Power Stations
  'Jackery Explorer 300': 'B082TMBYR6',
  'Jackery Explorer 500': 'B084HPQ96Y',
  'Goal Zero Yeti 400': 'B078LY8Q7V',
  'EcoFlow River 2': 'B0BSJBYN1S',
  'Bluetti AC200MAX': 'B08T7QTHQF',
  'Goal Zero Yeti 1000': 'B078LYDJPF',
  
  // Gaming Headsets
  'SteelSeries Arctis 7': 'B07FZVXS8H',
  'HyperX Cloud II': 'B00SAYCXWG',
  'Razer BlackShark V2': 'B0876Z5FJZ',
  
  // Kitchen Appliances
  'Ninja Foodi': 'B07S6443CX',
  'Cosori Air Fryer': 'B0785N7T8P',
  'Instant Pot Vortex Plus': 'B08J6W38L7',
  
  // Smartphones
  'OnePlus Nord N20': 'B09VK9Y1DS',
  'Moto G Power': 'B084D3CTG1',
  'Samsung Galaxy A53': 'B09SVVNLQN',
  
  // TVs
  'TCL 6-Series': 'B08857ZHY1',
  'Hisense U6G': 'B08VJ2JLCV',
  'Roku TV 55R635': 'B08716XNH8',
  
  // Drones
  'DJI Mini 2': 'B08MF3C8S5',
  'Holy Stone HS720': 'B085KYNG4C',
  'Potensic D88': 'B085LNLHPG',
  
  // Robot Vacuums
  'Roomba i7+': 'B07GNYDPJ6',
  'Shark IQ Robot': 'B07WDQYRZY',
  'Eufy RoboVac 11S': 'B07QLQ8Z5R',
  
  // Graphics Cards
  'RTX 3060': 'B08W8DGK3X',
  'RTX 4060': 'B0C2SYR3FJ',
  'GTX 1660 Super': 'B07ZHZL2JB',
  
  // Audio
  'Sony WH-1000XM4': 'B0863TXGM3',
  'Bose QuietComfort 35 II': 'B0756CYWWD',
  'Apple AirPods Pro': 'B09JQMJHXY',
  
  // Smart Home
  'Nest Learning': 'B0131RG6VK',
  'Ecobee SmartThermostat': 'B07NQT85FC',
  'Honeywell T9': 'B07BS2XHVD',
};

// Extract product names from article content
function extractProductNames(content, articleTitle) {
  const productNames = [];
  
  // Extract from tags in frontmatter
  const tagsMatch = content.match(/tags:\s*\[(.*?)\]/s);
  if (tagsMatch) {
    const tags = tagsMatch[1].split(',').map(tag => tag.replace(/["\[\]]/g, '').trim());
    productNames.push(...tags);
  }
  
  // Extract common product patterns from content
  const patterns = [
    /(?:the\s+)?([A-Z][a-zA-Z0-9\s]+(?:i7\+|PowerCore|Explorer|Arctis|Galaxy|iPhone|iPad|MacBook|Surface|ThinkPad|XPS|ROG|TUF|RTX|GTX)[\w\s]*)/g,
    /([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z0-9\s]*(?:Pro|Plus|Max|Ultra|Mini|Lite|Air|Studio)[\w\s]*)/g,
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      productNames.push(...matches.map(match => match.trim()));
    }
  });
  
  // Filter and deduplicate
  return [...new Set(productNames)]
    .filter(name => name.length > 3 && name.length < 50)
    .slice(0, 10); // Limit to 10 products per article
}

// Generate ProductLink component
function generateProductLink(productName, asin) {
  if (asin) {
    return `<ProductLink productName="${productName}" asin="${asin}">${productName}</ProductLink>`;
  }
  return `<ProductLink productName="${productName}">${productName}</ProductLink>`;
}

// Generate AmazonButton components
function generateAmazonButtons(products) {
  const buttons = products.map(product => {
    const asin = PRODUCT_ASINS[product.name];
    if (asin) {
      return `  <AmazonButton productName="${product.name}" asin="${asin}" />`;
    }
    return `  <AmazonButton productName="${product.name}" />`;
  }).join('\n');
  
  return `
## Shop These Products on Amazon

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;">
${buttons}
</div>

*As Amazon Associates, we earn from qualifying purchases. Prices and availability are subject to change.*`;
}

// Process a single article
function processArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.mdx');
    
    console.log(`Processing: ${fileName}`);
    
    // Skip if already has affiliate links
    if (content.includes('ProductLink') || content.includes('AmazonButton')) {
      console.log(`  ✓ Already has affiliate links, skipping`);
      return;
    }
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n(.*?)\n---\n(.*)/s);
    if (!frontmatterMatch) {
      console.log(`  ✗ No frontmatter found, skipping`);
      return;
    }
    
    const [, frontmatter, articleContent] = frontmatterMatch;
    const title = frontmatter.match(/title:\s*["'](.*?)["']/)?.[1] || fileName;
    
    // Extract products from tags
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/s);
    const products = [];
    
    if (tagsMatch) {
      const tags = tagsMatch[1].split(',').map(tag => tag.replace(/["\[\]]/g, '').trim());
      tags.forEach(tag => {
        if (tag && tag.length > 2) {
          products.push({ name: tag, asin: PRODUCT_ASINS[tag] });
        }
      });
    }
    
    if (products.length === 0) {
      console.log(`  ✗ No products found in tags, skipping`);
      return;
    }
    
    // Replace product mentions with ProductLink components
    let updatedContent = articleContent;
    
    products.forEach(product => {
      // Replace bold product mentions with ProductLink
      const boldPattern = new RegExp(`\\*\\*${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*`, 'g');
      const linkComponent = `**${generateProductLink(product.name, product.asin)}**`;
      updatedContent = updatedContent.replace(boldPattern, linkComponent);
      
      // Replace standalone mentions in conclusions/recommendations
      const standalonePattern = new RegExp(`\\b${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      updatedContent = updatedContent.replace(standalonePattern, (match, offset) => {
        // Only replace if not already in a component
        const before = updatedContent.substring(Math.max(0, offset - 100), offset);
        const after = updatedContent.substring(offset, offset + 100);
        
        if (before.includes('ProductLink') || after.includes('ProductLink') || 
            before.includes('**') || after.includes('**')) {
          return match;
        }
        
        return generateProductLink(product.name, product.asin);
      });
    });
    
    // Add Amazon buttons section before the last paragraph
    const amazonButtonsSection = generateAmazonButtons(products);
    
    // Find a good place to insert the buttons (before conclusion or at the end)
    const conclusionMatch = updatedContent.match(/(##?\s*(Conclusion|Summary|Final\s+Thoughts).*)/s);
    if (conclusionMatch) {
      const beforeConclusion = updatedContent.substring(0, conclusionMatch.index);
      const conclusion = conclusionMatch[1];
      updatedContent = beforeConclusion + amazonButtonsSection + '\n\n' + conclusion;
    } else {
      updatedContent = updatedContent + '\n\n' + amazonButtonsSection;
    }
    
    // Reconstruct the file
    const newContent = `---\n${frontmatter}\n---\n${updatedContent}`;
    
    // Write back to file
    fs.writeFileSync(filePath, newContent);
    console.log(`  ✓ Added affiliate links for ${products.length} products`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('Adding Amazon affiliate links to articles...');
  console.log(`Affiliate Tag: ${AFFILIATE_TAG}\n`);
  
  // Get all MDX files
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(CONTENT_DIR, file));
  
  console.log(`Found ${files.length} articles to process\n`);
  
  files.forEach(processArticle);
  
  console.log('\n✅ Affiliate link integration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the updated articles');
  console.log('2. Test the affiliate links');
  console.log('3. Deploy to production');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processArticle, extractProductNames, generateProductLink };