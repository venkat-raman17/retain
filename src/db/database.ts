/**
 * The database port. Repositories depend on this narrow interface, never on
 * `expo-sqlite` directly. That keeps SQLite at the very edge of the app and
 * makes the data layer swappable and testable (see `src/testing`).
 *
 * The shape intentionally mirrors `expo-sqlite`'s async API so the adapter in
 * `client.ts` is a thin pass-through.
 */
export type SqlValue = string | number | null;
export type SqlParams = SqlValue[];

export interface RunResult {
  changes: number;
  lastInsertRowId: number;
}

export interface AppDatabase {
  /** Execute one or more statements with no result (DDL, pragmas). */
  execute(sql: string): Promise<void>;
  /** Execute a write and return affected-row metadata. */
  run(sql: string, params?: SqlParams): Promise<RunResult>;
  /** First matching row, or null. */
  getFirst<T>(sql: string, params?: SqlParams): Promise<T | null>;
  /** All matching rows. */
  getAll<T>(sql: string, params?: SqlParams): Promise<T[]>;
  /** Run `work` inside a transaction, rolling back if it throws. */
  transaction(work: () => Promise<void>): Promise<void>;
}
