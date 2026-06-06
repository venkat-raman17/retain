import { days01to15 } from './days-01-15';
import { days16to30 } from './days-16-30';
import { days31to60 } from './days-31-60';
import { days61to90 } from './days-61-90';

export const dailyPathContent = [
  ...days01to15,
  ...days16to30,
  ...days31to60,
  ...days61to90,
] as const;
