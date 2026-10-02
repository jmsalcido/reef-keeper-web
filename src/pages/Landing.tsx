import { useState, type CSSProperties } from 'react';
import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { IPhoneHandoff } from '../components/IPhoneHandoff';
import { AppStoreButton } from '../components/AppStoreButton';
import { HeroPhone, LogPhone, GraphsPhone, TasksPhone } from '../components/Phones';
import { APP_STORE_URL } from '../config';
import { publishedPosts } from '../data/posts';

import {
  JsonLd,
  applicationProductJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
} from '../seo/structuredData';

const latestPosts = publishedPosts.slice(0, 3);

const overline: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'var(--teal-600)',
};

const sectionH2: CSSProperties = {
  fontSize: 38,
  lineHeight: 1.12,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--ocean-900)',
  margin: '14px 0 0',
};

const featureCard: CSSProperties = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-xl)',
  padding: 30,
  boxShadow: 'var(--shadow-xs)',
};

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 20px', marginTop: 1 }}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const CheckLight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 20px', marginTop: 1 }}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const FAQS = [
  {
    q: 'Is Reef Keeper free?',
    a: 'Start free with one primary aquarium, readings and maintenance tasks. Pro adds more aquariums, advanced trend ranges and data export. Monthly, Yearly and Lifetime unlock the same Pro access.',
  },
  {
    q: "What's the difference between the plans?",
    a: 'Only the billing. Monthly ($4.99) is the most flexible, Yearly ($44.99) works out to $3.75/mo — about 25% cheaper — and Lifetime ($99.99 once) is a one-time payment with no recurring charge. The app itself is identical on all three.',
  },
  {
    q: 'How do I cancel or change my plan?',
    a: 'Subscriptions are managed through your Apple ID. Open Settings → your name → Subscriptions on your iPhone to switch plans or cancel. You keep access until the end of the current period.',
  },
  {
    q: 'Does it work for freshwater and saltwater?',
    a: 'Yes. Track freshwater, saltwater and reef aquariums with their own parameter ranges. Start with one primary aquarium free; Pro supports additional aquariums.',
  },
  {
    q: 'Which parameters can I track?',
    a: 'Log pH, temperature, salinity, ammonia, nitrite, nitrate, phosphate, alkalinity, calcium, magnesium, KH and GH. Readings are entered by you from your tests.',
  },
  {
    q: 'Does my aquarium history sync between devices?',
    a: 'Aquarium records are stored locally on your device. Cross-device iCloud sync is not currently available. Pro includes data export so you can keep a separate copy of your records.',
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xs)',
              overflow: 'hidden',
            }}
          >
            <button
              id={`faq-question-${i}`}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '20px 22px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--text-strong)' }}>{f.q}</span>
              <span
                style={{
                  flex: '0 0 24px',
                  color: 'var(--teal-500)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--dur-base) var(--ease-standard)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            {(<div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} hidden={!isOpen} style={{ padding: '0 22px 22px', fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-body)' }}>
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Landing() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), applicationProductJsonLd(), faqPageJsonLd(FAQS)]} />
      <Nav variant="landing" />

      <main id="main-content">
      {/* HERO */}
      <section id="top" style={{ position: 'relative', background: 'var(--color-bg-gradient)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -140, right: -120, width: 460, height: 460, borderRadius: 999, background: 'radial-gradient(circle,rgba(52,160,184,.28),transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -160, left: -120, width: 420, height: 420, borderRadius: 999, background: 'radial-gradient(circle,rgba(39,160,106,.18),transparent 70%)' }} />
        <div
          className="rk-hero-grid"
          style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '84px 28px 88px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 56, alignItems: 'center' }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.7)', border: '1px solid var(--border-divider)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--teal-600)' }}>
              Aquarium tracker for iOS
            </div>
            <h1 style={{ fontSize: 60, lineHeight: 1.04, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ocean-900)', margin: '22px 0 0', textWrap: 'balance' } as CSSProperties}>
              Know your tanks.<br />Keep a clear history.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--text-body)', maxWidth: 480, margin: '22px 0 0' }}>
              Record your water tests, review changes over time, and organize maintenance. Reef
              Keeper brings the readings you enter into one aquarium logbook.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, flexWrap: 'wrap' }}>
              <AppStoreButton variant="dark" />
              <div style={{ fontSize: 13.5, lineHeight: 1.4, color: 'var(--text-muted)' }}>
                Free to download
                <br />
                Plans from <strong style={{ color: 'var(--text-body)' }}>$4.99/mo</strong>
              </div>
            </div>
            <IPhoneHandoff />
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                marginTop: 18,
                color: 'var(--teal-600)',
                fontSize: 14.5,
                fontWeight: 700,
              }}
            >
              Questions? Contact support
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 30, color: 'var(--teal-600)', fontSize: 14, fontWeight: 600 }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
              Keep your next reading close at hand.
            </div>
          </div>
          <div><HeroPhone /><p style={{ textAlign: 'center', color: 'var(--text-body)', fontSize: 13 }}>Illustration · fictional aquarium data</p></div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 28px 84px' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div style={overline}>Why Reef Keeper</div>
          <h2 style={sectionH2}>
            Everything your tanks need.
            <br />
            Nothing they don't.
          </h2>
        </div>
        <div className="rk-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginTop: 56 }}>
          {[
            {
              bg: 'var(--green-100)',
              stroke: 'var(--green-700)',
              d: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>',
              title: 'Keep your tests in one place',
              body: "Pick a tank, tap a parameter, type the value on a big numeric keypad, save. pH, salinity, nitrate and more — recorded before you've put the test kit down.",
            },
            {
              bg: 'var(--teal-100)',
              stroke: 'var(--teal-600)',
              d: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/>',
              title: 'See every trend',
              body: 'Review charts of the readings you enter against your aquarium ranges. A trend helps you decide what to check next; it does not diagnose aquarium health.',
            },
            {
              bg: 'var(--amber-100)',
              stroke: 'var(--amber-600)',
              d: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
              title: 'Plan your next maintenance task',
              body: 'Recurring reminders for water changes, filter swaps and dosing. Mark a task done and it reschedules itself — daily, weekly or monthly.',
            },
            {
              bg: 'var(--ink-100)',
              stroke: 'var(--ocean-700)',
              d: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11c3 1.5 5-1.5 9 0s6 1 9 0"/>',
              title: 'All your tanks together',
              body: 'Keep each aquarium with its own parameters, photo and history. Start with one primary aquarium free, and add more with Pro.',
            },
          ].map((f) => (
            <div key={f.title} style={featureCard}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: f.d }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-strong)', margin: '20px 0 0', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--text-body)', margin: '8px 0 0' }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section id="screens" style={{ position: 'relative', background: 'var(--color-header-gradient)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -80, width: 380, height: 380, borderRadius: 999, background: 'radial-gradient(circle,rgba(52,160,184,.22),transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '90px 28px' }}>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
            <div style={{ ...overline, color: 'var(--teal-400)' }}>A closer look</div>
            <h2 style={{ ...sectionH2, color: '#fff' }}>Built for the daily loop</h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,.78)', margin: '16px 0 0' }}>
              Log a reading, see the trend, get reminded of the next task. The whole cycle, designed
              to be fast. These illustrations use fictional data; they are not app screenshots.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 36, justifyContent: 'center', alignItems: 'flex-start', marginTop: 64, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              <LogPhone />
              <Caption title="Speed-first logging" body="Tap, type, save — the keypad is the whole flow." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: -18 }}>
              <GraphsPhone />
              <Caption title="Trends & safe ranges" body="Example range chosen for this fictional tank; not care advice." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              <TasksPhone />
              <Caption title="Maintenance, handled" body="Overdue in coral, complete to reschedule." />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: 'var(--surface-app)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 28px' }}>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
            <div style={overline}>Pricing</div>
            <h2 style={sectionH2}>One app. Pick how you pay.</h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--text-body)', margin: '14px 0 0' }}>
              Every Pro plan includes more aquariums, advanced trend ranges and data export.
              Choose your billing preference; free users can begin with one primary aquarium.
            </p>
          </div>
          <div className="rk-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginTop: 56, alignItems: 'stretch' }}>
            {/* Monthly */}
            <PlanCard
              label="Monthly"
              price="$4.99"
              unit="/mo"
              sub="Billed monthly. Cancel anytime."
              features={['Additional aquariums', 'Advanced trend ranges', 'Complete data export']}
              cta="View Monthly in the app"
            />
            {/* Yearly highlighted */}
            <div style={{ position: 'relative', background: 'var(--color-header-gradient)', borderRadius: 'var(--radius-xl)', padding: '32px 30px', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', transform: 'translateY(-12px)' }} className="rk-pricing-featured">
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#14704b', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 999, boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
                Yearly · Save about 25%
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#b3e2ec' }}>Yearly</div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 46, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>$44.99</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>/yr</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', marginTop: 6 }}>Just $3.75/mo, billed once a year.</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.16)', margin: '22px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {['Same Pro features as Monthly', 'Save $14.89 vs. 12 monthly payments', 'About 25% lower yearly cost'].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'rgba(255,255,255,.92)' }}>
                    <CheckLight />
                    {t}
                  </li>
                ))}
              </ul>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, borderRadius: 'var(--radius-pill)', background: '#14704b', color: '#fff', fontSize: 15, fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
                View Yearly in the app
              </a>
            </div>
            {/* Lifetime */}
            <PlanCard
              label="Lifetime"
              price="$99.99"
              unit="once"
              subColor="#805100"
              subWeight={600}
              sub="One-time purchase. No subscription."
              features={['Same Pro features as Monthly', 'One-time payment', 'No recurring subscription']}
              cta="View Lifetime in the app"
            />
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#456478', margin: '28px 0 0' }}>
            US reference prices; local prices and available offers appear in the app. Subscriptions are billed through your Apple ID and renew automatically
            until cancelled in Settings.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 760, margin: '0 auto', padding: '96px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={overline}>FAQ</div>
          <h2 style={{ ...sectionH2, fontSize: 36 }}>Questions, answered</h2>
        </div>
        <Faq />
      </section>

      {/* BLOG TEASER */}
      <section aria-labelledby="latest-guides-heading" className="rk-latest-guides" style={{ background: 'var(--surface-app)', borderTop: '1px solid var(--border-divider)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '84px 28px' }}>
          <div className="rk-latest-guides-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <div>
              <div style={overline}>The journal</div>
              <h2 id="latest-guides-heading" style={{ ...sectionH2, fontSize: 32, margin: '12px 0 0' }}>Guides for healthier tanks</h2>
            </div>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 15, fontWeight: 700, color: 'var(--teal-600)' }}>
              All articles
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="rk-latest-guides-grid">
            {latestPosts.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="rk-guide-card">
                <div className="rk-guide-card-art" style={{ background: p.gradient }} aria-hidden="true" />
                <div className="rk-guide-card-body">
                  <div className="rk-guide-card-meta">
                    <span style={{ color: p.categoryColor }}>{p.category}</span>
                    <span className="rk-guide-read-time">{p.readTime}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="rk-guide-read-link">Read article <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ position: 'relative', background: 'var(--color-header-gradient)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 520, height: 520, borderRadius: 999, background: 'radial-gradient(circle,rgba(52,160,184,.2),transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', padding: '96px 28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.025em', color: '#fff', margin: 0, textWrap: 'balance' } as CSSProperties}>
            Your tanks deserve a better logbook.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,.8)', margin: '18px auto 0', maxWidth: 520 }}>
            Download Reef Keeper free and log your first reading in seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
            <AppStoreButton variant="light" />
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

function Caption({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 240 }}>
      <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{title}</div>
      <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, marginTop: 4, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

function PlanCard({
  label,
  tag,
  price,
  unit,
  sub,
  subColor = 'var(--text-muted)',
  subWeight = 400,
  features,
  cta,
}: {
  label: string;
  tag?: string;
  price: string;
  unit: string;
  sub: string;
  subColor?: string;
  subWeight?: number;
  features: string[];
  cta: string;
}) {
  return (
    <div style={{ ...featureCard, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        {tag && (
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--amber-600)', background: 'var(--amber-100)', padding: '3px 8px', borderRadius: 999 }}>
            {tag}
          </span>
        )}
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 46, fontWeight: 600, color: 'var(--ocean-900)', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 14, color: subColor, fontWeight: subWeight, marginTop: 6 }}>{sub}</div>
      <div style={{ height: 1, background: 'var(--border-divider)', margin: '22px 0' }} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {features.map((t) => (
          <li key={t} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: 'var(--text-body)' }}>
            <Check />
            {t}
          </li>
        ))}
      </ul>
      <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, borderRadius: 'var(--radius-pill)', background: 'var(--white)', color: 'var(--ocean-700)', border: '1.5px solid var(--ink-300)', fontSize: 15, fontWeight: 700 }}>
        {cta}
      </a>
    </div>
  );
}
