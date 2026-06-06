import type { AppDatabase } from '../database';
import { SqliteJournalRepository, type JournalRepository } from './journal-repository';
import { SqliteProgressRepository, type ProgressRepository } from './progress-repository';
import { SqliteSettingsRepository, type SettingsRepository } from './settings-repository';

/**
 * The repository registry passed through the app via the storage provider. Add
 * new repositories here; features consume them via `useRepositories()`.
 */
export interface Repositories {
  journal: JournalRepository;
  settings: SettingsRepository;
  progress: ProgressRepository;
}

export function createRepositories(db: AppDatabase): Repositories {
  return {
    journal: new SqliteJournalRepository(db),
    settings: new SqliteSettingsRepository(db),
    progress: new SqliteProgressRepository(db),
  };
}

export type { JournalRepository, SettingsRepository, ProgressRepository };
