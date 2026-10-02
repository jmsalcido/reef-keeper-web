import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render, publicPaths, routeMetadata } from '../dist-ssr/prerender.js';
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const path of [...publicPaths, '/404']) {
  const metadata = routeMetadata(path);
  const tags = `<title>${escape(metadata.title)}</title>\n<link rel="canonical" href="${escape(metadata.canonicalUrl)}">\n` +
    Object.entries({description: metadata.description, robots: metadata.robots, 'og:title': metadata.title, 'og:description': metadata.description, 'og:url': metadata.canonicalUrl, 'og:type': metadata.type, 'og:image': metadata.image, 'og:image:alt': metadata.imageAlt, 'twitter:card': 'summary_large_image', 'twitter:title': metadata.title, 'twitter:description': metadata.description, 'twitter:image': metadata.image, 'twitter:image:alt': metadata.imageAlt}).map(([key,value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}">`).join('\n');
  const html = template.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+(?:name="description"|property="og:[^"]+")[\s\S]*?>/g, '').replace('</head>', tags + '</head>').replace('<div id="root"></div>', `<div id="root">${await render(path)}</div>`);
  const output = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`;
  await mkdir(output.slice(0, output.lastIndexOf('/')), { recursive: true });
  await writeFile(output, html);
}
console.log(`Prerendered ${publicPaths.length} public routes and the not-found page.`);

await writeFile('worker/routes.json', JSON.stringify(publicPaths, null, 2) + '\n');
