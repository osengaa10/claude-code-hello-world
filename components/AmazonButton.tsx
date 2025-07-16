'use client';

import { getProductAmazonLink } from '@/lib/amazon';

interface AmazonButtonProps {
  productName: string;
  asin?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AmazonButton({ 
  productName, 
  asin,
  variant = 'primary',
  size = 'md',
  className = ''
}: AmazonButtonProps) {
  const amazonLink = asin 
    ? `https://amazon.com/dp/${asin}?tag=unbiasedtechr-20`
    : getProductAmazonLink(productName);

  const handleClick = () => {
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

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-500',
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white focus:ring-orange-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={`Buy ${productName} on Amazon`}
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M.045 18.02c.072-.116.187-.18.315-.18.063 0 .124.013.18.036 4.95 1.963 10.664 3.016 17.13 3.016 3.14 0 6.357-.384 9.638-1.152.525-.12 1.056.205 1.176.73.12.525-.205 1.056-.73 1.176-3.453.808-6.897 1.218-10.326 1.218-6.792 0-12.84-1.117-18.084-3.346-.48-.204-.707-.759-.503-1.239.072-.168.18-.315.315-.425l-.111-.834zm20.06-9.925c-.525-.12-1.056.205-1.176.73-.808 3.453-1.218 6.897-1.218 10.326 0 6.792 1.117 12.84 3.346 18.084.204.48.759.707 1.239.503.168-.072.315-.18.425-.315l.834.111c.116-.072.18-.187.18-.315 0-.063-.013-.124-.036-.18-1.963-4.95-3.016-10.664-3.016-17.13 0-3.14.384-6.357 1.152-9.638.12-.525-.205-1.056-.73-1.176z"/>
        <path d="M12.5 2L3 7l9.5 5L22 7l-9.5-5zM12.5 14.5L3 9.5v6l9.5 5 9.5-5v-6l-9.5 5z"/>
      </svg>
      Buy on Amazon
    </button>
  );
}

// Amazon logo SVG for branding
export function AmazonLogo({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 30" 
      fill="currentColor"
      aria-label="Amazon"
    >
      <path d="M45.7 14.8c-4.9.4-7.3 1.8-7.3 4.3 0 1.4 1.1 2.3 2.8 2.3 1.8 0 3.7-.7 4.5-2.1V14.8zM50.8 23.9c-.3.3-.8.3-1.2.1-1.8-1.5-2.1-2.2-3.1-3.6-3 3-5.1 3.9-9 3.9-4.6 0-8.2-2.8-8.2-8.5 0-4.4 2.4-7.4 5.8-8.9 3-1.3 7.1-1.5 10.3-1.9v-.7c0-1.3.1-2.8-1.2-3.9-1.1-1-2.9-1.3-4.3-1.3-2.9.1-5.5 1.5-6.1 4.6-.1.3-.4.6-.7.6l-4.5-.5c-.3-.1-.6-.3-.5-.8C29.5 1.5 34.1 0 38.4 0c2.2 0 5.1.6 6.8 2.3 2.2 2.1 2 4.9 2 7.9v7.2c0 2.2.9 3.1 1.8 4.3.3.4.4.8 0 1.1l-2.7 2.1zM82.2 0c6.9 0 10.7 5.9 10.7 13.4 0 7.3-4.1 13-10.7 13-6.8 0-10.5-5.9-10.5-13.2C71.7 5.7 75.6 0 82.2 0zm0 4.5c-3.4 0-3.6 4.6-3.6 7.5 0 2.9.1 9 3.6 9s3.7-6 3.7-9.1c0-2.3-.1-4.8-.8-6.4-.5-1.1-1.4-1-2.9-1zM100 23.7c-.4 0-.6-.3-.6-.6V.9c0-.3.3-.6.6-.6h4.3c.3 0 .6.2.6.6v22.2c0 .3-.3.6-.6.6H100zM65.8 23.7c-.4 0-.6-.3-.6-.6V.9c0-.3.3-.6.6-.6h4.3c.3 0 .6.2.6.6v22.2c0 .3-.3.6-.6.6h-4.3z"/>
      <path d="M84.3 27.4c-13.5 0-20.8-9.9-20.8-24.1C63.5 7.7 68.8 0 82.2 0c4.6 0 8.6 1.7 11.5 4.9l-3.1 3.5c-2.2-2.4-5.2-3.7-8.4-3.7-8.7 0-11.3 7.6-11.3 15.6 0 8.2 2.6 15.8 11.3 15.8 3.4 0 6.7-1.4 8.9-4l3.1 3.4c-3 3.5-7.1 5.3-11.9 5.3z"/>
    </svg>
  );
}