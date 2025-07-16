'use client';

import { getProductAmazonLink } from '@/lib/amazon';

interface ProductLinkProps {
  productName: string;
  asin?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ProductLink({ 
  productName, 
  asin,
  children,
  className = ''
}: ProductLinkProps) {
  const amazonLink = asin 
    ? `https://amazon.com/dp/${asin}?tag=unbiasedtechr-20`
    : getProductAmazonLink(productName);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Track affiliate click for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'engagement',
        event_label: productName,
        affiliate_network: 'amazon'
      });
    }
    
    window.open(amazonLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={amazonLink}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-orange-600 hover:text-orange-700 font-medium underline decoration-orange-300 hover:decoration-orange-500 transition-colors ${className}`}
      aria-label={`Buy ${productName} on Amazon`}
    >
      {children || productName}
    </a>
  );
}