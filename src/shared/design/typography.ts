import { Platform } from 'react-native';

/**
 * Type system — strong, restrained, ceremonial.
 *
 * Two families, no custom font assets (fully bundled / offline): a system serif
 * for ceremony (display, headings, card/rite titles, seals) and the system sans
 * for sustained reading (body, labels, metadata). The pairing reads like an
 * ancient codex — a carved title over clean, legible teaching — without anything
 * futuristic or playfully rounded.
 *
 * The conceptual hierarchy (mapped to `AppText` variants):
 *   display   → ceremonial section titles
 *   heading   → screen titles
 *   title     → cards and rites
 *   subheading→ secondary titles within a card
 *   body      → teachings (optimized for long Codex passages)
 *   label     → controls and inline labels
 *   caption   → metadata and eyebrows
 *   seal      → short, mantra-like closing lines (engraved feel)
 */
const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  /** `ceremony` = serif for titles/seals; `reading` = sans for body/metadata. */
  family: {
    ceremony: serif,
    reading: sans,
  },
  size: {
    display: 34,
    title: 24,
    heading: 21,
    subheading: 18,
    body: 16,
    label: 14,
    caption: 12,
    seal: 13,
  },
  lineHeight: {
    display: 42,
    title: 31,
    heading: 28,
    subheading: 25,
    body: 26, // generous leading for long-form reading
    label: 20,
    caption: 16,
    seal: 20,
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
    /** A touch of air under ceremonial titles. */
    ceremonial: 0.3,
    wide: 0.6,
    /** Engraved eyebrows and seals. */
    wider: 1.4,
  },
} as const;
