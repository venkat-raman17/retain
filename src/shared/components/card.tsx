import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { theme } from '@/shared/design';

export interface CardProps extends ViewProps {
  children: ReactNode;
  tone?: 'surface' | 'raised' | 'overlay';
  padded?: boolean;
}

const toneColor = {
  surface: theme.colors.surface,
  raised: theme.colors.surfaceRaised,
  overlay: theme.colors.surfaceOverlay,
} as const;

export function Card({ children, tone = 'raised', padded = true, style, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, { backgroundColor: toneColor[tone] }, padded ? styles.padded : null, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  padded: { padding: theme.spacing.lg },
});
