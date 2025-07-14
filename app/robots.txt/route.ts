import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://besttech-reviews.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin or sensitive paths (if any)
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow all bots to crawl product pages and reviews
Allow: /
Allow: /category/
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}