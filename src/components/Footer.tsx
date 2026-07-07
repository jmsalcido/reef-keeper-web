import { useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';

const colLabel: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.5)',
  marginBottom: 14,
};
const colLink: CSSProperties = { color: 'rgba(255,255,255,.78)' };
const colWrap: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 14.5,
};

type NewsletterState = 'idle' | 'loading' | 'success' | 'error';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<NewsletterState>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmitState('error');
      setMessage('Enter a valid email address.');
      return;
    }

    setSubmitState('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        throw new Error(`Newsletter signup failed with ${response.status}`);
      }

      setEmail('');
      setSubmitState('success');
      setMessage('Thanks. You are on the list.');
    } catch {
      setSubmitState('error');
      setMessage('Could not subscribe right now. Please try again.');
    }
  }

  return (
    <div>
      <div style={colLabel}>Newsletter</div>
      <p style={{ fontSize: 14, lineHeight: 1.55, margin: '0 0 14px', color: 'rgba(255,255,255,.7)' }}>
        Reef keeping notes, product updates, and practical tank care tips.
      </p>
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <label htmlFor="newsletter-email" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (submitState !== 'idle' && submitState !== 'loading') {
              setSubmitState('idle');
              setMessage('');
            }
          }}
          style={{
            minWidth: 0,
            flex: 1,
            border: '1px solid rgba(255,255,255,.16)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,.08)',
            color: '#fff',
            font: 'inherit',
            fontSize: 14,
            padding: '12px 13px',
            outlineColor: 'var(--teal-400)',
          }}
        />
        <button
          type="submit"
          disabled={submitState === 'loading'}
          style={{
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: submitState === 'loading' ? 'var(--ink-400)' : 'var(--action-primary)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            padding: '0 15px',
            cursor: submitState === 'loading' ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {submitState === 'loading' ? 'Joining...' : 'Join'}
        </button>
      </form>
      {message && (
        <p
          role="status"
          style={{
            margin: '10px 0 0',
            color: submitState === 'success' ? 'var(--teal-400)' : 'var(--coral-300)',
            fontSize: 13,
            lineHeight: 1.45,
            fontWeight: 700,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

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
          gridTemplateColumns: '1.35fr .75fr .75fr 1.35fr',
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
            <Link to="/contact" style={colLink}>
              Support
            </Link>
            <Link to="/privacy" style={colLink}>
              Privacy
            </Link>
            <Link to="/terms" style={colLink}>
              Terms
            </Link>
          </div>
        </div>
        <NewsletterSignup />
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
