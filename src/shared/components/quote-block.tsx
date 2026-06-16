import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

import { AppText } from './text';

export interface AppQuoteBlockProps {
  quote: string;
  attribution?: string;
}

/** A passage or vow, set apart with an ember rule. */
export function AppQuoteBlock({ quote, attribution }: AppQuoteBlockProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { backgroundColor: colors.primary }]} />
      <View style={styles.body}>
        <AppText variant="subheading" color="energy">
          {`“${quote}”`}
        </AppText>
        {attribution ? (
          <AppText variant="caption" color="muted">
            {attribution}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: theme.spacing.md },
  bar: { width: 3, borderRadius: theme.radii.pill },
  body: { flex: 1, gap: theme.spacing.xs },
});
