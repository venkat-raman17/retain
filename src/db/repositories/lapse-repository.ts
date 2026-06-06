import { lapseRecordSchema, type LapseRecord } from '@/features/path/domain/lapse-record';

import type { AppDatabase } from '../database';

export interface LapseRepository {
  add(record: LapseRecord): Promise<void>;
  list(limit?: number): Promise<LapseRecord[]>;
  count(): Promise<number>;
}

interface LapseRow {
  id: string;
  occurred_at: string;
  trigger_type: string | null;
  state_before: string | null;
  lesson: string | null;
  next_clean_action: string | null;
  shame_spiral_interrupted: number;
  note: string | null;
}

function toRecord(row: LapseRow): LapseRecord {
  return lapseRecordSchema.parse({
    id: row.id,
    occurredAt: row.occurred_at,
    triggerType: row.trigger_type,
    stateBefore: row.state_before,
    lesson: row.lesson,
    nextCleanAction: row.next_clean_action,
    shameSpiralInterrupted: row.shame_spiral_interrupted === 1,
    note: row.note,
  });
}

export class SqliteLapseRepository implements LapseRepository {
  constructor(private readonly db: AppDatabase) {}

  async add(record: LapseRecord): Promise<void> {
    await this.db.run(
      `INSERT INTO lapse_records
         (id, occurred_at, trigger_type, state_before, lesson, next_clean_action,
          shame_spiral_interrupted, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        record.occurredAt,
        record.triggerType,
        record.stateBefore,
        record.lesson,
        record.nextCleanAction,
        record.shameSpiralInterrupted ? 1 : 0,
        record.note,
      ],
    );
  }

  async list(limit = 100): Promise<LapseRecord[]> {
    const rows = await this.db.getAll<LapseRow>(
      'SELECT * FROM lapse_records ORDER BY occurred_at DESC LIMIT ?;',
      [limit],
    );
    return rows.map(toRecord);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirst<{ n: number }>('SELECT COUNT(*) AS n FROM lapse_records;');
    return row?.n ?? 0;
  }
}
