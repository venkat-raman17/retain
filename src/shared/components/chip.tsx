import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/shared/design';
import { haptics } from '@/shared/lib';
import { useTheme } from '@/shared/hooks/use-theme';

import { AppText, type TextColor } from './text';

export type ChipTone = 'neutral' | 'energy' | 'accent' | 'support';

export interface AppChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
}

export function AppChip({ label, selected = false, onPress, tone = 'neutral', style }: AppChipProps) {
  const { colors } = useTheme();

  const toneMap: Record<ChipTone, { bg: string; border: string; text: TextColor }> = {
    neutral: { bg: colors.surfaceOverlay, border: colors.borderStrong, text: 'secondary' },
    energy: { bg: colors.primarySoft, border: colors.primary, text: 'energy' },
    accent: { bg: colors.accentSoft, border: colors.accent, text: 'accent' },
    support: { bg: colors.supportSoft, border: colors.support, text: 'support' },
  };

  const tone_ = toneMap[tone];
  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: selected ? tone_.bg : 'transparent',
          borderColor: selected ? tone_.border : colors.border,
        },
        style,
      ]}
    >
      <AppText variant="label" color={selected ? tone_.text : 'secondary'}>
        {label}
      </AppText>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
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
