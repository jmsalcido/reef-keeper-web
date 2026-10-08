import { useId, useRef, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { SourceLink, ToolCta, ToolHero, ToolSources, type ToolSource } from '../components/ToolPage';
import { canonicalAssetUrl, canonicalUrl } from '../config';
import {
  REQUIRED_QUALIFYING_TESTS,
  REQUIRED_SPAN_DAYS,
  TYPICAL_MAX_CYCLE_DAYS,
  assessCycle,
  type CycleAssessment,
  type CycleMethod,
  type CycleStage,
  type PastReading,
  type Reading,
  type WaterType,
} from '../lib/cycleCheck';
import { SeoHead } from '../seo/SeoHead';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  type FaqItem,
} from '../seo/structuredData';

const PATH = '/tools/aquarium-cycle-checker';
const TOOL_NAME = 'Aquarium Cycle Checker';
const SEO_TITLE = 'Is My Aquarium Cycled? Fish Tank Cycle Checker | Reef Keeper';
const META_DESCRIPTION =
  'Is your aquarium cycled? Enter ammonia, nitrite, and nitrate readings to see your nitrogen cycle stage, what each result means, and when to test next.';
const LAST_REVIEWED = '2026-10-08';

const MAX_AGE_DAYS = 3650;
const MAX_PREVIOUS_TESTS = 8;
const PPM_LIMITS: Record<keyof Reading, number> = { ammonia: 50, nitrite: 50, nitrate: 500 };

const SOURCES = {
  merckManagement: {
    label: 'Merck Veterinary Manual: Management of Aquarium Fish',
    url: 'https://www.merckvetmanual.com/exotic-and-laboratory-animals/aquarium-fish/management-of-aquarium-fish',
  },
  merckHome: {
    label: 'Merck Veterinary Manual: Providing a Home for Fish',
    url: 'https://www.merckvetmanual.com/all-other-pets/fish/providing-a-home-for-fish',
  },
  oataSetup: {
    label: 'Ornamental Aquatic Trade Association: How to set up and look after a freshwater tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/',
  },
  oataFreshwaterTesting: {
    label: 'Ornamental Aquatic Trade Association: How to test water quality in your freshwater tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-test-water-quality-in-your-freshwater-tank-aquarium/',
  },
  oataMarine: {
    label: 'Ornamental Aquatic Trade Association: How to test for water quality in a marine tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-marine-fish/how-to-test-for-water-quality-in-a-marine-tank-aquarium/',
  },
} satisfies Record<string, ToolSource>;

const Cite = ({ source, children }: { source: keyof typeof SOURCES; children: ReactNode }) => (
  <SourceLink source={SOURCES[source]}>{children}</SourceLink>
);

const FAQS: FaqItem[] = [
  {
    q: 'Is my aquarium cycled if ammonia and nitrite read zero?',
    a: 'Not from one test. A cycled tank shows zero ammonia, zero nitrite, and detectable nitrate, and those zeros hold over repeated tests while ammonia is still being produced. This checker looks for three such tests in a row, spread over at least four days, before it calls your readings consistent with an established cycle.',
  },
  {
    q: 'How long does it take to cycle a fish tank?',
    a: 'Usually several weeks. The Merck Veterinary Manual notes that a biological filter in a tropical tank can take up to 8 weeks to become established. Seeding with filter media from a healthy, established tank can shorten that. Temperature, the ammonia source, and water chemistry all affect the pace, so test results, not the calendar, tell you when the cycle is done.',
  },
  {
    q: 'Why is my nitrite not going down?',
    a: 'The nitrite stage is often the longest part of the cycle, because the bacteria that convert nitrite to nitrate become established after the ammonia-converting bacteria. Keep the ammonia source steady, keep the filter running, rinse filter media only in removed tank water rather than tap water, and check alkalinity: the Merck Veterinary Manual notes that low alkalinity can inhibit the biofilter.',
  },
  {
    q: 'Can I add fish once the tank has been running for a few weeks?',
    a: 'Time alone does not prove the cycle is finished. Wait until ammonia and nitrite read zero on repeated tests with nitrate present, then add fish gradually so the bacteria can keep up with the extra waste. Adding too many fish at once can cause new tank syndrome.',
  },
  {
    q: 'What is the difference between fishless and fish-in cycling?',
    a: 'Fishless cycling adds an ammonia source to a tank with no animals, so nothing is exposed to ammonia or nitrite while bacteria grow. Fish-in cycling relies on waste from a few fish, which means testing often and doing partial water changes whenever ammonia or nitrite is detectable. The Ornamental Aquatic Trade Association advises fish-in cycling only with great care and guidance from a retailer.',
  },
  {
    q: 'Do saltwater tanks cycle differently?',
    a: 'The same bacteria and the same three stages apply. Ammonia is more harmful in saltwater because of its higher pH, and live rock is one of the places nitrifying bacteria grow. Keep salinity stable and test more often while the tank is new.',
  },
  {
    q: 'Can a fish tank cycling calculator predict the day my tank will be ready?',
    a: 'No. Cycle speed depends on bacterial growth, temperature, the ammonia source, and water chemistry, so any date estimate is a guess. Tracking real ammonia, nitrite, and nitrate results over time is the reliable way to see when the cycle has finished.',
  },
];

