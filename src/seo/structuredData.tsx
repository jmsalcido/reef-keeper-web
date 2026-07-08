import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_STORE_URL,
  BRAND_NAME,
  SITE_URL,
  canonicalAssetUrl,
  canonicalUrl,
} from '../config';
import type { PublishedPost } from '../data/posts';

type JsonLdObject = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          key={`${item['@id'] ?? item['@type'] ?? 'json-ld'}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </>
  );
}

export type FaqItem = {
  q: string;
  a: string;
};

export function organizationJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: canonicalAssetUrl('/logo-mark.svg'),
  };
}

export function faqPageJsonLd(faqs: FaqItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl('/')}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function applicationProductJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'Product'],
    '@id': `${SITE_URL}/#app`,
    name: APP_NAME,
    alternateName: BRAND_NAME,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    image: canonicalAssetUrl('/app-icon-ios.png'),
    logo: canonicalAssetUrl('/logo-mark.svg'),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS',
    sameAs: [APP_STORE_URL],
    brand: {
      '@id': `${SITE_URL}/#organization`,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Monthly',
        price: '4.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: APP_STORE_URL,
      },
      {
        '@type': 'Offer',
        name: 'Yearly',
        price: '44.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: APP_STORE_URL,
      },
      {
        '@type': 'Offer',
        name: 'Lifetime',
        price: '99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: APP_STORE_URL,
      },
    ],
  };
}

export function blogPostingJsonLd(post: PublishedPost): JsonLdObject {
  const url = canonicalUrl(`/blog/${post.slug}`);
  const image = canonicalAssetUrl(post.image ?? '/app-icon-ios.png');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    image: [image],
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@id': `${SITE_URL}/#organization`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    url,
    articleSection: post.category,
  };
}

function serializeJsonLd(data: JsonLdObject) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
