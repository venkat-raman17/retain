import {
  appPreferencesSchema,
  DEFAULT_PREFERENCES,
  SETTING_KEYS,
  type AppPreferences,
  type AppPreferencesPatch,
} from '@/features/settings/domain/settings';

import type { AppDatabase } from '../database';

/**
 * Generic key/value store plus a typed preferences facade over it. Booleans are
 * persisted as '0'/'1' strings.
 */
export interface SettingsRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  getPreferences(): Promise<AppPreferences>;
  updatePreferences(patch: AppPreferencesPatch): Promise<AppPreferences>;
}

const readBit = (value: string | null, fallback: boolean): boolean =>
  value === null ? fallback : value === '1';
const writeBit = (value: boolean): string => (value ? '1' : '0');

export class SqliteSettingsRepository implements SettingsRepository {
  constructor(private readonly db: AppDatabase) {}

  async get(key: string): Promise<string | null> {
    const row = await this.db.getFirst<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?;',
      [key],
    );
    return row?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.run(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
      [key, value, new Date().toISOString()],
    );
  }

  async getPreferences(): Promise<AppPreferences> {
    const [haptics, reminders, safety] = await Promise.all([
      this.get(SETTING_KEYS.hapticsEnabled),
      this.get(SETTING_KEYS.remindersEnabled),
      this.get(SETTING_KEYS.safetyAcknowledged),
    ]);
    return appPreferencesSchema.parse({
      hapticsEnabled: readBit(haptics, DEFAULT_PREFERENCES.hapticsEnabled),
      remindersEnabled: readBit(reminders, DEFAULT_PREFERENCES.remindersEnabled),
      safetyAcknowledged: readBit(safety, DEFAULT_PREFERENCES.safetyAcknowledged),
    });
  }

  async updatePreferences(patch: AppPreferencesPatch): Promise<AppPreferences> {
    if (patch.hapticsEnabled !== undefined) {
      await this.set(SETTING_KEYS.hapticsEnabled, writeBit(patch.hapticsEnabled));
    }
    if (patch.remindersEnabled !== undefined) {
      await this.set(SETTING_KEYS.remindersEnabled, writeBit(patch.remindersEnabled));
    }
    if (patch.safetyAcknowledged !== undefined) {
      await this.set(SETTING_KEYS.safetyAcknowledged, writeBit(patch.safetyAcknowledged));
    }
    return this.getPreferences();
  }
}
