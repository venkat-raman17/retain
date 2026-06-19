import { Platform } from 'react-native';
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

/**
 * The init Promise is cached on `globalThis`, not a module-local binding, so it
 * survives Metro Fast Refresh re-evaluating this module during development. On
 * web (OPFS) only one sync access handle may exist per file; a module-local cache
 * would be dropped on hot reload while the previous handle stayed open, causing
 * "Access Handles cannot be created…" on the re-open. The global cache keeps a
 * single open per page load.
 */
const INIT_KEY = '__retainDbInit__';
type GlobalWithDb = typeof globalThis & {
  [INIT_KEY]?: Promise<InitializedDatabase> | null;
};
const globalRef = globalThis as GlobalWithDb;

/**
 * Open the database, run migrations, seed singleton rows, and build the
 * repositories. Caches the Promise so concurrent callers (and hot reloads)
 * share one initialization (important on web where OPFS allows only one access
 * handle per file).
 */
export function initializeRetainDatabase(): Promise<InitializedDatabase> {
  globalRef[INIT_KEY] ??= (async () => {
    const sqlite = await SQLite.openDatabaseAsync(DB_NAME);
    // WAL improves write concurrency on native. On web the single-connection
    // OPFS VFS gains nothing from it and its extra file handles can collide with
    // OPFS sync access handles, so use the default rollback journal there.
    if (Platform.OS !== 'web') {
      await sqlite.execAsync('PRAGMA journal_mode = WAL;');
    }
    await sqlite.execAsync('PRAGMA foreign_keys = ON;');

    const db = new SqliteAppDatabase(sqlite);
    await runMigrations(db);

    const repositories = createRepositories(db);
    await seedDefaults(repositories);

    log.info('database ready');
    return { db, repositories };
  })();
  return globalRef[INIT_KEY];
}

/** Clears every user-data table (schema is preserved). */
async function clearAllTables(): Promise<void> {
  const { db } = await initializeRetainDatabase();
  await db.transaction(async () => {
    for (const table of ALL_TABLES) {
      await db.run(`DELETE FROM ${table};`);
    }
  });
}

/**
 * Wipe all on-device user data. The schema is preserved; the next profile read
 * re-seeds a fresh, onboarding-incomplete profile, so the app returns to its
 * first-run state. Wire only to an explicit, confirmed user action.
 */
export async function resetAllLocalData(): Promise<void> {
  await clearAllTables();
  log.warn('all local data reset by user');
}

/**
 * DEVELOPMENT/TEST ONLY. Clears every user-data table (schema is preserved).
 * Never wire this to a production button without an explicit, guarded flow.
 */
export async function resetLocalDataForTestingOnly(): Promise<void> {
  await clearAllTables();
  log.warn('local data reset (testing only)');
}

/** Drop the cached promise (used by tooling/tests). */
export function clearDatabaseInstanceForTesting(): void {
  globalRef[INIT_KEY] = null;
}
