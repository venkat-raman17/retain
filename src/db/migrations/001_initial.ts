import type { Migration } from './index';

/**
 * Initial schema for local, user-generated data only. Bundled content (codex,
 * studies, rituals, principles, rites, disclaimer) is NOT stored here — it ships
 * in `src/content` and is validated by Zod at load time.
 *
 * Singleton tables (`user_profile`) use a `CHECK (id = 1)` guard. A lapse resets
 * `current_path_started_at` but never `path_started_at` or any history table.
 */
export const migration001: Migration = {
  id: 1,
  name: 'initial_schema',
  async up(db) {
    await db.execute(`
      CREATE TABLE user_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        onboarding_completed INTEGER NOT NULL DEFAULT 0,
        selected_vow TEXT,
        custom_vow TEXT,
        path_started_at TEXT,
        current_path_started_at TEXT,
        app_content_version INTEGER NOT NULL DEFAULT 1,
        preferred_teaching_tone TEXT NOT NULL DEFAULT 'gentle',
        notification_style TEXT NOT NULL DEFAULT 'off',
        app_lock_enabled INTEGER NOT NULL DEFAULT 0
      );
    `);

    await db.execute(`
      CREATE TABLE path_events (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        occurred_at TEXT NOT NULL,
        note TEXT
      );
    `);
    await db.execute(`CREATE INDEX idx_path_events_occurred_at ON path_events (occurred_at DESC);`);

    await db.execute(`
      CREATE TABLE urge_logs (
        id TEXT PRIMARY KEY NOT NULL,
        occurred_at TEXT NOT NULL,
        trigger_type TEXT NOT NULL,
        intensity_before INTEGER NOT NULL,
        intensity_after INTEGER,
        completed_pause_timer_seconds INTEGER,
        selected_response TEXT,
        note TEXT
      );
    `);
    await db.execute(`CREATE INDEX idx_urge_logs_occurred_at ON urge_logs (occurred_at DESC);`);

    await db.execute(`
      CREATE TABLE forge_acts (
        id TEXT PRIMARY KEY NOT NULL,
        occurred_at TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        duration_minutes INTEGER,
        linked_urge_id TEXT,
        note TEXT
      );
    `);
    await db.execute(`CREATE INDEX idx_forge_acts_occurred_at ON forge_acts (occurred_at DESC);`);

    await db.execute(`
      CREATE TABLE lapse_records (
        id TEXT PRIMARY KEY NOT NULL,
        occurred_at TEXT NOT NULL,
        trigger_type TEXT,
        state_before TEXT,
        lesson TEXT,
        next_clean_action TEXT,
        shame_spiral_interrupted INTEGER NOT NULL DEFAULT 0,
        note TEXT
      );
    `);
    await db.execute(`CREATE INDEX idx_lapse_records_occurred_at ON lapse_records (occurred_at DESC);`);

    await db.execute(`
      CREATE TABLE boundaries (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    await db.execute(`
      CREATE TABLE boundary_checkins (
        id TEXT PRIMARY KEY NOT NULL,
        boundary_id TEXT NOT NULL,
        checked_at TEXT NOT NULL,
        status TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (boundary_id) REFERENCES boundaries (id) ON DELETE CASCADE
      );
    `);
    await db.execute(
      `CREATE INDEX idx_boundary_checkins_boundary ON boundary_checkins (boundary_id, checked_at DESC);`,
    );

    await db.execute(`
      CREATE TABLE content_progress (
        id TEXT PRIMARY KEY NOT NULL,
        content_id TEXT NOT NULL,
        content_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        first_opened_at TEXT,
        completed_at TEXT,
        UNIQUE (content_type, content_id)
      );
    `);

    await db.execute(`
      CREATE TABLE settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  },
};
