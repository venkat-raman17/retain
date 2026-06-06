import { StyleSheet } from 'react-native';

import { theme } from '@/shared/design';

import { AppCard } from './card';
import { AppText, type TextColor } from './text';

export interface AppStatCardProps {
  label: string;
  value: string;
  valueColor?: TextColor;
}

export function AppStatCard({ label, value, valueColor = 'energy' }: AppStatCardProps) {
  return (
    <AppCard style={styles.card}>
      <AppText variant="display" color={valueColor}>
        {value}
      </AppText>
      <AppText variant="caption" color="muted" uppercase>
        {label}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.spacing.xs },
});
