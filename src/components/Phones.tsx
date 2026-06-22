import type { CSSProperties } from 'react';
import { APP_STORE_URL } from '../config';

/* ----------------------------- shared bits ----------------------------- */

const notch: CSSProperties = {
  position: 'absolute',
  top: 11,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 118,
  height: 28,
  background: '#0c0f14',
  borderRadius: 999,
  zIndex: 6,
};

const mono: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontVariantNumeric: 'tabular-nums',
};

function StatCell({
  label,
  value,
  bar,
}: {
  label: string;
  value: string;
  bar: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ ...mono, fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>
        {value}
      </span>
      <span style={{ width: '100%', height: 3, borderRadius: 2, background: bar }} />
    </div>
  );
}

function TankCard({
  name,
  type,
  volume,
  age,
  swatch,
  stats,
}: {
  name: string;
  type: string;
  volume: string;
  age: string;
  swatch: string;
  stats: { label: string; value: string; bar: string }[];
}) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-divider)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: 'var(--text-strong)',
              letterSpacing: '-0.01em',
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{type}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{volume}</div>
          <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 2 }}>{age}</div>
        </div>
        <div
          style={{
            width: 78,
            height: 78,
            flex: '0 0 78px',
            borderRadius: 'var(--radius-md)',
            background: swatch,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25)',
          }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 8,
          padding: '12px 16px 14px',
          borderTop: '1px solid var(--border-divider)',
        }}
      >
        {stats.map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

function navIcon(d: string, active = false) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '6px 0',
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? 'var(--teal-500)' : 'var(--ink-400)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: d }}
      />
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: active ? 'var(--teal-500)' : 'transparent',
        }}
      />
    </div>
  );
}

const ICONS = {
  tank: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11c3 1.5 5-1.5 9 0s6 1 9 0"/>',
  drop: '<path d="M12 2.5s7 7.6 7 12.5a7 7 0 0 1-14 0C5 10.1 12 2.5 12 2.5z"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/>',
  tasks:
    '<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="M4 6l1 1 2-2"/><path d="M4 12l1 1 2-2"/><path d="M4 18l1 1 2-2"/>',
};

function BottomNav({ active }: { active: keyof typeof ICONS }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        background: 'var(--white)',
        borderTop: '1px solid var(--border-divider)',
        padding: '8px 8px 14px',
      }}
    >
      {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((k) => (
        <div key={k} style={{ display: 'contents' }}>
          {navIcon(ICONS[k], k === active)}
        </div>
      ))}
    </nav>
  );
}

function PhoneShell({
  width = 286,
  height = 600,
  radius = 46,
  pad = 11,
  shadow = '0 30px 70px rgba(0,0,0,.4)',
  children,
}: {
  width?: number;
  height?: number;
  radius?: number;
  pad?: number;
  shadow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width,
        background: '#0c0f14',
        borderRadius: radius,
        padding: pad,
        boxShadow: shadow,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: radius - 10,
          overflow: 'hidden',
          background: 'var(--color-bg-gradient)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------- HERO PHONE ------------------------------ */

export function HeroPhone() {
  return (
    <div className="rk-hero-phone" style={{ justifySelf: 'center', animation: 'rk-float 7s var(--ease-standard) infinite' }}>
      <PhoneShell width={340} height={690} radius={50} pad={12} shadow="0 40px 90px rgba(14,44,64,.4)">
        <div style={{ ...notch }} />
        <div
          style={{
            background: 'var(--color-header-gradient)',
            color: '#fff',
            padding: '50px 20px 18px',
            boxShadow: 'var(--shadow-header)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.6)',
            }}
          >
            Reef Keeper
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, marginTop: 2 }}>My Tanks</div>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <TankCard
            name="Coral Reef"
            type="Reef Tank"
            volume="100 gal"
            age="1 yr online"
            swatch="linear-gradient(135deg,var(--coral-600),var(--ocean-700))"
            stats={[
              { label: 'pH', value: '8.2', bar: 'var(--green-600)' },
              { label: 'Temp', value: '78°', bar: 'var(--green-600)' },
              { label: 'Alk', value: '9.1', bar: 'var(--amber-500)' },
            ]}
          />
          <TankCard
            name="Guppy Haven"
            type="Freshwater Tank"
            volume="30 gal"
            age="6 mo online"
            swatch="linear-gradient(135deg,var(--green-600),var(--ocean-700))"
            stats={[
              { label: 'pH', value: '6.8', bar: 'var(--green-600)' },
              { label: 'NO₃', value: '8', bar: 'var(--green-600)' },
              { label: 'GH', value: '7', bar: 'var(--teal-500)' },
            ]}
          />
        </div>
        <BottomNav active="tank" />
      </PhoneShell>
    </div>
  );
}

