/**
 * Dilution math for a single partial water change.
 *
 * After replacing fraction `p` of the water, nitrate becomes
 *   after = current × (1 − p) + replacement × p
 * so the fraction needed to reach a target is
 *   p = (current − target) / (current − replacement).
 *
 * This ignores nitrate produced or removed between tests, and treats the
 * entered volume as the actual water volume.
 */

export type WaterChangeInputs = {
  volume: number;
  current: number;
  target: number;
  replacement: number;
};

export type WaterChangeResult =
  | { kind: 'atTarget' }
  | { kind: 'unreachable' }
  | {
      kind: 'change';
      /** Exact fraction needed (0–1). */
      fraction: number;
      /** Whole-percent recommendation, rounded up so the target is reached. */
      percent: number;
      volumeToReplace: number;
      predictedAfter: number;
      /** Equal 25% changes that reach the target when a single change would be large. */
      splitChanges: number | null;
    };

export const COMPARISON_PERCENTS = [10, 20, 30, 50] as const;
export const LARGE_CHANGE_PERCENT = 50;
const SPLIT_PERCENT = 25;

export const nitrateAfterChange = (current: number, replacement: number, fraction: number) =>
  current * (1 - fraction) + replacement * fraction;

/** Number of equal changes of `fraction` that bring nitrate to or below target. */
export const changesNeeded = (
  current: number,
  target: number,
  replacement: number,
  fraction: number,
) => Math.ceil(Math.log((target - replacement) / (current - replacement)) / Math.log(1 - fraction));

export function calculateWaterChange({
  volume,
  current,
  target,
  replacement,
}: WaterChangeInputs): WaterChangeResult {
  if (current <= target) return { kind: 'atTarget' };
  if (replacement >= target) return { kind: 'unreachable' };

  const fraction = (current - target) / (current - replacement);
  const percent = Math.min(100, Math.ceil(fraction * 100 - 1e-9));
  const rounded = percent / 100;

  return {
    kind: 'change',
    fraction,
    percent,
    volumeToReplace: volume * rounded,
    predictedAfter: nitrateAfterChange(current, replacement, rounded),
    splitChanges:
      percent > LARGE_CHANGE_PERCENT
        ? changesNeeded(current, target, replacement, SPLIT_PERCENT / 100)
        : null,
  };
}
