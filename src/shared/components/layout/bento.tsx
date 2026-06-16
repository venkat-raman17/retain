import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';

export interface BentoProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface BentoItemProps {
  /** 1 = half-width tile, 2 = full-width tile. */
  span?: 1 | 2;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * An asymmetric mosaic grid. Children are `BentoItem`s with a `span` of 1
 * (half-width) or 2 (full-width) that wrap into rows. Breaks the uniform
 * card-stack into a varied layout (Forge categories, Progress insights).
 */
export function Bento({ children, style }: BentoProps) {
  return <View style={[styles.grid, style]}>{children}</View>;
}

export function BentoItem({ span = 1, children, style }: BentoItemProps) {
  return <View style={[styles.item, span === 2 ? styles.span2 : styles.span1, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  item: { minWidth: 0 },
  // flexGrow lets two half tiles expand to fill the row once the gap is subtracted.
  span1: { flexBasis: '46%', flexGrow: 1 },
  span2: { flexBasis: '100%', flexGrow: 1 },
});
