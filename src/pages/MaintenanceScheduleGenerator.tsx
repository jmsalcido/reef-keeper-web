import { useId, useRef, useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Nav } from '../components/Nav';
import { MiniFooter } from '../components/Footer';
import {
  NumberField,
  Segmented,
  SourceLink,
  ToolCta,
  ToolHero,
  ToolSources,
  type ToolSource,
} from '../components/ToolPage';
import { canonicalAssetUrl, canonicalUrl } from '../config';
import {
  FREQUENCIES,
  NEW_TANK_MONTHS,
  WEEKDAYS,
  buildIcs,
  buildMaintenancePlan,
  type Equipment,
  type Frequency,
  type MaintenanceTask,
  type TankDetails,
  type TankStyle,
  type WaterType,
  type Weekday,
} from '../lib/maintenancePlan';
import { SeoHead } from '../seo/SeoHead';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  type FaqItem,
} from '../seo/structuredData';

const PATH = '/tools/aquarium-maintenance-schedule';
const TOOL_NAME = 'Aquarium Maintenance Schedule Generator';
const SEO_TITLE = 'Free Aquarium Maintenance Schedule Generator | Reef Keeper';
const META_DESCRIPTION =
  'Create a free aquarium maintenance schedule for freshwater, planted, or reef tanks. Edit daily, weekly, and monthly tasks, then save as PDF or calendar.';
const LAST_REVIEWED = '2026-10-08';

const LITERS_PER_GALLON = 3.78541;
const MAX_GALLONS = 30000;
const MAX_AGE_MONTHS = 600;

const SOURCES = {
  oataFreshwater: {
    label: 'Ornamental Aquatic Trade Association: How to set up and look after a freshwater tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/',
  },
  oataMarine: {
    label: 'Ornamental Aquatic Trade Association: How to set up and maintain a marine aquarium',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-marine-fish/how-to-set-up-and-look-after-a-marine-tank-aquarium/',
  },
  oataMarineTesting: {
    label: 'Ornamental Aquatic Trade Association: How to test for water quality in a marine tank',
    url: 'https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-marine-fish/how-to-test-for-water-quality-in-a-marine-tank-aquarium/',
  },
  merckHome: {
    label: 'Merck Veterinary Manual: Providing a Home for Fish',
    url: 'https://www.merckvetmanual.com/all-other-pets/fish/providing-a-home-for-fish',
  },
} satisfies Record<string, ToolSource>;

const Cite = ({ source, children }: { source: keyof typeof SOURCES; children: ReactNode }) => (
  <SourceLink source={SOURCES[source]}>{children}</SourceLink>
);

const FAQS: FaqItem[] = [
  {
    q: 'How often should you clean a fish tank?',
    a: 'Most aquariums do best with a light weekly routine rather than occasional deep cleans: test the water, do a partial water change, vacuum the substrate, and wipe algae from the glass. The Ornamental Aquatic Trade Association suggests changing up to 25% of the water weekly in freshwater tanks and at least 10% weekly in marine tanks, adjusted for stocking and tank size.',
  },
  {
    q: 'What should be on a reef tank maintenance checklist?',
    a: 'Daily: check the temperature and top off evaporation with fresh RO/DI water. Weekly: test salinity, pH, nitrate, alkalinity, calcium, and magnesium, do a salinity-matched water change, and empty the skimmer cup. Monthly: replace chemical media as the product recommends and check the TDS of your RO/DI water. Yearly: calibrate the refractometer.',
  },
  {
    q: 'How often should I clean the aquarium filter?',
    a: 'Check it weekly for blockages and reduced flow, and rinse the mechanical media when it clogs, often about once a month. Rinse it in water removed from the tank, never under the tap, and avoid replacing all biological media at once, because that removes the bacteria that keep ammonia and nitrite at zero.',
  },
  {
    q: 'Do new aquariums need a different maintenance schedule?',
    a: 'Yes. Test more often while the tank is new, because the bacteria that process waste are still establishing. This generator switches testing to twice a week for tanks under two months old. Use the aquarium cycle checker to read the results.',
  },
  {
    q: 'Do small fish tanks need more maintenance?',
    a: 'Often, yes. Small volumes change faster, so waste builds up and temperature swings more quickly. The Merck Veterinary Manual notes that small tanks such as bowls and betta tanks may need as much as 50% of the water changed per week.',
  },
  {
    q: 'Can I add my aquarium maintenance schedule to my calendar?',
    a: 'Yes. Download the .ics file and open it with Google Calendar, Apple Calendar, or Outlook. Each task becomes a recurring all-day event on the weekday you choose. As-needed tasks are left out because they depend on your test results.',
  },
  {
    q: 'Should water changes follow a schedule or test results?',
    a: 'Both. A weekly partial water change is a practical baseline, and test results tell you when to adjust it. If nitrate keeps rising, increase the size or frequency of changes; the water change calculator shows how much a given change lowers nitrate.',
  },
];

