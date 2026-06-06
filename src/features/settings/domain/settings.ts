import { z } from 'zod';

/**
 * Local, on-device app settings. Fully offline: there is no account and no sync.
 * `onboardingCompleted` and `safetyAcknowledged` gate the app's entry flow.
 */
export const appSettingsSchema = z.object({
  onboardingCompleted: z.boolean(),
  safetyAcknowledged: z.boolean(),
  hapticsEnabled: z.boolean(),
  remindersEnabled: z.boolean(),
  updatedAt: z.string().datetime(),
});
export type AppSettings = z.infer<typeof appSettingsSchema>;

/** Mutable settings (everything except the managed `updatedAt`). */
export type AppSettingsPatch = Partial<Omit<AppSettings, 'updatedAt'>>;

export const DEFAULT_SETTINGS: Omit<AppSettings, 'updatedAt'> = {
  onboardingCompleted: false,
  safetyAcknowledged: false,
  hapticsEnabled: true,
  remindersEnabled: false,
};
