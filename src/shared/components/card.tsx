import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { theme } from '@/shared/design';

export type CardTone = 'surface' | 'raised' | 'overlay' | 'parchment';
export type CardBorder = 'subtle' | 'strong' | 'gold' | 'ember' | 'clay' | 'paper' | 'none';

export interface AppCardProps extends ViewProps {
  children: ReactNode;
  /** Background slab. `parchment` is a warm reading surface — use `ink` text on it. */
  tone?: CardTone;
  /** Edge treatment. `gold` is ceremonial (milestones/vows); `clay` marks a lapse. */
  border?: CardBorder;
  padded?: boolean;
  /** Add a soft, warm elevation shadow (for surfaces that genuinely float). */
  elevated?: boolean;
  /** Makes the card tappable. */
  onPress?: () => void;
}

const toneColor: Record<CardTone, string> = {
  surface: theme.colors.surface,
  raised: theme.colors.surfaceRaised,
  overlay: theme.colors.surfaceOverlay,
  parchment: theme.colors.parchment,
};

const borderColor: Record<CardBorder, string> = {
  subtle: theme.colors.border,
  strong: theme.colors.borderStrong,
  gold: theme.colors.borderGold,
  ember: theme.colors.support,
  clay: theme.colors.danger,
  paper: theme.colors.parchmentBorder,
  none: 'transparent',
};

/**
 * A weighty surface slab. Cards lean on a quiet iron edge rather than a heavy
 * shadow; opt into `elevated` only when a surface should float.
 */
export function AppCard({
  children,
  tone = 'raised',
  border,
  padded = true,
  elevated = false,
  onPress,
  style,
  ...rest
}: AppCardProps) {
  const resolvedBorder = border ?? (tone === 'parchment' ? 'paper' : 'subtle');
  const cardStyle = [
    styles.card,
    { backgroundColor: toneColor[tone], borderColor: borderColor[resolvedBorder] },
    padded ? styles.padded : null,
    elevated ? theme.shadows.sm : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [...cardStyle, pressed ? styles.pressed : null]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: { padding: theme.spacing.lg },
  pressed: { opacity: 0.8 },
});
