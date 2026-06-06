/** Animation durations (ms) and easing names. */
export const durations = {
  instant: 0,
  fast: 150,
  base: 250,
  slow: 400,
  breath: 4000,
} as const;

export const easing = {
  standard: 'ease-in-out',
  decelerate: 'ease-out',
  accelerate: 'ease-in',
} as const;

export const motion = { durations, easing } as const;
