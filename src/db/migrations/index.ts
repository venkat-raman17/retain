import { createLogger } from '@/shared/lib';

import type { AppDatabase } from '../database';
import { migration001 } from './001_initial';
import { migration002 } from './002_crown_phase';

export interface Migration {
  readonly id: number;
  readonly name: string;
  up(db: AppDatabase): Promise<void>;
}

/**
 * Ordered, append-only migration list. Never edit a shipped migration — add a
 * new one. The runner applies each pending migration once, inside a transaction.
 */
export const migrations: readonly Migration[] = [migration001, migration002];

const log = createLogger('migrations');

export async function runMigrations(db: AppDatabase): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedRows = await db.getAll<{ id: number }>('SELECT id FROM schema_migrations;');
  const applied = new Set(appliedRows.map((row) => row.id));
  const pending = [...migrations].sort((a, b) => a.id - b.id).filter((m) => !applied.has(m.id));

  for (const migration of pending) {
    log.info(`applying migration ${migration.id} (${migration.name})`);
    await db.transaction(async () => {
      await migration.up(db);
      await db.run('INSERT INTO schema_migrations (id, name, applied_at) VALUES (?, ?, ?);', [
        migration.id,
        migration.name,
        new Date().toISOString(),
      ]);
    });
  }
}
