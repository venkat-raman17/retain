import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { theme } from '@/shared/design';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'label'
  | 'caption'
  | 'seal';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'energy'
  | 'accent'
  | 'support'
  | 'ember'
  | 'calm'
  | 'success'
  | 'warning'
  | 'danger'
  | 'gold'
  | 'onPrimary'
  | 'ink'
  | 'inkMuted';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof theme.typography.weight;
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
}

/**
 * Color names resolve to readable tones for their context. Base state tones
 * (`danger`/`success`/`warning`) are fills, so the *text* names map to their
 * lighter `*Text` siblings; `ink`/`inkMuted` are for text on parchment cards.
 */
const colorMap: Record<TextColor, string> = {
  primary: theme.colors.textPrimary,
  secondary: theme.colors.textSecondary,
  muted: theme.colors.textMuted,
  energy: theme.colors.primary,
  accent: theme.colors.accentText,
  support: theme.colors.support,
  ember: theme.colors.ember,
  calm: theme.colors.successText,
  success: theme.colors.successText,
  warning: theme.colors.warningText,
  danger: theme.colors.dangerText,
  gold: theme.colors.gold,
  onPrimary: theme.colors.onPrimary,
  ink: theme.colors.parchmentText,
  inkMuted: theme.colors.parchmentMuted,
};

/**
 * The single text primitive for the app. Screens never use raw `<Text>` so that
 * typography, color, and spacing stay consistent and centrally controllable.
 *
 * Ceremonial variants (display/heading/title/seal) are set in the serif; reading
 * variants (subheading/body/label/caption) use the sans for legibility.
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
const ceremony = t.family.ceremony;
const reading = t.family.reading;

const styles = StyleSheet.create({
  display: {
    fontFamily: ceremony,
    fontSize: t.size.display,
    lineHeight: t.lineHeight.display,
    fontWeight: t.weight.bold,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  title: {
    fontFamily: ceremony,
    fontSize: t.size.title,
    lineHeight: t.lineHeight.title,
    fontWeight: t.weight.bold,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  heading: {
    fontFamily: ceremony,
    fontSize: t.size.heading,
    lineHeight: t.lineHeight.heading,
    fontWeight: t.weight.semibold,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  subheading: {
    fontFamily: reading,
    fontSize: t.size.subheading,
    lineHeight: t.lineHeight.subheading,
    fontWeight: t.weight.semibold,
  },
  body: {
    fontFamily: reading,
    fontSize: t.size.body,
    lineHeight: t.lineHeight.body,
    fontWeight: t.weight.regular,
  },
  label: {
    fontFamily: reading,
    fontSize: t.size.label,
    lineHeight: t.lineHeight.label,
    fontWeight: t.weight.medium,
  },
  caption: {
    fontFamily: reading,
    fontSize: t.size.caption,
    lineHeight: t.lineHeight.caption,
    fontWeight: t.weight.regular,
  },
  /** Short, mantra-like closing line — engraved feel, serif with wide tracking. */
  seal: {
    fontFamily: ceremony,
    fontSize: t.size.seal,
    lineHeight: t.lineHeight.seal,
    fontWeight: t.weight.semibold,
    letterSpacing: t.letterSpacing.wider,
    fontStyle: 'italic',
  },
  uppercase: { textTransform: 'uppercase', letterSpacing: t.letterSpacing.wider },
});
