import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const postsFile = path.join(rootDir, 'src', 'data', 'posts.tsx');

const siteUrl = (process.env.VITE_SITE_URL ?? 'https://reefkeeper.otfusion.org').replace(/\/$/, '');

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
];

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const absoluteUrl = (routePath) => {
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
};

const renderUrl = ({ path: routePath, lastmod, changefreq, priority }) => {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(routePath))}</loc>`,
  ];

  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${escapeXml(changefreq)}</changefreq>`);
  if (priority) lines.push(`    <priority>${escapeXml(priority)}</priority>`);

  lines.push('  </url>');
  return lines.join('\n');
};

const readPublishedPosts = async () => {
  const source = await readFile(postsFile, 'utf8');
  const postPattern = /^  {\n    slug:\s*'([^']+)'([\s\S]*?)(?=^  },\n  {|^  },\n];)/gm;

  return [...source.matchAll(postPattern)]
    .map((match) => {
      const dateModified = match[2].match(/^\s+dateModified:\s*'([^']+)'/m)?.[1];
      const hasContent = /^\s+content:\s*\(\)\s*=>/m.test(match[2]);

      if (!dateModified || !hasContent) return null;

      return {
        path: `/blog/${match[1]}`,
        lastmod: dateModified,
        changefreq: 'monthly',
        priority: '0.7',
      };
    })
    .filter(Boolean);
};

const renderSitemap = (routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(renderUrl).join('\n')}
</urlset>
`;

const renderRobots = () => `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

const publishedPosts = await readPublishedPosts();

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, 'sitemap.xml'), renderSitemap([...staticRoutes, ...publishedPosts])),
  writeFile(path.join(publicDir, 'robots.txt'), renderRobots()),
]);

console.log(`Generated sitemap.xml with ${staticRoutes.length + publishedPosts.length} URLs.`);
