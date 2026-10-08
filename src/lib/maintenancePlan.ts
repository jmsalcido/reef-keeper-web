/**
 * Builds a starting aquarium maintenance plan from basic tank details, and
 * exports a plan as an iCalendar (.ics) file with one recurring event per task.
 */

export type WaterType = 'freshwater' | 'saltwater';
export type TankStyle = 'community' | 'planted' | 'fishOnly' | 'reef';
export type Equipment =
  | 'filter'
  | 'heater'
  | 'lights'
  | 'airPump'
  | 'co2'
  | 'skimmer'
  | 'autoTopOff'
  | 'dosingPump'
  | 'uv'
  | 'rodi';

export type Frequency =
  | 'daily'
  | 'twiceWeekly'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'yearly'
  | 'asNeeded';

export type MaintenanceTask = {
  id: string;
  title: string;
  frequency: Frequency;
  note?: string;
};

export type TankDetails = {
  waterType: WaterType;
  style: TankStyle;
  volumeGallons: number;
  ageMonths: number;
  equipment: Equipment[];
};

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'twiceWeekly', label: 'Twice a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Every 3 months' },
  { value: 'semiannual', label: 'Every 6 months' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'asNeeded', label: 'As needed' },
];

export const frequencyLabel = (frequency: Frequency) =>
  FREQUENCIES.find((option) => option.value === frequency)!.label;

/** Tanks younger than this get extra testing while the biofilter matures. */
export const NEW_TANK_MONTHS = 2;
/** Below roughly 10 gallons, water quality changes quickly. */
export const SMALL_TANK_GALLONS = 10;

