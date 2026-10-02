import { APP_DESCRIPTION, APP_NAME, canonicalAssetUrl, canonicalUrl } from '../config';
import { publishedPosts } from '../data/posts';

const pages: Record<string, [string, string]> = {
  '/': [APP_NAME + ' — Your aquarium logbook', APP_DESCRIPTION],
  '/blog': ['Aquarium care guides | Reef Keeper', 'Explore aquarium care guides, water testing routines, and practical ways to organize your aquarium records.'],
  '/contact': ['Contact support | Reef Keeper', 'Contact Reef Keeper support with questions about the aquarium tracker.'],
  '/privacy': ['Privacy policy | Reef Keeper', 'Read the Reef Keeper privacy policy.'],
  '/terms': ['Terms of use | Reef Keeper', 'Read the Reef Keeper terms of use.'],
};
export const publicPaths = [...Object.keys(pages), ...publishedPosts.map(post => `/blog/${post.slug}`)];
export function routeMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const post = publishedPosts.find(post => path === `/blog/${post.slug}`);
  const page = pages[path];
  const found = Boolean(post || page);
  return {
    title: post ? post.seoTitle ?? `${post.title} | Reef Keeper` : page?.[0] ?? 'Page not found | Reef Keeper',
    description: post ? post.metaDescription ?? post.excerpt : page?.[1] ?? 'This page does not exist. Browse the Reef Keeper aquarium guides.',
    canonicalUrl: canonicalUrl(path),
    type: post ? 'article' as const : 'website' as const,
    image: canonicalAssetUrl(post?.image ?? '/app-icon-ios.png'),
    imageAlt: post?.title ?? APP_NAME,
    robots: found ? 'index,follow' : 'noindex,follow',
  };
}
