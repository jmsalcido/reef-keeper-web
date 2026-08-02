import { useEffect, useState } from 'react';

type FeedbackValue = 'yes' | 'no';

type ArticleFeedbackProps = {
  slug: string;
  title: string;
  category: string;
};

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParameters?: Record<string, string>,
    ) => void;
  }
}

function ThumbIcon({ direction }: { direction: 'up' | 'down' }) {
  const transform = direction === 'down' ? 'rotate(180 12 12)' : undefined;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <g transform={transform}>
        <path d="M7 10v12" />
        <path d="M15 5.9 14 10h5.8a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 18.4 21H7V10l4.3-4.3a2 2 0 0 1 3.7.2Z" />
      </g>
    </svg>
  );
}

export function ArticleFeedback({ slug, title, category }: ArticleFeedbackProps) {
  const [response, setResponse] = useState<FeedbackValue | null>(null);

  useEffect(() => {
    setResponse(null);
  }, [slug]);

  const submitFeedback = (value: FeedbackValue) => {
    if (response) return;

    setResponse(value);
    window.gtag?.('event', 'article_feedback', {
      article_slug: slug,
      article_title: title,
      article_category: category,
      feedback_value: value,
    });
  };

  return (
    <section className="article-feedback" aria-labelledby="article-feedback-heading">
      {response ? (
        <>
          <h2 id="article-feedback-heading">Thanks for your feedback</h2>
          <p>It helps us make the Reef Keeper journal more useful.</p>
        </>
      ) : (
        <>
          <h2 id="article-feedback-heading">Was this article helpful?</h2>
          <div className="article-feedback__actions">
            <button
              type="button"
              className="article-feedback__button"
              onClick={() => submitFeedback('yes')}
              aria-label="Yes, this article was helpful"
            >
              <ThumbIcon direction="up" />
              Yes
            </button>
            <button
              type="button"
              className="article-feedback__button"
              onClick={() => submitFeedback('no')}
              aria-label="No, this article was not helpful"
            >
              <ThumbIcon direction="down" />
              No
            </button>
          </div>
        </>
      )}
    </section>
  );
}
