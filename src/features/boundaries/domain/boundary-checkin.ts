import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

export const CHECKIN_STATUSES = ['kept', 'broken', 'skipped'] as const;
export const checkinStatusSchema = z.enum(CHECKIN_STATUSES);
export type CheckinStatus = z.infer<typeof checkinStatusSchema>;

export const boundaryCheckinSchema = z.object({
  id: z.string().min(1),
  boundaryId: z.string().min(1),
  checkedAt: z.string().datetime(),
  status: checkinStatusSchema,
  note: z.string().max(2000).nullable(),
});
export type BoundaryCheckin = z.infer<typeof boundaryCheckinSchema>;

export function createBoundaryCheckin(
  boundaryId: string,
  status: CheckinStatus,
  clock: Clock,
  note: string | null = null,
): BoundaryCheckin {
  return boundaryCheckinSchema.parse({
    id: createId(),
    boundaryId,
    checkedAt: clock.now().toISOString(),
    status,
    note,
  });
}
