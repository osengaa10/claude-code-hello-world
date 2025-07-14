import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Track affiliate link clicks
  if (pathname.startsWith('/affiliate/')) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const product = url.searchParams.get('product');
    const source = url.searchParams.get('source') || 'unknown';
    
    if (targetUrl) {
      // Log click for analytics (you can replace with your analytics service)
      console.log(`Affiliate click: ${product} -> ${targetUrl} from ${source}`);
      
      // Add click tracking headers
      const response = NextResponse.redirect(targetUrl);
      response.headers.set('X-Affiliate-Click', 'true');
      response.headers.set('X-Product', product || 'unknown');
      response.headers.set('X-Source', source);
      
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/affiliate/:path*',
};