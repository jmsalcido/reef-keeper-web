import { useEffect } from 'react';

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
};

export function SeoHead({
  title,
  description,
  canonicalUrl,
  type = 'website',
  image,
  imageAlt,
}: SeoHeadProps) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setLink('canonical', canonicalUrl);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    if (imageAlt) {
      setMeta('property', 'og:image:alt', imageAlt);
      setMeta('name', 'twitter:image:alt', imageAlt);
    }
  }, [canonicalUrl, description, image, imageAlt, title, type]);

  return null;
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.append(tag);
  }

  tag.content = content;
}

function setLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.append(tag);
  }

  tag.href = href;
}
