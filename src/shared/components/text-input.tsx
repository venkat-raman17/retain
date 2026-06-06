import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { theme } from '@/shared/design';

import { AppText } from './text';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function AppTextInput({ label, error, style, multiline, ...rest }: AppTextInputProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" color="secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        multiline={multiline}
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          error ? styles.inputError : null,
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
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    backgroundColor: theme.colors.surfaceOverlay,
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  inputError: { borderColor: theme.colors.support },
});
