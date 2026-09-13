import { APP_STORE_URL } from '../config';

export function ArticleProCta({ articleSlug, articleTitle, placement }: {
  articleSlug: string;
  articleTitle: string;
  placement: 'inline' | 'footer';
}) {
  const trackClick = (ctaType: 'pro_plans' | 'app_store') => {
    window.gtag?.('event', 'article_cta_click', {
      article_slug: articleSlug,
      article_title: articleTitle,
      cta_type: ctaType,
      cta_placement: placement,
      conversion_intent: 'pro',
    });
  };

  return (
    <aside className="article-conversion-cta" aria-labelledby={`${articleSlug}-${placement}-cta`}>
      <h2 id={`${articleSlug}-${placement}-cta`}>
        {placement === 'inline' ? 'Make room for the way you keep aquariums' : 'Ready for more from your aquarium records?'}
      </h2>
      <p>
        Pro adds unlimited aquariums, advanced graphing, custom safe ranges, and data export.
        {placement === 'footer' && ' Already have Reef Keeper? Review the Pro options in the app. New here? Download it from the App Store, then choose Pro in the app.'}
      </p>
      <div className="article-conversion-cta__actions">
        {placement === 'inline' ? (
          <a className="article-conversion-cta__download" href="#pro-plans" onClick={() => trackClick('pro_plans')}>
            Compare Pro plans
          </a>
        ) : (
          <a className="article-conversion-cta__download" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackClick('app_store')}>
            Get Reef Keeper on the App Store
          </a>
        )}
      </div>
    </aside>
  );
}
