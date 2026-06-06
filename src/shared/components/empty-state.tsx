import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { AppButton } from './button';
import { AppText } from './text';

export interface AppEmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AppEmptyState({ title, message, actionLabel, onAction }: AppEmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      <AppText variant="body" color="muted" align="center">
        {message}
      </AppText>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xxxl,
  },
});
