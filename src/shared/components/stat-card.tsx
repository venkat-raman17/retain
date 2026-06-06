import { StyleSheet, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';

import { AppCard } from './card';
import { useCountUp } from './motion';
import { AppText, type TextColor } from './text';

export interface AppStatCardProps {
  label: string;
  value: string;
  valueColor?: TextColor;
  style?: ViewStyle;
}

export function AppStatCard({ label, value, valueColor = 'energy', style }: AppStatCardProps) {
  // Whole-number stats count up on appear; anything else (e.g. "3d", "—") is static.
  const numeric = /^\d+$/.test(value) ? Number.parseInt(value, 10) : null;

  return (
    <AppCard style={[styles.card, style]}>
      {numeric !== null ? (
        <CountUpValue value={numeric} color={valueColor} />
      ) : (
        <AppText variant="display" color={valueColor} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </AppText>
      )}
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>
        {label}
      </AppText>
    </AppCard>
  );
}

function CountUpValue({ value, color }: { value: number; color: TextColor }) {
  const display = useCountUp(value);
  return (
    <AppText variant="display" color={color} numberOfLines={1} adjustsFontSizeToFit>
      {display.toString()}
    </AppText>
  );
}

const styles = StyleSheet.create({
  card: { gap: theme.spacing.xs },
});
