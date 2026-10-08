/**
 * Nitrogen cycle assessment from ammonia, nitrite, and nitrate readings.
 *
 * The checker never calls a tank "ready" from one test or from elapsed days.
 * Its strongest result requires a streak of qualifying tests that matches the
 * Reef Keeper app's New Tank Cycle plan: three tests in a row with zero
 * ammonia, zero nitrite, and detectable nitrate, spanning at least four days.
 */

export type WaterType = 'freshwater' | 'saltwater';
export type CycleMethod = 'fishless' | 'fishIn';

export type Reading = { ammonia: number; nitrite: number; nitrate: number };
export type PastReading = Reading & { daysAgo: number };

export type CycleInputs = {
  waterType: WaterType;
  method: CycleMethod;
  ageDays: number;
  current: Reading;
  previous: PastReading[];
};

export type CycleStage = 'notStarted' | 'ammonia' | 'nitrite' | 'zeros' | 'consistent';

export type ChecklistStatus = 'done' | 'todo' | 'notSeen';
export type ChecklistItem = { label: string; status: ChecklistStatus };

export type CycleAssessment = {
  stage: CycleStage;
  /** Consecutive qualifying tests, most recent first, including the current one. */
  qualifyingTests: number;
  /** Days between the oldest and newest test in the qualifying streak. */
  qualifyingSpanDays: number;
  /** Ammonia or nitrite was seen in any test. */
  sawAmmoniaOrNitrite: boolean;
  /** Most recent previous test, for "since last test" comparisons. */
  lastTest: PastReading | null;
  checklist: ChecklistItem[];
};

export const REQUIRED_QUALIFYING_TESTS = 3;
export const REQUIRED_SPAN_DAYS = 4;
/** Merck Veterinary Manual: a tropical biofilter can take up to 8 weeks to establish. */
export const TYPICAL_MAX_CYCLE_DAYS = 56;

const isQualifying = ({ ammonia, nitrite, nitrate }: Reading) =>
  ammonia === 0 && nitrite === 0 && nitrate > 0;

export function assessCycle({ current, previous }: CycleInputs): CycleAssessment {
  const history = [...previous].sort((a, b) => a.daysAgo - b.daysAgo);
  const allTests: PastReading[] = [{ ...current, daysAgo: 0 }, ...history];

  let qualifyingTests = 0;
  let qualifyingSpanDays = 0;
  for (const test of allTests) {
    if (!isQualifying(test)) break;
    qualifyingTests += 1;
    qualifyingSpanDays = test.daysAgo;
  }

  const sawAmmonia = allTests.some((test) => test.ammonia > 0);
  const sawNitrite = allTests.some((test) => test.nitrite > 0);
  const confirmed =
    qualifyingTests >= REQUIRED_QUALIFYING_TESTS && qualifyingSpanDays >= REQUIRED_SPAN_DAYS;

  let stage: CycleStage;
  if (current.nitrite > 0) stage = 'nitrite';
  else if (current.ammonia > 0) stage = 'ammonia';
  else if (current.nitrate > 0) stage = confirmed ? 'consistent' : 'zeros';
  else stage = 'notStarted';

  const reachedZeros = stage === 'zeros' || stage === 'consistent';
  const pastStage = (seen: boolean, impliedByLaterStage: boolean): ChecklistStatus =>
    seen ? 'done' : impliedByLaterStage ? 'notSeen' : 'todo';

  return {
    stage,
    qualifyingTests,
    qualifyingSpanDays,
    sawAmmoniaOrNitrite: sawAmmonia || sawNitrite,
    lastTest: history[0] ?? null,
    checklist: [
      {
        label: 'Ammonia appeared',
        status: pastStage(sawAmmonia, sawNitrite || reachedZeros),
      },
      { label: 'Nitrite appeared', status: pastStage(sawNitrite, reachedZeros) },
      { label: 'Nitrate is detectable', status: current.nitrate > 0 ? 'done' : 'todo' },
      {
        label: 'Ammonia and nitrite both read 0',
        status: current.ammonia === 0 && current.nitrite === 0 && current.nitrate > 0 ? 'done' : 'todo',
      },
      {
        label: `Zeros held for ${REQUIRED_QUALIFYING_TESTS} tests over ${REQUIRED_SPAN_DAYS}+ days`,
        status: confirmed ? 'done' : 'todo',
      },
    ],
  };
}
