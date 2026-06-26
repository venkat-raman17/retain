import type { Migration } from './index';

/**
 * Adds `start_day_offset` to user_profile: the number of days a man skipped
 * before his first in-app day (onboarding "I've already done N days"). 0 means
 * he started at day 1. Existing rows default to 0 — i.e. treated as having
 * started from the beginning, so no honors are hidden for them.
 */
export const migration004: Migration = {
  id: 4,
  name: 'path_start_offset',
  async up(db) {
    await db.execute(`
      ALTER TABLE user_profile
        ADD COLUMN start_day_offset INTEGER NOT NULL DEFAULT 0;
    `);
  },
};
