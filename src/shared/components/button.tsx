import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/shared/design';

import { AppText, type TextColor } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'support';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const containerVariant: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.surfaceOverlay, borderColor: theme.colors.borderStrong },
  ghost: { backgroundColor: 'transparent' },
  support: { backgroundColor: theme.colors.supportSoft, borderColor: theme.colors.support },
};

const labelColor: Record<ButtonVariant, TextColor> = {
  primary: 'onPrimary',
  secondary: 'primary',
  ghost: 'secondary',
  support: 'support',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled === true || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        containerVariant[variant],
        fullWidth ? styles.fullWidth : null,
        pressed ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={theme.colors.textPrimary} />
        ) : (
          <AppText variant="label" weight="semibold" color={labelColor[variant]}>
            {label}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
  lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl },
  content: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.4 },
});
