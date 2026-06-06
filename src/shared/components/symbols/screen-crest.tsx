import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

interface ScreenCrestProps {
  children: ReactElement;
  opacity?: number;
}

/**
 * Absolutely-positioned container for a faint background sigil.
 * Wrap the target area in a `position: 'relative'` View, then place
 * ScreenCrest as the first child so the sigil sits behind the content.
 */
export function ScreenCrest({ children, opacity = 0.07 }: ScreenCrestProps) {
  return (
    <View style={[styles.crest, { opacity }]} pointerEvents="none">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  crest: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
