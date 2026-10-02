import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicPaths, routeMetadata } from '../dist-ssr/prerender.js';
test('every public route ships content and its own canonical metadata', async () => {
  for (const path of publicPaths) {
    const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, 'utf8');
    assert.match(html, /<h1[ >]/);
    assert.ok(html.includes(routeMetadata(path).canonicalUrl));
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
    assert.equal((html.match(/<title>/g) ?? []).length, 1);
    assert.ok(html.length > 3000);
  }
});
test('unknown routes are noindex and article metadata cannot leak to other routes', () => {
  assert.equal(routeMetadata('/invented').robots, 'noindex,follow');
  assert.equal(routeMetadata('/blog/invented').type, 'website');
  assert.equal(routeMetadata('/blog/').canonicalUrl, routeMetadata('/blog').canonicalUrl);
  assert.notEqual(routeMetadata('/').title, routeMetadata('/blog').title);
});
