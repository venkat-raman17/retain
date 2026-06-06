import { lapseSchema, type Lapse } from '@/features/path/domain/lapse';
import { practiceStateSchema, type PracticeState } from '@/features/path/domain/practice-state';

import type { AppDatabase } from '../database';

export interface ProgressRepository {
  /** Returns the practice state, materializing the default row on first read. */
  getPracticeState(): Promise<PracticeState>;
  savePracticeState(state: PracticeState): Promise<void>;
  listLapses(limit?: number): Promise<Lapse[]>;
  addLapse(lapse: Lapse): Promise<void>;
  lapseCount(): Promise<number>;
}

interface PracticeStateRow {
  current_streak_start: string | null;
  best_streak_days: number;
  total_resets: number;
  updated_at: string;
}

interface LapseRow {
  id: string;
  occurred_at: string;
  trigger: string | null;
  reframe: string | null;
  created_at: string;
}

function toPracticeState(row: PracticeStateRow): PracticeState {
  return practiceStateSchema.parse({
    currentStreakStart: row.current_streak_start,
    bestStreakDays: row.best_streak_days,
    totalResets: row.total_resets,
    updatedAt: row.updated_at,
  });
}

function toLapse(row: LapseRow): Lapse {
  return lapseSchema.parse({
    id: row.id,
    occurredAt: row.occurred_at,
    trigger: row.trigger,
    reframe: row.reframe,
    createdAt: row.created_at,
  });
}

export class SqliteProgressRepository implements ProgressRepository {
  constructor(private readonly db: AppDatabase) {}

  async getPracticeState(): Promise<PracticeState> {
    const row = await this.db.getFirst<PracticeStateRow>(
      'SELECT * FROM practice_state WHERE id = 1;',
    );
    if (row) return toPracticeState(row);

    const now = new Date().toISOString();
    const seeded = practiceStateSchema.parse({
      currentStreakStart: null,
      bestStreakDays: 0,
      totalResets: 0,
      updatedAt: now,
    });
    await this.db.run(
      `INSERT OR IGNORE INTO practice_state
         (id, current_streak_start, best_streak_days, total_resets, updated_at)
       VALUES (1, ?, ?, ?, ?);`,
      [seeded.currentStreakStart, seeded.bestStreakDays, seeded.totalResets, now],
    );
    return seeded;
  }

  async savePracticeState(state: PracticeState): Promise<void> {
    const next = practiceStateSchema.parse(state);
    await this.db.run(
      `UPDATE practice_state SET
         current_streak_start = ?,
         best_streak_days = ?,
         total_resets = ?,
         updated_at = ?
       WHERE id = 1;`,
      [next.currentStreakStart, next.bestStreakDays, next.totalResets, next.updatedAt],
    );
  }

  async listLapses(limit = 100): Promise<Lapse[]> {
    const rows = await this.db.getAll<LapseRow>(
      'SELECT * FROM lapses ORDER BY occurred_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toLapse);
  }

  async addLapse(lapse: Lapse): Promise<void> {
    const next = lapseSchema.parse(lapse);
    await this.db.run(
      `INSERT INTO lapses (id, occurred_at, trigger, reframe, created_at)
       VALUES (?, ?, ?, ?, ?);`,
      [next.id, next.occurredAt, next.trigger, next.reframe, next.createdAt],
    );
  }

  async lapseCount(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>('SELECT COUNT(*) AS n FROM lapses;');
    return row?.n ?? 0;
  }
}
