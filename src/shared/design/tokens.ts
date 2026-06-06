/**
 * Aggregator for the raw design tokens. Each is defined in a focused file
 * (`colors`, `spacing`, `radius`, `typography`, `shadows`, `motion`) and
 * re-exported here so `theme.ts` can assemble the semantic layer from one import.
 *
 * Layering: raw tokens (here) → semantic `theme` → `useTheme()` → components.
 * Components consume the semantic `theme`, never these raw values directly.
 */
export { palette } from './colors';
export { spacing } from './spacing';
export { radii } from './radius';
export { typography } from './typography';
export { shadows } from './shadows';
export { durations, easing, motion } from './motion';
