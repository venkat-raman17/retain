import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { theme } from '@/shared/design';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'energy'
  | 'accent'
  | 'support'
  | 'calm'
  | 'onPrimary';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof theme.typography.weight;
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
}

const colorMap: Record<TextColor, string> = {
  primary: theme.colors.textPrimary,
  secondary: theme.colors.textSecondary,
  muted: theme.colors.textMuted,
  energy: theme.colors.primary,
  accent: theme.colors.accent,
  support: theme.colors.support,
  calm: theme.colors.calm,
  onPrimary: theme.colors.onPrimary,
};

/**
 * The single text primitive for the app. Screens never use raw `<Text>` so that
 * typography, color, and spacing stay consistent and centrally controllable.
 */
export function AppText({
  variant = 'body',
  color = 'primary',
  weight,
  align,
  uppercase = false,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[
        styles[variant],
        { color: colorMap[color] },
        weight ? { fontWeight: theme.typography.weight[weight] } : null,
        align ? { textAlign: align } : null,
        uppercase ? styles.uppercase : null,
        style,
      ]}
      {...rest}
    />
  );
}

const t = theme.typography;

const styles = StyleSheet.create({
  display: { fontSize: t.size.display, lineHeight: t.lineHeight.display, fontWeight: t.weight.bold },
  title: { fontSize: t.size.title, lineHeight: t.lineHeight.title, fontWeight: t.weight.bold },
  heading: {
    fontSize: t.size.heading,
    lineHeight: t.lineHeight.heading,
    fontWeight: t.weight.semibold,
  },
  subheading: {
    fontSize: t.size.subheading,
    lineHeight: t.lineHeight.subheading,
    fontWeight: t.weight.semibold,
  },
  body: { fontSize: t.size.body, lineHeight: t.lineHeight.body, fontWeight: t.weight.regular },
  label: { fontSize: t.size.label, lineHeight: t.lineHeight.label, fontWeight: t.weight.medium },
  caption: {
    fontSize: t.size.caption,
    lineHeight: t.lineHeight.caption,
    fontWeight: t.weight.regular,
  },
  uppercase: { textTransform: 'uppercase', letterSpacing: t.letterSpacing.wider },
});
