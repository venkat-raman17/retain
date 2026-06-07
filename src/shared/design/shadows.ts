import type { ViewStyle } from 'react-native';

import { palette } from './colors';

/**
 * Elevation shadows — soft, warm, and rare.
 *
 * Manforge leans on iron borders, not heavy drop shadows. These exist for the few
 * surfaces that genuinely float (modals, the active pause card). The shadow is a
 * warm near-black so it reads as deepening stone, not a hard UI drop.
 */
export const shadows = {
  none: {},
  sm: {
    shadowColor: palette.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  md: {
    shadowColor: palette.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const satisfies Record<string, ViewStyle>;
