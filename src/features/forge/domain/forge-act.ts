import { z } from 'zod';

import { createId, type Clock } from '@/shared/lib';

export const FORGE_CATEGORIES = [
  'body',
  'mind',
  'spirit',
  'order',
  'creation',
  'brotherhood',
] as const;
export const forgeCategorySchema = z.enum(FORGE_CATEGORIES);
export type ForgeCategory = z.infer<typeof forgeCategorySchema>;

/** Canonical display labels for the six forge directions. The single source of truth. */
export const FORGE_CATEGORY_LABELS: Record<ForgeCategory, string> = {
  body: 'Body',
  mind: 'Mind',
  spirit: 'Spirit',
  order: 'Order',
  creation: 'Creation',
  brotherhood: 'Brotherhood',
};

export const forgeActSchema = z.object({
  id: z.string().min(1),
  occurredAt: z.string().datetime(),
  category: forgeCategorySchema,
  title: z.string().min(1).max(200),
  durationMinutes: z.number().int().min(0).max(1440).nullable(),
  linkedUrgeId: z.string().min(1).nullable(),
  note: z.string().max(2000).nullable(),
});
export type ForgeAct = z.infer<typeof forgeActSchema>;

export const forgeActDraftSchema = z.object({
  category: forgeCategorySchema,
  title: z.string().trim().min(1, 'Name the act first.').max(200),
  durationMinutes: z.number().int().min(0).max(1440).nullable().default(null),
  linkedUrgeId: z.string().min(1).nullable().default(null),
  note: z.string().trim().max(2000).nullable().default(null),
});
export type ForgeActDraft = z.input<typeof forgeActDraftSchema>;

export function createForgeAct(draft: ForgeActDraft, clock: Clock): ForgeAct {
  const parsed = forgeActDraftSchema.parse(draft);
  return forgeActSchema.parse({
    id: createId(),
    occurredAt: clock.now().toISOString(),
    ...parsed,
  });
}
