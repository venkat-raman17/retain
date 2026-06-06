import { z } from 'zod';

export const ARCHETYPES = [
  'monk',
  'warrior',
  'craftsman',
  'king',
  'lover',
  'pilgrim',
  'sage',
  'brother',
  'guardian',
  'builder',
  'healer',
  'sovereign',
] as const;
export const archetypeSchema = z.enum(ARCHETYPES);
export type Archetype = z.infer<typeof archetypeSchema>;

export const archetypeProfileSchema = z.object({
  id: archetypeSchema,
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

export const archetypeProfilesSchema = z.array(archetypeProfileSchema).length(12);
