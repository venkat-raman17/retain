import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { AppText, AppCard, AppScreen, AppHeader } from '@/shared/components';
import { theme } from '@/shared/design';

import { useProgressSummary } from '../hooks/use-progress-summary';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <AppCard style={styles.stat}>
      <AppText variant="display" color="energy">
        {value}
      </AppText>
      <AppText variant="caption" color="muted" uppercase>
        {label}
      </AppText>
    </AppCard>
  );
}

export function ProgressScreen() {
  const { summary } = useProgressSummary();

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow={copy.progress.eyebrow}
          title={copy.progress.title}
          subtitle={copy.progress.description}
        />
        <View style={styles.grid}>
          <Stat label="Current path" value={`${summary?.currentPathDays ?? 0}d`} />
          <Stat label="Longest path" value={`${summary?.longestPathDays ?? 0}d`} />
          <Stat label="Total practice" value={`${summary?.totalPracticeDays ?? 0}d`} />
          <Stat label="Urges observed" value={`${summary?.urgesObserved ?? 0}`} />
          <Stat label="Forge acts" value={`${summary?.forgeActs ?? 0}`} />
          <Stat label="Returns" value={`${summary?.returnsRecorded ?? 0}`} />
        </View>
        <AppCard tone="overlay">
          <AppText variant="body" color="calm">
            Your practice is more than a streak. Command is trained in the return, and a lapse is
            studied — never worshiped.
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  stat: { flexGrow: 1, flexBasis: '46%', gap: theme.spacing.xs },
});
