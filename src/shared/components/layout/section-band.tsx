import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '@/shared/design';
import type { SurfaceTone } from '@/shared/hooks/use-surface-tone';

export interface SectionBandProps {
  /** When set, the section is tinted in this tone; omit for a plain group. */
  tone?: SurfaceTone;
  /** Use the tone's gradient instead of a flat wash. */
  gradient?: boolean;
  padded?: boolean;
  rounded?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * A tonal zone — wraps a group of content in a tinted, optionally gradient band so
 * a screen reads as 2–3 distinct color blocks instead of one flat scroll. Tints
 * come from `useSurfaceTone`, so they stay theme-correct and low-alpha.
 */
export function SectionBand({
  tone,
  gradient = false,
  padded = true,
  rounded = true,
  children,
  style,
}: SectionBandProps) {
  const shape: ViewStyle = {
    ...(rounded ? { borderRadius: theme.radii.lg } : null),
    ...(padded ? { padding: theme.spacing.lg } : null),
  };

  if (!tone) {
    return <View style={[shape, style]}>{children}</View>;
  }

  if (gradient) {
    return (
      <LinearGradient
        colors={tone.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.bordered, { borderColor: tone.border }, shape, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[styles.bordered, { backgroundColor: tone.wash, borderColor: tone.border }, shape, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bordered: { borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
});
