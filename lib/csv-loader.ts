/**
 * CSV Loader for Affiliate Products
 * Loads affiliate product data from CSV file and populates PRODUCT_URLS
 * 
 * NOTE: This module is server-side only (uses Node.js fs module)
 */

import fs from 'fs';
import path from 'path';

// Ensure this only runs on server-side
if (typeof window !== 'undefined') {
  throw new Error('csv-loader.ts is server-side only and cannot be used in the browser');
}

export interface AffiliateProduct {
  product_name: string;
  affiliate_url: string;
  status: 'verified' | 'pending' | 'inactive';
  article_slug: string;
  category: string;
  last_updated: string;
  notes: string;
}

/**
 * Parse CSV content into structured data
 */
export function parseCsvContent(csvContent: string): AffiliateProduct[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  return lines.slice(1).map(line => {
    // Handle quoted CSV values that may contain commas
    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Add the last value
    
    const product: any = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });
    
    return product as AffiliateProduct;
  });
}

/**
 * Load affiliate products from CSV file
 */
export function loadAffiliateProducts(): AffiliateProduct[] {
  try {
    const csvPath = path.join(process.cwd(), 'affiliate-products.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.warn('affiliate-products.csv not found, using empty product list');
      return [];
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    return parseCsvContent(csvContent);
  } catch (error) {
    console.error('Error loading affiliate products CSV:', error);
    return [];
  }
}

/**
 * Generate PRODUCT_URLS object from CSV data
 */
export function generateProductUrls(): Record<string, string> {
  const products = loadAffiliateProducts();
  const productUrls: Record<string, string> = {};
  
  products.forEach(product => {
    // Only include products with valid URLs and verified status
    if (product.affiliate_url && 
        product.affiliate_url !== 'pending' && 
        product.status === 'verified' &&
        (product.affiliate_url.startsWith('https://') || product.affiliate_url.startsWith('B'))) {
      productUrls[product.product_name] = product.affiliate_url;
    }
  });
  
  return productUrls;
}

/**
 * Get products that need affiliate URLs
 */
export function getProductsNeedingUrls(): AffiliateProduct[] {
  const products = loadAffiliateProducts();
  return products.filter(product => 
    !product.affiliate_url || 
    product.affiliate_url === 'pending' || 
    product.status === 'pending'
  );
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): AffiliateProduct[] {
  const products = loadAffiliateProducts();
  return products.filter(product => product.category === category);
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const products = loadAffiliateProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Validate ASIN format
 */
export function isValidAsin(asin: string): boolean {
  // ASIN is typically 10 characters: B + 9 alphanumeric characters
  const asinPattern = /^B[0-9A-Z]{9}$/;
  return asinPattern.test(asin);
}

/**
 * Validate affiliate URL format
 */
export function isValidAffiliateUrl(url: string): boolean {
  // Check if it's a valid Amazon URL with affiliate parameters
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('amazon.com') && 
           (urlObj.searchParams.has('tag') || urlObj.pathname.includes('/dp/'));
  } catch {
    return false;
  }
}

/**
 * Extract ASIN from affiliate URL
 */
export function extractAsinFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/dp\/([B0-9A-Z]{10})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Generate statistics about the affiliate products
 */
export function getProductStats() {
  const products = loadAffiliateProducts();
  const verified = products.filter(p => p.status === 'verified').length;
  const pending = products.filter(p => p.status === 'pending').length;
  const needingUrls = products.filter(p => !p.affiliate_url || p.affiliate_url === 'pending').length;
  
  return {
    total: products.length,
    verified,
    pending,
    needingUrls,
    categories: getAllCategories().length
  };
}