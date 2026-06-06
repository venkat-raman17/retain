import { useCallback } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  /** Scale at the bottom of the press. Default 0.97 — a weighted "give", not a bounce. */
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A Pressable that springs down a touch on press and eases back on release — the
 * tactile feedback behind buttons and tappable cards. One shared value drives the
 * press: normally it scales; under the OS Reduce Motion setting it dips opacity
 * instead. The animated style rides in the style array on the animated host (so
 * Reanimated actually applies it), which is why callers pass a plain style, not a
 * `({ pressed }) => …` function.
 */
export function PressableScale({
  scaleTo = 0.97,
  style,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => {
    const p = pressed.get();
    if (reduceMotion) {
      return { opacity: 1 - p * 0.15 };
    }
    return { transform: [{ scale: 1 - p * (1 - scaleTo) }] };
  }, [reduceMotion, scaleTo]);

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      pressed.set(withTiming(1, { duration: 120, easing: Easing.out(Easing.quad) }));
      onPressIn?.(event);
    },
    [onPressIn, pressed],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      pressed.set(withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) }));
      onPressOut?.(event);
    },
    [onPressOut, pressed],
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
