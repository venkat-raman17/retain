import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks';

export interface FadeInRiseProps {
  children: ReactNode;
  /** Position in a list — each item's entrance is delayed `index * stagger` ms. */
  index?: number;
  /** Entrance duration, ms. */
  duration?: number;
  /** Per-index stagger, ms. */
  stagger?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Fades content in while it rises a few px into place (Reanimated `FadeInDown`,
 * which starts below and settles up). Stagger a list by passing `index`. Under
 * Reduce Motion it renders instantly with no transform.
 */
export function FadeInRise({
  children,
  index = 0,
  duration = 360,
  stagger = 55,
  style,
}: FadeInRiseProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(duration).delay(index * stagger)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
