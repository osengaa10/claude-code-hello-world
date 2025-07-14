'use client';

export interface AffiliateClick {
  id: string;
  timestamp: Date;
  productName: string;
  productId?: string;
  affiliateUrl: string;
  source: string; // which article/page
  category: string;
  price?: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  userId?: string;
}

export interface AffiliateStats {
  totalClicks: number;
  clicksByProduct: Record<string, number>;
  clicksByCategory: Record<string, number>;
  clicksBySource: Record<string, number>;
  conversionRate?: number;
  revenueEstimate?: number;
  topProducts: Array<{
    name: string;
    clicks: number;
    category: string;
  }>;
}

const STORAGE_KEY = 'affiliate_clicks';
const SESSION_KEY = 'affiliate_session';

// Generate unique session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Track affiliate link click
export function trackAffiliateClick(
  productName: string,
  affiliateUrl: string,
  source: string,
  category: string,
  price?: string,
  productId?: string
): void {
  if (typeof window === 'undefined') return;
  
  const click: AffiliateClick = {
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    timestamp: new Date(),
    productName,
    productId,
    affiliateUrl,
    source,
    category,
    price,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    sessionId: getSessionId(),
  };
  
  // Store in localStorage
  const existingClicks = getStoredClicks();
  existingClicks.push(click);
  
  // Keep only last 1000 clicks to prevent storage bloat
  if (existingClicks.length > 1000) {
    existingClicks.splice(0, existingClicks.length - 1000);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingClicks));
  
  // Send to analytics if configured
  sendToAnalytics(click);
  
  console.log('Affiliate click tracked:', click);
}

// Get stored clicks from localStorage
function getStoredClicks(): AffiliateClick[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const clicks = JSON.parse(stored);
    return clicks.map((click: any) => ({
      ...click,
      timestamp: new Date(click.timestamp)
    }));
  } catch (error) {
    console.error('Error loading stored clicks:', error);
    return [];
  }
}

// Get affiliate click statistics
export function getAffiliateStats(timeRange?: number): AffiliateStats {
  const clicks = getStoredClicks();
  
  // Filter by time range if specified (days)
  const filteredClicks = timeRange
    ? clicks.filter(click => {
        const daysDiff = (Date.now() - click.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= timeRange;
      })
    : clicks;
  
  const totalClicks = filteredClicks.length;
  
  // Group by product
  const clicksByProduct: Record<string, number> = {};
  filteredClicks.forEach(click => {
    clicksByProduct[click.productName] = (clicksByProduct[click.productName] || 0) + 1;
  });
  
  // Group by category
  const clicksByCategory: Record<string, number> = {};
  filteredClicks.forEach(click => {
    clicksByCategory[click.category] = (clicksByCategory[click.category] || 0) + 1;
  });
  
  // Group by source
  const clicksBySource: Record<string, number> = {};
  filteredClicks.forEach(click => {
    clicksBySource[click.source] = (clicksBySource[click.source] || 0) + 1;
  });
  
  // Get top products
  const topProducts = Object.entries(clicksByProduct)
    .map(([name, clicks]) => ({
      name,
      clicks,
      category: filteredClicks.find(click => click.productName === name)?.category || 'unknown'
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
  
  return {
    totalClicks,
    clicksByProduct,
    clicksByCategory,
    clicksBySource,
    topProducts
  };
}

// Send click data to analytics service
function sendToAnalytics(click: AffiliateClick): void {
  // Google Analytics 4 event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      product_name: click.productName,
      product_category: click.category,
      source: click.source,
      custom_product_id: click.productId,
      value: click.price ? parseFloat(click.price.replace(/[^0-9.]/g, '')) : undefined,
      currency: 'USD',
    });

    // Also track as a conversion event
    (window as any).gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      event_category: 'affiliate',
      event_label: click.productName,
      value: click.price ? parseFloat(click.price.replace(/[^0-9.]/g, '')) : undefined,
    });
  }
  
  // Custom analytics endpoint (optional)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(click),
    }).catch(error => {
      console.error('Error sending to analytics:', error);
    });
  }
}

// Export data for analysis
export function exportAffiliateData(): string {
  const clicks = getStoredClicks();
  
  const csvHeaders = [
    'timestamp', 'product_name', 'category', 'source', 'price',
    'affiliate_url', 'user_agent', 'referrer', 'session_id'
  ];
  
  const csvRows = clicks.map(click => [
    click.timestamp.toISOString(),
    click.productName,
    click.category,
    click.source,
    click.price || '',
    click.affiliateUrl,
    click.userAgent,
    click.referrer,
    click.sessionId
  ]);
  
  return [csvHeaders, ...csvRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

// Clear old data
export function clearOldAffiliateData(daysToKeep: number = 30): void {
  const clicks = getStoredClicks();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const filteredClicks = clicks.filter(click => click.timestamp > cutoffDate);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredClicks));
}

// Hook for React components
export function useAffiliateTracking() {
  const trackClick = (
    productName: string,
    affiliateUrl: string,
    source: string,
    category: string,
    price?: string,
    productId?: string
  ) => {
    trackAffiliateClick(productName, affiliateUrl, source, category, price, productId);
    
    // Open link in new tab
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };
  
  return { trackClick };
}