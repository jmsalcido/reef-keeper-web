import { Link, useParams } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { AppStoreButton } from '../components/AppStoreButton';
import { getPost, isPublishedPost, posts } from '../data/posts';
import { JsonLd, blogPostingJsonLd, organizationJsonLd } from '../seo/structuredData';

export function Article() {
  const { slug } = useParams({ from: '/blog/$slug' });
  const post = getPost(slug);

  if (!post || !isPublishedPost(post)) {
    return <NotFound />;
  }

  const related = posts.find((p) => p.slug !== post.slug && isPublishedPost(p));

  return (
    <>
      <JsonLd data={[organizationJsonLd(), blogPostingJsonLd(post)]} />
      <Nav variant="inner" />

      <article>
        {/* Article hero */}
        <div style={{ background: 'var(--color-bg-gradient)', borderBottom: '1px solid var(--border-divider)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 28px 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: post.categoryColor }}>{post.category}</span>
              <span style={{ fontSize: 14, color: 'var(--text-faint)' }}>· {post.readTime}</span>
            </div>
            <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ocean-900)', margin: '16px 0 0', textWrap: 'balance' } as React.CSSProperties}>
              {post.title}
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--text-body)', margin: '18px 0 0' }}>{post.excerpt}</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 8, background: 'var(--color-header-gradient)' }} />

        {/* Body */}
        <div className="prose" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 28px 24px' }}>
          {post.content()}
        </div>

        {/* Inline CTA */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 28px 64px' }}>
          <div style={{ background: 'var(--color-header-gradient)', borderRadius: 'var(--radius-xl)', padding: 36, textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>Log every reading in seconds</h3>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.78)', margin: '12px auto 0', maxWidth: 380, lineHeight: 1.5 }}>
              Reef Keeper tracks your trends and reminds you when each test is due. Free on the App
              Store.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <AppStoreButton variant="light" glyph={24} />
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related && (
        <section style={{ background: 'var(--surface-app)', borderTop: '1px solid var(--border-divider)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 28px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--teal-600)', marginBottom: 18 }}>
              Keep reading
            </div>
            <Link
              to="/blog/$slug"
              params={{ slug: related.slug }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'var(--surface-card)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}
            >
              <div style={{ width: 120, alignSelf: 'stretch', flex: '0 0 120px', background: related.gradient }} />
              <div style={{ padding: '20px 22px 20px 4px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: related.categoryColor }}>{related.category}</div>
                <h3 style={{ fontSize: 18, lineHeight: 1.3, fontWeight: 700, color: 'var(--text-strong)', margin: '6px 0 0' }}>{related.title}</h3>
              </div>
            </Link>
          </div>
        </section>
      )}

      <MiniFooter />
    </>
  );
}

function NotFound() {
  return (
    <>
      <Nav variant="inner" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--ocean-900)' }}>Article not found</h1>
        <p style={{ fontSize: 17, color: 'var(--text-body)', marginTop: 12 }}>
          That post doesn’t exist (yet). Browse the journal for what’s published.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 700, color: 'var(--teal-600)' }}>
            ← All articles
          </Link>
        </div>
      </div>
      <MiniFooter />
    </>
  );
}
