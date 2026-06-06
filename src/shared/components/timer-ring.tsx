import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { AppText } from './text';

export interface AppTimerRingProps {
  /** Progress from 0 to 1. */
  progress: number;
  size?: number;
  label: string;
  sublabel?: string;
}

/**
 * A dependency-free progress ring: a static circle with an orbiting indicator
 * dot driven by `progress`. Used by the Pause breathing timer.
 */
export function AppTimerRing({ progress, size = 220, label, sublabel }: AppTimerRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const angle = clamped * 360;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${angle}deg` }] }]}
      >
        <View style={[styles.indicator, { left: size / 2 - 5 }]} />
      </View>
      <View style={styles.center}>
        <AppText variant="display" color="energy">
          {label}
        </AppText>
        {sublabel ? (
          <AppText variant="caption" color="muted" uppercase>
            {sublabel}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    top: -6,
    width: 10,
    height: 10,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
  },
  center: { alignItems: 'center', gap: theme.spacing.xs },
});
