import type { Migration } from './index';

/**
 * Initial schema for local, user-generated data only. Bundled content (codex,
 * practices, principles, onboarding, disclaimer) is NOT stored here — it ships
 * in `src/content` and is validated by Zod at load time.
 *
 * Singleton tables (`settings`, `practice_state`) use a `CHECK (id = 1)` guard
 * so there is exactly one row.
 */
export const migration001: Migration = {
  id: 1,
  name: 'initial_schema',
  async up(db) {
    await db.execute(`
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        onboarding_completed INTEGER NOT NULL DEFAULT 0,
        safety_acknowledged INTEGER NOT NULL DEFAULT 0,
        haptics_enabled INTEGER NOT NULL DEFAULT 1,
        reminders_enabled INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE practice_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        current_streak_start TEXT,
        best_streak_days INTEGER NOT NULL DEFAULT 0,
        total_resets INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE journal_entries (
        id TEXT PRIMARY KEY NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        kind TEXT NOT NULL,
        mood INTEGER,
        energy INTEGER,
        body TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]'
      );
    `);
    await db.execute(`CREATE INDEX idx_journal_created_at ON journal_entries (created_at DESC);`);

    await db.execute(`
      CREATE TABLE lapses (
        id TEXT PRIMARY KEY NOT NULL,
        occurred_at TEXT NOT NULL,
        trigger TEXT,
        reframe TEXT,
        created_at TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE boundaries (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL
      );
    `);
  },
};
