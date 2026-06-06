/**
 * Injectable clock. Domain and service code depends on this interface instead of
 * calling `new Date()` directly, which keeps streak/recovery logic deterministic
 * and unit-testable.
 */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

/** Build a fixed clock for tests. */
export function fixedClock(date: Date): Clock {
  return { now: () => new Date(date.getTime()) };
}
