import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

export function Divider({ inset = false }: { inset?: boolean }) {
  return <View style={[styles.divider, inset ? styles.inset : null]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  inset: { marginHorizontal: theme.spacing.lg },
});
