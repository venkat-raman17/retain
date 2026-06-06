import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

import { PressableScale } from './pressable-scale';

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
  const { colors, shadows } = useTheme();

  const toneColor: Record<CardTone, string> = {
    surface: colors.surface,
    raised: colors.surfaceRaised,
    overlay: colors.surfaceOverlay,
    parchment: colors.parchment,
  };

  const borderColor: Record<CardBorder, string> = {
    subtle: colors.border,
    strong: colors.borderStrong,
    gold: colors.borderGold,
    ember: colors.support,
    clay: colors.danger,
    paper: colors.parchmentBorder,
    none: 'transparent',
  };

  const resolvedBorder = border ?? (tone === 'parchment' ? 'paper' : 'subtle');
  // "Light from above": on default-edged dark slabs, lift just the top hairline
  // to a lighter iron. Intentional accent borders (gold/ember/clay) keep theirs.
  const topHighlight = border === undefined && tone !== 'parchment';
  const cardStyle = [
    styles.card,
    { backgroundColor: toneColor[tone], borderColor: borderColor[resolvedBorder] },
    topHighlight ? { borderTopColor: colors.borderStrong } : null,
    padded ? styles.padded : null,
    elevated ? shadows.sm : null,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} accessibilityRole="button" style={cardStyle}>
        {children}
      </PressableScale>
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
});
