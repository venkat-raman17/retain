import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Tracks the OS "Reduce Motion" accessibility setting, reactively. Motion
 * primitives consult this to degrade gracefully — no press-spring, no entrance
 * slide — for users who have asked the system to minimize animation.
 *
 * (We deliberately don't use Reanimated's `useReducedMotion` so the behavior is
 * identical under the Jest mock, which doesn't implement that hook.)
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
