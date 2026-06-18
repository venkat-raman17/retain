import { z } from 'zod';

export const stationSchema = z.object({
  id: z.string().min(1),
  arcsCleared: z.number().int().min(0).max(9),
  title: z.string().min(1),
  description: z.string().min(1),
  sealSource: z.enum(['arc', 'semantic']),
  sealId: z.string().min(1),
});
export type Station = z.infer<typeof stationSchema>;

export const stationsSchema = z.array(stationSchema).length(10);
