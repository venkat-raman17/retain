/**
 * Raw color palette — the obsidian/ember/gold language of Retain. No component
 * references these directly; semantic mapping lives in `theme.ts`.
 *
 * Note: bright red is avoided on purpose. Urge-support and warnings use a steady
 * ember/amber, never an alarm red (see docs/CONTENT_SAFETY.md — no failure-red).
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

  warning: '#C8923A',
  warningSoft: 'rgba(200, 146, 58, 0.14)',

  white: '#FFFFFF',
  black: '#000000',
} as const;
