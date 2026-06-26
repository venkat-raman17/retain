import type { LapseRepository, PathRepository, UserProfileRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { createLapseRecord, type LapseRecord, type LapseRecordDraft } from '../domain/lapse-record';
import { createPathEvent } from '../domain/path-event';
import type { UserProfile } from '../domain/user-profile';

/**
 * The heart of the product's stance on lapses. Recording a lapse:
 *   1. writes the lapse record (recovery + learning, never punishment),
 *   2. logs a `lapse_recorded` path event,
 *   3. clears `currentPathStartedAt` — resetting the CURRENT path only.
 *
 * `pathStartedAt` and every history table (urges, forge acts, journals, returns,
 * content progress) are deliberately left untouched. A return re-starts the path.
 */
export class LapseRecoveryService {
  constructor(
    private readonly profiles: UserProfileRepository,
    private readonly path: PathRepository,
    private readonly lapses: LapseRepository,
    private readonly clock: Clock,
  ) {}

  async recordLapse(draft: LapseRecordDraft): Promise<LapseRecord> {
    const record = createLapseRecord(draft, this.clock);
    await this.lapses.add(record);
    await this.path.addEvent(createPathEvent('lapse_recorded', this.clock));
    await this.profiles.update({ currentPathStartedAt: null });
    return record;
  }

  async recordReturn(): Promise<UserProfile> {
    const now = this.clock.now().toISOString();
    // A return restarts the run at day 1, so the start-day offset resets — every
    // arc is walkable again and no honors should stay hidden.
    const profile = await this.profiles.update({ currentPathStartedAt: now, startDayOffset: 0 });
    await this.path.addEvent(createPathEvent('return_recorded', this.clock));
    return profile;
  }
}