export function buildMaintenancePlan({
  waterType,
  style,
  volumeGallons,
  ageMonths,
  equipment,
}: TankDetails): MaintenanceTask[] {
  const has = (item: Equipment) => equipment.includes(item);
  const salt = waterType === 'saltwater';
  const reef = style === 'reef';
  const planted = style === 'planted';
  const isNew = ageMonths < NEW_TANK_MONTHS;
  const small = volumeGallons < SMALL_TANK_GALLONS;

  const testParameters = salt
    ? `salinity, pH, ammonia, nitrite, and nitrate${reef ? ', plus alkalinity, calcium, and magnesium' : ''}`
    : `ammonia, nitrite, nitrate, and pH${planted ? ', plus KH and GH' : ''}`;

  const tasks: (MaintenanceTask | false)[] = [
    // Daily
    {
      id: 'temperature',
      title: has('heater') ? 'Check temperature and that the heater is working' : 'Check water temperature',
      frequency: 'daily',
    },
    {
      id: 'observe',
      title: 'Check livestock behavior and that filters and pumps are running',
      frequency: 'daily',
      note: 'Look for gasping, hiding, clamped fins, or reduced flow.',
    },
    salt &&
      !has('autoTopOff') && {
        id: 'top-off',
        title: 'Top off evaporated water with fresh (RO/DI) water',
        frequency: 'daily',
        note: 'Salt stays behind when water evaporates, so top off with fresh water, never saltwater.',
      },
    has('co2') && {
      id: 'co2-daily',
      title: 'Check the CO2 bubble rate or drop checker',
      frequency: 'daily',
    },

    // Weekly
    {
      id: 'test',
      title: `Test ${testParameters}`,
      frequency: isNew ? 'twiceWeekly' : 'weekly',
      note: isNew
        ? 'Test more often while the tank is new. Use the aquarium cycle checker to read the results.'
        : 'Log each result so you can spot trends, not just single readings.',
    },
    {
      id: 'water-change',
      title: salt ? 'Partial water change with salinity-matched saltwater' : 'Partial water change with dechlorinated water',
      frequency: 'weekly',
      note: [
        salt ? 'OATA suggests at least 10% weekly for marine tanks.' : 'OATA suggests up to 25% weekly for freshwater tanks.',
        'Adjust the size to your nitrate readings and match the temperature.',
        small && 'Small tanks change quickly and may need larger or more frequent changes.',
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      id: 'substrate',
      title: planted ? 'Lightly vacuum open substrate areas between plants' : 'Vacuum the substrate during the water change',
      frequency: 'weekly',
    },
    {
      id: 'glass',
      title: 'Clean algae from the glass',
      frequency: 'weekly',
    },
    has('filter') && {
      id: 'filter-inspect',
      title: 'Inspect the filter for blockages, debris, and reduced flow',
      frequency: 'weekly',
    },
    planted && {
      id: 'plants',
      title: 'Trim plants and remove dead or melting leaves',
      frequency: 'weekly',
    },
    has('skimmer') && {
      id: 'skimmer',
      title: 'Empty and rinse the protein skimmer collection cup',
      frequency: 'weekly',
      note: 'Or sooner whenever it is full.',
    },
    has('autoTopOff') && {
      id: 'ato',
      title: 'Refill the auto top-off reservoir and check the sensor',
      frequency: 'weekly',
    },
    has('dosingPump') && {
      id: 'dosing',
      title: 'Check dosing pump reservoirs, tubing, and doses',
      frequency: 'weekly',
    },

    // Monthly and longer
    has('filter') && {
      id: 'filter-rinse',
      title: 'Rinse mechanical filter media in removed tank water',
      frequency: 'monthly',
      note: 'Never under the tap: chlorine or chloramine can harm beneficial bacteria. Do it sooner if flow drops.',
    },
    {
      id: 'equipment-review',
      title: 'Review equipment: heater, pumps, cords, and drip loops',
      frequency: 'monthly',
    },
    {
      id: 'trends',
      title: 'Review water parameter trends and adjust the routine',
      frequency: 'monthly',
    },
    has('lights') && {
      id: 'lights',
      title: 'Check the light timer and photoperiod',
      frequency: 'monthly',
    },
    has('airPump') && {
      id: 'air',
      title: 'Check the air pump, airline, and air stone',
      frequency: 'monthly',
    },
    has('co2') && {
      id: 'co2-cylinder',
      title: 'Check CO2 cylinder pressure and tubing',
      frequency: 'monthly',
    },
    salt && {
      id: 'chemical-media',
      title: 'Replace chemical filter media, such as carbon or phosphate remover',
      frequency: 'monthly',
      note: 'Follow the product’s recommended replacement interval.',
    },
    has('rodi') && {
      id: 'rodi-tds',
      title: 'Check the TDS reading of your RO/DI water',
      frequency: 'monthly',
      note: 'Rising TDS means the filters or membrane need attention.',
    },
    salt && {
      id: 'pumps',
      title: 'Clean return pump and powerhead impellers',
      frequency: 'quarterly',
    },
    has('rodi') && {
      id: 'rodi-filters',
      title: 'Replace RO/DI sediment and carbon filters',
      frequency: 'semiannual',
      note: 'Follow the manufacturer’s schedule for your unit.',
    },
    has('uv') && {
      id: 'uv',
      title: 'Clean the UV sterilizer sleeve and check the bulb',
      frequency: 'semiannual',
      note: 'Follow the manufacturer’s advice for bulb replacement.',
    },
    {
      id: 'consumables',
      title: 'Replace expired test kits and worn filter parts',
      frequency: 'semiannual',
    },
    salt && {
      id: 'refractometer',
      title: 'Calibrate the refractometer or salinity probe',
      frequency: 'yearly',
    },
    {
      id: 'audit',
      title: 'Inspect the stand, lid, hoses, and tubing; replace anything worn',
      frequency: 'yearly',
    },

    // As needed
    {
      id: 'extra-water-change',
      title: 'Extra water change when readings rise',
      frequency: 'asNeeded',
      note: 'Use the water change calculator to size it.',
    },
    has('filter') && {
      id: 'bio-media',
      title: 'Replace worn filter media a portion at a time',
      frequency: 'asNeeded',
      note: 'Replacing all biological media at once can remove the bacteria that keep ammonia and nitrite at zero.',
    },
  ];

  return tasks.filter((task): task is MaintenanceTask => Boolean(task));
}

/* ---------- Calendar export ---------- */

export type Weekday = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
export const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: 'MO', label: 'Monday' },
  { value: 'TU', label: 'Tuesday' },
  { value: 'WE', label: 'Wednesday' },
  { value: 'TH', label: 'Thursday' },
  { value: 'FR', label: 'Friday' },
  { value: 'SA', label: 'Saturday' },
  { value: 'SU', label: 'Sunday' },
];
const WEEKDAY_INDEX: Record<Weekday, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const weekdayAfter = (day: Weekday, offset: number) =>
  (Object.keys(WEEKDAY_INDEX) as Weekday[]).find(
    (key) => WEEKDAY_INDEX[key] === (WEEKDAY_INDEX[day] + offset) % 7,
  )!;

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/** First date on or after `from` that falls on one of `days`. */
const nextWeekday = (from: Date, days: Weekday[]) => {
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = addDays(from, offset);
    if (days.some((day) => WEEKDAY_INDEX[day] === candidate.getDay())) return candidate;
  }
  return from;
};

