import {
  appSettingsSchema,
  DEFAULT_SETTINGS,
  type AppSettings,
  type AppSettingsPatch,
} from '@/features/settings/domain/settings';

import type { AppDatabase } from '../database';

export interface SettingsRepository {
  /** Returns settings, materializing the default row on first read. */
  get(): Promise<AppSettings>;
  update(patch: AppSettingsPatch): Promise<AppSettings>;
}

interface SettingsRow {
  onboarding_completed: number;
  safety_acknowledged: number;
  haptics_enabled: number;
  reminders_enabled: number;
  updated_at: string;
}

const bit = (value: boolean): number => (value ? 1 : 0);

function toSettings(row: SettingsRow): AppSettings {
  return appSettingsSchema.parse({
    onboardingCompleted: row.onboarding_completed === 1,
    safetyAcknowledged: row.safety_acknowledged === 1,
    hapticsEnabled: row.haptics_enabled === 1,
    remindersEnabled: row.reminders_enabled === 1,
    updatedAt: row.updated_at,
  });
}

export class SqliteSettingsRepository implements SettingsRepository {
  constructor(private readonly db: AppDatabase) {}

  async get(): Promise<AppSettings> {
    const row = await this.db.getFirst<SettingsRow>('SELECT * FROM settings WHERE id = 1;');
    if (row) return toSettings(row);

    const now = new Date().toISOString();
    const seeded = appSettingsSchema.parse({ ...DEFAULT_SETTINGS, updatedAt: now });
    await this.db.run(
      `INSERT OR IGNORE INTO settings
         (id, onboarding_completed, safety_acknowledged, haptics_enabled, reminders_enabled, updated_at)
       VALUES (1, ?, ?, ?, ?, ?);`,
      [
        bit(seeded.onboardingCompleted),
        bit(seeded.safetyAcknowledged),
        bit(seeded.hapticsEnabled),
        bit(seeded.remindersEnabled),
        now,
      ],
    );
    return seeded;
  }

  async update(patch: AppSettingsPatch): Promise<AppSettings> {
    const current = await this.get();
    const next = appSettingsSchema.parse({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    await this.db.run(
      `UPDATE settings SET
         onboarding_completed = ?,
         safety_acknowledged = ?,
         haptics_enabled = ?,
         reminders_enabled = ?,
         updated_at = ?
       WHERE id = 1;`,
      [
        bit(next.onboardingCompleted),
        bit(next.safetyAcknowledged),
        bit(next.hapticsEnabled),
        bit(next.remindersEnabled),
        next.updatedAt,
      ],
    );
    return next;
  }
}
