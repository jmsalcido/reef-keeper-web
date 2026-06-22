import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { AppStoreButton } from '../components/AppStoreButton';
import { posts } from '../data/posts';

export function BlogIndex() {
  const [featured, ...rest] = posts;

  return (
    <>
      <Nav variant="inner" />

      <section style={{ background: 'var(--color-bg-gradient)', borderBottom: '1px solid var(--border-divider)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '72px 28px 64px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal-600)' }}>
            The Reef Keeper journal
          </div>
          <h1 style={{ fontSize: 48, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ocean-900)', margin: '16px 0 0' }}>
            Keep healthier tanks
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--text-body)', maxWidth: 560, margin: '18px 0 0' }}>
            Practical guides on water testing, the nitrogen cycle and reading your parameter trends —
            written for hobbyists, by the team behind Reef Keeper.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 28px 96px' }}>
        {/* Featured */}
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="rk-featured"
          style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', background: 'var(--surface-card)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 48 }}
        >
          <div style={{ position: 'relative', minHeight: 300, background: featured.gradient, overflow: 'hidden' }}>
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
              <polyline points="0,220 60,200 120,210 180,150 240,90 300,130 360,110 400,120" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="240" cy="90" r="6" fill="#fff" />
            </svg>
          </div>
          <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: featured.categoryColor }}>{featured.category}</span>
              <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>· {featured.readTime}</span>
            </div>
            <h2 style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', margin: '12px 0 0' }}>{featured.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-body)', margin: '12px 0 0' }}>{featured.excerpt}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 700, color: 'var(--teal-600)', marginTop: 18 }}>
              Read article
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        <div className="rk-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {rest.map((p) => {
            const card = (
              <>
                <div style={{ height: 170, background: p.gradient, position: 'relative' }}>
                  {p.comingSoon && (
                    <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', background: 'rgba(0,0,0,.25)', padding: '4px 9px', borderRadius: 999 }}>
                      Soon
                    </span>
                  )}
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: p.categoryColor }}>{p.category}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>· {p.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 700, color: 'var(--text-strong)', margin: '10px 0 0' }}>{p.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-muted)', margin: '10px 0 0', flex: 1 }}>{p.excerpt}</p>
                </div>
              </>
            );
            const cardStyle = {
              display: 'flex',
              flexDirection: 'column' as const,
              background: 'var(--surface-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
              opacity: p.comingSoon ? 0.92 : 1,
            };
            return p.comingSoon ? (
              <div key={p.slug} style={cardStyle}>
                {card}
              </div>
            ) : (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} style={cardStyle}>
                {card}
              </Link>
            );
          })}
        </div>
      </section>

      <section style={{ background: 'var(--color-header-gradient)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, lineHeight: 1.15, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>Put it into practice</h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,.78)', margin: '14px auto 0', maxWidth: 460 }}>
            Reef Keeper logs every reading and reminds you of the next task. Free on the App Store.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <AppStoreButton variant="light" />
          </div>
        </div>
      </section>

      <MiniFooter />
    </>
  );
}
