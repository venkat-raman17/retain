import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

/** Shared across urge logs and lapse records. */
export const TRIGGER_TYPES = [
  'lust',
  'boredom',
  'stress',
  'loneliness',
  'anger',
  'fatigue',
  'habit',
  'escapism',
  'unknown',
] as const;
export const triggerTypeSchema = z.enum(TRIGGER_TYPES);
export type TriggerType = z.infer<typeof triggerTypeSchema>;

const intensity = z.number().int().min(1).max(10);

export const urgeLogSchema = z.object({
  id: z.string().min(1),
  occurredAt: z.string().datetime(),
  triggerType: triggerTypeSchema,
  intensityBefore: intensity,
  intensityAfter: intensity.nullable(),
  completedPauseTimerSeconds: z.number().int().min(0).nullable(),
  selectedResponse: z.string().max(200).nullable(),
  note: z.string().max(2000).nullable(),
});
export type UrgeLog = z.infer<typeof urgeLogSchema>;

export const urgeLogDraftSchema = z.object({
  triggerType: triggerTypeSchema.default('unknown'),
  intensityBefore: intensity,
  intensityAfter: intensity.nullable().default(null),
  completedPauseTimerSeconds: z.number().int().min(0).nullable().default(null),
  selectedResponse: z.string().trim().max(200).nullable().default(null),
  note: z.string().trim().max(2000).nullable().default(null),
});
export type UrgeLogDraft = z.input<typeof urgeLogDraftSchema>;

export function createUrgeLog(draft: UrgeLogDraft, clock: Clock): UrgeLog {
  const parsed = urgeLogDraftSchema.parse(draft);
  return urgeLogSchema.parse({
    id: createId(),
    occurredAt: clock.now().toISOString(),
    ...parsed,
  });
}
