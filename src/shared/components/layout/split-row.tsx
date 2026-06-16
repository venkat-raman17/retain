import { Children, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';

export interface SplitRowProps {
  children: ReactNode;
  /** Gap between columns. Defaults to `spacing.md`. */
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Lays its direct children out as equal-width columns in a row — the two-up
 * pattern hand-rolled across path/chamber/boundaries, extracted once. Each child
 * gets `flex: 1`.
 */
export function SplitRow({ children, gap = theme.spacing.md, style }: SplitRowProps) {
  return (
    <View style={[styles.row, { gap }, style]}>
      {Children.map(children, (child) => (
        <View style={styles.col}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  col: { flex: 1, minWidth: 0 },
});
