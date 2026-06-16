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

import { AppText } from '../text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ARCS = 9;
const GAP_PX = 7;

export interface PathPulseProps {
  /** Current path day (1-based). */
  currentDay: number;
  /** Total days in the rite. Defaults to 90 (nine 10-day arcs). */
  totalDays?: number;
  /** The title of the current arc, shown under the day count. */
  arcTitle?: string;
  /** When false, the ring is an unlit track (path not begun). */
  running?: boolean;
  size?: number;
  /** Lit color (usually the arc tone's base). Defaults to the theme primary. */
  litColor?: string;
}

/**
 * The living progress hero: a segmented ring of nine arc-arcs around the 90-day
 * rite. Completed arcs are lit, the current arc sweeps to today's progress, and
 * future arcs stay as a quiet track. The center reads "Day N" + the arc title.
 * Replaces the 4-up stat grid as the Path focal point. Honors Reduce Motion
 * (snaps to final fill).
 */
export function PathPulse({
  currentDay,
  totalDays = 90,
  arcTitle,
  running = true,
  size = 240,
  litColor,
}: PathPulseProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();

  const lit = litColor ?? colors.primary;
  const track = colors.borderStrong;

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const sliceLen = circumference / ARCS;
  const segLen = sliceLen - GAP_PX;
  const arcLen = totalDays / ARCS;

  const currentArc = running ? Math.min(Math.max(Math.ceil(currentDay / arcLen), 1), ARCS) : 0;
  const completedArcs = Math.max(0, currentArc - 1);
  const dayWithinArc = running ? currentDay - completedArcs * arcLen : 0;
  const progressInArc = Math.max(0, Math.min(1, dayWithinArc / arcLen));

  const offsetFor = (index: number) => -(index * sliceLen + GAP_PX / 2);

  const targetLen = currentArc > 0 ? segLen * progressInArc : 0;
  const animatedLen = useSharedValue(targetLen);

  useEffect(() => {
    if (reduceMotion) {
      animatedLen.set(targetLen);
      return;
    }
    animatedLen.set(withTiming(targetLen, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [targetLen, reduceMotion, animatedLen]);

  const currentArcProps = useAnimatedProps(() => ({
    strokeDasharray: `${animatedLen.get()} ${circumference}`,
  }));

  const trackIndices = Array.from({ length: ARCS }, (_, i) => i);
  const completedIndices = Array.from({ length: completedArcs }, (_, i) => i);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: totalDays, now: running ? currentDay : 0 }}
      style={[styles.wrap, { width: size, height: size }]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track — all nine arc segments, dim. */}
        {trackIndices.map((i) => (
          <Circle
            key={`track-${i}`}
            cx={center}
            cy={center}
            r={radius}
            stroke={track}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${segLen} ${circumference}`}
            strokeDashoffset={offsetFor(i)}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
        {/* Completed arcs — fully lit. */}
        {completedIndices.map((i) => (
          <Circle
            key={`done-${i}`}
            cx={center}
            cy={center}
            r={radius}
            stroke={lit}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${segLen} ${circumference}`}
            strokeDashoffset={offsetFor(i)}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
        {/* Current arc — sweeps to today's progress. */}
        {currentArc > 0 ? (
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={lit}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDashoffset={offsetFor(currentArc - 1)}
            animatedProps={currentArcProps}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ) : null}
      </Svg>
      <View style={styles.center}>
        <AppText variant="caption" color="muted" uppercase>
          {running ? 'Day' : 'The Path'}
        </AppText>
        <AppText variant="display" style={{ color: running ? lit : colors.textMuted }}>
          {running ? currentDay.toString() : '—'}
        </AppText>
        {arcTitle ? (
          <AppText variant="caption" color="secondary" align="center" numberOfLines={1}>
            {arcTitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: theme.spacing.xs, paddingHorizontal: theme.spacing.lg },
});
