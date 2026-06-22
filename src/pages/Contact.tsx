import { useState, type CSSProperties, type FormEvent } from 'react';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { SUPPORT_POST_URL } from '../config';

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-strong)',
  marginBottom: 8,
};

const inputStyle: CSSProperties = {
  width: '100%',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-md)',
  padding: '13px 14px',
  font: 'inherit',
  fontSize: 15,
  color: 'var(--text-strong)',
  background: '#fff',
  outlineColor: 'var(--teal-500)',
};

const helperStyle: CSSProperties = {
  fontSize: 13.5,
  lineHeight: 1.55,
  color: 'var(--text-muted)',
  margin: '8px 0 0',
};

const infoCardStyle: CSSProperties = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-lg)',
  padding: 24,
  boxShadow: 'var(--shadow-xs)',
};

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  details: '',
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const updateField =
    (field: keyof typeof initialForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (submitState !== 'idle' && submitState !== 'loading') {
        setSubmitState('idle');
        setStatusMessage('');
      }
    };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!SUPPORT_POST_URL) {
      setSubmitState('unconfigured');
      setStatusMessage(
        'Support intake is not configured yet. Please try again later.',
      );
      return;
    }

    setSubmitState('loading');
    setStatusMessage('');

    try {
      const response = await fetch(SUPPORT_POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          details: form.details,
        }),
      });

      if (!response.ok) {
        throw new Error(`Support request failed with ${response.status}`);
      }

      setForm(initialForm);
      setSubmitState('success');
      setStatusMessage("Thanks. We'll review your message and get back to you.");
    } catch {
      setSubmitState('error');
      setStatusMessage(
        'Something went wrong while sending your request. Please try again.',
      );
    }
  }

  const statusColor =
    submitState === 'success'
      ? 'var(--green-700)'
      : submitState === 'error' || submitState === 'unconfigured'
        ? 'var(--coral-700)'
        : 'var(--text-muted)';

  return (
    <>
      <Nav variant="inner" />

      <section style={{ background: 'var(--color-bg-gradient)', borderBottom: '1px solid var(--border-divider)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '72px 28px 64px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal-600)' }}>
            Reef Keeper support
          </div>
          <h1 style={{ fontSize: 48, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ocean-900)', margin: '16px 0 0' }}>
            Contact support
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--text-body)', maxWidth: 620, margin: '18px 0 0' }}>
            Tell us what happened, which device you are using, and anything that
            would help us understand the issue. We will use those details to
            route your request.
          </p>
        </div>
      </section>

      <main style={{ background: 'var(--surface-app)' }}>
        <div
          className="rk-contact-grid"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '64px 28px 96px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 320px',
            gap: 28,
            alignItems: 'start',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-xl)',
              padding: 32,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18 }} className="rk-contact-fields">
              <div>
                <label htmlFor="support-name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="support-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="support-email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="support-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label htmlFor="support-subject" style={labelStyle}>
                Subject
              </label>
              <input
                id="support-subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={updateField('subject')}
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <label htmlFor="support-message" style={labelStyle}>
                Message
              </label>
              <textarea
                id="support-message"
                name="message"
                required
                rows={7}
                value={form.message}
                onChange={updateField('message')}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <label htmlFor="support-details" style={labelStyle}>
                App or device details
              </label>
              <textarea
                id="support-details"
                name="details"
                rows={4}
                value={form.details}
                onChange={updateField('details')}
                placeholder="Optional: iPhone model, iOS version, app version, or steps to reproduce."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
              />
              <p style={helperStyle}>
                Do not include passwords, payment details, or other sensitive
                personal information.
              </p>
            </div>

            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={submitState === 'loading'}
                style={{
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  background: submitState === 'loading' ? 'var(--ink-400)' : 'var(--action-primary)',
                  color: '#fff',
                  padding: '13px 22px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: submitState === 'loading' ? 'wait' : 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {submitState === 'loading' ? 'Sending...' : 'Send request'}
              </button>
              {statusMessage && (
                <p role="status" style={{ margin: 0, color: statusColor, fontSize: 14.5, fontWeight: 700, lineHeight: 1.45 }}>
                  {statusMessage}
                </p>
              )}
            </div>
          </form>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={infoCardStyle}>
              <h2 style={{ fontSize: 19, lineHeight: 1.25, fontWeight: 800, color: 'var(--ocean-900)', margin: 0 }}>
                What helps us respond faster
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-body)', margin: '12px 0 0' }}>
                Include the tank type, the screen you were using, and what you
                expected to happen.
              </p>
            </div>
            <div style={infoCardStyle}>
              <h2 style={{ fontSize: 19, lineHeight: 1.25, fontWeight: 800, color: 'var(--ocean-900)', margin: 0 }}>
                Subscription help
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-body)', margin: '12px 0 0' }}>
                Purchases and cancellations are managed through your Apple ID
                subscriptions.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <MiniFooter />
    </>
  );
}
