import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
} from 'react';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { SUPPORT_POST_URL } from '../config';

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';
type SupportAttachment = { file: File; previewUrl: string };

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 512 * 1024;
const ATTACHMENT_ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png';

const isSupportedAttachment = (file: File) => {
  const extension = file.name.toLowerCase().split('.').pop();
  return (
    (file.type === 'image/jpeg' || file.type === 'image/png') &&
    (extension === 'jpg' || extension === 'jpeg' || extension === 'png')
  );
};

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
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const attachmentsRef = useRef<SupportAttachment[]>([]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const updateAttachments = (
    update:
      | SupportAttachment[]
      | ((current: SupportAttachment[]) => SupportAttachment[]),
  ) => {
    setAttachments((current) => {
      const next = typeof update === 'function' ? update(current) : update;
      const nextPreviewUrls = new Set(
        next.map(({ previewUrl }) => previewUrl),
      );

      current.forEach(({ previewUrl }) => {
        if (!nextPreviewUrls.has(previewUrl)) {
          URL.revokeObjectURL(previewUrl);
        }
      });

      attachmentsRef.current = next;
      return next;
    });
  };

  const clearStatus = () => {
    if (submitState !== 'idle' && submitState !== 'loading') {
      setSubmitState('idle');
      setStatusMessage('');
    }
  };

  const updateField =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      clearStatus();
    };

  function addAttachments(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);

    if (!files.length) {
      return;
    }

    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      setSubmitState('error');
      setStatusMessage(`You can attach up to ${MAX_ATTACHMENTS} pictures.`);
      return;
    }

    const invalidFile = files.find(
      (file) => !isSupportedAttachment(file) || file.size > MAX_ATTACHMENT_SIZE,
    );

    if (invalidFile) {
      setSubmitState('error');
      setStatusMessage(
        `${invalidFile.name} must be a JPG or PNG no larger than 512 KB.`,
      );
      return;
    }

    updateAttachments((current) => [
      ...current,
      ...files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    clearStatus();
  }

  function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    addAttachments(event.currentTarget.files);
    event.currentTarget.value = '';
  }

  function handleAttachmentDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    addAttachments(event.dataTransfer.files);
  }

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
      const body = new FormData();
      body.append('name', form.name);
      body.append('email', form.email);
      body.append('subject', form.subject);
      body.append('message', form.message);
      body.append('details', form.details);
      attachments.forEach(({ file }) => {
        body.append('attachments', file, file.name);
      });

      const response = await fetch(SUPPORT_POST_URL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      const contentType = response.headers.get('content-type') ?? '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error(`Support request failed with ${response.status}`);
      }

      setForm(initialForm);
      updateAttachments([]);
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

            <div style={{ marginTop: 24 }}>
              <span style={labelStyle}>
                Screenshots <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(optional)</span>
              </span>
              <label
                htmlFor="support-attachments"
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleAttachmentDrop}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  border: `1.5px dashed ${isDragging ? 'var(--teal-600)' : 'var(--teal-400)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  background: isDragging
                    ? 'var(--teal-100)'
                    : 'linear-gradient(135deg, var(--teal-100), #fff)',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
              >
                <input
                  id="support-attachments"
                  name="attachments"
                  type="file"
                  accept={ATTACHMENT_ACCEPT}
                  multiple
                  onChange={handleAttachmentChange}
                  style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    flex: '0 0 44px',
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    color: 'var(--teal-700)',
                    background: '#fff',
                    boxShadow: '0 4px 14px rgba(18, 111, 116, .12)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
                    <path d="m8 8 4-4 4 4M12 4v11" />
                  </svg>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <strong style={{ fontSize: 14.5, color: 'var(--ocean-900)' }}>
                    Drop screenshots here or browse
                  </strong>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    JPG or PNG · up to 5 files · 512 KB each
                  </span>
                </span>
              </label>

              {attachments.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))',
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  {attachments.map(({ file, previewUrl }, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      style={{
                        position: 'relative',
                        minWidth: 0,
                        overflow: 'hidden',
                        border: '1px solid var(--border-divider)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-app)',
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt={`Screenshot ${index + 1}: ${file.name}`}
                        style={{ width: '100%', aspectRatio: '1.25', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => {
                          updateAttachments((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index),
                          );
                          clearStatus();
                        }}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          display: 'grid',
                          placeItems: 'center',
                          width: 26,
                          height: 26,
                          border: '1px solid rgba(255, 255, 255, .8)',
                          borderRadius: '50%',
                          background: 'rgba(8, 37, 51, .78)',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, transform: 'translateY(-1px)' }}>×</span>
                      </button>
                      <span
                        title={file.name}
                        style={{
                          display: 'block',
                          overflow: 'hidden',
                          padding: '7px 8px 8px',
                          color: 'var(--text-body)',
                          fontSize: 11.5,
                          lineHeight: 1.3,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
