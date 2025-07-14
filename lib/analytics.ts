// Google Analytics 4 integration

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics measurement ID not found');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track events
export const trackEvent = (action: string, parameters?: any) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return;

  window.gtag('event', action, parameters);
};

// Track affiliate clicks
export const trackAffiliateClick = (
  productName: string,
  category: string,
  source: string,
  value?: number
) => {
  trackEvent('affiliate_click', {
    product_name: productName,
    product_category: category,
    source: source,
    value: value,
    currency: 'USD',
  });
};

// Track content interactions
export const trackContentInteraction = (
  action: string,
  contentType: string,
  contentId: string
) => {
  trackEvent('content_interaction', {
    action: action,
    content_type: contentType,
    content_id: contentId,
  });
};

// Track search
export const trackSearch = (searchTerm: string, results?: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results: results,
  });
};

// Track newsletter signup
export const trackNewsletterSignup = (method: string) => {
  trackEvent('newsletter_signup', {
    method: method,
  });
};

// Track form submission
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('form_submission', {
    form_name: formName,
    success: success,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    percentage: percentage,
  });
};

// Track time on page
export const trackTimeOnPage = (timeInSeconds: number, pageUrl: string) => {
  trackEvent('time_on_page', {
    time_seconds: timeInSeconds,
    page_url: pageUrl,
  });
};

// Track outbound links
export const trackOutboundLink = (url: string, linkText: string) => {
  trackEvent('outbound_link_click', {
    url: url,
    link_text: linkText,
  });
};

// Track file downloads
export const trackFileDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

// Track product views
export const trackProductView = (
  productName: string,
  category: string,
  price?: string
) => {
  trackEvent('product_view', {
    product_name: productName,
    product_category: category,
    price: price,
  });
};

// Track comparison interactions
export const trackComparisonView = (
  products: string[],
  category: string
) => {
  trackEvent('comparison_view', {
    products: products.join(','),
    product_category: category,
    product_count: products.length,
  });
};

// Enhanced ecommerce tracking for affiliate links
export const trackPurchaseIntent = (
  productName: string,
  category: string,
  price: string,
  source: string
) => {
  trackEvent('purchase_intent', {
    product_name: productName,
    product_category: category,
    price: price,
    source: source,
  });
};

// Track user engagement
export const trackEngagement = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  trackEvent('engagement', {
    action: action,
    category: category,
    label: label,
    value: value,
  });
};

// Custom dimensions for affiliate tracking
export const setCustomDimensions = (dimensions: Record<string, string>) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    custom_map: dimensions,
  });
};

// Track user properties
export const setUserProperties = (properties: Record<string, string>) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_properties: properties,
  });
};

// Track exceptions
export const trackException = (description: string, fatal: boolean = false) => {
  trackEvent('exception', {
    description: description,
    fatal: fatal,
  });
};

// Utility function to check if analytics is enabled
export const isAnalyticsEnabled = (): boolean => {
  return Boolean(GA_MEASUREMENT_ID && typeof window !== 'undefined' && window.gtag);
};