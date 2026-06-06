import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { theme } from '@/shared/design';
import { useReducedMotion } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';

import { AppText } from './text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface AppTimerRingProps {
  /** Progress from 0 to 1. */
  progress: number;
  size?: number;
  label: string;
  sublabel?: string;
}

/**
 * A progress ring drawn as an SVG arc: a quiet iron track with an ember arc that
 * animates smoothly to `progress` (sweeping clockwise from 12 o'clock). Used by
 * the Pause breathing timer. Honors Reduce Motion (snaps without animating).
 */
export function AppTimerRing({ progress, size = 220, label, sublabel }: AppTimerRingProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(1, progress));

  const animatedProgress = useSharedValue(target);

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.set(target);
      return;
    }
    animatedProgress.set(withTiming(target, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, [target, reduceMotion, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.get()),
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(target * 100) }}
      style={[styles.ring, { width: size, height: size }]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.borderStrong}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
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
  ring: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: theme.spacing.xs },
});
