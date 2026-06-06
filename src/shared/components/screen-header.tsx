import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { AppText, type TextColor } from './text';

export interface AppHeaderProps {
  eyebrow?: string;
  eyebrowColor?: TextColor;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function AppHeader({
  eyebrow,
  eyebrowColor = 'accent',
  title,
  subtitle,
  align = 'left',
}: AppHeaderProps) {
  const textAlign = align === 'center' ? 'center' : 'left';
  return (
    <View style={[styles.container, align === 'center' ? styles.center : null]}>
      {eyebrow ? (
        <AppText variant="caption" color={eyebrowColor} uppercase align={textAlign}>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title" align={textAlign}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color="secondary" align={textAlign}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xs },
  center: { alignItems: 'center' },
});
