import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import { usePracticeState } from '@/features/path';
import { AppText, Card, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';
import { useRepositories } from '@/shared/storage';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.stat}>
      <AppText variant="display" color="energy">
        {value}
      </AppText>
      <AppText variant="caption" color="muted" uppercase>
        {label}
      </AppText>
    </Card>
  );
}

export function ProgressScreen() {
  const { state, streakDays } = usePracticeState();
  const { journal, progress } = useRepositories();
  const [journalCount, setJournalCount] = useState(0);
  const [recoveries, setRecoveries] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([journal.count(), progress.lapseCount()]).then(([entries, lapses]) => {
      if (!active) return;
      setJournalCount(entries);
      setRecoveries(lapses);
    });
    return () => {
      active = false;
    };
  }, [journal, progress]);

  return (
    <Screen scroll>
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.progress.eyebrow}
          title={copy.progress.title}
          subtitle={copy.progress.description}
        />
        <View style={styles.grid}>
          <Stat label="Current streak" value={`${streakDays}d`} />
          <Stat label="Best streak" value={`${state?.bestStreakDays ?? 0}d`} />
          <Stat label="Recoveries" value={`${recoveries}`} />
          <Stat label="Reflections" value={`${journalCount}`} />
        </View>
        <Card tone="overlay">
          <AppText variant="body" color="calm">
            Every reset is a recovery, not a verdict. The numbers here are for learning, never for
            judgment.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  stat: { flexGrow: 1, flexBasis: '46%', gap: theme.spacing.xs },
});
