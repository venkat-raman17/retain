import { z } from 'zod';

/**
 * The single practice identity (one row). Holds the vow, the path dates, and
 * practice preferences. No account, no PII — just the state of one man's
 * practice on one device.
 */
export const TEACHING_TONES = ['plain', 'stern', 'gentle', 'mystical'] as const;
export const teachingToneSchema = z.enum(TEACHING_TONES);
export type TeachingTone = z.infer<typeof teachingToneSchema>;

export const NOTIFICATION_STYLES = ['off', 'minimal', 'stern', 'gentle', 'mystical'] as const;
export const notificationStyleSchema = z.enum(NOTIFICATION_STYLES);
export type NotificationStyle = z.infer<typeof notificationStyleSchema>;

export const PATH_PHASES = ['initiation_90', 'crowned_long_path'] as const;
export const pathPhaseSchema = z.enum(PATH_PHASES);
export type PathPhase = z.infer<typeof pathPhaseSchema>;

export const userProfileSchema = z.object({
  onboardingCompleted: z.boolean(),
  selectedVow: z.string().min(1).nullable(),
  customVow: z.string().max(280).nullable(),
  /** First time the path was ever started; never reset by a lapse. */
  pathStartedAt: z.string().datetime().nullable(),
  /** Start of the current run; reset to now on a return after a lapse. */
  currentPathStartedAt: z.string().datetime().nullable(),
  /**
   * Days skipped before the user's first in-app day (onboarding "I've already
   * done N days"). 0 = started at day 1. Used to hide honors for arcs/days the
   * user never walked. Reset to 0 on a full restart / return (a new run from day 1).
   */
  startDayOffset: z.number().int().min(0).default(0),
  appContentVersion: z.number().int().min(0),
  preferredTeachingTone: teachingToneSchema,
  notificationStyle: notificationStyleSchema,
  appLockEnabled: z.boolean(),
  /** Phase of the rite: first 90 days vs. crowned long path. */
  currentPathPhase: pathPhaseSchema.default('initiation_90'),
  /** When the Crown was received; null until Day 90 is completed. */
  crownReceivedAt: z.string().datetime().nullable().default(null),
  /** When the Long Path began; null until Crown received. */
  longPathStartedAt: z.string().datetime().nullable().default(null),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export type UserProfilePatch = Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>;

export const DEFAULT_PROFILE: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
  onboardingCompleted: false,
  selectedVow: null,
  customVow: null,
  pathStartedAt: null,
  currentPathStartedAt: null,
  startDayOffset: 0,
  appContentVersion: 1,
  preferredTeachingTone: 'gentle',
  notificationStyle: 'off',
  appLockEnabled: false,
  currentPathPhase: 'initiation_90',
  crownReceivedAt: null,
  longPathStartedAt: null,
};

/** Preset vows offered in onboarding (Prompt 6). Stored by id; custom in customVow. */
export const VOW_PRESETS = [
  { id: 'pause-before-obey', text: 'I pause before I obey.' },
  { id: 'do-not-waste-fire', text: 'I do not waste the fire.' },
  { id: 'turn-desire-to-strength', text: 'I turn desire into strength.' },
  { id: 'not-ruled-by-impulse', text: 'I am not ruled by impulse.' },
  { id: 'return-without-shame', text: 'I return without shame.' },
] as const;

export function resolveVowText(
  profile: Pick<UserProfile, 'selectedVow' | 'customVow'>,
): string | null {
  if (profile.customVow) return profile.customVow;
  const preset = VOW_PRESETS.find((vow) => vow.id === profile.selectedVow);
  return preset ? preset.text : null;
}
