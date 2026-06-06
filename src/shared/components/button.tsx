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

export interface AppButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

/**
 * Buttons read like carved stone / forged metal, not app-store candy:
 *   primary   → struck aged gold with a darker gold seam, dark engraved label.
 *   secondary → an iron-edged stone slab with a gilded label.
 *   ghost     → bare stone (text only).
 *   support   → a banked ember panel for pause/urge moments.
 */
const containerVariant: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.borderGold },
  secondary: {
    backgroundColor: theme.colors.surfaceOverlay,
    borderColor: theme.colors.borderStrong,
  },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  support: { backgroundColor: theme.colors.supportSoft, borderColor: theme.colors.support },
};

const labelColor: Record<ButtonVariant, TextColor> = {
  primary: 'onPrimary',
  secondary: 'energy', // gilded label on the stone slab
  ghost: 'secondary',
  support: 'support',
};

const spinnerColor: Record<ButtonVariant, string> = {
  primary: theme.colors.onPrimary,
  secondary: theme.colors.primary,
  ghost: theme.colors.textSecondary,
  support: theme.colors.support,
};

export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style: styleProp,
  ...rest
}: AppButtonProps) {
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
        styleProp ?? null,
        pressed ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={spinnerColor[variant]} />
        ) : (
          <AppText variant="label" weight="semibold" color={labelColor[variant]} uppercase>
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
