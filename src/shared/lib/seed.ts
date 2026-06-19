/**
 * Deterministic per-day seed (Knuth multiplicative hash). Pure: the same day
 * always yields the same seed, so the day's color tone and its visual mark vary
 * in lockstep with no `Math.random`. Shared by `useDayTheme` and `DaySigil`.
 */
export function daySeed(day: number): number {
  return (Math.trunc(day) * 2654435761) >>> 0;
}
