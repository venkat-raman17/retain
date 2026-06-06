import { Pressable, StyleSheet } from 'react-native';

import { theme } from '@/shared/design';

import { AppCard } from './card';
import { AppText, type TextColor } from './text';

export interface AppContentCardProps {
  eyebrow?: string;
  eyebrowColor?: TextColor;
  title: string;
  body?: string;
  onPress?: () => void;
}

/** A list-item card for bundled content (codex days, studies, rituals). */
export function AppContentCard({
  eyebrow,
  eyebrowColor = 'accent',
  title,
  body,
  onPress,
}: AppContentCardProps) {
  const card = (
    <AppCard style={styles.card}>
      {eyebrow ? (
        <AppText variant="caption" color={eyebrowColor} uppercase>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="subheading">{title}</AppText>
      {body ? (
        <AppText variant="body" color="secondary">
          {body}
        </AppText>
      ) : null}
    </AppCard>
  );

  if (!onPress) return card;
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {card}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.spacing.xs },
});
