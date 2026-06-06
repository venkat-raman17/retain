import { z } from 'zod';

import { triggerTypeSchema } from '@/features/pause/domain/urge-log';
import { createId, type Clock } from '@/shared/lib';

/**
 * A lapse record is recovery and learning, never punishment. The optional fields
 * exist to turn the moment into insight (state before, the lie the urge told,
 * the next clean action) — see docs/CONTENT_SAFETY.md.
 */
export const lapseRecordSchema = z.object({
  id: z.string().min(1),
  occurredAt: z.string().datetime(),
  triggerType: triggerTypeSchema.nullable(),
  stateBefore: z.string().max(2000).nullable(),
  lesson: z.string().max(2000).nullable(),
  nextCleanAction: z.string().max(2000).nullable(),
  shameSpiralInterrupted: z.boolean(),
  note: z.string().max(2000).nullable(),
});
export type LapseRecord = z.infer<typeof lapseRecordSchema>;

export const lapseRecordDraftSchema = z.object({
  triggerType: triggerTypeSchema.nullable().default(null),
  stateBefore: z.string().trim().max(2000).nullable().default(null),
  lesson: z.string().trim().max(2000).nullable().default(null),
  nextCleanAction: z.string().trim().max(2000).nullable().default(null),
  shameSpiralInterrupted: z.boolean().default(false),
  note: z.string().trim().max(2000).nullable().default(null),
});
export type LapseRecordDraft = z.input<typeof lapseRecordDraftSchema>;

export function createLapseRecord(draft: LapseRecordDraft, clock: Clock): LapseRecord {
  const parsed = lapseRecordDraftSchema.parse(draft);
  return lapseRecordSchema.parse({
    id: createId(),
    occurredAt: clock.now().toISOString(),
    ...parsed,
  });
}
