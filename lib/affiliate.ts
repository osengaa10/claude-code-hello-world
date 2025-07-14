export interface AffiliateLink {
  url: string;
  product: string;
  source: string;
  displayText: string;
}

export function createAffiliateLink({
  url,
  product,
  source,
  displayText,
}: AffiliateLink): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  const affiliateUrl = new URL('/affiliate/redirect', baseUrl);
  
  affiliateUrl.searchParams.set('url', url);
  affiliateUrl.searchParams.set('product', product);
  affiliateUrl.searchParams.set('source', source);
  
  return affiliateUrl.toString();
}

export function trackAffiliateClick(product: string, source: string) {
  // Track click in localStorage for analytics
  if (typeof window !== 'undefined') {
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push({
      product,
      source,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
  }
}

export const AFFILIATE_TAGS = {
  AMAZON: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'your-amazon-tag',
  // Add other affiliate program tags here
} as const;