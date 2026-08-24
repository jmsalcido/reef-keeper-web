import { Link } from '@tanstack/react-router';
import { ArticleConversionCta } from '../../components/ArticleConversionCta';
import type { PublishedPost } from './types';

export const fishArrivalJourneyPost: PublishedPost = {
  slug: 'how-to-track-new-fish-first-week-aquarium',
  category: 'Fish Care',
  categoryColor: 'var(--teal-600)',
  readTime: '6 min read',
  title: 'How to Track New Fish During Their First Week in an Aquarium',
  seoTitle: 'How to Track New Fish During Their First Week | Reef Keeper',
  metaDescription:
    'New fish need a calm first-week routine. Learn what to observe, when to test water, and how Reef Keeper’s Fish Arrival Journey keeps the timeline together.',
  excerpt:
    'A calm, practical first-week routine for noticing changes, checking water, and keeping every new fish’s arrival history together.',
  gradient: 'linear-gradient(135deg,var(--teal-600),var(--ocean-900))',
  relatedSlugs: ['why-do-my-new-fish-keep-dying', 'how-often-to-test-aquarium-water'],
  datePublished: '2026-08-24',
  dateModified: '2026-08-24',
  content: () => (
    <>
      <p>
        The first week after bringing home fish can feel uncertain. A fish may be quiet, a test
        result may look different, or you may simply wonder whether everything is settling in as
        expected. The useful goal is not to guess a diagnosis from every change. It is to notice
        changes, protect water stability, and keep a clear record.
      </p>
      <p>
        A short <strong>new fish first week</strong> log gives you a timeline to work from: what
        you observed, what you measured, and what changed around the aquarium. That context is more
        useful than trying to reconstruct the week from memory.
      </p>

      <h2>What to watch during a new fish’s first week</h2>
      <p>
        Keep your notes calm and factual. This new fish observation checklist is about recording
        what you see, not diagnosing the reason for it.
      </p>
      <ul>
        <li>
          <strong>Appetite or interest in food:</strong> Did the fish approach food, ignore it, or
          behave differently from the previous day?
        </li>
        <li>
          <strong>Breathing and swimming behavior:</strong> Note changes in movement, positioning,
          or breathing that appear different from its usual pattern.
        </li>
        <li>
          <strong>Appearance and visible changes:</strong> Record noticeable color, fin, body, or
          surface changes with a short note or photo.
        </li>
        <li>
          <strong>Tank equipment and water conditions:</strong> Check that filtration, heating,
          flow, and other equipment are operating as expected. Add readings when you test.
        </li>
      </ul>
      <p>
        These observations create a baseline. If something changes later, you can compare the days
        rather than focus on one isolated moment. For help with broader first-week concerns, read{' '}
        <Link to="/blog/$slug" params={{ slug: 'why-do-my-new-fish-keep-dying' }} className="link">
          why new fish can struggle in their first week
        </Link>
        .
      </p>

      <h2>A simple 7-day new fish checklist</h2>
      <p>
        This is a practical new fish acclimation checklist for keeping the first week organized.
        Observe every day, then use water checks on days 1, 3, and 7 as one simple routine.
      </p>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>What to record</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Day 1</td>
            <td>Arrival details, fish label and count, tank, first observations, and a water check.</td>
          </tr>
          <tr>
            <td>Day 2</td>
            <td>Interest in food, behavior, appearance, and equipment operation.</td>
          </tr>
          <tr>
            <td>Day 3</td>
            <td>Daily observations plus a water check.</td>
          </tr>
          <tr>
            <td>Days 4–6</td>
            <td>Continue brief daily notes and look for changes from the previous entries.</td>
          </tr>
          <tr>
            <td>Day 7</td>
            <td>Observe, test water, and summarize the first week.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Every aquarium is different, so adjust the routine for your stocking, tank maturity, and
        livestock needs. Our guide to{' '}
        <Link to="/blog/$slug" params={{ slug: 'how-often-to-test-aquarium-water' }} className="link">
          how often to test aquarium water
        </Link>{' '}
        can help you choose a longer-term rhythm.
      </p>

      <h2>Why water history matters after adding fish</h2>
      <p>
        New livestock, transport, feeding changes, and stocking levels can all change the context
        around water readings. A single result is useful, but the sequence often gives you a clearer
        picture.
      </p>
      <p>
        Record measured readings alongside arrival dates, feeding notes, observations, and tank
        changes. That lets you review what happened before and after an event without assuming one
        reading proves a cause. Start with our{' '}
        <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
          aquarium water parameters guide
        </Link>{' '}
        for a practical reference, or use an{' '}
        <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameter-tracker' }} className="link">
          aquarium water parameter tracker
        </Link>{' '}
        to keep your results together.
      </p>

      <h2>When quarantine or a tank move needs its own record</h2>
      <p>
        A separate timeline can be especially useful when fish spend time in quarantine or move
        between tanks. Keeping the transfer date, daily observations, water checks, notes, and
        photos in one place makes the record easier to follow later.
      </p>
      <p>
        A 14-day quarantine timeline can support a thoughtful routine, but it is not a guarantee of
        health or disease prevention. Its value is context: you can see what was observed, when it
        happened, and which aquarium the fish was in at the time.
      </p>

      <h2>Keep the fish’s story with the aquarium</h2>
      <p>
        Reef Keeper 1.5 makes it simpler to <strong>track new fish in an aquarium</strong> without
        scattering a fish arrival log across reminders, photo libraries, and test notes. Fish
        Records preserve arrival history, and Fish Arrival Watch provides a guided 7-day observation
        timeline.
      </p>
      <p>
        Records can move between tanks, while optional 14-day quarantine keeps observation and
        water-check history together. Local photos and durable loss records preserve history without
        deleting it. Fish labels, counts, photos, notes, and readings stay on your device; private
        exports of records, history, and photos are controlled by you.
      </p>
      <p>
        For the rest of your aquarium routine, pair this first-week record with an{' '}
        <Link to="/blog/$slug" params={{ slug: 'aquarium-maintenance-schedule' }} className="link">
          aquarium maintenance schedule
        </Link>
        .
      </p>

      <aside
        style={{
          background: 'var(--coral-100)',
          border: '1px solid rgba(215, 97, 73, .24)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          margin: '32px 0',
        }}
      >
        <strong>When to ask for help</strong>
        <p style={{ marginBottom: 0 }}>
          Contact an aquatic veterinarian, knowledgeable retailer, or experienced local fishkeeping
          professional if fish are in obvious distress, multiple fish are affected, or conditions
          cannot be stabilized.
        </p>
      </aside>

      <h2>Frequently asked questions</h2>
      <h3>What should I watch after adding new fish?</h3>
      <p>
        Observe appetite, breathing and swimming behavior, visible appearance, equipment operation,
        and measured water conditions. Keep notes factual so you can compare each day with the
        previous one.
      </p>
      <h3>How often should I test water after adding fish?</h3>
      <p>
        A practical first-week routine is to test on days 1, 3, and 7 while observing daily. Adjust
        it for your aquarium’s needs and any changes you notice.
      </p>
      <h3>Should I keep a record of new fish?</h3>
      <p>
        Yes. A fish arrival log connects observations, water readings, photos, feeding notes, and
        tank moves in one timeline.
      </p>
      <h3>Is an aquarium quarantine tracker a diagnosis tool?</h3>
      <p>
        No. An aquarium fish quarantine tracker records observations and measurements. It helps you
        make decisions from a clearer timeline; it does not diagnose illness or replace professional
        advice.
      </p>

      <ArticleConversionCta
        heading="Give every new arrival a clearer first-week record"
        body="Download Reef Keeper on iPhone and give every new arrival a clearer first-week record."
        articleSlug="how-to-track-new-fish-first-week-aquarium"
        articleTitle="How to Track New Fish During Their First Week in an Aquarium"
        downloadLabel="Download Reef Keeper on iPhone"
      />
    </>
  ),
};
