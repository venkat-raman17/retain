import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

export interface AppIconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  accessibilityLabel: string;
  /** Visual size of the hit area. Default: 32. */
  size?: number;
}

/**
 * A minimal circular pressable for icon actions (no label).
 * Used for the theme picker trigger on the path screen.
 */
export function AppIconButton({
  children,
  accessibilityLabel,
  size = 32,
  ...rest
}: AppIconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        pressed ? { backgroundColor: colors.surfaceRaised } : null,
      ]}
      {...rest}
    >
      <View style={styles.inner}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
  inner: { alignItems: 'center', justifyContent: 'center' },
});
