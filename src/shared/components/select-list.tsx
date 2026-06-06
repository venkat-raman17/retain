import { Pressable, StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { AppText } from './text';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface AppSelectListProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

/** A single-select list of options (used by onboarding pickers). */
export function AppSelectList<T extends string>({
  options,
  value,
  onChange,
}: AppSelectListProps<T>) {
  return (
    <View style={styles.list}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.option,
              {
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                backgroundColor: selected ? theme.colors.primarySoft : 'transparent',
              },
            ]}
          >
            <AppText variant="label" color={selected ? 'energy' : 'primary'}>
              {option.label}
            </AppText>
            {option.description ? (
              <AppText variant="caption" color="muted">
                {option.description}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: theme.spacing.sm },
  option: {
    borderRadius: theme.radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: 2,
  },
});