type ReadingFields = Record<keyof Reading, string>;
type PreviousRow = ReadingFields & { id: number; daysAgo: string };

const readingKeys: (keyof Reading)[] = ['ammonia', 'nitrite', 'nitrate'];
const readingLabels: Record<keyof Reading, string> = {
  ammonia: 'Ammonia',
  nitrite: 'Nitrite',
  nitrate: 'Nitrate',
};

const formatPpm = (value: number) =>
  `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ppm`;

function parseValue(raw: string, min: number, max: number, unit: string) {
  const trimmed = raw.trim().replace(',', '.');
  const value = Number(trimmed);
  if (trimmed === '' || !Number.isFinite(value)) return { error: 'Enter a number.' };
  if (value < min || value > max) return { error: `Enter ${min}–${max} ${unit}.` };
  return { value };
}

function parseReading(fields: ReadingFields) {
  const errors: Partial<Record<keyof Reading, string>> = {};
  const reading = {} as Reading;
  for (const key of readingKeys) {
    const parsed = parseValue(fields[key], 0, PPM_LIMITS[key], 'ppm');
    if (parsed.error) errors[key] = parsed.error;
    else reading[key] = parsed.value!;
  }
  return Object.keys(errors).length ? { errors } : { errors, reading };
}

const stageCopy: Record<CycleStage, { step: string; title: string }> = {
  notStarted: { step: 'Not started', title: 'No cycle activity detected yet' },
  ammonia: { step: 'Stage 1 of 3 · Ammonia', title: 'Ammonia is building' },
  nitrite: { step: 'Stage 2 of 3 · Nitrite', title: 'Bacteria are converting ammonia to nitrite' },
  zeros: { step: 'Stage 3 of 3 · Confirming', title: 'Ammonia and nitrite read zero. Now confirm it.' },
  consistent: { step: 'Checks complete', title: 'Your readings are consistent with an established cycle' },
};

const tapWaterNote = (result: CycleAssessment) =>
  result.sawAmmoniaOrNitrite
    ? ''
    : ' You have not recorded any ammonia or nitrite. If the tank was not seeded with established media, this nitrate may come from your tap water, so test it too.';

function stageSummary(stage: CycleStage, method: CycleMethod, current: Reading, result: CycleAssessment) {
  switch (stage) {
    case 'notStarted':
      return method === 'fishless'
        ? 'None of the three compounds are showing up yet. The cycle starts once bacteria have a steady ammonia source to feed on. If you have already added ammonia, retest to confirm the reading.'
        : 'Nothing is showing up yet. With fish in a new tank, ammonia usually builds within days, so zero readings this early do not mean the tank is cycled. Keep testing.';
    case 'ammonia':
      return 'Ammonia is present but nitrite has not appeared yet, so the bacteria that convert ammonia are still getting established.';
    case 'nitrite':
      return current.ammonia > 0
        ? 'Both ammonia and nitrite are present. Ammonia-converting bacteria are working, and the bacteria that turn nitrite into nitrate are still catching up.'
        : 'Ammonia is being processed and nitrite is now the main reading. This is often the longest stage of the cycle.';
    case 'zeros': {
      const progress = `You have ${result.qualifyingTests} of ${REQUIRED_QUALIFYING_TESTS} qualifying tests in a row${
        result.qualifyingTests > 1 ? ` over ${result.qualifyingSpanDays} days` : ''
      }. The checker needs ${REQUIRED_QUALIFYING_TESTS} spread over at least ${REQUIRED_SPAN_DAYS} days.`;
      return `This is what a finished cycle looks like, but one good test is not enough. ${progress}${tapWaterNote(result)}`;
    }
    case 'consistent':
      return `You have ${result.qualifyingTests} tests in a row with zero ammonia, zero nitrite, and detectable nitrate over ${result.qualifyingSpanDays} days. That is a strong sign, not a guarantee, so keep testing as you add livestock.${tapWaterNote(result)}`;
  }
}

