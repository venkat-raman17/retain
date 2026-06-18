import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

/** Shared across urge logs and lapse records. */
export const TRIGGER_TYPES = [
  'lust',
  'loneliness',
  'boredom',
  'stress',
  'fatigue',
  'habit',
  'escapism',
  'anger',
  'unknown',
] as const;
export const triggerTypeSchema = z.enum(TRIGGER_TYPES);
export type TriggerType = z.infer<typeof triggerTypeSchema>;

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  lust: 'Lust',
  loneliness: 'Loneliness',
  boredom: 'Boredom',
  stress: 'Stress',
  fatigue: 'Fatigue',
  habit: 'Habit',
  escapism: 'Escapism',
  anger: 'Anger',
  unknown: "I don't know yet",
};

const intensity = z.number().int().transform((v) => Math.min(5, Math.max(1, v)));

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
