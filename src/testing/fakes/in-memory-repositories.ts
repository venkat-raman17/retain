import type { JournalRepository, ProgressRepository, Repositories, SettingsRepository } from '@/db';
import type { JournalEntry } from '@/features/journal/domain/journal-entry';
import { lapseSchema, type Lapse } from '@/features/path/domain/lapse';
import { practiceStateSchema, type PracticeState } from '@/features/path/domain/practice-state';
import {
  appSettingsSchema,
  DEFAULT_SETTINGS,
  type AppSettings,
  type AppSettingsPatch,
} from '@/features/settings/domain/settings';

/**
 * In-memory implementations of the repository ports. They let services, hooks,
 * and screens be tested without a native SQLite database — the same interfaces,
 * backed by plain JavaScript collections.
 */

const EPOCH = new Date(0).toISOString();

class InMemoryJournalRepository implements JournalRepository {
  private readonly entries = new Map<string, JournalEntry>();

  async list(limit = 100): Promise<JournalEntry[]> {
    return [...this.entries.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  async getById(id: string): Promise<JournalEntry | null> {
    return this.entries.get(id) ?? null;
  }
  async save(entry: JournalEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }
  async remove(id: string): Promise<void> {
    this.entries.delete(id);
  }
  async count(): Promise<number> {
    return this.entries.size;
  }
}

class InMemorySettingsRepository implements SettingsRepository {
  private value: AppSettings = appSettingsSchema.parse({ ...DEFAULT_SETTINGS, updatedAt: EPOCH });

  async get(): Promise<AppSettings> {
    return this.value;
  }
  async update(patch: AppSettingsPatch): Promise<AppSettings> {
    this.value = appSettingsSchema.parse({
      ...this.value,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return this.value;
  }
}

class InMemoryProgressRepository implements ProgressRepository {
  private state: PracticeState = practiceStateSchema.parse({
    currentStreakStart: null,
    bestStreakDays: 0,
    totalResets: 0,
    updatedAt: EPOCH,
  });
  private readonly lapses: Lapse[] = [];

  async getPracticeState(): Promise<PracticeState> {
    return this.state;
  }
  async savePracticeState(state: PracticeState): Promise<void> {
    this.state = practiceStateSchema.parse(state);
  }
  async listLapses(limit = 100): Promise<Lapse[]> {
    return this.lapses.slice(0, limit);
  }
  async addLapse(lapse: Lapse): Promise<void> {
    this.lapses.unshift(lapseSchema.parse(lapse));
  }
  async lapseCount(): Promise<number> {
    return this.lapses.length;
  }
}

export function createFakeRepositories(): Repositories {
  return {
    journal: new InMemoryJournalRepository(),
    settings: new InMemorySettingsRepository(),
    progress: new InMemoryProgressRepository(),
  };
}
