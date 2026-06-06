import { z } from 'zod';

/**
 * Local app preferences, persisted in the key/value `settings` table. Practice
 * identity (vow, path dates, onboarding) lives on the user profile, not here.
 */
export const SETTING_KEYS = {
  hapticsEnabled: 'haptics_enabled',
  remindersEnabled: 'reminders_enabled',
  safetyAcknowledged: 'safety_acknowledged',
  primaryIntention: 'primary_intention',
  preferredForgeCategory: 'preferred_forge_category',
} as const;
export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export const appPreferencesSchema = z.object({
  hapticsEnabled: z.boolean(),
  remindersEnabled: z.boolean(),
  safetyAcknowledged: z.boolean(),
  /** Reason the user started the practice — set during onboarding. */
  primaryIntention: z.string().nullable(),
  /** First Forge category chosen during onboarding. */
  preferredForgeCategory: z.string().nullable(),
});
export type AppPreferences = z.infer<typeof appPreferencesSchema>;
export type AppPreferencesPatch = Partial<AppPreferences>;

export const DEFAULT_PREFERENCES: AppPreferences = {
  hapticsEnabled: true,
  remindersEnabled: false,
  safetyAcknowledged: false,
  primaryIntention: null,
  preferredForgeCategory: null,
};
