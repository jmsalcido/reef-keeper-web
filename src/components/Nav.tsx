import { Link } from '@tanstack/react-router';
import { APP_STORE_URL } from '../config';
import { AppleGlyph } from './AppStoreButton';

/**
 * Sticky translucent site header.
 * On the landing page the section links are in-page hash anchors; elsewhere
 * they route back to the landing page and then scroll to the section.
 */
export function Nav({ variant = 'landing' }: { variant?: 'landing' | 'inner' }) {
  const onLanding = variant === 'landing';

  const sectionLink = (hash: string, label: string) =>
    onLanding ? (
      <a
        href={`#${hash}`}
        style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-body)' }}
      >
        {label}
      </a>
    ) : (
      <Link
        to="/"
        hash={hash}
        style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-body)' }}
      >
        {label}
      </Link>
    );

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-divider)',
      }}
    >
      <nav
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo-wordmark.svg"
            alt="Reef Keeper"
            style={{ height: 34, width: 'auto' }}
          />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {sectionLink('features', 'Features')}
          {sectionLink('screens', 'The app')}
          {sectionLink('pricing', 'Pricing')}
          <Link
            to="/blog"
            style={{
              fontSize: 14.5,
              fontWeight: onLanding ? 600 : 700,
              color: onLanding ? 'var(--text-body)' : 'var(--teal-600)',
            }}
          >
            Blog
          </Link>
        </div>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            background: 'var(--ocean-900)',
            color: '#fff',
            padding: '9px 16px 9px 14px',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <AppleGlyph size={18} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Download</span>
        </a>
      </nav>
    </header>
  );
}
