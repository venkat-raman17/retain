import type { UrgeRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { createUrgeLog, type UrgeLog, type UrgeLogDraft } from '../domain/urge-log';

/**
 * Records the outcome of an urge ridden out in Pause. Celebrates command, not
 * suppression — the act of pausing is the rep, whatever the urge does next.
 */
export class PauseService {
  constructor(
    private readonly urges: UrgeRepository,
    private readonly clock: Clock,
  ) {}

  async recordUrge(draft: UrgeLogDraft): Promise<UrgeLog> {
    const log = createUrgeLog(draft, this.clock);
    await this.urges.add(log);
    return log;
  }

  listRecent(limit?: number): Promise<UrgeLog[]> {
    return this.urges.list(limit);
  }
}