/* ------------------------------- LOG PHONE ------------------------------- */

const chipIdle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '9px 14px',
  borderRadius: 999,
  fontSize: 13.5,
  fontWeight: 600,
  background: 'var(--white)',
  color: 'var(--ocean-700)',
  border: '1.5px solid var(--teal-600)',
};
const key: CSSProperties = {
  minHeight: 46,
  background: 'var(--surface-app)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  fontWeight: 600,
  color: 'var(--text-strong)',
};

export function LogPhone() {
  return (
    <PhoneShell>
      <div style={notch} />
      <div
        style={{
          background: 'var(--color-header-gradient)',
          color: '#fff',
          padding: '46px 18px 16px',
          boxShadow: 'var(--shadow-header)',
        }}
      >
        <div style={{ fontSize: 21, fontWeight: 800 }}>Log a Reading</div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            background: 'rgba(255,255,255,.14)',
            padding: '5px 12px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Coral Reef
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 10,
          }}
        >
          Parameter
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <span style={chipIdle}>pH</span>
          <span style={chipIdle}>Temp</span>
          <span style={chipIdle}>Salinity</span>
          <span
            style={{
              ...chipIdle,
              fontWeight: 700,
              background: 'var(--ocean-500)',
              color: '#fff',
              border: '1.5px solid var(--ocean-500)',
            }}
          >
            Nitrate
          </span>
          <span style={chipIdle}>Ammonia</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 'auto',
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: '8px 18px 18px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--ink-200)', margin: '0 auto 12px' }} />
        <div
          style={{
            textAlign: 'center',
            padding: '4px 0 14px',
            borderBottom: '1px solid var(--border-divider)',
            marginBottom: 12,
          }}
        >
          <span style={{ ...mono, fontSize: 28, fontWeight: 600, color: 'var(--text-strong)' }}>5</span>
          <span style={{ fontSize: 17, color: 'var(--text-muted)', marginLeft: 7, fontWeight: 500 }}>ppm</span>
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 24,
              background: 'var(--teal-500)',
              marginLeft: 4,
              verticalAlign: 'middle',
              animation: 'rk-blink 1s steps(1) infinite',
            }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
          {['1', '2', '3', '4'].map((n) => (
            <div key={n} style={key}>
              {n}
            </div>
          ))}
          <div style={{ ...key, background: 'var(--ink-200)' }}>5</div>
          <div style={key}>6</div>
        </div>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            background: 'var(--action-primary)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '.02em',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          SAVE
        </a>
      </div>
    </PhoneShell>
  );
}

/* ------------------------------ GRAPHS PHONE ----------------------------- */

const tfTab = (label: string, active = false): CSSProperties => ({
  padding: '7px 12px',
  fontSize: 12.5,
  fontWeight: active ? 700 : 500,
  borderRadius: 999,
  color: active ? 'var(--ocean-700)' : 'var(--text-muted)',
  background: active ? 'var(--white)' : 'transparent',
  boxShadow: active ? 'var(--shadow-xs)' : 'none',
});

const filterPill = (active = false): CSSProperties => ({
  padding: '7px 13px',
  borderRadius: 999,
  fontSize: 12.5,
  fontWeight: active ? 700 : 600,
  background: active ? 'var(--teal-500)' : 'var(--white)',
  color: active ? '#fff' : 'var(--ocean-700)',
  border: '1.5px solid var(--teal-500)',
});