function nextSteps(stage: CycleStage, method: CycleMethod): ReactNode[] {
  const fishIn = method === 'fishIn';
  const retest = fishIn
    ? 'Test ammonia, nitrite, and nitrate daily while fish are in a cycling tank.'
    : 'Retest ammonia, nitrite, and nitrate every 2–3 days and add each result under “Previous tests.”';
  const steadySource = fishIn
    ? 'Feed lightly so waste does not outpace the bacteria.'
    : 'Keep the ammonia source steady, following the product’s instructions.';
  const protectFish = (
    <>
      Do partial water changes whenever ammonia or nitrite is detectable. See{' '}
      <Link to="/blog/$slug" params={{ slug: 'how-to-lower-ammonia-in-fish-tank' }} className="link">
        how to lower ammonia
      </Link>{' '}
      and{' '}
      <Link to="/blog/$slug" params={{ slug: 'how-to-lower-nitrite-in-fish-tank' }} className="link">
        how to lower nitrite
      </Link>
      .
    </>
  );
  const protectBacteria =
    'Keep the filter running and rinse filter media only in removed tank water, never tap water.';

  switch (stage) {
    case 'notStarted':
      return fishIn
        ? [retest, steadySource, 'Avoid adding more fish until the cycle has finished.']
        : [
            'Add an ammonia source (bottled ammonia or a pinch of fish food) if you have not yet.',
            retest,
            'Seeding with filter media from a healthy, established tank can speed things up.',
          ];
    case 'ammonia':
    case 'nitrite':
      return [
        ...(fishIn ? [protectFish] : []),
        retest,
        steadySource,
        protectBacteria,
        stage === 'ammonia'
          ? 'Watch for nitrite to appear. That means the first group of bacteria is established.'
          : 'Watch for nitrite to fall and nitrate to rise.',
      ];
    case 'zeros':
      return [
        `Retest in 2 days. You need ${REQUIRED_QUALIFYING_TESTS} tests in a row with zero ammonia, zero nitrite, and nitrate present, spanning at least ${REQUIRED_SPAN_DAYS} days.`,
        'Add today’s result under “Previous tests” next time so the checker can track your streak.',
        fishIn ? steadySource : 'Keep adding your usual ammonia source so the bacteria stay fed.',
      ];
    case 'consistent':
      return fishIn
        ? [
            'Add new fish gradually, a few at a time, so the bacteria can keep up.',
            'Test after each addition and keep testing more often during the first month.',
          ]
        : [
            'Keep feeding the bacteria with your ammonia source until fish arrive, and confirm it still reads zero ammonia and nitrite.',
            <>
              If nitrate is high, lower it with a water change before adding fish. Use the{' '}
              <Link to="/tools/water-change-calculator" className="link">
                water change calculator
              </Link>{' '}
              to size it.
            </>,
            'Add fish gradually and test after each addition.',
          ];
  }
}

function readingMeaning(key: keyof Reading, current: Reading) {
  const value = current[key];
  switch (key) {
    case 'ammonia':
      return value > 0
        ? 'Comes from fish waste, uneaten food, or dosed ammonia. The first group of bacteria converts it to nitrite.'
        : 'None detected. Either bacteria are already converting it, or there is no ammonia source yet.';
    case 'nitrite':
      if (value > 0) return 'Made from ammonia by the first bacteria. A second group converts it to nitrate.';
      return current.nitrate > 0
        ? 'None detected. Nitrite is being converted to nitrate as it forms.'
        : 'None detected yet. Nitrite appears once ammonia-converting bacteria are established.';
    case 'nitrate':
      return value > 0
        ? 'The end product of the cycle. It builds up over time and is removed with water changes. Tap water can contain it too.'
        : 'None detected yet. Nitrate appears as the final stage of the cycle begins.';
  }
}

