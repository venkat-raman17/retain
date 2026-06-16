import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

export function AppDivider({ inset = false }: { inset?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.border }, inset ? styles.inset : null]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  inset: { marginHorizontal: theme.spacing.lg },
});
