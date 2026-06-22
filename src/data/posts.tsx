import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

export type Post = {
  slug: string;
  category: string;
  categoryColor: string;
  readTime: string;
  title: string;
  excerpt: string;
  gradient: string;
  comingSoon?: boolean;
  content?: () => ReactNode;
};

const Bullet = ({ d, stroke = 'var(--teal-500)' }: { d: string; stroke?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 22px', marginTop: 1 }} dangerouslySetInnerHTML={{ __html: d }} />
);

export const posts: Post[] = [
  {
    slug: 'how-often-to-test-aquarium-water',
    category: 'Water testing',
    categoryColor: 'var(--teal-600)',
    readTime: '6 min read',
    title: 'How often should you test your aquarium water?',
    excerpt:
      'A new tank, a mature reef and a planted nano all want different testing rhythms. Here’s a simple schedule — and which parameters actually move the needle.',
    gradient: 'linear-gradient(135deg,var(--teal-400),var(--ocean-900))',
    content: () => (
      <>
        <p>
          If there’s one habit that separates thriving tanks from struggling ones, it’s{' '}
          <strong>consistent testing</strong>. Not obsessive testing — consistent. Water in a
          closed system drifts slowly, and the only way to catch a problem before your fish or
          corals do is to measure on a regular cadence and watch the trend.
        </p>
        <p>The hard part isn’t the chemistry; it’s the routine. So let’s make it simple.</p>

        <h2>The short answer</h2>
        <p>
          For most established tanks, testing the core parameters <strong>once a week</strong> is
          plenty. New tanks need more — every day or two during cycling — and high-demand reef
          systems benefit from a couple of checks a week on the parameters their corals consume
          fastest.
        </p>

        <div style={{ background: 'var(--green-100)', borderRadius: 'var(--radius-lg)', padding: '22px 24px', margin: '8px 0 24px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--green-700)', marginBottom: 10 }}>
            A simple schedule
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Cycling (new tank)', 'Ammonia, nitrite & nitrate every 1–2 days'],
              ['Established', 'Full panel once a week, same day'],
              ['Busy reef', 'Alkalinity, calcium & magnesium 2–3× a week'],
              ['After a change', 'Re-test anything you adjusted within 24h'],
            ].map(([k, v]) => (
              <li key={k} style={{ display: 'flex', gap: 12, fontSize: 16, color: 'var(--ink-700)' }}>
                <strong style={{ minWidth: 120, color: 'var(--green-700)' }}>{k}</strong> {v}
              </li>
            ))}
          </ul>
        </div>

        <h2>Why frequency depends on the tank’s age</h2>
        <p>
          A brand-new tank has no established bacteria colony to process waste, so ammonia and
          nitrite can swing dangerously in a single day. During this{' '}
          <Link to="/blog/$slug" params={{ slug: 'new-tank-syndrome-nitrogen-cycle' }} className="link">
            cycling period
          </Link>{' '}
          you’re not maintaining a stable system — you’re watching one come to life, and daily
          readings are how you know it’s safe to add livestock.
        </p>
        <p>
          Once the cycle completes and your readings hold steady week to week, you can relax the
          cadence. A mature tank is a buffered, biologically stable environment; it changes slowly,
          and weekly testing catches drift long before it matters.
        </p>

        <h2>Which parameters actually matter</h2>
        <p>You don’t need to test everything every time. Match the parameter to the tank:</p>
        <ul>
          <li>
            <Bullet d='<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' />
            <span>
              <strong>Every tank:</strong> temperature, pH, ammonia, nitrite, nitrate. These are
              your safety vitals.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M12 2.5s7 7.6 7 12.5a7 7 0 0 1-14 0C5 10.1 12 2.5 12 2.5z"/>' />
            <span>
              <strong>Saltwater & reef:</strong> salinity, alkalinity, calcium, magnesium. Corals
              draw these down constantly.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/>' />
            <span>
              <strong>Planted:</strong> watch pH and nitrate against your dosing and CO₂ schedule.
            </span>
          </li>
        </ul>

        <h2>The trend matters more than the number</h2>
        <p>
          A single nitrate reading of 15 ppm tells you very little. The same number measured every
          week for a month tells you everything: is it holding steady, creeping up, or spiking after
          feeding? <strong>Direction beats magnitude.</strong> A value that’s technically “in
          range” but climbing fast is a problem you can fix early; a stable value near the edge of
          safe is often fine.
        </p>
        <p>
          This is exactly why logging beats memory. Test on the same day each week, write the number
          down the moment you read it, and let the line do the talking.
        </p>

        <h2>Make the habit stick</h2>
        <p>
          The best testing schedule is the one you don’t have to think about. Pick a fixed day,
          keep your kit somewhere visible, and set a recurring reminder so it’s never a decision.
          Reef Keeper was built around exactly this loop —{' '}
          <strong>log a reading in seconds, see the trend, get nudged when the next test is due</strong>{' '}
          — so consistency becomes the default instead of the goal.
        </p>
      </>
    ),
  },
  {
    slug: 'new-tank-syndrome-nitrogen-cycle',
    category: 'Getting started',
    categoryColor: 'var(--green-700)',
    readTime: '7 min read',
    title: 'New tank syndrome: surviving the nitrogen cycle',
    excerpt:
      'Why ammonia and nitrite spike in a brand-new tank, what a healthy cycle curve looks like, and when it’s safe to add livestock.',
    gradient: 'linear-gradient(135deg,var(--green-500),var(--ocean-800))',
    content: () => (
      <>
        <p>
          Every new aquarium goes through the same rite of passage. You fill it, you add a fish or
          two, and within a week the water that looked perfect turns toxic. This is{' '}
          <strong>new tank syndrome</strong>, and it isn’t a failure — it’s biology.
          Understanding it is the single most valuable thing a new keeper can learn.
        </p>

        <h2>What the nitrogen cycle actually is</h2>
        <p>
          Fish produce <strong>ammonia</strong> — through waste and respiration — and ammonia is
          highly toxic even in small amounts. In an established tank, colonies of beneficial bacteria
          convert that ammonia into <strong>nitrite</strong> (also toxic), and a second group
          converts nitrite into <strong>nitrate</strong> (largely harmless at low levels, removed by
          water changes).
        </p>
        <p>
          A brand-new tank has none of those bacteria yet. They have to grow, and growing them takes
          weeks. Until they do, waste has nowhere to go.
        </p>

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 24, margin: '8px 0 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 4 }}>
            The classic cycle curve
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            Over roughly 4–6 weeks, each spike rises and falls in sequence.
          </div>
          <svg viewBox="0 0 480 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <line x1="34" y1="170" x2="470" y2="170" stroke="var(--ink-200)" strokeWidth="1.5" />
            <line x1="34" y1="20" x2="34" y2="170" stroke="var(--ink-200)" strokeWidth="1.5" />
            <path d="M34,168 C90,168 110,40 150,40 C190,40 210,150 280,162 C350,168 430,166 466,166" fill="none" stroke="var(--coral-600)" strokeWidth="3" strokeLinecap="round" />
            <path d="M34,170 C120,170 150,164 200,80 C240,30 270,40 300,120 C340,164 420,166 466,164" fill="none" stroke="var(--amber-500)" strokeWidth="3" strokeLinecap="round" />
            <path d="M34,170 C150,170 230,168 300,150 C360,134 420,70 466,40" fill="none" stroke="var(--teal-500)" strokeWidth="3" strokeLinecap="round" />
            <text x="40" y="16" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="var(--ink-500)">
              Concentration
            </text>
            <text x="408" y="190" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="var(--ink-500)">
              Time →
            </text>
          </svg>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
            {[
              ['Ammonia', 'var(--coral-600)'],
              ['Nitrite', 'var(--amber-500)'],
              ['Nitrate', 'var(--teal-500)'],
            ].map(([label, c]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>
                <span style={{ width: 16, height: 3, borderRadius: 2, background: c }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <h2>Reading the curve</h2>
        <p>A healthy cycle plays out in a predictable order, and watching it is genuinely reassuring once you know the script:</p>
        <ul>
          <li>
            <Bullet stroke="var(--coral-600)" d='<path d="M12 2v20"/><path d="m5 9 7-7 7 7"/>' />
            <span>
              <strong>Ammonia rises first</strong>, peaks, then begins to fall as the first bacteria
              establish.
            </span>
          </li>
          <li>
            <Bullet stroke="var(--amber-500)" d='<path d="M12 2v20"/><path d="m5 9 7-7 7 7"/>' />
            <span>
              <strong>Nitrite spikes next</strong> as ammonia is converted — often the longest,
              most nerve-wracking phase.
            </span>
          </li>
          <li>
            <Bullet stroke="var(--green-600)" d='<path d="M20 6 9 17l-5-5"/>' />
            <span>
              <strong>Ammonia and nitrite both hit zero</strong>, and nitrate climbs. That’s your
              green light.
            </span>
          </li>
        </ul>

        <h2>When is it safe to add livestock?</h2>
        <p>
          The cycle is complete when you can measure <strong>0 ppm ammonia and 0 ppm nitrite</strong>{' '}
          with a detectable nitrate reading, and those zeros hold for several consecutive days. Not
          one good reading — a stable pattern. This is the moment a logbook earns its keep: a chart
          that shows both curves flat on the floor for a week is far more trustworthy than a single
          hopeful test.
        </p>
        <p>
          Add livestock slowly even then. A big bioload dropped on a young bacteria colony can
          trigger a smaller second spike, so stock in stages and keep{' '}
          <Link to="/blog/$slug" params={{ slug: 'how-often-to-test-aquarium-water' }} className="link">
            testing frequently
          </Link>{' '}
          for the first month.
        </p>

        <h2>Speeding it up safely</h2>
        <p>
          You can shorten the wait by seeding your tank with established media — filter sponge,
          gravel or a bottled bacteria product from a healthy system. It gives the colony a head
          start, but it doesn’t skip the cycle. <strong>You still test until the numbers prove
          it’s done.</strong> Patience here pays off for the entire life of the tank.
        </p>
      </>
    ),
  },
  {
    slug: 'reading-your-nitrate-trend',
    category: 'Reef keeping',
    categoryColor: 'var(--coral-700)',
    readTime: '5 min',
    title: 'Reading your nitrate trend: what’s normal?',
    excerpt:
      'How to interpret the slope of your nitrate line, not just the number — and what a steady climb is really telling you.',
    gradient: 'linear-gradient(135deg,var(--coral-600),var(--ocean-800))',
    comingSoon: true,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
