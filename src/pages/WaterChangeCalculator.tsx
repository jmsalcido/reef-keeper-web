import { useId, useRef, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import { SourceLink, ToolCta, ToolHero, ToolSources, type ToolSource } from '../components/ToolPage';
import { canonicalAssetUrl, canonicalUrl } from '../config';
import {
  COMPARISON_PERCENTS,
  calculateWaterChange,
  nitrateAfterChange,
  type WaterChangeInputs,
} from '../lib/waterChange';
import { SeoHead } from '../seo/SeoHead';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  type FaqItem,
} from '../seo/structuredData';

const PATH = '/tools/water-change-calculator';
const TOOL_NAME = 'Aquarium Water Change Calculator';
const SEO_TITLE = 'Aquarium Water Change Calculator for Nitrate | Reef Keeper';
const META_DESCRIPTION =
  'Free aquarium water change calculator. Enter tank size and nitrate readings to see what % to change, how many gallons or liters to replace, and your new ppm.';

const LAST_REVIEWED = '2026-10-08';

const SOURCES = {
  oataFreshwater: {
    label: 'Ornamental Aquatic Trade Association: How to test water quality in your freshwater tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-test-water-quality-in-your-freshwater-tank-aquarium/',
  },
  oataMarine: {
    label: 'Ornamental Aquatic Trade Association: How to test for water quality in a marine tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-marine-fish/how-to-test-for-water-quality-in-a-marine-tank-aquarium/',
  },
  merckEnvironmental: {
    label: 'Merck Veterinary Manual: Environmental Diseases of Aquatic Animals in Aquatic Systems',
    url: 'https://www.merckvetmanual.com/exotic-and-laboratory-animals/aquatic-systems/environmental-diseases-of-aquatic-animals-in-aquatic-systems',
  },
  merckHome: {
    label: 'Merck Veterinary Manual: Providing a Home for Fish',
    url: 'https://www.merckvetmanual.com/all-other-pets/fish/providing-a-home-for-fish',
  },
  epaDrinkingWater: {
    label: 'U.S. EPA: National Primary Drinking Water Regulations',
    url: 'https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations',
  },
  camargo: {
    label:
      'Camargo, Alonso & Salamanca (2005). Nitrate toxicity to aquatic animals: a review with new data for freshwater invertebrates. Chemosphere 58(9), 1255–1267',
    url: 'https://doi.org/10.1016/j.chemosphere.2004.10.044',
  },
} satisfies Record<string, ToolSource>;

const Cite = ({ source, children }: { source: keyof typeof SOURCES; children: ReactNode }) => (
  <SourceLink source={SOURCES[source]}>{children}</SourceLink>
);

const LITERS_PER_GALLON = 3.78541;
const MAX_VOLUME = 100000;
const MAX_PPM = 1000;

type Unit = 'gal' | 'L';
type FieldKey = keyof WaterChangeInputs;

const FAQS: FaqItem[] = [
  {
    q: 'How do I calculate how much water to change to lower nitrate?',
    a: 'Subtract your target nitrate from your current nitrate, then divide by your current nitrate minus the nitrate in your replacement water. With 40 ppm now, a 20 ppm target, and 0 ppm replacement water, that is (40 − 20) ÷ (40 − 0) = 0.5, or a 50% water change.',
  },
  {
    q: 'Does a 50% water change remove 50% of the nitrate?',
    a: 'Only when the replacement water has no nitrate. If your tap or mixed saltwater contains nitrate, each change adds some back, so the same percentage lowers the reading by less. Test your replacement water and enter that value.',
  },
  {
    q: 'Is a large water change safe for my fish?',
    a: 'Not automatically. Large, sudden changes can shift temperature, pH, hardness, or salinity, and livestock that has adapted to the old water may be stressed. Many keepers prefer several smaller changes spread over a few days. Match temperature, condition tap water, and match salinity for marine tanks. If animals are in distress, contact an aquatic veterinarian or an experienced aquarium professional.',
  },
  {
    q: 'Why did my nitrate not drop as much as the calculator predicted?',
    a: 'The most common reason is that the real water volume is smaller than the tank’s rated size because substrate, rock, and decor take up space, or larger if you have a sump. Test-kit accuracy, nitrate in the replacement water, and waste released from the substrate or filter during cleaning can also change the result.',
  },
  {
    q: 'Can a water change lower nitrate below my tap water level?',
    a: 'No. Water changes dilute your tank toward the nitrate level of the replacement water, so that level is the floor. Tap water can legally contain nitrate: the U.S. EPA drinking-water limit is 10 mg/L measured as nitrogen, which is about 44 ppm on aquarium test kits that report nitrate (NO3). If your target is at or below your tap water reading, you need a lower-nitrate source such as RO/DI water, or another export method alongside water changes.',
  },
  {
    q: 'What nitrate level should I aim for?',
    a: 'There is no single number for every aquarium. For marine tanks, the Ornamental Aquatic Trade Association advises keeping nitrate at or below 20 mg/L (ppm) for fish-only systems and 5–10 mg/L for invertebrates, depending on the species. A scientific review of nitrate toxicity found that tolerance varies widely with species and life stage, so use a target that fits your livestock and watch the trend over time rather than chasing one test result.',
  },
];

