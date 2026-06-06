import type { BoundaryRepository } from '@/db';
import type { Clock } from '@/shared/lib';

import { createBoundary, type Boundary, type BoundaryDraft } from '../domain/boundary';
import { createBoundaryCheckin, type CheckinStatus } from '../domain/boundary-checkin';

export class BoundaryService {
  constructor(
    private readonly boundaries: BoundaryRepository,
    private readonly clock: Clock,
  ) {}

  listActive(): Promise<Boundary[]> {
    return this.boundaries.list(true);
  }

  async add(draft: BoundaryDraft): Promise<Boundary> {
    const boundary = createBoundary(draft, this.clock);
    await this.boundaries.save(boundary);
    return boundary;
  }

  async deactivate(id: string): Promise<void> {
    await this.boundaries.setActive(id, false, this.clock.now().toISOString());
  }

  async checkin(boundaryId: string, status: CheckinStatus, note: string | null = null): Promise<void> {
    const record = createBoundaryCheckin(boundaryId, status, this.clock, note);
    await this.boundaries.addCheckin(record);

    if (status === 'broken') {
      await this.boundaries.setActive(boundaryId, true, this.clock.now().toISOString());
    }
  }
}
