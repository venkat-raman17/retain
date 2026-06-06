import { createLogger } from '@/shared/lib';

const log = createLogger('db');

/**
 * Map raw SQLite rows through a parser, dropping (and logging) any row that fails
 * validation instead of letting it reject the whole query.
 *
 * A single malformed row — e.g. one that predates a schema change — should degrade
 * a list, never crash the feature reading it. This keeps the local-first app usable
 * and surfaces the offending row in dev logs so it can be diagnosed and migrated.
 */
export function parseRows<Row, T>(table: string, rows: Row[], parse: (row: Row) => T): T[] {
  const parsed: T[] = [];
  for (const row of rows) {
    try {
      parsed.push(parse(row));
    } catch (error) {
      log.warn(`Skipped malformed ${table} row`, error);
    }
  }
  return parsed;
}
