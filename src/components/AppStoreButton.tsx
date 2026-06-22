import { APP_STORE_URL } from '../config';

const AppleGlyph = ({ size = 26, color = '#fff' }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M16.36 12.66c-.02-2.07 1.69-3.06 1.77-3.11-.96-1.41-2.46-1.6-2.99-1.62-1.27-.13-2.49.75-3.13.75-.65 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.39 2.05-1.45 2.51-.37 6.22 1.04 8.26.69.99 1.51 2.1 2.58 2.06 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.12-.02 1.82-1 2.5-2 .79-1.15 1.11-2.27 1.13-2.33-.02-.01-2.17-.83-2.19-3.29zM14.3 6.25c.57-.69.95-1.65.85-2.6-.82.03-1.81.55-2.4 1.23-.53.61-.99 1.58-.87 2.51.91.07 1.85-.46 2.42-1.14z" />
  </svg>
);

type Variant = 'dark' | 'light';

/** The "Download on the App Store" button — links to the live listing. */
export function AppStoreButton({
  variant = 'dark',
  glyph = 26,
}: {
  variant?: Variant;
  glyph?: number;
}) {
  const light = variant === 'light';
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 11,
        background: light ? '#fff' : 'var(--ocean-900)',
        color: light ? 'var(--ocean-900)' : '#fff',
        padding: '13px 22px',
        borderRadius: 14,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <AppleGlyph size={glyph} color={light ? 'currentColor' : '#fff'} />
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.1,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 500, opacity: light ? 0.7 : 0.85 }}>
          Download on the
        </span>
        <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>
          App Store
        </span>
      </span>
    </a>
  );
}

export { AppleGlyph };
