import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

import { AppText } from './text';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function AppTextInput({ label, error, style, multiline, ...rest }: AppTextInputProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" color="secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            backgroundColor: colors.surfaceOverlay,
            borderColor: colors.border,
          },
          multiline ? styles.multiline : null,
          error ? { borderColor: colors.support } : null,
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color="support">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.sm },
  input: {
    fontSize: theme.typography.size.body,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
