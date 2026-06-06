/**
 * All four premium runtime themes for Retain.
 *
 * Each theme satisfies `AppTheme` and is selectable at runtime via ThemeContext.
 * Non-color tokens (spacing, radii, typography, durations, shadows) are shared
 * across all themes — only `colors` differs.
 *
 * Design language (rebuilt for contrast + premium feel):
 *   - Surfaces are clean, near-black NEUTRALS with clear elevation steps — never
 *     muddy warm-brown (which reads cheap). Each step up is distinctly lighter.
 *   - Text is crisp and high-contrast: near-white primary (~#F5–#FA), a clearly
 *     readable secondary, and a muted tone reserved for non-essential captions.
 *     All body/label tones clear WCAG AA (4.5:1) on the surfaces they sit on.
 *   - Accents are saturated and modern, used surgically (primary action, the
 *     active day, selected state) — the colour that carries each theme's identity.
 *
 * Theme IDs are persisted to SQLite under the key `'theme_id'`. Default: `'ember'`.
 */
import { durations, radii, shadows, spacing, typography } from './tokens';
import { type AppTheme, type ThemeColor, sharedArchetype } from './theme';

// ─── Theme ID ────────────────────────────────────────────────────────────────

export type ThemeId = 'ember' | 'obsidian-gold' | 'royal-sapphire' | 'graphite';

export const DEFAULT_THEME_ID: ThemeId = 'ember';

/** Ordered list — used by the picker to render cards in a fixed order. */
export const THEME_IDS: ThemeId[] = ['ember', 'obsidian-gold', 'royal-sapphire', 'graphite'];

// ─── Picker metadata ─────────────────────────────────────────────────────────

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  /** Three swatches shown in the picker card: [bg, text, accent]. */
  swatches: [string, string, string];
}

export const THEME_META: Record<ThemeId, ThemeMeta> = {
  ember: {
    id: 'ember',
    name: 'Ember',
    swatches: ['#0C0B0A', '#FAF6F0', '#F26C3A'],
  },
  'obsidian-gold': {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    swatches: ['#0B0B0C', '#F7F2E8', '#E3B341'],
  },
  'royal-sapphire': {
    id: 'royal-sapphire',
    name: 'Royal Sapphire',
    swatches: ['#0A0C12', '#ECEFF8', '#5773E6'],
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    swatches: ['#0C0D0F', '#F4F6F8', '#CBD2DC'],
  },
};

// ─── Theme factory ───────────────────────────────────────────────────────────

function makeTheme(colors: Record<ThemeColor, string>): AppTheme {
  return { colors, archetype: sharedArchetype, spacing, radii, typography, durations, shadows };
}

// ─── 1. Ember ────────────────────────────────────────────────────────────────
// Neutral near-black + vivid ember. The fire identity, modern and high-contrast.

const ember = makeTheme({
  background: '#0C0B0A',
  backgroundRaised: '#121110',
  surface: '#171513',
  surfaceRaised: '#1F1C18',
  surfaceOverlay: '#26221C',
  border: '#332E29',
  borderStrong: '#48423A',
  borderGold: '#A07C44',
  textPrimary: '#FAF6F0',
  textSecondary: '#B7AEA3',
  textMuted: '#8A8174',
  onPrimary: '#1A0E06',
  textInverse: '#0C0B0A',
  primary: '#F26C3A',
  primarySoft: 'rgba(242, 108, 58, 0.15)',
  primaryBright: '#FF8A5C',
  primarySurface: '#2A1710',
  accent: '#B0823F',
  accentSoft: 'rgba(176, 130, 63, 0.15)',
  accentText: '#E0A862',
  support: '#F26C3A',
  supportSoft: 'rgba(242, 108, 58, 0.15)',
  ember: '#F26C3A',
  emberMuted: '#C0542A',
  gold: '#D9A93C',
  bronze: '#B0823F',
  iron: '#5A544C',
  success: '#4FA06A',
  successSoft: 'rgba(79, 160, 106, 0.16)',
  successText: '#7FCB97',
  calm: '#4FA06A',
  calmSoft: 'rgba(79, 160, 106, 0.16)',
  warning: '#E0A23C',
  warningSoft: 'rgba(224, 162, 60, 0.15)',
  warningText: '#F0BE6A',
  danger: '#B04A52',
  dangerSoft: 'rgba(176, 74, 82, 0.18)',
  dangerText: '#E58A92',
  focusRing: '#F26C3A',
  parchment: '#E8D8B8',
  parchmentText: '#231D16',
  parchmentMuted: '#66553C',
  parchmentBorder: 'rgba(35, 29, 22, 0.16)',
});

// ─── 2. Obsidian Gold ────────────────────────────────────────────────────────
// Pure obsidian + crisp champagne gold. Luxury timepiece. The earned precious.

