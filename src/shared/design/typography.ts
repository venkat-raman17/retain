/**
 * Type scale. `weight` uses `as const` so the string-literal types match what
 * React Native's `fontWeight` expects.
 */
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
