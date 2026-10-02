import paths from './routes.json' with { type: 'json' };
export async function servePage(request, assets) {
  const url = new URL(request.url);
  if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    url.protocol = 'https:';
    return Response.redirect(url.href, 308);
  }
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const canonicalPath = url.pathname.replace(/\/+$/, '') || '/';
  if (canonicalPath !== url.pathname) {
    url.pathname = canonicalPath;
    return Response.redirect(url.href, 308);
  }
  if (paths.includes(canonicalPath)) {
    url.pathname = canonicalPath === '/' ? '/index.html' : canonicalPath + '/index.html';
    return assets.fetch(new Request(url, request));
  }
  // Serve existing static files, but do not expose duplicate /index.html pages.
  if (!url.pathname.endsWith('.html')) {
    const asset = await assets.fetch(request);
    if (asset.status !== 404) return asset;
  }
  url.pathname = '/404.html';
  const page = await assets.fetch(new Request(url, request));
  return new Response(request.method === 'HEAD' ? null : page.body, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-cache' },
  });
}
