import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

/**
 * A boundary is a personal commitment the user defines (e.g. "phone stays out of
 * the bedroom"). The `boundaries` table already exists in the schema; a
 * `BoundaryRepository` is the next extension point for this feature.
 */
export const boundarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(1000),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Boundary = z.infer<typeof boundarySchema>;

export const boundaryDraftSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).default(''),
});
export type BoundaryDraft = z.input<typeof boundaryDraftSchema>;

export function createBoundary(draft: BoundaryDraft, clock: Clock): Boundary {
  const parsed = boundaryDraftSchema.parse(draft);
  return boundarySchema.parse({
    id: createId(),
    title: parsed.title,
    description: parsed.description,
    isActive: true,
    createdAt: clock.now().toISOString(),
  });
}
