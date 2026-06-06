/**
 * Corner radii — moderate, never playful.
 *
 * Cards and buttons should read like carved stone or forged metal, not app-store
 * candy. Radii are kept small-to-moderate so surfaces feel weighty; nothing here
 * is a bubble. `pill` is reserved for chips and the breath ring.
 */
export const radii = {
  none: 0,
  sm: 6, // inputs, small controls
  md: 10, // buttons
  lg: 14, // cards
  xl: 20, // large feature cards / sheets
  pill: 999, // chips, rings
} as const;
