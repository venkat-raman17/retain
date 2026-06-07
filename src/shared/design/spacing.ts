/**
 * 4pt spacing scale — generous by default.
 *
 * Manforge breathes. Sections get real air (`xxl`/`xxxl`), and `xxxxl` exists for
 * ceremonial space around a single statement (a vow, a seal, a milestone). Use
 * the semantic names, not raw numbers, in components.
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64, // ceremonial breathing room around a single statement
} as const;
