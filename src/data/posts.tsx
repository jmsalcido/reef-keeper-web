import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

type PostBase = {
  slug: string;
  category: string;
  categoryColor: string;
  readTime: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  gradient: string;
  image?: string;
};

export type PublishedPost = PostBase & {
  comingSoon?: false;
  datePublished: string;
  dateModified: string;
  content: () => ReactNode;
};

export type ComingSoonPost = PostBase & {
  comingSoon?: boolean;
  datePublished?: never;
  dateModified?: never;
  content?: never;
};

export type Post = PublishedPost | ComingSoonPost;

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
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
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
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
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
    slug: 'aquarium-maintenance-schedule',
    category: 'Maintenance',
    categoryColor: 'var(--green-700)',
    readTime: '9 min read',
    title: 'Aquarium Maintenance Schedule: Daily, Weekly, Monthly & Yearly Checklist',
    seoTitle: 'Aquarium Maintenance Schedule: Daily, Weekly, Monthly & Yearly Checklist',
    metaDescription:
      'A practical aquarium maintenance schedule with daily, weekly, monthly, 6-month, and yearly tasks for healthier freshwater and reef tanks.',
    excerpt:
      'A practical aquarium maintenance schedule for daily checks, weekly water changes, monthly cleaning, 6-month reviews, and yearly tank care.',
    gradient: 'linear-gradient(135deg,var(--green-500),var(--teal-700))',
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
    content: () => (
      <>
        <p>
          A good <strong>aquarium maintenance schedule</strong> is less about doing a giant reset
          every few months and more about doing small, predictable tasks before problems build up.
          Fish, plants, corals, bacteria, filters, lights, and heaters all depend on stability. A
          checklist turns that stability into a habit.
        </p>
        <p>
          The exact routine depends on your tank size, stocking level, filtration, and whether you
          keep freshwater, planted, saltwater, or reef systems. Still, most aquariums benefit from a
          simple rhythm: quick daily observations, weekly water care, monthly equipment checks,
          deeper 6-month reviews, and a yearly reset of the things people forget.
        </p>

        <h2>Daily aquarium maintenance</h2>
        <p>
          Daily care should be fast. You are not trying to rebuild the tank every morning. You are
          checking whether anything changed overnight and catching issues while they are still
          small.
        </p>
        <ul>
          <li>
            <Bullet d='<path d="M20 6 9 17l-5-5"/>' />
            <span>
              <strong>Check fish behavior:</strong> look for gasping, hiding, clamped fins, unusual
              aggression, or fish sitting near the surface.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M12 2v20"/><path d="m5 9 7-7 7 7"/>' />
            <span>
              <strong>Confirm temperature:</strong> a stuck heater or warm room can shift
              temperature faster than many beginners expect.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>' />
            <span>
              <strong>Inspect equipment flow:</strong> make sure filters, pumps, air stones, and
              surface agitation are working normally.
            </span>
          </li>
          <li>
            <Bullet d='<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>' />
            <span>
              <strong>Feed carefully:</strong> feed what livestock will eat quickly, and remove
              obvious leftovers when possible.
            </span>
          </li>
        </ul>
        <p>
          A daily glance is also the best time to notice evaporation. Freshwater evaporates, but
          minerals and salt stay behind. In reef tanks especially, topping off with fresh water
          helps keep salinity from creeping upward.
        </p>

        <h2>Weekly aquarium maintenance</h2>
        <p>
          Weekly maintenance is where most tank health is won. This is the cadence for testing,
          water changes, algae control, and trend review. Pick a day you can repeat, because a
          routine you actually follow is better than a perfect routine you keep postponing.
        </p>
        <h3>Test your core water parameters</h3>
        <p>
          For most established aquariums, weekly testing gives you enough signal to catch drift.
          Test pH, ammonia, nitrite, nitrate, and temperature for most tanks. Reef keepers should
          also track salinity, alkalinity, calcium, and magnesium. Planted freshwater tanks may also
          benefit from watching KH, GH, and nitrate against fertilizing and CO2 routines.
        </p>
        <p>
          If you are unsure which numbers matter most, read the guide to{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
            aquarium water parameters
          </Link>{' '}
          and safe beginner ranges.
        </p>
        <h3>Do the water change your tank needs</h3>
        <p>
          Many freshwater tanks do well with a weekly partial water change, often around 10-25%,
          but the right amount depends on nitrate buildup, stocking, feeding, and plant growth. Reef
          tanks may use smaller or more tailored changes depending on dosing, nutrients, and coral
          demand. Test results should guide the routine instead of habit alone.
        </p>
        <p>
          During the water change, siphon obvious debris, clean the glass, wipe salt creep on
          saltwater systems, and inspect hoses or cords for wear. Avoid washing biological filter
          media under untreated tap water, since chlorine or chloramine can harm beneficial
          bacteria.
        </p>

        <h2>Monthly aquarium maintenance</h2>
        <p>
          Monthly tasks are mostly about equipment, slow buildup, and records. They are easy to
          forget because the tank often looks fine until something fails.
        </p>
        <ul>
          <li>
            <Bullet d='<path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8z"/>' />
            <span>
              <strong>Service mechanical filtration:</strong> rinse sponges or pads in removed tank
              water when flow drops or debris builds up.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/>' />
            <span>
              <strong>Review parameter trends:</strong> one nitrate number matters less than
              whether the line is stable, rising, or suddenly spiking.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M6 2h12"/><path d="M8 2v20"/><path d="M16 2v20"/><path d="M6 22h12"/>' />
            <span>
              <strong>Check bulbs, LEDs, and timers:</strong> confirm your photoperiod is still
              intentional and not feeding nuisance algae.
            </span>
          </li>
        </ul>
        <p>
          This is also a good time to compare the tank to your notes. Did algae appear after a
          lighting change? Did nitrate climb after adding fish? Did alkalinity drop after coral
          growth picked up? A simple{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameter-tracker' }} className="link">
            aquarium water parameter tracker
          </Link>{' '}
          makes those patterns easier to see.
        </p>

        <h2>Every 6 months</h2>
        <p>
          Twice a year, step back and look at the system as a whole. You are checking whether the
          maintenance schedule still matches the aquarium you have today, not the one you set up
          months ago.
        </p>
        <ul>
          <li>
            <Bullet d='<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v7h-7"/>' />
            <span>
              Replace consumables such as chemical media, worn filter parts, dosing tubing, or test
              kits that are expired or nearly empty.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/>' />
            <span>
              Recheck whether your water-change volume, feeding routine, and testing frequency
              still match your livestock and nutrient trends.
            </span>
          </li>
          <li>
            <Bullet d='<path d="M3 12h18"/><path d="M12 3v18"/>' />
            <span>
              Inspect pumps, heaters, return lines, lids, stands, power strips, and drip loops for
              reliability and safety.
            </span>
          </li>
        </ul>

        <h2>Yearly aquarium maintenance</h2>
        <p>
          Yearly work should not be a disruptive teardown. Think of it as an audit. Calibrate or
          replace tools that have drifted, review old records, and decide what routine should change
          for the next year.
        </p>
        <p>
          For reef aquariums, this may include checking refractometer calibration, reviewing dosing
          amounts, replacing aging probes if you use a controller, and confirming your salt mix and
          water source still produce expected results. For freshwater tanks, it may mean replacing
          old hoses, checking hardscape stability, refreshing aquascaping plans, or reassessing
          stocking.
        </p>

        <h2>How Reef Keeper helps the schedule stick</h2>
        <p>
          The hardest part of aquarium maintenance is not knowing what to do. It is remembering
          what is due, doing it on time, and seeing whether it worked. Reef Keeper helps by letting
          you create recurring reminders for water changes, filter service, testing, dosing, and
          other tank-specific tasks.
        </p>
        <p>
          When you also log water readings, maintenance stops being guesswork. You can see whether
          nitrates improved after a water change, whether alkalinity is dropping between doses, or
          whether a missed task lines up with a parameter swing. That history is what turns a
          checklist into better tank care.
        </p>
      </>
    ),
  },
  {
    slug: 'aquarium-water-parameter-tracker',
    category: 'Water testing',
    categoryColor: 'var(--teal-600)',
    readTime: '8 min read',
    title: 'How to Track Aquarium Water Parameters Without Using a Spreadsheet',
    seoTitle: 'Aquarium Water Parameter Tracker: Track Your Tank Without a Spreadsheet',
    metaDescription:
      'Learn how to track aquarium water parameters without a spreadsheet, including pH, ammonia, nitrite, nitrate, temperature, KH, GH, salinity, calcium, and magnesium.',
    excerpt:
      'Spreadsheets work, but they are not the only way to track pH, ammonia, nitrate, salinity, KH, GH, calcium, magnesium, and tank history.',
    gradient: 'linear-gradient(135deg,var(--teal-400),var(--ocean-800))',
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
    content: () => (
      <>
        <p>
          An <strong>aquarium water parameter tracker</strong> is simply a place to record test
          results over time. It can be a notebook, spreadsheet, Google Sheet, aquarium app, or even
          a calendar. The format matters less than the habit: test regularly, write the number down,
          and compare today to the last few readings.
        </p>
        <p>
          That last part is where many aquariums go off track. A single result tells you what the
          water looked like in that moment. A history tells you whether the tank is becoming safer,
          drifting slowly, or moving toward a problem.
        </p>

        <h2>Why tracking water parameters matters</h2>
        <p>
          Aquarium water can look clear while still being unsafe. Ammonia and nitrite are commonly
          invisible. Nitrate can climb slowly. Temperature can swing between day and night. Reef
          parameters like alkalinity, calcium, and magnesium can move as corals grow, even when the
          tank looks beautiful.
        </p>
        <p>
          Tracking gives you context. If nitrate is 30 ppm today, is that normal for your tank, or
          did it jump from 5 ppm after a missed water change? If alkalinity is lower than expected,
          is it a one-off test error, or has it been falling for two weeks? You cannot answer those
          questions from memory with much confidence.
        </p>

        <h2>Parameters worth tracking</h2>
        <h3>Freshwater basics</h3>
        <p>
          Most freshwater keepers should log temperature, pH, ammonia, nitrite, and nitrate. KH and
          GH are also useful because they describe buffering and hardness, which influence stability
          and livestock suitability. Planted tanks may add notes about CO2, fertilizing, lighting,
          and water changes.
        </p>
        <h3>Saltwater and reef basics</h3>
        <p>
          Saltwater keepers should track temperature, salinity, pH, ammonia, nitrite, and nitrate.
          Reef tanks usually need alkalinity or KH, calcium, and magnesium too, because stony corals
          and coralline algae consume those minerals. Phosphate can also be useful, especially when
          algae or coral color changes.
        </p>
        <p>
          For practical beginner ranges, see{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
            aquarium water parameters explained
          </Link>
          .
        </p>

        <h2>Option 1: notebook tracking</h2>
        <p>
          A paper notebook is simple, cheap, and flexible. You can write down the date, tank name,
          test results, livestock notes, feeding changes, maintenance, and anything unusual. It is
          also easy to keep near the tank.
        </p>
        <p>
          The downside is that paper does not graph trends for you. It is harder to compare six
          months of nitrate readings, spot a slow KH decline, or search for the last time you
          changed filter media. Paper works best when you enjoy writing and have one tank with a
          straightforward routine.
        </p>

        <h2>Option 2: spreadsheet tracking</h2>
        <p>
          Spreadsheets are powerful. You can build columns for pH, ammonia, nitrite, nitrate,
          temperature, KH, GH, salinity, calcium, magnesium, phosphate, and notes. You can add
          charts, formulas, color coding, and separate tabs for different tanks.
        </p>
        <p>
          But a spreadsheet is only helpful if you keep using it. Many hobbyists stop because it
          feels like work after every test. It can also be awkward on a phone when your hands are
          wet, test vials are on the counter, and you just want to enter one number quickly.
        </p>

        <h2>Option 3: app-based tracking</h2>
        <p>
          An app works well when you want speed, history, and reminders without building your own
          system. Reef Keeper is designed around that loop: pick the tank, log the reading, and
          return later to see graphs and history. Instead of scrolling through rows, you can look at
          trends by parameter and see how the tank is changing.
        </p>
        <p>
          App tracking also helps if you have more than one aquarium. A reef tank, planted tank, and
          quarantine tank may all need different parameters and schedules. Keeping those histories
          separate reduces mistakes and makes it easier to understand each tank on its own terms.
        </p>

        <h2>What to record besides numbers</h2>
        <p>
          The best logs include a few notes. Record water changes, filter cleaning, dosing,
          livestock additions, medication advised by a professional, unusual behavior, power
          outages, algae blooms, and equipment changes. These notes explain the numbers.
        </p>
        <p>
          For example, nitrate rising after adding fish is a different story from nitrate rising
          after skipping two water changes. Temperature dropping during a cold night is different
          from temperature dropping because a heater failed. Context turns a tracker from a data
          dump into a care tool.
        </p>

        <h2>Build a tracking habit</h2>
        <p>
          Start with the parameters that matter most for your tank and log them on the same day
          each week. During cycling or after a problem, test more often. When the system is stable,
          keep the rhythm predictable.
        </p>
        <p>
          If spreadsheets make you avoid logging, use something easier. A notebook is better than no
          record, and an app like Reef Keeper can make the habit even lighter by pairing quick logs
          with graphs, history, and recurring reminders.
        </p>
      </>
    ),
  },
  {
    slug: 'aquarium-water-parameters',
    category: 'Water testing',
    categoryColor: 'var(--teal-600)',
    readTime: '10 min read',
    title: 'Aquarium Water Parameters Explained: Safe Ranges for Freshwater & Reef Tanks',
    seoTitle: 'Aquarium Water Parameters Explained: Freshwater and Reef Safe Ranges',
    metaDescription:
      'Aquarium water parameters explained in beginner-friendly language, with practical safe ranges for freshwater and reef tanks plus a helpful reference table.',
    excerpt:
      'A beginner-friendly guide to aquarium water parameters, safe freshwater and reef ranges, and which numbers need the most attention.',
    gradient: 'linear-gradient(135deg,var(--teal-500),var(--green-700))',
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
    content: () => (
      <>
        <p>
          <strong>Aquarium water parameters</strong> are the measurable conditions that tell you
          whether your tank is stable and suitable for the fish, plants, invertebrates, or corals
          you keep. Clear water is nice, but test results are what show whether the aquarium is
          actually safe.
        </p>
        <p>
          The ranges below are practical starting points, not universal rules. Different species
          have different needs, and some animals are adapted to softer, harder, warmer, cooler,
          fresher, or saltier water. When in doubt, research your specific livestock, test your
          water regularly, and ask an experienced aquarist, aquatic veterinarian, or local aquarium
          professional for situation-specific guidance.
        </p>

        <h2>Quick reference table</h2>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Freshwater starting range</th>
              <th>Reef starting range</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Temperature</td>
              <td>74-80 F for many tropical tanks</td>
              <td>76-80 F for many reef tanks</td>
              <td>Fast swings can stress livestock.</td>
            </tr>
            <tr>
              <td>pH</td>
              <td>Often 6.5-7.8, species dependent</td>
              <td>About 7.8-8.4</td>
              <td>Stability is often more important than chasing a perfect number.</td>
            </tr>
            <tr>
              <td>Ammonia</td>
              <td>0 ppm</td>
              <td>0 ppm</td>
              <td>Commonly toxic and urgent when detectable.</td>
            </tr>
            <tr>
              <td>Nitrite</td>
              <td>0 ppm</td>
              <td>0 ppm</td>
              <td>Usually points to an incomplete or disrupted cycle.</td>
            </tr>
            <tr>
              <td>Nitrate</td>
              <td>Commonly under 20-40 ppm</td>
              <td>Often 2-20 ppm, system dependent</td>
              <td>High or rising nitrate can point to excess nutrients.</td>
            </tr>
            <tr>
              <td>KH / alkalinity</td>
              <td>Often 3-8 dKH, species dependent</td>
              <td>About 7-11 dKH</td>
              <td>Buffers pH and supports reef calcification.</td>
            </tr>
            <tr>
              <td>GH</td>
              <td>Often 4-12 dGH, species dependent</td>
              <td>Not usually tracked as GH</td>
              <td>Describes mineral hardness for freshwater livestock.</td>
            </tr>
            <tr>
              <td>Salinity</td>
              <td>Not applicable</td>
              <td>About 1.024-1.026 specific gravity</td>
              <td>Core stability parameter for marine animals.</td>
            </tr>
            <tr>
              <td>Calcium</td>
              <td>Not usually tracked</td>
              <td>About 380-450 ppm</td>
              <td>Used by stony corals, clams, and coralline algae.</td>
            </tr>
            <tr>
              <td>Magnesium</td>
              <td>Not usually tracked</td>
              <td>About 1250-1350 ppm</td>
              <td>Helps stabilize calcium and alkalinity chemistry.</td>
            </tr>
          </tbody>
        </table>

        <h2>Ammonia, nitrite, and nitrate</h2>
        <p>
          These three numbers tell the story of the nitrogen cycle. Fish waste and decaying food
          create ammonia. Beneficial bacteria convert ammonia into nitrite, then nitrite into
          nitrate. In a cycled aquarium, ammonia and nitrite should usually test at zero.
        </p>
        <p>
          Detectable ammonia or nitrite is commonly a sign to slow down, test again, check the
          source of waste, and consider a water change or other corrective steps appropriate for
          the tank. New aquariums are especially vulnerable, which is why a cycling tank needs more
          frequent testing than a mature one.
        </p>
        <p>
          Nitrate is different. It is less immediately dangerous at low levels, but it still matters.
          If nitrate keeps rising, the tank may be overfed, overstocked, under-maintained, or short
          on export through water changes, plants, refugia, or other filtration.
        </p>

        <h2>pH, KH, and GH</h2>
        <p>
          pH measures acidity or alkalinity. Beginners often focus on hitting a specific pH, but
          many aquariums do better when pH is stable and appropriate for the livestock. Sudden pH
          changes can be more stressful than a number that is slightly outside a generic chart.
        </p>
        <p>
          KH, also called carbonate hardness or alkalinity, helps resist pH swings. In reef tanks,
          alkalinity is also one of the major building blocks corals use. GH measures general
          hardness in freshwater, which matters for species that prefer soft water or mineral-rich
          water.
        </p>

        <h2>Temperature and salinity</h2>
        <p>
          Temperature affects oxygen, metabolism, feeding, and stress. A stable heater and a
          reliable thermometer are basic equipment, but logging temperature helps you see patterns:
          warm afternoons, cold nights, or slow heater failure.
        </p>
        <p>
          Salinity is one of the most important reef and saltwater parameters. Evaporation removes
          fresh water but leaves salt behind, so salinity can rise if top-offs are missed. Always
          use a calibrated tool and make changes gradually.
        </p>

        <h2>Calcium and magnesium in reef tanks</h2>
        <p>
          Reef aquariums add another layer because corals and coralline algae consume alkalinity,
          calcium, and magnesium over time. If those values drift, coral growth and stability can
          suffer. Many reef keepers test these parameters weekly at first, then adjust frequency
          once they understand consumption.
        </p>
        <p>
          Avoid dosing blindly. Test, log, look at the trend, and adjust carefully. If a value seems
          strange, retest before making a major change.
        </p>

        <h2>Use ranges as guardrails, not panic buttons</h2>
        <p>
          Safe ranges help you notice risk, but trends are often more useful than one result. A
          nitrate reading that slowly climbs for a month tells you something different from a stable
          reading at the same value. A reef alkalinity number that drops every week tells you more
          than a single test on one afternoon.
        </p>
        <p>
          Reef Keeper is useful here because you can log readings by tank and see graphs over time.
          Pair that with a recurring{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-maintenance-schedule' }} className="link">
            aquarium maintenance schedule
          </Link>{' '}
          and you will have a clearer picture of what your aquarium normally does.
        </p>
      </>
    ),
  },
  {
    slug: 'aquarium-log-book-vs-app',
    category: 'Tracking',
    categoryColor: 'var(--coral-700)',
    readTime: '8 min read',
    title: 'Aquarium Log Book vs Aquarium Apps: Which One Is Better?',
    seoTitle: 'Aquarium Log Book vs Aquarium Apps: Which One Is Better?',
    metaDescription:
      'Compare aquarium log books, spreadsheets, Google Sheets, and aquarium tracker apps for water parameters, reminders, trends, and multiple tanks.',
    excerpt:
      'Paper log books, spreadsheets, Google Sheets, and aquarium tracker apps can all work. Here is how to choose the best tracking system for your tank.',
    gradient: 'linear-gradient(135deg,var(--coral-600),var(--teal-700))',
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
    content: () => (
      <>
        <p>
          An <strong>aquarium log book</strong> can be one of the most useful tools in the hobby.
          It gives you a record of water tests, maintenance, livestock additions, dosing, equipment
          changes, and problems. When something goes wrong, a log helps you stop guessing.
        </p>
        <p>
          The real question is not whether to track your aquarium. It is which tracking system you
          will actually use: paper, spreadsheet, Google Sheets, or an aquarium tracker app.
        </p>

        <h2>Paper aquarium log books</h2>
        <p>
          Paper is simple. You can buy a dedicated aquarium journal or use any notebook. Write the
          date, tank name, test results, water change amount, filter cleaning, feeding notes, and
          anything unusual. No login, no setup, no battery.
        </p>
        <p>
          Paper is especially good for people who enjoy writing and want a physical record near the
          tank. It is also flexible. You can sketch aquascape ideas, tape in receipts, or write long
          notes after a problem.
        </p>
        <p>
          The tradeoff is retrieval. Paper does not automatically show graphs, remind you when a
          task is due, or compare nitrate across three tanks. If you want to know whether pH has
          slowly drifted over four months, you have to read back through the pages yourself.
        </p>

        <h2>Spreadsheets</h2>
        <p>
          Spreadsheets are the power-user option. You can create columns for pH, ammonia, nitrite,
          nitrate, temperature, KH, GH, salinity, calcium, magnesium, phosphate, water changes,
          dosing, and notes. You can graph trends and color-code out-of-range results.
        </p>
        <p>
          For hobbyists who already enjoy spreadsheets, this can work well. It is customizable and
          easy to back up. You can also build separate tabs for each aquarium.
        </p>
        <p>
          The downside is friction. Opening a spreadsheet on a phone, finding the right row, typing
          values into tiny cells, and maintaining formulas can feel like office work. That friction
          matters because the best tracker is the one you keep using after the excitement fades.
        </p>

        <h2>Google Sheets</h2>
        <p>
          Google Sheets solves some spreadsheet problems by syncing across devices. You can update
          it from a phone, laptop, or tablet, and it is easy to share with another caretaker. If a
          family member feeds the tank while you are away, shared access can be helpful.
        </p>
        <p>
          It still has the same basic limitation: you are maintaining a general-purpose tool. Google
          Sheets can track an aquarium, but it does not know what an aquarium is. Reminders,
          tank-specific parameter sets, safe ranges, and trend views are things you have to create
          or manage yourself.
        </p>

        <h2>Aquarium tracker apps</h2>
        <p>
          Aquarium apps are built for the workflow. Instead of designing rows and formulas, you log
          readings by tank and parameter. A good app should make frequent tasks faster, not more
          complicated.
        </p>
        <p>
          Reef Keeper is strongest when you care about three things: reminders, trends, and multiple
          tanks. You can track water readings, review history, see graphs, and set recurring tasks
          for water changes, testing, dosing, filter cleaning, and other maintenance. Each tank gets
          its own history, which matters if you keep a reef, freshwater tank, and quarantine setup
          side by side.
        </p>

        <h2>Which option is better?</h2>
        <p>
          Use paper if you want a low-tech journal and enjoy writing. Use a spreadsheet if you want
          full customization and do not mind building your own system. Use Google Sheets if sharing
          and cross-device access matter more than aquarium-specific features.
        </p>
        <p>
          Use an aquarium tracker app if you want the least friction over the long term. Most
          aquarium problems are not caused by a lack of good intentions. They happen because tests
          are skipped, water changes drift, or nobody notices a trend until livestock reacts.
        </p>
        <p>
          If you are comparing tracking methods because something has already gone wrong, this guide
          on{' '}
          <Link to="/blog/$slug" params={{ slug: 'why-do-my-fish-keep-dying' }} className="link">
            why fish keep dying
          </Link>{' '}
          explains the common patterns tracking can reveal.
        </p>

        <h2>The best system is the one you trust</h2>
        <p>
          A log book is not about collecting numbers for their own sake. It is about building a
          reliable memory for the aquarium. If you can look back and see what changed before algae,
          illness, ammonia, or coral stress appeared, you can respond more calmly.
        </p>
        <p>
          Reef Keeper fits that role for hobbyists who want structure without spreadsheet upkeep:
          quick logs, readable trends, recurring reminders, and separate histories for every tank.
        </p>
      </>
    ),
  },
  {
    slug: 'why-do-my-fish-keep-dying',
    category: 'Troubleshooting',
    categoryColor: 'var(--coral-700)',
    readTime: '9 min read',
    title: 'Why Your Fish Keep Dying And How Tracking Your Tank Prevents It',
    seoTitle: 'Why Do My Fish Keep Dying? Common Causes and How Tracking Helps',
    metaDescription:
      'Wondering why your fish keep dying? Learn common aquarium causes like ammonia spikes, missed water changes, overfeeding, temperature swings, and lack of tracking.',
    excerpt:
      'If your fish keep dying, the cause is often hidden in water quality, missed maintenance, feeding, temperature, or changes that were never tracked.',
    gradient: 'linear-gradient(135deg,var(--coral-600),var(--ocean-900))',
    image: '/app-icon-ios.png',
    datePublished: '2026-07-07',
    dateModified: '2026-07-07',
    content: () => (
      <>
        <p>
          Searching <strong>why do my fish keep dying</strong> usually comes from a rough place.
          You tried to care for the tank, the water may look clean, and losing fish feels confusing
          and discouraging. In many cases, repeated losses are not random. They are clues that the
          aquarium is unstable in a way you cannot see yet.
        </p>
        <p>
          This guide cannot diagnose every situation or replace expert advice. Fish can die from
          disease, injury, poor sourcing, aggression, toxins, or species-specific needs. But for
          beginners, the most common patterns often come back to water quality, missed maintenance,
          overfeeding, temperature swings, and not having a clear history of what changed.
        </p>

        <h2>Start by testing the water</h2>
        <p>
          Clear water does not mean safe water. Ammonia and nitrite can be present without clouding
          the tank, and both are commonly dangerous to fish. If fish are dying, test ammonia,
          nitrite, nitrate, pH, and temperature as soon as you can. For saltwater tanks, also check
          salinity. For reef tanks, check alkalinity, calcium, and magnesium when relevant.
        </p>
        <p>
          If ammonia or nitrite is detectable, treat the situation as urgent. Confirm the result,
          look for dead livestock or decaying food, review recent changes, and take appropriate
          corrective action for your setup. When unsure, contact a knowledgeable aquarium store,
          experienced keeper, or aquatic veterinarian.
        </p>

        <h2>Common reason 1: unstable parameters</h2>
        <p>
          Fish usually handle stable, suitable water better than water that changes suddenly. A pH
          swing, salinity jump, temperature spike, or rapid hardness change can stress livestock
          even if the final number seems close to a chart.
        </p>
        <p>
          This is why tracking matters. If you only test after a fish dies, you may miss the swing
          that happened two days earlier. A log helps show whether the tank has been steady or
          drifting. For a practical range overview, use the{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
            aquarium water parameters
          </Link>{' '}
          guide as a starting point.
        </p>

        <h2>Common reason 2: ammonia spikes</h2>
        <p>
          Ammonia spikes commonly happen in new tanks, overstocked tanks, after overfeeding, after a
          dead fish goes unnoticed, or when beneficial bacteria are disrupted. A filter cleaned too
          aggressively, media replaced all at once, or untreated tap water used on biological media
          can reduce the bacteria that process waste.
        </p>
        <p>
          New aquariums are especially vulnerable because the nitrogen cycle is still developing.
          During that period, fish waste can build faster than bacteria can process it. Frequent
          testing and careful stocking are much safer than assuming the tank is ready because it has
          been running for a certain number of days.
        </p>

        <h2>Common reason 3: missed water changes</h2>
        <p>
          Water changes dilute nitrate and other dissolved waste, replenish some minerals, and give
          you a chance to remove debris. Missing one water change may not cause a disaster, but
          missed maintenance can compound over time.
        </p>
        <p>
          A schedule helps because maintenance stops depending on memory. If you are not sure what
          routine to follow, start with this{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-maintenance-schedule' }} className="link">
            aquarium maintenance schedule
          </Link>{' '}
          and adjust based on your tank, test results, and livestock.
        </p>

        <h2>Common reason 4: overfeeding</h2>
        <p>
          Overfeeding is easy to do because feeding feels like care. Uneaten food breaks down,
          raises waste, and can contribute to ammonia, nitrite, nitrate, cloudy water, and algae.
          Fish begging at the glass does not always mean they need more food.
        </p>
        <p>
          Tracking can help here too. If nitrate rises after a feeding change, or if ammonia appears
          after a weekend of extra food, your notes will show the connection. Without notes, every
          problem feels new.
        </p>

        <h2>Common reason 5: temperature swings</h2>
        <p>
          A heater that sticks on, a heater that fails, a tank near a window, or a warm room can all
          create stressful swings. Temperature also affects oxygen levels. In many cases, fish show
          stress before a keeper realizes the temperature moved.
        </p>
        <p>
          Check temperature at different times of day when troubleshooting. Logging those readings
          can reveal a daily pattern that one quick test misses.
        </p>

        <h2>Common reason 6: no tracking history</h2>
        <p>
          The hardest aquarium problems are the ones with no timeline. Did the fish die before or
          after the water change? Was nitrate already climbing? Did pH shift after adding new
          substrate? Was the heater running warmer last week? A log gives you answers.
        </p>
        <p>
          You can use paper, a spreadsheet, or an app. The important thing is to capture water
          readings, maintenance, feeding changes, new livestock, equipment changes, and unusual
          behavior. This comparison of an{' '}
          <Link to="/blog/$slug" params={{ slug: 'aquarium-log-book-vs-app' }} className="link">
            aquarium log book vs apps
          </Link>{' '}
          can help you pick a system.
        </p>

        <h2>How Reef Keeper helps prevent repeat losses</h2>
        <p>
          Reef Keeper is built to make tracking easier before there is a crisis. You can log water
          parameters by tank, review graphs and history, and set recurring reminders so testing,
          water changes, and maintenance do not depend on memory.
        </p>
        <p>
          That does not guarantee every fish will survive. Aquariums are living systems, and some
          issues need expert help. But a clear history gives you a much better chance of spotting
          ammonia spikes, missed tasks, overfeeding patterns, and temperature swings before they
          become repeat losses.
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

export const isPublishedPost = (post: Post): post is PublishedPost =>
  !post.comingSoon && typeof post.content === 'function';
