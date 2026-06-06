import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';

import { AppText, type TextColor } from './text';

export type ChipTone = 'neutral' | 'energy' | 'accent' | 'support';

export interface AppChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
}

const toneMap: Record<ChipTone, { bg: string; border: string; text: TextColor }> = {
  neutral: { bg: theme.colors.surfaceOverlay, border: theme.colors.borderStrong, text: 'secondary' },
  energy: { bg: theme.colors.primarySoft, border: theme.colors.primary, text: 'energy' },
  accent: { bg: theme.colors.accentSoft, border: theme.colors.accent, text: 'accent' },
  support: { bg: theme.colors.supportSoft, border: theme.colors.support, text: 'support' },
};

export function AppChip({ label, selected = false, onPress, tone = 'neutral', style }: AppChipProps) {
  const colors = toneMap[tone];
  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.bg : 'transparent',
          borderColor: selected ? colors.border : theme.colors.border,
        },
        style,
      ]}
    >
      <AppText variant="label" color={selected ? colors.text : 'secondary'}>
        {label}
      </AppText>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
});
