import { useEffect, useState } from 'react';
import { Easing, runOnJS, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks';

/**
 * Animates an integer from its previous value up to `value` (from 0 on first
 * mount), returning the current rounded number to render. The classic premium
 * "count-up" for stat tiles. Snaps straight to the value under Reduce Motion.
 */
export function useCountUp(value: number, duration = 800): number {
  const reduceMotion = useReducedMotion();
  const animated = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Under Reduce Motion we return `value` directly (below), so no animation
    // or state update is needed here.
    if (reduceMotion) return;
    animated.set(withTiming(value, { duration, easing: Easing.out(Easing.cubic) }));
  }, [value, duration, reduceMotion, animated]);

  useDerivedValue(() => {
    runOnJS(setDisplay)(Math.round(animated.get()));
  });

  return reduceMotion ? value : display;
}
