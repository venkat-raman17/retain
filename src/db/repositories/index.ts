import type { AppDatabase } from '../database';
import {
  SqliteAchievementsRepository,
  type AchievementsRepository,
} from './achievements-repository';
import {
  SqliteContentProgressRepository,
  type ContentProgressRepository,
} from './content-progress-repository';
import { SqliteForgeRepository, type ForgeRepository } from './forge-repository';
import { SqliteLapseRepository, type LapseRepository } from './lapse-repository';
import { SqlitePathRepository, type PathRepository } from './path-repository';
import { SqliteSettingsRepository, type SettingsRepository } from './settings-repository';
import { SqliteUrgeRepository, type UrgeRepository } from './urge-repository';
import { SqliteUserProfileRepository, type UserProfileRepository } from './user-profile-repository';

/**
 * The repository registry passed through the app via the storage provider. Add
 * new repositories here; features consume them via `useRepositories()`.
 */
export interface Repositories {
  profile: UserProfileRepository;
  path: PathRepository;
  urge: UrgeRepository;
  forge: ForgeRepository;
  lapse: LapseRepository;
  contentProgress: ContentProgressRepository;
  settings: SettingsRepository;
  achievements: AchievementsRepository;
}

export function createRepositories(db: AppDatabase): Repositories {
  return {
    profile: new SqliteUserProfileRepository(db),
    path: new SqlitePathRepository(db),
    urge: new SqliteUrgeRepository(db),
    forge: new SqliteForgeRepository(db),
    lapse: new SqliteLapseRepository(db),
    contentProgress: new SqliteContentProgressRepository(db),
    settings: new SqliteSettingsRepository(db),
    achievements: new SqliteAchievementsRepository(db),
  };
}

export type {
  UserProfileRepository,
  PathRepository,
  UrgeRepository,
  ForgeRepository,
  LapseRepository,
  ContentProgressRepository,
  SettingsRepository,
  AchievementsRepository,
};
export type { ForgeCategoryCount } from './forge-repository';
export type { EarnedAchievement } from './achievements-repository';
