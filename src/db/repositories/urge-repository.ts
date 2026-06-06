import { urgeLogSchema, type UrgeLog } from '@/features/pause/domain/urge-log';

import type { AppDatabase } from '../database';

export interface UrgeRepository {
  add(log: UrgeLog): Promise<void>;
  list(limit?: number): Promise<UrgeLog[]>;
  count(): Promise<number>;
  mostCommonTrigger(): Promise<string | null>;
}

interface UrgeRow {
  id: string;
  occurred_at: string;
  trigger_type: string;
  intensity_before: number;
  intensity_after: number | null;
  completed_pause_timer_seconds: number | null;
  selected_response: string | null;
  note: string | null;
}

function toLog(row: UrgeRow): UrgeLog {
  return urgeLogSchema.parse({
    id: row.id,
    occurredAt: row.occurred_at,
    triggerType: row.trigger_type,
    intensityBefore: row.intensity_before,
    intensityAfter: row.intensity_after,
    completedPauseTimerSeconds: row.completed_pause_timer_seconds,
    selectedResponse: row.selected_response,
    note: row.note,
  });
}

export class SqliteUrgeRepository implements UrgeRepository {
  constructor(private readonly db: AppDatabase) {}

  async add(log: UrgeLog): Promise<void> {
    await this.db.run(
      `INSERT INTO urge_logs
         (id, occurred_at, trigger_type, intensity_before, intensity_after,
          completed_pause_timer_seconds, selected_response, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        log.id,
        log.occurredAt,
        log.triggerType,
        log.intensityBefore,
        log.intensityAfter,
        log.completedPauseTimerSeconds,
        log.selectedResponse,
        log.note,
      ],
    );
  }

  async list(limit = 100): Promise<UrgeLog[]> {
    const rows = await this.db.getAll<UrgeRow>(
      'SELECT * FROM urge_logs ORDER BY occurred_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toLog);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>('SELECT COUNT(*) AS n FROM urge_logs;');
    return row?.n ?? 0;
  }

  async mostCommonTrigger(): Promise<string | null> {
    const row = await this.db.getFirst<{ trigger_type: string }>(
      'SELECT trigger_type FROM urge_logs GROUP BY trigger_type ORDER BY COUNT(*) DESC LIMIT 1;',
    );
    return row?.trigger_type ?? null;
  }
}