export function GraphsPhone() {
  return (
    <PhoneShell shadow="0 36px 80px rgba(0,0,0,.46)">
      <div style={notch} />
      <div
        style={{
          background: 'var(--color-header-gradient)',
          color: '#fff',
          padding: '46px 18px 16px',
          boxShadow: 'var(--shadow-header)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.6)',
          }}
        >
          Coral Reef
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, marginTop: 2 }}>Analytics</div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <div
          style={{
            display: 'inline-flex',
            alignSelf: 'center',
            alignItems: 'center',
            gap: 2,
            padding: 4,
            background: 'var(--ink-100)',
            borderRadius: 999,
          }}
        >
          <span style={tfTab('7d')}>7d</span>
          <span style={tfTab('30d', true)}>30d</span>
          <span style={tfTab('90d')}>90d</span>
          <span style={tfTab('1y')}>1y</span>
        </div>
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-divider)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Nitrate</div>
              <div style={{ ...mono, fontSize: 30, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.1, marginTop: 2 }}>
                8
                <span style={{ fontSize: 15, color: 'var(--text-faint)', fontWeight: 500, marginLeft: 3 }}>ppm</span>
              </div>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'var(--status-success-surface)',
                color: 'var(--green-700)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ▲ +40%
            </span>
          </div>
          <svg viewBox="0 0 240 120" style={{ width: '100%', height: 120, marginTop: 12, display: 'block' }}>
            <rect x="0" y="44" width="240" height="40" fill="var(--green-100)" opacity="0.6" />
            <text x="2" y="40" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-400)">
              20
            </text>
            <text x="2" y="92" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-400)">
              10
            </text>
            <polyline
              points="6,96 44,82 82,86 120,64 158,40 196,58 234,52"
              fill="none"
              stroke="var(--teal-500)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points="6,96 44,82 82,86 120,64 158,40 196,58 234,52 234,120 6,120"
              fill="var(--teal-500)"
              opacity="0.08"
            />
            <circle cx="158" cy="40" r="3.4" fill="var(--coral-600)" stroke="#fff" strokeWidth="1.5" />
            <circle cx="234" cy="52" r="3" fill="var(--teal-500)" stroke="#fff" strokeWidth="1.5" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <span style={{ width: 14, height: 8, borderRadius: 3, background: 'var(--green-100)', display: 'inline-block' }} />
            Safe 10–20 ppm
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          <span style={filterPill(true)}>Nitrate</span>
          <span style={filterPill()}>pH</span>
          <span style={filterPill()}>Temp</span>
          <span style={filterPill()}>Alk</span>
        </div>
      </div>
    </PhoneShell>
  );
}

/* ------------------------------- TASKS PHONE ----------------------------- */

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-divider)', margin: '2px 0' }} />;
}

export function TasksPhone() {
  return (
    <PhoneShell>
      <div style={notch} />
      <div
        style={{
          background: 'var(--color-header-gradient)',
          color: '#fff',
          padding: '46px 18px 16px',
          boxShadow: 'var(--shadow-header)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.6)',
          }}
        >
          Reef Keeper
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, marginTop: 2 }}>Tasks</div>
      </div>
      <div style={{ flex: 1, padding: '18px 18px', overflow: 'hidden' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--coral-600)',
            marginBottom: 6,
          }}
        >
          Overdue
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 2px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--coral-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flex: '0 0 22px' }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>Clean protein skimmer</div>
            <div style={{ fontSize: 13, color: 'var(--coral-600)', marginTop: 3 }}>
              Coral Reef · <span style={{ fontWeight: 600 }}>overdue 2 days</span>
            </div>
          </div>
        </div>
        <Divider />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: '16px 0 6px',
          }}
        >
          Upcoming
        </div>
        {[
          { title: 'Water change (10 gal)', meta: 'Guppy Haven · Weekly, Due tomorrow' },
          { title: 'Dose calcium', meta: 'Coral Reef · Daily, Due in 2 days' },
        ].map((t) => (
          <div key={t.title}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 2px' }}>
              <span style={{ width: 24, height: 24, flex: '0 0 24px', borderRadius: 7, border: '2px solid var(--ink-300)', marginTop: 1 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{t.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{t.meta}</div>
              </div>
            </div>
            <Divider />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 2px' }}>
          <span
            style={{
              width: 24,
              height: 24,
              flex: '0 0 24px',
              borderRadius: 7,
              background: 'var(--green-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-faint)', textDecoration: 'line-through' }}>
              Replace filter floss
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Guppy Haven · Monthly</div>
          </div>
        </div>
      </div>
      <BottomNav active="tasks" />
    </PhoneShell>
  );
}
