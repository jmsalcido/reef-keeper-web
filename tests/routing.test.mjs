import { test } from 'node:test';
import assert from 'node:assert/strict';
import { servePage } from '../worker/pages.mjs';
const assets = { fetch: async request => {
  const path = new URL(request.url).pathname;
  return new Response(request.method === 'HEAD' ? null : path, {status: ['/index.html', '/blog/index.html', '/404.html', '/robots.txt', '/sitemap.xml'].includes(path) ? 200 : 404});
}};
test('HTTPS and slash redirects preserve query', async () => {
  for (const [input, target] of [['http://example.com/blog?q=1', 'https://example.com/blog?q=1'], ['https://example.com/blog/?q=1', 'https://example.com/blog?q=1']]) {
    const response = await servePage(new Request(input), assets);
    assert.equal(response.status, 308); assert.equal(response.headers.get('location'), target);
  }
});
test('known routes, assets, unknown pages and HEAD have correct status', async () => {
  for (const [path, status] of [['/',200], ['/blog',200], ['/robots.txt',200], ['/sitemap.xml',200], ['/missing',404], ['/blog/missing',404], ['/index.html',404]]) {
    for (const method of ['GET','HEAD']) {
      const response = await servePage(new Request('https://example.com'+path, {method}), assets);
      assert.equal(response.status, status); if (method === 'HEAD') assert.equal(await response.text(), '');
    }
  }
});