/** First `day` of the month on or after `from`'s month (moving to next month if already past). */
const firstWeekdayOfMonth = (from: Date, day: Weekday) => {
  const thisMonth = nextWeekday(new Date(from.getFullYear(), from.getMonth(), 1), [day]);
  return thisMonth >= from
    ? thisMonth
    : nextWeekday(new Date(from.getFullYear(), from.getMonth() + 1, 1), [day]);
};

/** The RRULE and first occurrence for a task, or null for tasks with no fixed schedule. */
export function recurrence(frequency: Frequency, day: Weekday, start: Date) {
  const monthly = (interval: number) => ({
    rule: `FREQ=MONTHLY;INTERVAL=${interval};BYDAY=1${day}`,
    first: firstWeekdayOfMonth(start, day),
  });

  switch (frequency) {
    case 'daily':
      return { rule: 'FREQ=DAILY', first: start };
    case 'twiceWeekly': {
      const days = [day, weekdayAfter(day, 3)];
      return { rule: `FREQ=WEEKLY;BYDAY=${days.join(',')}`, first: nextWeekday(start, days) };
    }
    case 'weekly':
      return { rule: `FREQ=WEEKLY;BYDAY=${day}`, first: nextWeekday(start, [day]) };
    case 'biweekly':
      return { rule: `FREQ=WEEKLY;INTERVAL=2;BYDAY=${day}`, first: nextWeekday(start, [day]) };
    case 'monthly':
      return monthly(1);
    case 'quarterly':
      return monthly(3);
    case 'semiannual':
      return monthly(6);
    case 'yearly':
      return monthly(12);
    case 'asNeeded':
      return null;
  }
}

const pad = (value: number) => String(value).padStart(2, '0');
const icsDate = (date: Date) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
const icsTimestamp = (date: Date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
const escapeText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Folds content lines longer than 75 octets, as RFC 5545 requires. */
const fold = (line: string) => {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (currentBytes + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
      currentBytes = 0;
    }
    current += char;
    currentBytes += size;
  }
  parts.push(current);
  return parts.join('\r\n ');
};

export function buildIcs({
  tasks,
  day,
  start,
  sourceUrl,
  now = new Date(),
}: {
  tasks: MaintenanceTask[];
  day: Weekday;
  start: Date;
  sourceUrl: string;
  now?: Date;
}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Reef Keeper//Aquarium Maintenance Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Aquarium maintenance',
  ];

  tasks.forEach((task, index) => {
    const schedule = recurrence(task.frequency, day, start);
    if (!schedule) return;
    const description = [task.note, `${frequencyLabel(task.frequency)} task from ${sourceUrl}`]
      .filter(Boolean)
      .join('\n\n');

    lines.push(
      'BEGIN:VEVENT',
      `UID:${icsTimestamp(now)}-${index}-${task.id}@reefkeeper`,
      `DTSTAMP:${icsTimestamp(now)}`,
      `DTSTART;VALUE=DATE:${icsDate(schedule.first)}`,
      `DTEND;VALUE=DATE:${icsDate(addDays(schedule.first, 1))}`,
      `RRULE:${schedule.rule}`,
      `SUMMARY:${escapeText(`Aquarium: ${task.title}`)}`,
      `DESCRIPTION:${escapeText(description)}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
