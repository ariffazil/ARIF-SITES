export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (context.request.method !== 'GET') return context.next();
  const accept = context.request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return context.next();
  try {
    const origin = url.origin;
    const res = await fetch(origin + '/static/discoveries.html', context.request);
    if (res.ok) {
      return new Response(await res.text(), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
          'X-Pre-Rendered': 'SSG-v1',
        }
      });
    }
  } catch (e) {}
  return context.next();
}
