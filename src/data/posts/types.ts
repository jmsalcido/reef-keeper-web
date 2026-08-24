import type { ReactNode } from 'react';

type PostBase = {
  slug: string;
  category: string;
  categoryColor: string;
  readTime: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  gradient: string;
  image?: string;
  relatedSlugs?: string[];
};

export type PublishedPost = PostBase & {
  comingSoon?: false;
  datePublished: string;
  dateModified: string;
  content: () => ReactNode;
};

export type ComingSoonPost = PostBase & {
  comingSoon?: boolean;
  datePublished?: never;
  dateModified?: never;
  content?: never;
};

export type Post = PublishedPost | ComingSoonPost;
