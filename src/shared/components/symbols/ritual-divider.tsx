import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { theme } from '@/shared/design';

interface RitualDividerProps {
  color?: string;
}

/** ──── ◆ ──── — a slim ritual divider between sections. */
export function RitualDivider({ color = theme.colors.border }: RitualDividerProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: color }]} />
      <Svg width={12} height={16} viewBox="0 0 12 16" fill="none">
        <Path
          d="M 6 2 L 10 8 L 6 14 L 2 8 Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </Svg>
      <View style={[styles.line, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
