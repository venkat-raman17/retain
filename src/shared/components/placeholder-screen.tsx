import { Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/shared/design';

import { AppText, type TextColor } from './text';
import { Card } from './card';
import { Divider } from './divider';
import { Screen } from './screen';
import { ScreenHeader } from './screen-header';

export interface PlaceholderScreenProps {
  eyebrow?: string;
  title: string;
  description: string;
  /** Bulleted lines describing what this surface will hold. */
  points?: readonly string[];
  accent?: TextColor;
  footer?: ReactNode;
}

/**
 * Consistent placeholder used by feature screens that are scaffolded but not yet
 * built out. Keeps the shell coherent and on-brand while features land.
 */
export function PlaceholderScreen({
  eyebrow,
  title,
  description,
  points,
  accent = 'accent',
  footer,
}: PlaceholderScreenProps) {
  return (
    <Screen scroll footer={footer}>
      <View style={styles.container}>
        <ScreenHeader eyebrow={eyebrow} eyebrowColor={accent} title={title} subtitle={description} />

        {points && points.length > 0 ? (
          <Card>
            {points.map((point, index) => (
              <Fragment key={point}>
                {index > 0 ? <Divider /> : null}
                <View style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: theme.colors[accentDot(accent)] }]} />
                  <AppText variant="body" color="secondary" style={styles.rowText}>
                    {point}
                  </AppText>
                </View>
              </Fragment>
            ))}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

function accentDot(accent: TextColor): 'accent' | 'support' | 'calm' | 'primary' {
  if (accent === 'support') return 'support';
  if (accent === 'calm') return 'calm';
  if (accent === 'energy') return 'primary';
  return 'accent';
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, paddingVertical: theme.spacing.md },
  dot: { width: 7, height: 7, borderRadius: theme.radii.pill, marginTop: 7 },
  rowText: { flex: 1 },
});
