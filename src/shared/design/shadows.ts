import type { ViewStyle } from 'react-native';

/** Elevation shadows. Soft and dark — this is a calm, monastic surface. */
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const satisfies Record<string, ViewStyle>;
