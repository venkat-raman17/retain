import { z } from 'zod';

/**
 * Each of the 90 path days is its own archetype — a unique identity the man
 * "becomes" that day, never repeated. An archetype is referenced by a slug
 * (`arch-01`…`arch-90`, matching its day) and carries a full profile. The
 * per-day color and focal sigil are derived from the day/arc, so a profile is
 * pure copy.
 */
export const archetypeSchema = z.string().min(1);
export type Archetype = z.infer<typeof archetypeSchema>;

export const archetypeProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  essence: z.string().min(1),
  light: z.string().min(1),
  shadow: z.string().min(1),
  discipline: z.string().min(1),
  temptation: z.string().min(1),
  practice: z.string().min(1),
  lapseMedicine: z.string().min(1),
  dailyCommand: z.string().min(1),
  retainLine: z.string().min(1),
});
export type ArchetypeProfile = z.infer<typeof archetypeProfileSchema>;

export const archetypeProfilesSchema = z.array(archetypeProfileSchema).length(90);