const fieldConfig: Record<FieldKey, { label: string; help: string }> = {
  volume: {
    label: 'Aquarium water volume',
    help: 'Actual water, not the rated tank size, if you know it.',
  },
  current: { label: 'Current nitrate', help: 'Your latest test result.' },
  target: { label: 'Target nitrate', help: 'Where you want nitrate to be after the change.' },
  replacement: {
    label: 'Nitrate in replacement water',
    help: 'Test your tap, RO/DI, or mixed saltwater. Use 0 if it reads zero.',
  },
};

const fieldOrder: FieldKey[] = ['volume', 'current', 'target', 'replacement'];

const formatNumber = (value: number, maxDigits = 1) =>
  value.toLocaleString('en-US', { maximumFractionDigits: maxDigits });

function parseFields(values: Record<FieldKey, string>) {
  const errors: Partial<Record<FieldKey, string>> = {};
  const parsed = {} as WaterChangeInputs;

  for (const key of fieldOrder) {
    const raw = values[key].trim().replace(',', '.');
    const value = Number(raw);

    if (raw === '' || !Number.isFinite(value)) {
      errors[key] = 'Enter a number.';
    } else if (key === 'volume' && (value <= 0 || value > MAX_VOLUME)) {
      errors[key] = 'Enter a volume greater than 0.';
    } else if (key !== 'volume' && (value < 0 || value > MAX_PPM)) {
      errors[key] = `Enter a value from 0 to ${MAX_PPM} ppm.`;
    } else {
      parsed[key] = value;
    }
  }

  return Object.keys(errors).length ? { errors } : { errors, inputs: parsed };
}

