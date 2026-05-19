// Cloudflare Pages Function: serves SSG pre-rendered home page for /
// Falls through to SPA for non-HTML requests
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Only handle GET requests for HTML
  if (context.request.method !== 'GET') {
    return context.next();
  }
  
  // Check if browser accepts HTML
  const accept = context.request.headers.get('accept') || '';
  if (!accept.includes('text/html')) {
    return context.next();
  }
  
  try {
    const origin = url.origin;
    const res = await fetch(origin + '/static/home.html', context.request);
    if (res.ok) {
      const html = await res.text();
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
          'X-Pre-Rendered': 'SSG-v1',
        }
      });
    }
  } catch (e) {
    // Fall through to SPA
  }
  
  return context.next();
}
