import * as SQLite from 'expo-sqlite';

import { createLogger } from '@/shared/lib';

import type { AppDatabase, RunResult, SqlParams } from './database';
import { runMigrations } from './migrations';
import { createRepositories, type Repositories } from './repositories';
import { seedDefaults } from './seed/seed';

const DB_NAME = 'retain.db';
const log = createLogger('db');

/** Order matters for `resetLocalDataForTestingOnly`: children before parents. */
const ALL_TABLES = [
  'boundary_checkins',
  'boundaries',
  'content_progress',
  'forge_acts',
  'urge_logs',
  'journal_entries',
  'lapse_records',
  'path_events',
  'settings',
  'user_profile',
] as const;

/**
 * The one place that touches `expo-sqlite`. A thin adapter wraps the native
 * handle in the {@link AppDatabase} port so nothing else imports SQLite.
 */
class SqliteAppDatabase implements AppDatabase {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  execute(sql: string): Promise<void> {
    return this.db.execAsync(sql);
  }

  async run(sql: string, params: SqlParams = []): Promise<RunResult> {
    const result = await this.db.runAsync(sql, params);
    return { changes: result.changes, lastInsertRowId: result.lastInsertRowId };
  }

  getFirst<T>(sql: string, params: SqlParams = []): Promise<T | null> {
    return this.db.getFirstAsync<T>(sql, params);
  }

  getAll<T>(sql: string, params: SqlParams = []): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, params);
  }

  transaction(work: () => Promise<void>): Promise<void> {
    return this.db.withTransactionAsync(work);
  }
}

export interface InitializedDatabase {
  db: AppDatabase;
  repositories: Repositories;
}

let instance: InitializedDatabase | null = null;

/**
 * Open the database, run migrations, seed singleton rows, and build the
 * repositories. Cached so repeated calls return the same instance.
 */
export async function initializeRetainDatabase(): Promise<InitializedDatabase> {
  if (instance) return instance;

  const sqlite = await SQLite.openDatabaseAsync(DB_NAME);
  await sqlite.execAsync('PRAGMA journal_mode = WAL;');
  await sqlite.execAsync('PRAGMA foreign_keys = ON;');

  const db = new SqliteAppDatabase(sqlite);
  await runMigrations(db);

  const repositories = createRepositories(db);
  await seedDefaults(repositories);

  log.info('database ready');
  instance = { db, repositories };
  return instance;
}

/**
 * DEVELOPMENT/TEST ONLY. Clears every user-data table (schema is preserved).
 * Never wire this to a production button without an explicit, guarded flow.
 */
export async function resetLocalDataForTestingOnly(): Promise<void> {
  const { db } = await initializeRetainDatabase();
  await db.transaction(async () => {
    for (const table of ALL_TABLES) {
      await db.run(`DELETE FROM ${table};`);
    }
  });
  log.warn('local data reset (testing only)');
}

/** Drop the cached instance (used by tooling/tests). */
export function clearDatabaseInstanceForTesting(): void {
  instance = null;
}
