import { z } from 'zod';

import type { Clock } from '@/shared/lib';
import { createId } from '@/shared/lib';

/**
 * A lapse is a recovery and learning record, not a punishment. The optional
 * `trigger` and `reframe` fields exist to turn the moment into insight: what
 * preceded it, and how it is reframed going forward.
 */
export const lapseSchema = z.object({
  id: z.string().min(1),
  occurredAt: z.string().datetime(),
  trigger: z.string().max(500).nullable(),
  reframe: z.string().max(1000).nullable(),
  createdAt: z.string().datetime(),
});
export type Lapse = z.infer<typeof lapseSchema>;

export const lapseDraftSchema = z.object({
  trigger: z.string().trim().max(500).nullable().default(null),
  reframe: z.string().trim().max(1000).nullable().default(null),
});
export type LapseDraft = z.input<typeof lapseDraftSchema>;

export function createLapse(draft: LapseDraft, clock: Clock): Lapse {
  const parsed = lapseDraftSchema.parse(draft);
  const now = clock.now().toISOString();
  return lapseSchema.parse({
    id: createId(),
    occurredAt: now,
    trigger: parsed.trigger,
    reframe: parsed.reframe,
    createdAt: now,
  });
}
