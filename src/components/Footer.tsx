import { Link } from '@tanstack/react-router';

const colLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.5)',
  marginBottom: 14,
};
const colLink: React.CSSProperties = { color: 'rgba(255,255,255,.78)' };
const colWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 14.5,
};

/** Full site footer used on the landing page. */
export function Footer() {
  return (
    <footer style={{ background: 'var(--ocean-900)', color: 'rgba(255,255,255,.7)' }}>
      <div
        className="rk-footer-grid"
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '56px 28px 40px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/logo-mark.svg"
              alt=""
              style={{ width: 36, height: 36, borderRadius: 10 }}
            />
            <span style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>
              Reef Keeper
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, margin: '16px 0 0', maxWidth: 300 }}>
            The calm, fast way to keep every aquarium you own in safe range.
          </p>
        </div>
        <div>
          <div style={colLabel}>Product</div>
          <div style={colWrap}>
            <Link to="/" hash="features" style={colLink}>
              Features
            </Link>
            <Link to="/" hash="pricing" style={colLink}>
              Pricing
            </Link>
            <Link to="/blog" style={colLink}>
              Blog
            </Link>
            <Link to="/" hash="faq" style={colLink}>
              FAQ
            </Link>
          </div>
        </div>
        <div>
          <div style={colLabel}>Company</div>
          <div style={colWrap}>
            <a href="#" style={colLink}>
              Support
            </a>
            <Link to="/privacy" style={colLink}>
              Privacy
            </Link>
            <Link to="/terms" style={colLink}>
              Terms
            </Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 13,
            color: 'rgba(255,255,255,.5)',
          }}
        >
          <span>© 2026 Reef Keeper. Made for aquarists.</span>
          <span>Designed with the Aqua Track design system.</span>
        </div>
      </div>
    </footer>
  );
}

/** Slim footer used on blog pages. */
export function MiniFooter() {
  return (
    <footer style={{ background: 'var(--ocean-900)', color: 'rgba(255,255,255,.55)' }}>
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo-mark.svg" alt="" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Reef Keeper</span>
        </div>
        <span>© 2026 Reef Keeper. Made for aquarists.</span>
      </div>
    </footer>
  );
}
