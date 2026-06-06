import {
  DEFAULT_PROFILE,
  userProfileSchema,
  type UserProfile,
  type UserProfilePatch,
} from '@/features/path/domain/user-profile';

import type { AppDatabase } from '../database';

export interface UserProfileRepository {
  /** Returns the profile, materializing the default singleton row on first read. */
  get(): Promise<UserProfile>;
  update(patch: UserProfilePatch): Promise<UserProfile>;
}

interface ProfileRow {
  created_at: string;
  updated_at: string;
  onboarding_completed: number;
  selected_vow: string | null;
  custom_vow: string | null;
  path_started_at: string | null;
  current_path_started_at: string | null;
  app_content_version: number;
  preferred_teaching_tone: string;
  notification_style: string;
  app_lock_enabled: number;
  current_path_phase: string | null;
  crown_received_at: string | null;
  long_path_started_at: string | null;
}

const bit = (value: boolean): number => (value ? 1 : 0);

function toProfile(row: ProfileRow): UserProfile {
  return userProfileSchema.parse({
    onboardingCompleted: row.onboarding_completed === 1,
    selectedVow: row.selected_vow,
    customVow: row.custom_vow,
    pathStartedAt: row.path_started_at,
    currentPathStartedAt: row.current_path_started_at,
    appContentVersion: row.app_content_version,
    preferredTeachingTone: row.preferred_teaching_tone,
    notificationStyle: row.notification_style,
    appLockEnabled: row.app_lock_enabled === 1,
    currentPathPhase: row.current_path_phase ?? 'initiation_90',
    crownReceivedAt: row.crown_received_at ?? null,
    longPathStartedAt: row.long_path_started_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export class SqliteUserProfileRepository implements UserProfileRepository {
  constructor(private readonly db: AppDatabase) {}

  async get(): Promise<UserProfile> {
    const row = await this.db.getFirst<ProfileRow>('SELECT * FROM user_profile WHERE id = 1;');
    if (row) return toProfile(row);

    const now = new Date().toISOString();
    const seeded = userProfileSchema.parse({ ...DEFAULT_PROFILE, createdAt: now, updatedAt: now });
    await this.db.run(
      `INSERT OR IGNORE INTO user_profile
         (id, created_at, updated_at, onboarding_completed, selected_vow, custom_vow,
          path_started_at, current_path_started_at, app_content_version,
          preferred_teaching_tone, notification_style, app_lock_enabled,
          current_path_phase, crown_received_at, long_path_started_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        now, now,
        bit(seeded.onboardingCompleted),
        seeded.selectedVow,
        seeded.customVow,
        seeded.pathStartedAt,
        seeded.currentPathStartedAt,
        seeded.appContentVersion,
        seeded.preferredTeachingTone,
        seeded.notificationStyle,
        bit(seeded.appLockEnabled),
        seeded.currentPathPhase,
        seeded.crownReceivedAt,
        seeded.longPathStartedAt,
      ],
    );
    return seeded;
  }

  async update(patch: UserProfilePatch): Promise<UserProfile> {
    const current = await this.get();
    const next = userProfileSchema.parse({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    await this.db.run(
      `UPDATE user_profile SET
         updated_at = ?, onboarding_completed = ?, selected_vow = ?, custom_vow = ?,
         path_started_at = ?, current_path_started_at = ?, app_content_version = ?,
         preferred_teaching_tone = ?, notification_style = ?, app_lock_enabled = ?,
         current_path_phase = ?, crown_received_at = ?, long_path_started_at = ?
       WHERE id = 1;`,
      [
        next.updatedAt,
        bit(next.onboardingCompleted),
        next.selectedVow,
        next.customVow,
        next.pathStartedAt,
        next.currentPathStartedAt,
        next.appContentVersion,
        next.preferredTeachingTone,
        next.notificationStyle,
        bit(next.appLockEnabled),
        next.currentPathPhase,
        next.crownReceivedAt,
        next.longPathStartedAt,
      ],
    );
    return next;
  }
}
