import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/shared/design';
import { haptics } from '@/shared/lib';
import { useTheme } from '@/shared/hooks/use-theme';

import { PressableScale } from './pressable-scale';
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

const labelColor: Record<ButtonVariant, TextColor> = {
  primary: 'onPrimary',
  secondary: 'energy',
  ghost: 'secondary',
  support: 'support',
};

/**
 * Buttons read like carved stone / forged metal, not app-store candy:
 *   primary   → solid accent fill with dark engraved label.
 *   secondary → an iron-edged stone slab with an energy label.
 *   ghost     → bare stone (text only).
 *   support   → a soft accent panel for pause/urge moments.
 */
export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style: styleProp,
  onPress,
  ...rest
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled === true || loading;

  // A weighted tap on commit: ember (primary/support) gets a light impact, the
  // iron slab a selection tick; ghost stays silent (it's the quiet way out).
  const handlePress = onPress
    ? (event: GestureResponderEvent) => {
        if (variant === 'primary' || variant === 'support') haptics.impact('light');
        else if (variant === 'secondary') haptics.selection();
        onPress(event);
      }
    : onPress;

  const containerVariant: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary, borderColor: colors.borderGold },
    secondary: { backgroundColor: colors.surfaceOverlay, borderColor: colors.borderStrong },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    support: { backgroundColor: colors.supportSoft, borderColor: colors.support },
  };

  const spinnerColor: Record<ButtonVariant, string> = {
    primary: colors.onPrimary,
    secondary: colors.primary,
    ghost: colors.textSecondary,
    support: colors.support,
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={[
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        containerVariant[variant],
        fullWidth ? styles.fullWidth : null,
        styleProp ?? null,
        isDisabled ? styles.disabled : null,
      ]}
      onPress={handlePress}
      {...rest}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[colors.primaryBright, colors.primary, colors.emberMuted]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={spinnerColor[variant]} />
        ) : (
          <AppText variant="label" weight="semibold" color={labelColor[variant]} uppercase>
            {label}
          </AppText>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // clip the primary gradient to the rounded corners
  },
  md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
  lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl },
  content: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.4 },
});
