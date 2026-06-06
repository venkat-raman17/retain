/**
 * Aggregator for the design tokens. Tokens are defined in focused files
 * (`colors`, `spacing`, `radius`, `typography`, `shadows`, `motion`) and
 * re-exported here for convenience. Components consume the semantic `theme`,
 * not these raw tokens directly.
 */
export { palette } from './colors';
export { spacing } from './spacing';
export { radii } from './radius';
export { typography } from './typography';
export { shadows } from './shadows';
export { durations, easing, motion } from './motion';