const STYLE_OPTIONS: Record<WaterType, { value: TankStyle; label: string }[]> = {
  freshwater: [
    { value: 'community', label: 'Fish only' },
    { value: 'planted', label: 'Planted' },
  ],
  saltwater: [
    { value: 'fishOnly', label: 'Fish only' },
    { value: 'reef', label: 'Reef' },
  ],
};

const STYLE_NAMES: Record<TankStyle, string> = {
  community: 'freshwater fish-only',
  planted: 'planted freshwater',
  fishOnly: 'saltwater fish-only',
  reef: 'reef',
};

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; only?: WaterType }[] = [
  { value: 'filter', label: 'Filter' },
  { value: 'heater', label: 'Heater' },
  { value: 'lights', label: 'Lights' },
  { value: 'airPump', label: 'Air pump' },
  { value: 'co2', label: 'CO2 system', only: 'freshwater' },
  { value: 'skimmer', label: 'Protein skimmer', only: 'saltwater' },
  { value: 'autoTopOff', label: 'Auto top-off', only: 'saltwater' },
  { value: 'dosingPump', label: 'Dosing pump', only: 'saltwater' },
  { value: 'uv', label: 'UV sterilizer' },
  { value: 'rodi', label: 'RO/DI unit' },
];

const DEFAULT_EQUIPMENT: Equipment[] = ['filter', 'heater', 'lights'];

/** Turns tool names mentioned in task notes into links. */
const NOTE_LINKS: { phrase: string; to: '/tools/aquarium-cycle-checker' | '/tools/water-change-calculator' }[] = [
  { phrase: 'aquarium cycle checker', to: '/tools/aquarium-cycle-checker' },
  { phrase: 'water change calculator', to: '/tools/water-change-calculator' },
];

function renderNote(note: string) {
  const match = NOTE_LINKS.find((link) => note.includes(link.phrase));
  if (!match) return note;
  const [before, after] = note.split(match.phrase);
  return (
    <>
      {before}
      <Link to={match.to} className="link">
        {match.phrase}
      </Link>
      {after}
    </>
  );
}

