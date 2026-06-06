import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

/**
 * A boundary is a personal attention/environment commitment ("guard the gates").
 * Check-ins live in {@link ./boundary-checkin}.
 */
export const boundarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(160),
  description: z.string().max(2000).nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Boundary = z.infer<typeof boundarySchema>;

export const boundaryDraftSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().default(null),
});
export type BoundaryDraft = z.input<typeof boundaryDraftSchema>;

export function createBoundary(draft: BoundaryDraft, clock: Clock): Boundary {
  const parsed = boundaryDraftSchema.parse(draft);
  const now = clock.now().toISOString();
  return boundarySchema.parse({
    id: createId(),
    title: parsed.title,
    description: parsed.description,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
}
