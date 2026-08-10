import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { APP_STORE_URL } from '../config';

type CtaType = 'app_store' | 'contact';

type ArticleConversionCtaProps = {
  heading: string;
  body: ReactNode;
  articleSlug: string;
  articleTitle: string;
  downloadLabel?: string;
  contactLabel?: string;
};

export function ArticleConversionCta({
  heading,
  body,
  articleSlug,
  articleTitle,
  downloadLabel = 'Download Reef Keeper',
  contactLabel = 'Contact us',
}: ArticleConversionCtaProps) {
  const headingId = `${articleSlug}-cta-title`;

  const trackClick = (ctaType: CtaType) => {
    window.gtag?.('event', 'article_cta_click', {
      article_slug: articleSlug,
      article_title: articleTitle,
      cta_type: ctaType,
    });
  };

  return (
    <aside className="article-conversion-cta" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <p>{body}</p>
      <div className="article-conversion-cta__actions">
        <a
          className="article-conversion-cta__download"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('app_store')}
        >
          {downloadLabel}
        </a>
        <Link
          className="article-conversion-cta__contact"
          to="/contact"
          onClick={() => trackClick('contact')}
        >
          {contactLabel}
        </Link>
      </div>
    </aside>
  );
}
