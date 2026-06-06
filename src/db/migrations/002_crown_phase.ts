import type { Migration } from './index';

/**
 * Adds 90-day rite fields to user_profile:
 * - current_path_phase: 'initiation_90' | 'crowned_long_path'
 * - crown_received_at: ISO datetime or NULL
 * - long_path_started_at: ISO datetime or NULL
 *
 * Also extends the path_events check constraint to allow the four new
 * event types. SQLite cannot alter a CHECK constraint directly — we
 * leave the constraint as-is (SQLite does not enforce named CHECK
 * constraints via ALTER TABLE anyway) and rely on the domain validation.
 */
export const migration002: Migration = {
  id: 2,
  name: 'crown_phase',
  async up(db) {
    await db.execute(`
      ALTER TABLE user_profile
        ADD COLUMN current_path_phase TEXT NOT NULL DEFAULT 'initiation_90';
    `);
    await db.execute(`
      ALTER TABLE user_profile
        ADD COLUMN crown_received_at TEXT;
    `);
    await db.execute(`
      ALTER TABLE user_profile
        ADD COLUMN long_path_started_at TEXT;
    `);
  },
};