export function WaterChangeCalculator() {
  const [unit, setUnit] = useState<Unit>('gal');
  const [values, setValues] = useState<Record<FieldKey, string>>({
    volume: '40',
    current: '40',
    target: '20',
    replacement: '0',
  });
  const hasTrackedUse = useRef(false);
  const formId = useId();

  const { errors, inputs } = parseFields(values);
  const result = inputs ? calculateWaterChange(inputs) : null;

  const trackUse = () => {
    if (hasTrackedUse.current) return;
    hasTrackedUse.current = true;
    window.gtag?.('event', 'tool_used', { tool_name: 'water_change_calculator' });
  };

  const updateField = (key: FieldKey, value: string) => {
    trackUse();
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const switchUnit = (next: Unit) => {
    if (next === unit) return;
    trackUse();
    const volume = Number(values.volume.trim().replace(',', '.'));
    if (values.volume.trim() !== '' && Number.isFinite(volume) && volume > 0) {
      const converted = next === 'L' ? volume * LITERS_PER_GALLON : volume / LITERS_PER_GALLON;
      setValues((previous) => ({ ...previous, volume: String(Math.round(converted * 10) / 10) }));
    }
    setUnit(next);
  };

  const unitLabel = unit === 'gal' ? 'gallons' : 'liters';
  const unitShort = unit === 'gal' ? 'gal' : 'L';

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
        <ToolHero crumb="Water change calculator" title="Aquarium Water Change Calculator">
          Find the water change percentage needed to lower nitrate to your target, how many{' '}
          {unitLabel} to replace, and what your nitrate should read afterward.
        </ToolHero>

        <section className="tool-wrap" aria-labelledby={`${formId}-heading`}>
          <div className="tool-card">
            <div className="tool-card-head">
              <h2 id={`${formId}-heading`}>Your tank</h2>
              <div className="tool-segmented" role="radiogroup" aria-label="Volume unit">
                {(['gal', 'L'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={unit === option}
                    className={unit === option ? 'is-active' : undefined}
                    onClick={() => switchUnit(option)}
                  >
                    {option === 'gal' ? 'Gallons' : 'Liters'}
                  </button>
                ))}
              </div>
            </div>

            <form className="tool-fields" noValidate onSubmit={(event) => event.preventDefault()}>
              {fieldOrder.map((key) => {
                const id = `${formId}-${key}`;
                const error = errors[key];

                return (
                  <div className="tool-field" key={key}>
                    <label htmlFor={id}>{fieldConfig[key].label}</label>
                    <div className={`tool-input${error ? ' has-error' : ''}`}>
                      <input
                        id={id}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={values[key]}
                        aria-invalid={Boolean(error)}
                        aria-describedby={`${id}-help`}
                        onChange={(event) => updateField(key, event.target.value)}
                      />
                      <span aria-hidden="true">{key === 'volume' ? unitShort : 'ppm'}</span>
                    </div>
                    <small id={`${id}-help`} className={error ? 'is-error' : undefined}>
                      {error ?? fieldConfig[key].help}
                    </small>
                  </div>
                );
              })}
            </form>

            <div className="tool-result" aria-live="polite">
              {!result || !inputs ? (
                <p className="tool-result-empty">Fill in all four fields to see your result.</p>
              ) : result.kind === 'atTarget' ? (
                <div className="tool-callout is-ok">
                  <strong>No water change needed to reach this target.</strong> Your current nitrate
                  ({formatNumber(inputs.current)} ppm) is already at or below{' '}
                  {formatNumber(inputs.target)} ppm. Keep testing on your usual routine and watch the
                  trend.
                </div>
              ) : result.kind === 'unreachable' ? (
                <div className="tool-callout is-warn">
                  <strong>A water change can’t reach this target.</strong> Your replacement water
                  has {formatNumber(inputs.replacement)} ppm nitrate, so water changes can only bring
                  the tank down toward that level, never below it. Try a lower-nitrate water source
                  such as RO/DI, or set a target above {formatNumber(inputs.replacement)} ppm.
                </div>
              ) : (
                <>
                  <div className="tool-stats">
                    <div className="tool-stat is-primary">
                      <span className="tool-stat-value">{result.percent}%</span>
                      <span className="tool-stat-label">water change</span>
                    </div>
                    <div className="tool-stat">
                      <span className="tool-stat-value">
                        {formatNumber(result.volumeToReplace)} {unitShort}
                      </span>
                      <span className="tool-stat-label">to replace</span>
                    </div>
                    <div className="tool-stat">
                      <span className="tool-stat-value">≈ {formatNumber(result.predictedAfter)} ppm</span>
                      <span className="tool-stat-label">nitrate afterward</span>
                    </div>
                  </div>
                  <p className="tool-summary">
                    Your aquarium has {formatNumber(inputs.current)} ppm nitrate. A{' '}
                    {result.percent}% water change ({formatNumber(result.volumeToReplace)} {unitLabel})
                    with {formatNumber(inputs.replacement)} ppm replacement water should bring it to
                    approximately {formatNumber(result.predictedAfter)} ppm.
                  </p>
                  {result.splitChanges !== null && (
                    <div className="tool-callout is-warn">
                      <strong>That’s a large single change.</strong> Big water changes can shift
                      temperature, pH, hardness, or salinity quickly. With 25% changes, you would
                      need about {result.splitChanges} to reach {formatNumber(inputs.target)} ppm,
                      which you can spread over several days.
                    </div>
                  )}
                </>
              )}

              {inputs && inputs.current > inputs.replacement && (
                <div className="tool-compare">
                  <h3>Compare common water changes</h3>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Change</th>
                        <th scope="col">Replace</th>
                        <th scope="col">Nitrate after</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_PERCENTS.map((percent) => {
                        const after = nitrateAfterChange(inputs.current, inputs.replacement, percent / 100);
                        const reachesTarget = after <= inputs.target + 1e-9;

                        return (
                          <tr key={percent}>
                            <th scope="row">{percent}%</th>
                            <td>
                              {formatNumber((inputs.volume * percent) / 100)} {unitShort}
                            </td>
                            <td>
                              ≈ {formatNumber(after)} ppm
                              {reachesTarget && <span className="tool-badge">Target</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="tool-disclaimer">
                This is dilution math, not a guarantee that a particular water change is safe for
                every aquarium. It assumes the volume you entered is the actual water volume and
                ignores nitrate produced between tests. Retest after the change to confirm.
              </p>
            </div>
          </div>

          <ToolCta
            toolName="water_change_calculator"
            heading="Want to track your water parameters and know when to test again?"
            label="Get Reef Keeper for free"
          >
            Log every reading in seconds, see your nitrate trend, and follow Reef Keeper’s High
            Nitrate Recovery plan with water-change scenarios and retest reminders.
          </ToolCta>
        </section>

        <article className="prose tool-content">
          <h2>How the water change calculation works</h2>
          <p>
            A partial water change dilutes nitrate. When you remove part of the tank water and
            replace it, the new nitrate level is a blend of the old water you kept and the new water
            you added:
          </p>
          <p className="tool-formula">
            Nitrate after = current × (1 − change %) + replacement × change %
          </p>
          <p>
            Solving that for the change percentage gives the amount needed to hit your target:
          </p>
          <p className="tool-formula">
            Change % = (current − target) ÷ (current − replacement)
          </p>
          <p>
            The calculator rounds the percentage up to the next whole number so the predicted result
            lands at or just below your target.
          </p>

          <h2>Example: lowering nitrate from 40 ppm to 20 ppm</h2>
          <p>
            Your 40-gallon aquarium tests at <strong>40 ppm nitrate</strong> and your conditioned tap
            water reads 0 ppm. A <strong>50% water change</strong> (20 gallons) should reduce nitrate
            to approximately <strong>20 ppm</strong>. If your tap water had 10 ppm nitrate instead,
            the same 50% change would only bring the tank to about 25 ppm, and you would need a 67%
            change to reach 20 ppm.
          </p>

          <h2>How to lower nitrates in an aquarium</h2>
          <p>
            The{' '}
            <Cite source="merckEnvironmental">Merck Veterinary Manual</Cite> lists water changes,
            live plants, and anaerobic bacteria as the ways nitrate leaves an aquarium. Water
            changes work right away, but they do not stop nitrate from coming back. To keep it
            down, find out why it rose:
          </p>
          <ol>
            <li>
              <strong>Confirm the reading.</strong> Test ammonia and nitrite too. If either is
              detectable, that is the more urgent problem.
            </li>
            <li>
              <strong>Test your replacement water.</strong> If it contains nitrate, it sets the floor
              for every water change. U.S. tap water can contain up to{' '}
              <Cite source="epaDrinkingWater">10 mg/L nitrate-nitrogen under EPA rules</Cite>, which
              is roughly 44 ppm on a typical aquarium nitrate test.
            </li>
            <li>
              <strong>Look for the source.</strong> Overfeeding, a missed maintenance routine,
              trapped debris, a clogged filter, or added livestock are common causes.
            </li>
            <li>
              <strong>Lower it in measured steps.</strong> Several smaller changes are usually gentler
              than one very large change.
            </li>
            <li>
              <strong>Retest and watch the trend.</strong> A single reading tells you where you are;
              the trend tells you whether your routine is working.
            </li>
          </ol>
          <p>
            For causes and a step-by-step plan, read our guide to{' '}
            <Link to="/blog/$slug" params={{ slug: 'high-nitrate-in-aquarium' }} className="link">
              high nitrate in an aquarium
            </Link>
            . To set an ongoing routine, see{' '}
            <Link to="/blog/$slug" params={{ slug: 'how-often-to-change-aquarium-water' }} className="link">
              how often to change aquarium water
            </Link>
            .
          </p>

          <h2>Before you do a large water change</h2>
          <p>
            Match the new water’s temperature to the tank: the{' '}
            <Cite source="merckEnvironmental">Merck Veterinary Manual</Cite> notes that sudden
            changes of even a few degrees can weaken fish immunity. Treat tap water with a{' '}
            <Cite source="merckHome">dechlorinator</Cite>, and for marine and reef tanks{' '}
            <Cite source="oataMarine">match the salinity</Cite> of the aquarium, because rapid
            changes can severely stress livestock. As a routine, the{' '}
            <Cite source="oataFreshwater">Ornamental Aquatic Trade Association</Cite> suggests
            changing up to 25% of a freshwater tank’s water each week, adjusted for species, tank
            size, and stocking.
          </p>
          <p>
            If your tank has had high nitrate for a long
            time, the livestock may have adjusted to it, so bringing it down gradually is often the
            safer choice. Check that other{' '}
            <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
              aquarium water parameters
            </Link>{' '}
            are in a suitable range too.
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
              <Link to="/blog/$slug" params={{ slug: 'high-nitrate-in-aquarium' }} className="link">
                High nitrate in an aquarium: causes, fixes, and a simple plan
              </Link>
            </li>
            <li>
              <Link to="/blog/$slug" params={{ slug: 'how-often-to-change-aquarium-water' }} className="link">
                How often should you change aquarium water?
              </Link>
            </li>
            <li>
              <Link to="/blog/$slug" params={{ slug: 'how-often-to-test-aquarium-water' }} className="link">
                How often to test aquarium water
              </Link>
            </li>
            <li>
              <Link to="/blog/$slug" params={{ slug: 'aquarium-water-parameters' }} className="link">
                Aquarium water parameters explained
              </Link>
            </li>
            <li>
              <Link to="/tools/aquarium-cycle-checker" className="link">
                Aquarium cycle checker: is my tank cycled?
              </Link>
            </li>
            <li>
              <Link to="/tools/aquarium-maintenance-schedule" className="link">
                Aquarium maintenance schedule generator
              </Link>
            </li>
          </ul>

          <ToolSources
            sources={Object.values(SOURCES)}
            lastReviewed={LAST_REVIEWED}
            note="For aquarium water, mg/L and ppm are interchangeable."
          />
        </article>
      </main>

      <MiniFooter />
    </>
  );
}
