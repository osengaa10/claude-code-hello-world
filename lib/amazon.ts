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
 * Common product ASINs for frequently mentioned items
 */
export const PRODUCT_ASINS: Record<string, string> = {
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
  
  // Headphones & Audio
  'SteelSeries Arctis 7': 'B07FZVXS8H',
  'HyperX Cloud II': 'B00SAYCXWG',
  'Razer BlackShark V2': 'B0876Z5FJZ',
  
  // VPN Services (redirect to official sites)
  'ExpressVPN': '',
  'NordVPN': '',
  'Surfshark': '',
  
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
  
  // Dash Cams
  'Garmin Dash Cam 66W': 'B07RCKNJ6N',
  'Nextbase 622GW': 'B088X7K9CN',
  'Viofo A129 Pro Duo': 'B07T5T7PRR',
  
  // SSDs
  'Samsung T7': 'B0874XN4D8',
  'SanDisk Extreme Pro': 'B08GTYFC37',
  'Crucial X8': 'B07YD5P6ZQ',
  
  // Smart Home
  'Nest Learning': 'B0131RG6VK',
  'Ecobee SmartThermostat': 'B07NQT85FC',
  'Honeywell T9': 'B07BS2XHVD',
  
  // New Article Products - Earbuds
  'Sony WF-C500': 'B09CFP6J6D', // Verified: Black variant on Amazon
  'Jabra Elite 3': 'B09B468VKX', // Verified: Navy variant on Amazon
  'JLab Audio JBuds Air': 'B07HGL3J31', // Verified: True Wireless Signature Bluetooth Earbuds
  
  // New Article Products - Meditation
  'Hugger Mugger Zafu Meditation Cushion': 'B0000AXD9Y',
  'Peace Yoga Crescent Meditation Cushion': 'B07QMQY9R8',
  'Florensi Meditation Cushion Set': 'B083TQHG8X',
};

/**
 * Get Amazon link for a product
 */
export function getProductAmazonLink(productName: string): string {
  if (!productName || typeof productName !== 'string') {
    console.error('Invalid productName passed to getProductAmazonLink:', productName);
    return `https://amazon.com/?tag=${AFFILIATE_TAG}`;
  }
  
  const asin = PRODUCT_ASINS[productName];
  return generateAmazonLink(productName, asin);
}