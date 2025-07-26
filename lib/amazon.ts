/**
 * Amazon Affiliate Link Utilities
 * Generates Amazon affiliate links with the unbiasedtechr-20 tag
 */

const AFFILIATE_TAG = 'unbiasedtechr-20';

/**
 * Generate Amazon search link with affiliate tag
 */
export function generateAmazonSearchLink(productName: string): string {
  if (!productName || typeof productName !== 'string') {
    console.error('Invalid productName passed to generateAmazonSearchLink:', productName);
    return `https://amazon.com/?tag=${AFFILIATE_TAG}`;
  }
  
  const searchQuery = productName.replace(/\s+/g, '+');
  return `https://amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=${AFFILIATE_TAG}`;
}

/**
 * Generate Amazon product link with ASIN and affiliate tag
 */
export function generateAmazonProductLink(asin: string): string {
  return `https://amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * Generate Amazon link with fallback to search if no ASIN provided
 */
export function generateAmazonLink(productName: string, asin?: string): string {
  if (!productName || typeof productName !== 'string') {
    console.error('Invalid productName passed to generateAmazonLink:', productName);
    return `https://amazon.com/?tag=${AFFILIATE_TAG}`;
  }
  
  if (asin) {
    return generateAmazonProductLink(asin);
  }
  return generateAmazonSearchLink(productName);
}

/**
 * Product URLs loaded from CSV file at build time
 * This is populated server-side and passed to client components
 */
let PRODUCT_URLS: Record<string, string> = {};

// Initialize PRODUCT_URLS based on environment
async function initializeProductUrls() {
  if (typeof window === 'undefined') {
    // Server-side: Load from CSV
    try {
      const { generateProductUrls } = await import('./csv-loader');
      PRODUCT_URLS = generateProductUrls();
      console.log(`Loaded ${Object.keys(PRODUCT_URLS).length} product URLs from CSV`);
    } catch (error) {
      console.error('Failed to load product URLs from CSV:', error);
      // Fallback to essential ASINs (for backward compatibility)
      PRODUCT_URLS = {
        // New articles with verified ASINs
        'Sony WF-C500': 'B094C4VDJZ',
        'Jabra Elite 3': 'B08YRLWZLQ', 
        'JLab Audio JBuds Air': 'B07TQPZQ1R',
        'Hugger Mugger Zafu Meditation Cushion': 'B0000AXD9Y',
        'Peace Yoga Crescent Meditation Cushion': 'B07QMQY9R8',
        'Florensi Meditation Cushion Set': 'B083TQHG8X',
        'NOCO Boost Plus GB40': 'B015TKUPIC',
        'Clore Automotive Jump-N-Carry JNC660': 'B000JHN0MS',
        'Hulkman Alpha85 Jump Starter': 'B07JBQZPX8',
        'Logitech MX Master 3S': 'B09HM94VDS',
        'Razer Basilisk X Hyperspeed': 'B07YPBQSCK',
        'Microsoft Ergonomic Mouse': 'B07S395RWD',
        'ASUS VA24EHE 24-inch Monitor': 'B08LCQSC1J',
        'LG 24MK430H-B 24-Inch Monitor': 'B07PGL2WVS',
        'Dell S2421DS 24-Inch QHD Monitor': 'B08G14DP7L',
        // Power stations and accessories
        'Jackery Explorer 300': 'B082TMBYR6',
        'Jackery Explorer 500': 'B07SM5HBK1',
        'Goal Zero Yeti 400': 'B078LY8Q7V',
        'EcoFlow River 2': 'B0BSJBYN1S',
        'Anker PowerCore 10000': 'B019GJLER8',
        // Smart home
        'Nest Learning': 'B0131RG6VK',
        'Ecobee SmartThermostat': 'B07NQT85FC',
        'Honeywell T9': 'B07BS2XHVD',
      };
    }
  } else {
    // Client-side: Use fallback (server should have already loaded)
    // This shouldn't normally be needed since components get server-rendered
  }
}

// Initialize on module load (server-side only)
if (typeof window === 'undefined') {
  initializeProductUrls();
}

/**
 * Get all product URLs (for use in components)
 */
export function getProductUrls(): Record<string, string> {
  return PRODUCT_URLS;
}

/**
 * Get all product ASINs (for backward compatibility)
 */
export function getProductAsins(): Record<string, string> {
  const asins: Record<string, string> = {};
  Object.entries(PRODUCT_URLS).forEach(([productName, url]) => {
    if (url.startsWith('B') && url.length === 10) {
      // It's an ASIN, use directly
      asins[productName] = url;
    } else {
      // Extract ASIN from URL
      const match = url.match(/\/dp\/([B0-9A-Z]{10})/);
      if (match) {
        asins[productName] = match[1];
      }
    }
  });
  return asins;
}

/**
 * Set product URLs (for testing or manual override)
 */
export function setProductUrls(urls: Record<string, string>): void {
  PRODUCT_URLS = urls;
}

/**
 * Set product ASINs (for backward compatibility)
 */
export function setProductAsins(asins: Record<string, string>): void {
  PRODUCT_URLS = asins;
}

/**
 * Cache for invalid ASINs to avoid repeated failures
 */
const INVALID_ASINS = new Set<string>();

/**
 * Mark an ASIN as invalid (for client-side failure tracking)
 */
export function markAsinInvalid(asin: string): void {
  if (asin && asin.match(/^B[0-9A-Z]{9}$/)) {
    INVALID_ASINS.add(asin);
    console.warn(`ASIN marked as invalid: ${asin}`);
  }
}

/**
 * Check if an ASIN is known to be invalid
 */
export function isAsinMarkedInvalid(asin: string): boolean {
  return INVALID_ASINS.has(asin);
}

/**
 * Get Amazon link for a product with fallback handling
 */
export function getProductAmazonLink(productName: string): string {
  if (!productName || typeof productName !== 'string') {
    console.error('Invalid productName passed to getProductAmazonLink:', productName);
    return `https://amazon.com/?tag=${AFFILIATE_TAG}`;
  }
  
  const urlOrAsin = PRODUCT_URLS[productName];
  
  if (!urlOrAsin) {
    console.warn(`No affiliate URL found for product: ${productName}, falling back to search`);
    return generateAmazonSearchLink(productName);
  }
  
  // If it's a full URL, return it directly (these are usually reliable)
  if (urlOrAsin.startsWith('https://')) {
    return urlOrAsin;
  }
  
  // If it's an ASIN, check if it's marked as invalid
  if (urlOrAsin.startsWith('B') && urlOrAsin.length === 10) {
    if (isAsinMarkedInvalid(urlOrAsin)) {
      console.warn(`Using search fallback for invalid ASIN ${urlOrAsin} (product: ${productName})`);
      return generateAmazonSearchLink(productName);
    }
    return generateAmazonProductLink(urlOrAsin);
  }
  
  // Fallback to search for any other format
  console.warn(`Unknown affiliate URL format for ${productName}: ${urlOrAsin}, falling back to search`);
  return generateAmazonSearchLink(productName);
}