function changeSinceLast(key: keyof Reading, current: Reading, last: PastReading | null) {
  if (!last) return null;
  const before = last[key];
  const now = current[key];
  const when = `${last.daysAgo} day${last.daysAgo === 1 ? '' : 's'} ago`;
  if (now === before) return `Same as ${when}`;
  return `${now > before ? '↑' : '↓'} from ${formatPpm(before)} ${when}`;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const labelId = useId();

  return (
    <div className="tool-field">
      <span className="tool-label" id={labelId}>
        {label}
      </span>
      <div className="tool-segmented is-block" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={value === option.value ? 'is-active' : undefined}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  suffix,
  error,
  help,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  suffix: string;
  error?: string;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="tool-field">
      <label htmlFor={id}>{label}</label>
      <div className={`tool-input${error ? ' has-error' : ''}`}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error || help ? `${id}-help` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <span aria-hidden="true">{suffix}</span>
      </div>
      {(error || help) && (
        <small id={`${id}-help`} className={error ? 'is-error' : undefined}>
          {error ?? help}
        </small>
      )}
    </div>
  );
}

export function AquariumCycleChecker() {
  const formId = useId();
  const hasTrackedUse = useRef(false);
  const nextRowId = useRef(1);
  const [waterType, setWaterType] = useState<WaterType>('freshwater');
  const [method, setMethod] = useState<CycleMethod>('fishless');
  const [ageDays, setAgeDays] = useState('14');
  const [current, setCurrent] = useState<ReadingFields>({ ammonia: '1', nitrite: '2', nitrate: '5' });
  const [previousRows, setPreviousRows] = useState<PreviousRow[]>([]);

  const trackUse = () => {
    if (hasTrackedUse.current) return;
    hasTrackedUse.current = true;
    window.gtag?.('event', 'tool_used', { tool_name: 'aquarium_cycle_checker' });
  };
  const edit = <T,>(setter: (value: T) => void) => (value: T) => {
    trackUse();
    setter(value);
  };

  const age = parseValue(ageDays, 0, MAX_AGE_DAYS, 'days');
  const currentParsed = parseReading(current);
  const previousParsed = previousRows.map((row) => {
    const reading = parseReading(row);
    const daysAgo = parseValue(row.daysAgo, 1, MAX_AGE_DAYS, 'days');
    const allErrors: Partial<Record<keyof PreviousRow, string>> = {
      ...reading.errors,
      ...(daysAgo.error && { daysAgo: daysAgo.error }),
    };
    // Blank fields mean the row is still being filled in; only flag values that are wrong.
    const errors = Object.fromEntries(
      Object.entries(allErrors).filter(([key]) => row[key as keyof PreviousRow] !== ''),
    ) as typeof allErrors;
    const value =
      reading.reading && daysAgo.value !== undefined ? { ...reading.reading, daysAgo: daysAgo.value } : null;
    const started = [row.daysAgo, ...readingKeys.map((key) => row[key])].some((field) => field.trim() !== '');
    return { row, errors, value, incomplete: started && !value && Object.keys(errors).length === 0 };
  });
  const previous = previousParsed.flatMap((parsed) => (parsed.value ? [parsed.value] : []));

  const ready = age.value !== undefined && currentParsed.reading;
  const result = ready
    ? assessCycle({
        waterType,
        method,
        ageDays: age.value!,
        current: currentParsed.reading!,
        previous,
      })
    : null;

  const updatePrevious = (id: number, key: keyof PreviousRow, value: string) => {
    trackUse();
    setPreviousRows((rows) => rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };
  const addPrevious = () => {
    trackUse();
    setPreviousRows((rows) => [
      ...rows,
      { id: nextRowId.current++, daysAgo: '', ammonia: '', nitrite: '', nitrate: '' },
    ]);
  };

  return (
    <>
      <SeoHead
        title={SEO_TITLE}
        description={META_DESCRIPTION}
        canonicalUrl={canonicalUrl(PATH)}
        image={canonicalAssetUrl('/app-icon-ios.png')}
        imageAlt={TOOL_NAME}
      />
      <JsonLd
        data={[
          organizationJsonLd(),
          webApplicationJsonLd({
            path: PATH,
            name: TOOL_NAME,
            description: META_DESCRIPTION,
            dateModified: LAST_REVIEWED,
            citations: Object.values(SOURCES).map((source) => source.url),
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: TOOL_NAME, path: PATH },
          ]),
          faqPageJsonLd(FAQS, PATH),
        ]}
      />
      <Nav variant="inner" />

      <main>
        <ToolHero crumb="Aquarium cycle checker" title="Is My Aquarium Cycled? Free Cycle Checker">
          Enter your latest ammonia, nitrite, and nitrate results to see where your tank is in the
          nitrogen cycle, what each reading means, and what to test next.
        </ToolHero>

        <section className="tool-wrap" aria-labelledby={`${formId}-heading`}>
          <div className="tool-card">
            <div className="tool-card-head">
              <h2 id={`${formId}-heading`}>Your tank</h2>
            </div>

            <form className="tool-fields" noValidate onSubmit={(event) => event.preventDefault()}>
              <Segmented
                label="Water type"
                value={waterType}
                options={[
                  { value: 'freshwater', label: 'Freshwater' },
                  { value: 'saltwater', label: 'Saltwater' },
                ]}
                onChange={edit(setWaterType)}
              />
              <Segmented
                label="Cycling method"
                value={method}
                options={[
                  { value: 'fishless', label: 'Fishless' },
                  { value: 'fishIn', label: 'Fish in tank' },
                ]}
                onChange={edit(setMethod)}
              />
              <NumberField
                id={`${formId}-age`}
                label="Aquarium age"
                value={ageDays}
                suffix="days"
                error={age.error}
                help="Days since the tank was set up with water."
                onChange={edit(setAgeDays)}
              />
              {readingKeys.map((key) => (
                <NumberField
                  key={key}
                  id={`${formId}-${key}`}
                  label={readingLabels[key]}
                  value={current[key]}
                  suffix="ppm"
                  error={currentParsed.errors[key]}
                  onChange={edit((value: string) => setCurrent((fields) => ({ ...fields, [key]: value })))}
                />
              ))}
            </form>

            <div className="tool-previous">
              <h3>Previous tests (optional)</h3>
              <p>Add earlier results to see trends and confirm the cycle across several tests.</p>
              {previousParsed.map(({ row, errors, incomplete }, index) => (
                <fieldset key={row.id} className="tool-previous-row">
                  <legend>
                    Test {index + 1}
                    <button
                      type="button"
                      className="tool-remove"
                      aria-label={`Remove test ${index + 1}`}
                      onClick={() => setPreviousRows((rows) => rows.filter((candidate) => candidate.id !== row.id))}
                    >
                      Remove
                    </button>
                  </legend>
                  <div className="tool-previous-fields">
                    <NumberField
                      id={`${formId}-prev-${row.id}-days`}
                      label="Days ago"
                      value={row.daysAgo}
                      suffix="days"
                      error={errors.daysAgo}
                      onChange={(value) => updatePrevious(row.id, 'daysAgo', value)}
                    />
                    {readingKeys.map((key) => (
                      <NumberField
                        key={key}
                        id={`${formId}-prev-${row.id}-${key}`}
                        label={readingLabels[key]}
                        value={row[key]}
                        suffix="ppm"
                        error={errors[key]}
                        onChange={(value) => updatePrevious(row.id, key, value)}
                      />
                    ))}
                  </div>
                  {incomplete && <small className="tool-row-hint">Fill in all four values to include this test.</small>}
                </fieldset>
              ))}
              {previousRows.length < MAX_PREVIOUS_TESTS && (
                <button type="button" className="tool-add" onClick={addPrevious}>
                  + Add a previous test
                </button>
              )}
            </div>

            <div className="tool-result" aria-live="polite">
              {!result || !currentParsed.reading || age.value === undefined ? (
                <p className="tool-result-empty">Fill in the tank age and all three readings to see your result.</p>
              ) : (
                <CycleResult
                  result={result}
                  current={currentParsed.reading}
                  method={method}
                  waterType={waterType}
                  ageDays={age.value}
                />
              )}
              <p className="tool-disclaimer">
                This checker reads your test results. It never declares a tank ready for fish from a
                single set of readings or from the number of days that have passed. If fish are in
                distress, contact an aquatic veterinarian or an experienced aquarium professional.
              </p>
            </div>
          </div>

          <ToolCta
            toolName="aquarium_cycle_checker"
            heading="Track your nitrogen cycle, save your test results, and get reminders with Reef Keeper."
            label="Get Reef Keeper on the App Store"
          >
            The New Tank Cycle plan sets a testing rhythm, reminds you when the next check is due,
            and tracks the same three-test rule this checker uses, so you can see your cycle finish
            on a chart instead of guessing.
          </ToolCta>
        </section>

        <article className="prose tool-content">
          <h2>How the nitrogen cycle works</h2>
          <p>
            Fish waste and uneaten food release ammonia. In an established aquarium, bacteria in the
            filter and on surfaces turn that ammonia into nitrite, and a second group turns nitrite
            into nitrate, as the{' '}
            <Cite source="merckHome">Merck Veterinary Manual</Cite> describes. A new tank has almost
            none of these bacteria, so the cycle plays out in three stages:
          </p>
          <ol>
            <li>
              <strong>Ammonia rises.</strong> There is waste, but few bacteria to process it yet.
            </li>
            <li>
              <strong>Nitrite rises as ammonia falls.</strong> The first bacteria are established;
              the second group is still growing. This is often the longest stage.
            </li>
            <li>
              <strong>Ammonia and nitrite reach zero and nitrate climbs.</strong> Both groups are
              keeping up with the waste.
            </li>
          </ol>
          <p>
            The{' '}
            <Cite source="oataSetup">Ornamental Aquatic Trade Association</Cite> describes the filter
            as mature once ammonia and nitrite have dropped to zero and stay there, with nitrate
            rising. In saltwater,{' '}
            <Cite source="oataMarine">ammonia is more harmful because of the higher pH</Cite>, so
            the same readings call for extra care.
          </p>

          <h2>How long does it take to cycle a fish tank?</h2>
          <p>
            Usually several weeks. The{' '}
            <Cite source="merckManagement">Merck Veterinary Manual</Cite> notes that a biological
            filter in a tropical tank can take up to {TYPICAL_MAX_CYCLE_DAYS / 7} weeks to establish,
            and the{' '}
            <Cite source="oataSetup">Ornamental Aquatic Trade Association</Cite> describes fishless
            cycling as dosing ammonia over several weeks. Seeding the tank
            with filter media from a healthy, established aquarium can shorten the wait, but it does
            not skip the cycle.
          </p>
          <p>
            That is why this checker does not count days. Two tanks set up on the same day can
            finish weeks apart depending on temperature, the ammonia source, alkalinity, and how the
            filter is maintained. Your readings are the only reliable answer.
          </p>

          <h2>How to tell when your aquarium is cycled</h2>
          <p>
            Look for a pattern, not a single good test: zero ammonia, zero nitrite, and detectable
            nitrate on repeated tests while ammonia is still being produced. This checker, and the
            New Tank Cycle plan in{' '}
            <Link to="/blog/$slug" params={{ slug: 'reefkeeper-1-3-guided-care-plans' }} className="link">
              Reef Keeper 1.3
            </Link>
            , look for {REQUIRED_QUALIFYING_TESTS} such tests in a row spread over at least{' '}
            {REQUIRED_SPAN_DAYS} days. Even then,{' '}
            <Cite source="oataSetup">add fish slowly</Cite> so the bacteria can grow with the extra
            waste. For the full picture, read our guide to{' '}
            <Link to="/blog/$slug" params={{ slug: 'new-tank-syndrome-nitrogen-cycle' }} className="link">
              new tank syndrome and the nitrogen cycle
            </Link>
            .
          </p>

          <h2>Frequently asked questions</h2>
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}

          <h2>Related guides and tools</h2>
          <ul className="tool-related">
            <li>
              <Link to="/blog/$slug" params={{ slug: 'new-tank-syndrome-nitrogen-cycle' }} className="link">
                New tank syndrome: surviving the nitrogen cycle
              </Link>
            </li>
            <li>
              <Link to="/blog/$slug" params={{ slug: 'why-do-my-new-fish-keep-dying' }} className="link">
                Why do my new fish keep dying? A first-week checklist
              </Link>
            </li>
            <li>
              <Link to="/blog/$slug" params={{ slug: 'how-often-to-test-aquarium-water' }} className="link">
                How often to test aquarium water
              </Link>
            </li>
            <li>
              <Link to="/tools/water-change-calculator" className="link">
                Aquarium water change calculator
              </Link>
            </li>
          </ul>

          <ToolSources sources={Object.values(SOURCES)} lastReviewed={LAST_REVIEWED} />
        </article>
      </main>

      <MiniFooter />
    </>
  );
}

