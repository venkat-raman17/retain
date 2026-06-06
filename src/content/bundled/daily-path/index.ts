import { days01to15 } from './days-01-15';
import { days16to30 } from './days-16-30';

export const dailyPathContent = [...days01to15, ...days16to30] as const;
