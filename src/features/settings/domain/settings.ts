import { z } from 'zod';

/**
 * Local app preferences, persisted in the key/value `settings` table. Practice
 * identity (vow, path dates, onboarding) lives on the user profile, not here.
 */
export const SETTING_KEYS = {
  hapticsEnabled: 'haptics_enabled',
  remindersEnabled: 'reminders_enabled',
  safetyAcknowledged: 'safety_acknowledged',
} as const;
export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export const appPreferencesSchema = z.object({
  hapticsEnabled: z.boolean(),
  remindersEnabled: z.boolean(),
  safetyAcknowledged: z.boolean(),
});
export type AppPreferences = z.infer<typeof appPreferencesSchema>;
export type AppPreferencesPatch = Partial<AppPreferences>;

export const DEFAULT_PREFERENCES: AppPreferences = {
  hapticsEnabled: true,
  remindersEnabled: false,
  safetyAcknowledged: false,
};