function CycleResult({
  result,
  current,
  method,
  waterType,
  ageDays,
}: {
  result: CycleAssessment;
  current: Reading;
  method: CycleMethod;
  waterType: WaterType;
  ageDays: number;
}) {
  const { stage } = result;
  const toxicPresent = current.ammonia > 0 || current.nitrite > 0;
  const stalled =
    ageDays > TYPICAL_MAX_CYCLE_DAYS &&
    (stage === 'ammonia' || stage === 'nitrite' || (stage === 'notStarted' && method === 'fishless'));

  return (
    <>
      <div className={`tool-stage is-${stage}`}>
        <span className="tool-stage-step">
          Day {ageDays} · {stageCopy[stage].step}
        </span>
        <h3>{stageCopy[stage].title}</h3>
        <p>{stageSummary(stage, method, current, result)}</p>
      </div>

      {method === 'fishIn' && toxicPresent && (
        <div className="tool-callout is-danger">
          <strong>Fish are exposed to {current.ammonia > 0 && current.nitrite > 0 ? 'ammonia and nitrite' : current.ammonia > 0 ? 'ammonia' : 'nitrite'}.</strong>{' '}
          Both are toxic. Do partial water changes to keep levels down, feed lightly, and test daily
          until both read zero.
        </div>
      )}
      {waterType === 'saltwater' && current.ammonia > 0 && (
        <div className="tool-callout is-warn">
          <strong>Ammonia is more harmful in saltwater</strong> because of its higher pH. Keep
          salinity stable and test often.
        </div>
      )}
      {stalled && (
        <div className="tool-callout is-warn">
          <strong>This is taking longer than usual.</strong> A biofilter can take up to{' '}
          {TYPICAL_MAX_CYCLE_DAYS / 7} weeks. Check that the filter runs continuously, the ammonia
          source is steady, tap water is dechlorinated, and alkalinity (KH) is not low, since low
          alkalinity can slow the bacteria.
        </div>
      )}

      <h4 className="tool-subhead">What your readings mean</h4>
      <ul className="tool-readings">
        {readingKeys.map((key) => {
          const change = changeSinceLast(key, current, result.lastTest);
          return (
            <li key={key}>
              <div className="tool-reading-head">
                <strong>{readingLabels[key]}</strong>
                <span className={current[key] > 0 ? 'is-detected' : 'is-zero'}>{formatPpm(current[key])}</span>
              </div>
              <p>{readingMeaning(key, current)}</p>
              {change && <small>{change}</small>}
            </li>
          );
        })}
      </ul>

      <h4 className="tool-subhead">Cycle progress</h4>
      <ul className="tool-checklist">
        {result.checklist.map((item) => (
          <li key={item.label} className={`is-${item.status}`}>
            <span aria-hidden="true">{item.status === 'done' ? '✓' : item.status === 'notSeen' ? '–' : ''}</span>
            <span>
              {item.label}
              <span className="sr-only">
                {item.status === 'done' ? ' (done)' : item.status === 'notSeen' ? ' (not seen)' : ' (not yet)'}
              </span>
              {item.status === 'notSeen' && <small>Not recorded. Normal if the tank was seeded.</small>}
            </span>
          </li>
        ))}
      </ul>

      <h4 className="tool-subhead">Next steps</h4>
      <ul className="tool-steps">
        {nextSteps(stage, method).map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </>
  );
}
