import type { Migration } from './index';

/**
 * Adds achievements_earned table to track which honors the user has unlocked.
 * Everything else (embers, rank, quest state) is derived from existing tables
 * at query time — this is the only new storage needed for the gamification layer.
 */
export const migration003: Migration = {
  id: 3,
  name: 'achievements',
  async up(db) {
    await db.execute(`
      CREATE TABLE achievements_earned (
        id TEXT PRIMARY KEY NOT NULL,
        achievement_id TEXT NOT NULL,
        earned_at TEXT NOT NULL,
        UNIQUE (achievement_id)
      );
    `);
    await db.execute(
      `CREATE INDEX idx_achievements_earned_at ON achievements_earned (earned_at DESC);`,
    );
  },
};
