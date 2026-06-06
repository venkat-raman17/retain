/**
 * Design tokens — the raw, context-free values of the Retain visual language.
 *
 * Aesthetic: obsidian dark, calm and disciplined. The energy is represented as
 * a warm gold (an ally, something valuable), the path as a mystical indigo, and
 * urge-support moments as a steady ember (supportive, never alarming or shaming).
 *
 * Nothing here references a component or a screen. Semantic mapping lives in
 * `theme.ts`; components consume the theme, not these raw values directly.
 */

export const palette = {
  obsidian: '#0B0B12',
  ink: '#14141F',
  slate: '#1B1B2A',
  slateRaised: '#23233A',

  border: 'rgba(236, 234, 240, 0.08)',
  borderStrong: 'rgba(236, 234, 240, 0.16)',

  textPrimary: '#ECEAF0',
  textSecondary: '#A7A4B8',
  textMuted: '#6E6B82',

  gold: '#E0B25C',
  goldSoft: 'rgba(224, 178, 92, 0.14)',

  indigo: '#7C6BD6',
  indigoSoft: 'rgba(124, 107, 214, 0.14)',

  jade: '#5FB59A',
  jadeSoft: 'rgba(95, 181, 154, 0.14)',

  ember: '#C8654B',
  emberSoft: 'rgba(200, 101, 75, 0.14)',

  white: '#FFFFFF',
  black: '#000000',
} as const;

/** 4pt spacing scale. Use the semantic names, not raw numbers, in components. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  size: {
    display: 34,
    title: 27,
    heading: 21,
    subheading: 18,
    body: 16,
    label: 14,
    caption: 12,
  },
  lineHeight: {
    display: 40,
    title: 33,
    heading: 28,
    subheading: 25,
    body: 24,
    label: 20,
    caption: 16,
  },
  // `as const` preserves the string-literal types that RN's `fontWeight` expects.
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.6,
    wider: 1.4,
  },
} as const;

/** Animation durations in milliseconds. */
export const durations = {
  instant: 0,
  fast: 150,
  base: 250,
  slow: 400,
  breath: 4000,
} as const;
