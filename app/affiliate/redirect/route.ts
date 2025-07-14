import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const product = searchParams.get('product');
  const source = searchParams.get('source');
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }
  
  // Log the click for analytics
  console.log(`Affiliate redirect: ${product} -> ${targetUrl} from ${source}`);
  
  // You can add database logging here
  // await logAffiliateClick({ product, source, targetUrl, timestamp: new Date() });
  
  // Redirect to the affiliate URL
  return NextResponse.redirect(targetUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}