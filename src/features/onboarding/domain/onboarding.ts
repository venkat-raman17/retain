/**
 * Onboarding domain: step types and intention options.
 * No imports from other features — this module is self-contained.
 */

export const ONBOARDING_STEPS = [
  'welcome',
  'philosophy',
  'privacy',
  'intention',
  'vow',
  'forge',
  'disclaimer',
  'path_start',
  'begin',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const INTENTIONS = [
  {
    id: 'impulse',
    label: 'Break free from impulse',
    description: 'I keep acting before I choose.',
  },
  {
    id: 'attention',
    label: 'Reclaim my attention',
    description: 'My focus is scattered and consumed.',
  },
  {
    id: 'lust',
    label: 'Command desire',
    description: 'Lust has more control than I want to admit.',
  },
  {
    id: 'loneliness',
    label: 'Stop leaking into loneliness',
    description: 'I seek comfort in the wrong places.',
  },
  {
    id: 'discipline',
    label: 'Build real discipline',
    description: 'I want to do what I say I will do.',
  },
  {
    id: 'purpose',
    label: 'Convert energy into purpose',
    description: 'I have ambition without direction.',
  },
  {
    id: 'energy',
    label: 'Restore and raise my energy',
    description: 'I feel drained, scattered, or numb.',
  },
  {
    id: 'self_respect',
    label: 'Return to self-respect',
    description: 'I want to be a man I can respect.',
  },
] as const;

export type IntentionId = (typeof INTENTIONS)[number]['id'];

export const FORGE_CATEGORY_DISPLAY = [
  { id: 'body', label: 'Body', description: 'Train, move, build physical discipline.' },
  { id: 'mind', label: 'Mind', description: 'Study, focus, deep work, planning.' },
  { id: 'spirit', label: 'Spirit', description: 'Pray, meditate, silence, gratitude.' },
  { id: 'order', label: 'Order', description: 'Clean, organize, prepare, repair.' },
  { id: 'creation', label: 'Creation', description: 'Write, build, draw, practice a skill.' },
  { id: 'brotherhood', label: 'Brotherhood', description: 'Serve, connect, speak honestly.' },
] as const;

export interface OnboardingDraft {
  /** Preset vow ID from VOW_PRESETS, or 'custom'. */
  vowPresetId: string | null;
  /** Text when vowPresetId === 'custom'. */
  customVow: string | null;
  /** One of INTENTIONS[].id */
  intention: IntentionId;
  /** One of FORGE_CATEGORY_DISPLAY[].id */
  forgeCategory: string;
  /** Days already completed before install (0 = starting fresh today). */
  offsetDays: number;
}
