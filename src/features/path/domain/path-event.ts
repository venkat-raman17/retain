import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

export const PATH_EVENT_TYPES = [
  'path_started',
  'vow_changed',
  'lapse_recorded',
  'return_recorded',
  'milestone_reached',
] as const;
export const pathEventTypeSchema = z.enum(PATH_EVENT_TYPES);
export type PathEventType = z.infer<typeof pathEventTypeSchema>;

export const pathEventSchema = z.object({
  id: z.string().min(1),
  type: pathEventTypeSchema,
  occurredAt: z.string().datetime(),
  note: z.string().max(2000).nullable(),
});
export type PathEvent = z.infer<typeof pathEventSchema>;

export function createPathEvent(
  type: PathEventType,
  clock: Clock,
  note: string | null = null,
): PathEvent {
  return pathEventSchema.parse({
    id: createId(),
    type,
    occurredAt: clock.now().toISOString(),
    note,
  });
}
