import { pathEventSchema, type PathEvent, type PathEventType } from '@/features/path/domain/path-event';

import type { AppDatabase } from '../database';

export interface PathRepository {
  addEvent(event: PathEvent): Promise<void>;
  listEvents(limit?: number): Promise<PathEvent[]>;
  countByType(type: PathEventType): Promise<number>;
}

interface PathEventRow {
  id: string;
  type: string;
  occurred_at: string;
  note: string | null;
}

function toEvent(row: PathEventRow): PathEvent {
  return pathEventSchema.parse({
    id: row.id,
    type: row.type,
    occurredAt: row.occurred_at,
    note: row.note,
  });
}

export class SqlitePathRepository implements PathRepository {
  constructor(private readonly db: AppDatabase) {}

  async addEvent(event: PathEvent): Promise<void> {
    await this.db.run('INSERT INTO path_events (id, type, occurred_at, note) VALUES (?, ?, ?, ?);', [
      event.id,
      event.type,
      event.occurredAt,
      event.note,
    ]);
  }

  async listEvents(limit = 200): Promise<PathEvent[]> {
    const rows = await this.db.getAll<PathEventRow>(
      'SELECT * FROM path_events ORDER BY occurred_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toEvent);
  }

  async countByType(type: PathEventType): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>(
      'SELECT COUNT(*) AS n FROM path_events WHERE type = ?;',
      [type],
    );
    return row?.n ?? 0;
  }
}
