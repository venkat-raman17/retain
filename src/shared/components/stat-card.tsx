import { StyleSheet, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';

import { AppCard } from './card';
import { AppText, type TextColor } from './text';

export interface AppStatCardProps {
  label: string;
  value: string;
  valueColor?: TextColor;
  style?: ViewStyle;
}

export function AppStatCard({ label, value, valueColor = 'energy', style }: AppStatCardProps) {
  return (
    <AppCard style={[styles.card, style]}>
      <AppText variant="display" color={valueColor} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>
        {label}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.spacing.xs },
});