const obsidianGold = makeTheme({
  background: '#0B0B0C',
  backgroundRaised: '#111111',
  surface: '#161514',
  surfaceRaised: '#1E1C1A',
  surfaceOverlay: '#242220',
  border: '#322F2A',
  borderStrong: '#47423A',
  borderGold: '#A07C44',
  textPrimary: '#F7F2E8',
  textSecondary: '#B6AD9C',
  textMuted: '#877E6C',
  onPrimary: '#1A1405',
  textInverse: '#0B0B0C',
  primary: '#E3B341',
  primarySoft: 'rgba(227, 179, 65, 0.15)',
  primaryBright: '#F2C863',
  primarySurface: '#2A2110',
  accent: '#B0823F',
  accentSoft: 'rgba(176, 130, 63, 0.15)',
  accentText: '#E0A862',
  support: '#E3B341',
  supportSoft: 'rgba(227, 179, 65, 0.15)',
  ember: '#E3B341',
  emberMuted: '#B68A2E',
  gold: '#E3B341',
  bronze: '#B0823F',
  iron: '#5C564C',
  success: '#4FA06A',
  successSoft: 'rgba(79, 160, 106, 0.16)',
  successText: '#7FCB97',
  calm: '#4FA06A',
  calmSoft: 'rgba(79, 160, 106, 0.16)',
  warning: '#E0A23C',
  warningSoft: 'rgba(224, 162, 60, 0.15)',
  warningText: '#F0BE6A',
  danger: '#B04A52',
  dangerSoft: 'rgba(176, 74, 82, 0.18)',
  dangerText: '#E58A92',
  focusRing: '#E3B341',
  parchment: '#E8D8B8',
  parchmentText: '#231D16',
  parchmentMuted: '#66553C',
  parchmentBorder: 'rgba(35, 29, 22, 0.16)',
});

// ─── 3. Royal Sapphire ───────────────────────────────────────────────────────
// Cool blue-black + vivid royal indigo. Controlled intelligence, signal clarity.

const royalSapphire = makeTheme({
  background: '#0A0C12',
  backgroundRaised: '#0E101A',
  surface: '#11131D',
  surfaceRaised: '#181B27',
  surfaceOverlay: '#1C1F2D',
  border: '#272B3D',
  borderStrong: '#373C54',
  borderGold: '#A07C44',
  textPrimary: '#ECEFF8',
  textSecondary: '#929AB8',
  textMuted: '#767E9C',
  onPrimary: '#EEF1FB',
  textInverse: '#0A0C12',
  primary: '#5773E6',
  primarySoft: 'rgba(87, 115, 230, 0.18)',
  primaryBright: '#92A6F2',
  primarySurface: '#141B36',
  accent: '#B0823F',
  accentSoft: 'rgba(176, 130, 63, 0.15)',
  accentText: '#E0A862',
  support: '#5773E6',
  supportSoft: 'rgba(87, 115, 230, 0.18)',
  ember: '#5773E6',
  emberMuted: '#3D55B8',
  gold: '#C8A658',
  bronze: '#B0823F',
  iron: '#565C72',
  success: '#46A86E',
  successSoft: 'rgba(70, 168, 110, 0.16)',
  successText: '#79CB97',
  calm: '#46A86E',
  calmSoft: 'rgba(70, 168, 110, 0.16)',
  warning: '#DD9A3C',
  warningSoft: 'rgba(221, 154, 60, 0.15)',
  warningText: '#F0BE6A',
  danger: '#B04A58',
  dangerSoft: 'rgba(176, 74, 88, 0.18)',
  dangerText: '#E58A98',
  focusRing: '#5773E6',
  parchment: '#E8D8B8',
  parchmentText: '#231D16',
  parchmentMuted: '#66553C',
  parchmentBorder: 'rgba(35, 29, 22, 0.16)',
});

// ─── 4. Graphite ─────────────────────────────────────────────────────────────
// Cool neutral near-black + polished platinum. Minimal, monochrome, max contrast.

const graphite = makeTheme({
  background: '#0C0D0F',
  backgroundRaised: '#111316',
  surface: '#16181B',
  surfaceRaised: '#1E2024',
  surfaceOverlay: '#23262B',
  border: '#2E3238',
  borderStrong: '#434851',
  borderGold: '#A07C44',
  textPrimary: '#F4F6F8',
  textSecondary: '#A4AAB2',
  textMuted: '#767C84',
  onPrimary: '#0C0E11',
  textInverse: '#0C0D0F',
  primary: '#CBD2DC',
  primarySoft: 'rgba(203, 210, 220, 0.12)',
  primaryBright: '#E4E9EF',
  primarySurface: '#1C2025',
  accent: '#B0823F',
  accentSoft: 'rgba(176, 130, 63, 0.15)',
  accentText: '#E0A862',
  support: '#CBD2DC',
  supportSoft: 'rgba(203, 210, 220, 0.12)',
  ember: '#CBD2DC',
  emberMuted: '#9AA2AD',
  gold: '#C8A658',
  bronze: '#B0823F',
  iron: '#5A6068',
  success: '#57A56E',
  successSoft: 'rgba(87, 165, 110, 0.16)',
  successText: '#84CB99',
  calm: '#57A56E',
  calmSoft: 'rgba(87, 165, 110, 0.16)',
  warning: '#DC9C40',
  warningSoft: 'rgba(220, 156, 64, 0.15)',
  warningText: '#F0BE6A',
  danger: '#B24E54',
  dangerSoft: 'rgba(178, 78, 84, 0.18)',
  dangerText: '#E58A90',
  focusRing: '#CBD2DC',
  parchment: '#E8D8B8',
  parchmentText: '#231D16',
  parchmentMuted: '#66553C',
  parchmentBorder: 'rgba(35, 29, 22, 0.16)',
});

// ─── Theme map ───────────────────────────────────────────────────────────────

export const THEMES: Record<ThemeId, AppTheme> = {
  ember,
  'obsidian-gold': obsidianGold,
  'royal-sapphire': royalSapphire,
  graphite,
};

export function isThemeId(value: string): value is ThemeId {
  return value in THEMES;
}