function parseNumber(raw: string, min: number, max: number) {
  const trimmed = raw.trim().replace(',', '.');
  const value = Number(trimmed);
  return trimmed !== '' && Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

function downloadFile(contents: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function MaintenanceScheduleGenerator() {
  const formId = useId();
  const hasTrackedUse = useRef(false);
  const nextCustomId = useRef(1);

  const [waterType, setWaterType] = useState<WaterType>('freshwater');
  const [style, setStyle] = useState<TankStyle>('community');
  const [unit, setUnit] = useState<'gal' | 'L'>('gal');
  const [volume, setVolume] = useState('20');
  const [ageMonths, setAgeMonths] = useState('6');
  const [equipment, setEquipment] = useState<Equipment[]>(DEFAULT_EQUIPMENT);

  /** Set once the visitor edits the plan; holds the tank details it was built from. */
  const [customPlan, setCustomPlan] = useState<{ tasks: MaintenanceTask[]; builtFrom: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskFrequency, setNewTaskFrequency] = useState<Frequency>('weekly');
  const [day, setDay] = useState<Weekday>('SA');
  const [includeDaily, setIncludeDaily] = useState(false);

  const volumeValue = parseNumber(volume, 0.1, unit === 'gal' ? MAX_GALLONS : MAX_GALLONS * LITERS_PER_GALLON);
  const ageValue = parseNumber(ageMonths, 0, MAX_AGE_MONTHS);
  const details: TankDetails | null =
    volumeValue !== undefined && ageValue !== undefined
      ? {
          waterType,
          style,
          volumeGallons: unit === 'gal' ? volumeValue : volumeValue / LITERS_PER_GALLON,
          ageMonths: ageValue,
          equipment,
        }
      : null;
  const detailsKey = JSON.stringify(details);
  const suggested = details ? buildMaintenancePlan(details) : null;
  const plan = customPlan?.tasks ?? suggested;
  const detailsChangedSinceEdit = customPlan !== null && customPlan.builtFrom !== detailsKey;

  const trackUse = () => {
    if (hasTrackedUse.current) return;
    hasTrackedUse.current = true;
    window.gtag?.('event', 'tool_used', { tool_name: 'aquarium_maintenance_schedule' });
  };
  const edit = <T,>(setter: (value: T) => void) => (value: T) => {
    trackUse();
    setter(value);
  };

  const changeWaterType = (next: WaterType) => {
    trackUse();
    setWaterType(next);
    setStyle(STYLE_OPTIONS[next][0].value);
    setEquipment((current) =>
      current.filter((item) => {
        const option = EQUIPMENT_OPTIONS.find((candidate) => candidate.value === item);
        return !option?.only || option.only === next;
      }),
    );
  };

  const changeUnit = (next: 'gal' | 'L') => {
    if (next === unit) return;
    trackUse();
    if (volumeValue !== undefined) {
      const converted = next === 'L' ? volumeValue * LITERS_PER_GALLON : volumeValue / LITERS_PER_GALLON;
      setVolume(String(Math.round(converted * 10) / 10));
    }
    setUnit(next);
  };

  const toggleEquipment = (item: Equipment) => {
    trackUse();
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  const updateTasks = (update: (tasks: MaintenanceTask[]) => MaintenanceTask[]) => {
    if (!plan) return;
    trackUse();
    setCustomPlan({ tasks: update(plan), builtFrom: customPlan?.builtFrom ?? detailsKey });
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    updateTasks((tasks) => [
      ...tasks,
      { id: `custom-${nextCustomId.current++}`, title, frequency: newTaskFrequency },
    ]);
    setNewTaskTitle('');
  };

  const resetPlan = () => {
    setCustomPlan(null);
    setEditing(false);
  };

  const exportCalendar = () => {
    if (!plan) return;
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ics = buildIcs({
      tasks: includeDaily ? plan : plan.filter((task) => task.frequency !== 'daily'),
      day,
      start: tomorrow,
      sourceUrl: canonicalUrl(PATH),
    });
    downloadFile(ics, 'aquarium-maintenance-schedule.ics', 'text/calendar;charset=utf-8');
    window.gtag?.('event', 'tool_export', { tool_name: 'aquarium_maintenance_schedule', format: 'ics' });
  };

  const printPlan = () => {
    setEditing(false);
    window.gtag?.('event', 'tool_export', { tool_name: 'aquarium_maintenance_schedule', format: 'pdf' });
    // Let the view-mode plan render before the print dialog captures the page.
    setTimeout(() => window.print(), 50);
  };

  const summary = details
    ? `${STYLE_NAMES[style][0].toUpperCase()}${STYLE_NAMES[style].slice(1)} aquarium · ${volume.trim()} ${unit === 'gal' ? 'gal' : 'L'} · ${
        ageValue! < 1 ? 'under 1 month old' : `${ageValue} month${ageValue === 1 ? '' : 's'} old`
      }`
    : '';

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
        <ToolHero crumb="Maintenance schedule generator" title="Aquarium Maintenance Schedule Generator">
          Answer a few questions about your tank to get a daily, weekly, and monthly maintenance
          plan. Edit any task, then save it as a PDF or add it to your calendar.
        </ToolHero>

        <section className="tool-wrap" aria-labelledby={`${formId}-heading`}>
          <div className="tool-card">
            <div className="tool-card-head no-print">
              <h2 id={`${formId}-heading`}>Your tank</h2>
            </div>

            <form className="tool-fields no-print" noValidate onSubmit={(event) => event.preventDefault()}>
              <Segmented
                label="Water type"
                value={waterType}
                options={[
                  { value: 'freshwater', label: 'Freshwater' },
                  { value: 'saltwater', label: 'Saltwater' },
                ]}
                onChange={changeWaterType}
              />
              <Segmented
                label="Aquarium type"
                value={style}
                options={STYLE_OPTIONS[waterType]}
                onChange={edit(setStyle)}
              />
              <div className="tool-volume">
                <NumberField
                  id={`${formId}-volume`}
                  label="Aquarium volume"
                  value={volume}
                  suffix={unit}
                  error={volumeValue === undefined ? 'Enter a volume greater than 0.' : undefined}
                  onChange={edit(setVolume)}
                />
                <div className="tool-segmented tool-inline-units" role="radiogroup" aria-label="Volume unit">
                  {(['gal', 'L'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={unit === option}
                      className={unit === option ? 'is-active' : undefined}
                      onClick={() => changeUnit(option)}
                    >
                      {option === 'gal' ? 'Gallons' : 'Liters'}
                    </button>
                  ))}
                </div>
              </div>
              <NumberField
                id={`${formId}-age`}
                label="Tank age"
                value={ageMonths}
                suffix="months"
                error={ageValue === undefined ? `Enter 0–${MAX_AGE_MONTHS} months.` : undefined}
                help={`Use 0 or 1 for a new tank. Under ${NEW_TANK_MONTHS} months adds extra testing.`}
                onChange={edit(setAgeMonths)}
              />
              <div className="tool-field tool-field-wide">
                <span className="tool-label" id={`${formId}-equipment`}>
                  Equipment installed
                </span>
                <div className="tool-chips" role="group" aria-labelledby={`${formId}-equipment`}>
                  {EQUIPMENT_OPTIONS.filter((option) => !option.only || option.only === waterType).map(
                    (option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={equipment.includes(option.value)}
                        className={equipment.includes(option.value) ? 'is-active' : undefined}
                        onClick={() => toggleEquipment(option.value)}
                      >
                        {option.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </form>

            <div className="tool-result tool-plan-print" aria-live="polite">
              {!plan ? (
                <p className="tool-result-empty">Enter the tank volume and age to build your plan.</p>
              ) : (
                <>
                  <div className="tool-plan-head">
                    <div>
                      <h3>Your maintenance plan</h3>
                      <p>{summary}</p>
                    </div>
                    <div className="tool-plan-actions no-print">
                      {editing ? (
                        <button type="button" className="tool-button is-primary" onClick={() => setEditing(false)}>
                          Done
                        </button>
                      ) : (
                        <button type="button" className="tool-button" onClick={() => setEditing(true)}>
                          Customize
                        </button>
                      )}
                      {customPlan && (
                        <button type="button" className="tool-button is-quiet" onClick={resetPlan}>
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {detailsChangedSinceEdit && (
                    <div className="tool-callout is-warn no-print">
                      <strong>Your tank details changed.</strong> Your edited plan is kept as-is.{' '}
                      <button type="button" className="tool-text-button" onClick={resetPlan}>
                        Rebuild the plan for these details
                      </button>{' '}
                      (this replaces your edits).
                    </div>
                  )}

                  <PlanGroups
                    tasks={plan}
                    editing={editing}
                    onChange={(id, changes) =>
                      updateTasks((tasks) => tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)))
                    }
                    onRemove={(id) => updateTasks((tasks) => tasks.filter((task) => task.id !== id))}
                  />

                  {editing && (
                    <form
                      className="tool-add-task no-print"
                      onSubmit={(event) => {
                        event.preventDefault();
                        addTask();
                      }}
                    >
                      <label htmlFor={`${formId}-new-task`} className="sr-only">
                        New task
                      </label>
                      <input
                        id={`${formId}-new-task`}
                        type="text"
                        placeholder="Add a task, e.g. Feed vacation feeder"
                        value={newTaskTitle}
                        onChange={(event) => setNewTaskTitle(event.target.value)}
                      />
                      <label htmlFor={`${formId}-new-frequency`} className="sr-only">
                        How often
                      </label>
                      <select
                        id={`${formId}-new-frequency`}
                        value={newTaskFrequency}
                        onChange={(event) => setNewTaskFrequency(event.target.value as Frequency)}
                      >
                        {FREQUENCIES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="tool-button is-primary" disabled={!newTaskTitle.trim()}>
                        Add
                      </button>
                    </form>
                  )}

                  <div className="tool-export no-print">
                    <h4 className="tool-subhead">Save your schedule</h4>
                    <div className="tool-export-options">
                      <label>
                        Weekly tasks on{' '}
                        <select value={day} onChange={(event) => setDay(event.target.value as Weekday)}>
                          {WEEKDAYS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="tool-checkbox">
                        <input
                          type="checkbox"
                          checked={includeDaily}
                          onChange={(event) => setIncludeDaily(event.target.checked)}
                        />
                        Include daily tasks in the calendar
                      </label>
                    </div>
                    <div className="tool-export-buttons">
                      <button type="button" className="tool-button is-primary" onClick={exportCalendar}>
                        Add to calendar (.ics)
                      </button>
                      <button type="button" className="tool-button" onClick={printPlan}>
                        Print or save as PDF
                      </button>
                    </div>
                    <p className="tool-export-help">
                      The calendar file works with Google Calendar, Apple Calendar, and Outlook.
                      Monthly and longer tasks land on the first {WEEKDAYS.find((option) => option.value === day)!.label}{' '}
                      of the month. As-needed tasks are not added.
                    </p>
                  </div>
                </>
              )}
              <p className="tool-disclaimer">
                This is a starting point based on common aquarium care guidance. Adjust it to your
                livestock, your equipment manufacturer’s instructions, and your test results.
              </p>
            </div>
          </div>

          <ToolCta
            toolName="aquarium_maintenance_schedule"
            heading="Want automatic reminders and a history of completed maintenance?"
            label="Get Reef Keeper on the App Store"
          >
            Reef Keeper’s Weekly Care Plan turns this schedule into a checklist with local
            reminders, lets you mark each task completed or skipped, and shows what is overdue.
          </ToolCta>
        </section>

        <article className="prose tool-content">
          <h2>A typical aquarium maintenance schedule</h2>
          <p>
            Every tank is different, but most routines share the same rhythm. Use this table as a
            fish tank cleaning schedule to start from, then adjust it to your readings.
          </p>
          <div className="article-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">How often</th>
                  <th scope="col">Freshwater</th>
                  <th scope="col">Saltwater and reef</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Daily</th>
                  <td>Check temperature, livestock, and that equipment is running</td>
                  <td>Same, plus top off evaporation with fresh RO/DI water</td>
                </tr>
                <tr>
                  <th scope="row">Weekly</th>
                  <td>Test water, partial water change (up to 25%), vacuum substrate, clean glass, inspect filter</td>
                  <td>Test water including salinity, partial water change (at least 10%), empty skimmer cup</td>
                </tr>
                <tr>
                  <th scope="row">Monthly</th>
                  <td>Rinse filter media in tank water, review equipment and parameter trends</td>
                  <td>Same, plus replace chemical media and check RO/DI water TDS</td>
                </tr>
                <tr>
                  <th scope="row">Every 3–12 months</th>
                  <td>Replace expired test kits and worn parts, inspect hoses and stand</td>
                  <td>Same, plus clean pump impellers and calibrate the refractometer</td>
                </tr>
                <tr>
                  <th scope="row">As needed</th>
                  <td colSpan={2}>Extra water changes when readings rise; replace filter media a portion at a time</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The weekly water change guidance comes from the{' '}
            <Cite source="oataFreshwater">Ornamental Aquatic Trade Association’s freshwater</Cite> and{' '}
            <Cite source="oataMarine">marine</Cite> care sheets, which also recommend testing at least
            once a week and cleaning filters with water from a water change, never under a tap. For
            marine tanks, OATA advises checking the temperature every day and emptying the protein
            skimmer cup when it is full.
          </p>

          <h2>Reef tank maintenance checklist</h2>
          <p>
            Reef tanks add a few tasks because corals consume minerals and are sensitive to
            changes. Keep salinity stable by topping off with fresh water, since salt stays behind
            when water evaporates. Test alkalinity, calcium, and magnesium along with the usual
            parameters, and keep your RO/DI unit maintained so it produces water with{' '}
            <Cite source="oataMarineTesting">the lowest total dissolved solids possible</Cite>. Match
            the salinity of new water to the tank for every water change.
          </p>

          <h2>How to adjust the schedule for your tank</h2>
          <ul className="tool-related">
            <li>
              <strong>New tanks:</strong> test more often while the biofilter matures. Read the
              results with the{' '}
              <Link to="/tools/aquarium-cycle-checker" className="link">
                aquarium cycle checker
              </Link>
              .
            </li>
            <li>
              <strong>Small tanks:</strong> conditions change quickly. The{' '}
              <Cite source="merckHome">Merck Veterinary Manual</Cite> notes that small tanks may need
              as much as 50% of their water changed each week.
            </li>
            <li>
              <strong>Rising nitrate:</strong> increase the size or frequency of water changes. The{' '}
              <Link to="/tools/water-change-calculator" className="link">
                water change calculator
              </Link>{' '}
              shows how much each change helps.
            </li>
            <li>
              <strong>Planted tanks:</strong> add trimming and fertilizing, and vacuum gently around
              roots.
            </li>
          </ul>
          <p>
            For a deeper explanation of each task, read our{' '}
            <Link to="/blog/$slug" params={{ slug: 'aquarium-maintenance-schedule' }} className="link">
              daily, weekly, monthly, and yearly aquarium maintenance checklist
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
              <Link to="/blog/$slug" params={{ slug: 'aquarium-maintenance-schedule' }} className="link">
                Aquarium maintenance schedule: daily, weekly, monthly, and yearly checklist
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
              <Link to="/tools/water-change-calculator" className="link">
                Aquarium water change calculator
              </Link>
            </li>
            <li>
              <Link to="/tools/aquarium-cycle-checker" className="link">
                Aquarium cycle checker
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

function PlanGroups({
  tasks,
  editing,
  onChange,
  onRemove,
}: {
  tasks: MaintenanceTask[];
  editing: boolean;
  onChange: (id: string, changes: Partial<MaintenanceTask>) => void;
  onRemove: (id: string) => void;
}) {
  const groups = FREQUENCIES.map((frequency) => ({
    ...frequency,
    tasks: tasks.filter((task) => task.frequency === frequency.value),
  })).filter((group) => group.tasks.length > 0);

  if (groups.length === 0) {
    return <p className="tool-result-empty">No tasks yet. Add one below or reset the plan.</p>;
  }

  return (
    <div className="tool-plan">
      {groups.map((group) => (
        <section key={group.value} className="tool-plan-group" aria-label={`${group.label} tasks`}>
          <h4>
            {group.label} <span>{group.tasks.length}</span>
          </h4>
          <ul>
            {group.tasks.map((task) =>
              editing ? (
                <li key={task.id} className="is-editing">
                  <input
                    type="text"
                    aria-label="Task"
                    value={task.title}
                    onChange={(event) => onChange(task.id, { title: event.target.value })}
                  />
                  <select
                    aria-label={`How often: ${task.title}`}
                    value={task.frequency}
                    onChange={(event) => onChange(task.id, { frequency: event.target.value as Frequency })}
                  >
                    {FREQUENCIES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button type="button" aria-label={`Remove ${task.title}`} onClick={() => onRemove(task.id)}>
                    ×
                  </button>
                </li>
              ) : (
                <li key={task.id}>
                  <span className="tool-plan-check" aria-hidden="true" />
                  <div>
                    <strong>{task.title}</strong>
                    {task.note && <p>{renderNote(task.note)}</p>}
                  </div>
                </li>
              ),
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
