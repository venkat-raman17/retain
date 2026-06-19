import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { fontFamilyFor, theme, type FontFamilyName, type FontWeightName } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

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
/**
 * Each variant's typeface + default weight. The concrete bundled family
 * (e.g. `Cinzel_700Bold`) is resolved at render via `fontFamilyFor`, since each
 * Google-Font weight is a distinct family name — `fontWeight` alone won't pick
 * the right TTF on Android. The `weight` prop overrides the default per variant.
 */
const VARIANT_FONT: Record<TextVariant, { family: FontFamilyName; weight: FontWeightName }> = {
  display: { family: 'ceremony', weight: 'bold' },
  title: { family: 'ceremony', weight: 'bold' },
  heading: { family: 'ceremony', weight: 'semibold' },
  subheading: { family: 'reading', weight: 'semibold' },
  body: { family: 'reading', weight: 'regular' },
  label: { family: 'reading', weight: 'medium' },
  caption: { family: 'reading', weight: 'regular' },
  seal: { family: 'ceremony', weight: 'semibold' },
};

export function AppText({
  variant = 'body',
  color = 'primary',
  weight,
  align,
  uppercase = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();

  const colorMap: Record<TextColor, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    energy: colors.primaryBright,
    accent: colors.accentText,
    support: colors.support,
    ember: colors.ember,
    calm: colors.successText,
    success: colors.successText,
    warning: colors.warningText,
    danger: colors.dangerText,
    gold: colors.gold,
    onPrimary: colors.onPrimary,
    ink: colors.parchmentText,
    inkMuted: colors.parchmentMuted,
  };

  const variantFont = VARIANT_FONT[variant];
  const fontFamily = fontFamilyFor(variantFont.family, weight ?? variantFont.weight);

  return (
    <Text
      // Cap font scaling so the fixed per-variant line heights don't clip or
      // overlap at extreme system text sizes; still generous for low vision.
      // Overridable per-instance via `rest`.
      maxFontSizeMultiplier={1.6}
      style={[
        styles[variant],
        { fontFamily, color: colorMap[color] },
        align ? { textAlign: align } : null,
        uppercase ? styles.uppercase : null,
        style,
      ]}
      {...rest}
    />
  );
}

const t = theme.typography;

// Font family + weight are resolved dynamically (see VARIANT_FONT) so the
// correct per-weight TTF is selected; styles below carry only metrics.
const styles = StyleSheet.create({
  display: {
    fontSize: t.size.display,
    lineHeight: t.lineHeight.display,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  title: {
    fontSize: t.size.title,
    lineHeight: t.lineHeight.title,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  heading: {
    fontSize: t.size.heading,
    lineHeight: t.lineHeight.heading,
    letterSpacing: t.letterSpacing.ceremonial,
  },
  subheading: {
    fontSize: t.size.subheading,
    lineHeight: t.lineHeight.subheading,
  },
  body: {
    fontSize: t.size.body,
    lineHeight: t.lineHeight.body,
  },
  label: {
    fontSize: t.size.label,
    lineHeight: t.lineHeight.label,
  },
  caption: {
    fontSize: t.size.caption,
    lineHeight: t.lineHeight.caption,
  },
  /** Short, mantra-like closing line — engraved Cinzel caps with wide tracking. */
  seal: {
    fontSize: t.size.seal,
    lineHeight: t.lineHeight.seal,
    letterSpacing: t.letterSpacing.wider,
  },
  uppercase: { textTransform: 'uppercase', letterSpacing: t.letterSpacing.wider },
});
