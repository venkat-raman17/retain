import { StyleSheet, View } from 'react-native';

import {
  AppCard,
  AppHeader,
  AppScreen,
  AppStatCard,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';

import { useProgressSummary } from '../hooks/use-progress-summary';

function formatCapitalize(s: string | null): string {
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
}

export function ProgressScreen() {
  const { summary, weekSummary } = useProgressSummary();

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHeader
          eyebrow="Progress"
          title="The record of practice."
          subtitle="Your practice is more than a streak."
        />

        {/* Stats — short single-word labels so nothing wraps */}
        <View style={styles.grid}>
          <AppStatCard label="Day" value={`${summary?.currentPathDays ?? 0}`} style={styles.stat} />
          <AppStatCard label="Longest" value={`${summary?.longestPathDays ?? 0}`} style={styles.stat} />
          <AppStatCard label="Practice" value={`${summary?.totalPracticeDays ?? 0}`} style={styles.stat} />
        </View>
        <View style={styles.grid}>
          <AppStatCard label="Urges" value={`${summary?.urgesObserved ?? 0}`} style={styles.stat} />
          <AppStatCard label="Forge" value={`${summary?.forgeActs ?? 0}`} style={styles.stat} />
          <AppStatCard
            label="Lapses"
            value={`${summary?.lapsesStudied ?? 0}`}
            valueColor="muted"
            style={styles.stat}
          />
          <AppStatCard
            label="Returns"
            value={`${summary?.returnsRecorded ?? 0}`}
            valueColor="calm"
            style={styles.stat}
          />
        </View>

        {/* This week — a readable summary, not a tiny chart */}
        {weekSummary ? (
          <AppCard>
            <AppText variant="caption" color="muted" uppercase>
              This week
            </AppText>
            <View style={styles.weekRow}>
              <WeekItem label="Forge" value={weekSummary.forgeActsThisWeek} />
              <WeekItem label="Urges" value={weekSummary.urgesThisWeek} />
              <WeekItem label="Journal" value={weekSummary.journalEntriesThisWeek} />
            </View>
          </AppCard>
        ) : null}

        {/* Insights */}
        {summary ? (
          <AppCard tone="overlay">
            <AppText variant="caption" color="muted" uppercase>
              Insights
            </AppText>
            <View style={styles.insightRow}>
              <AppText variant="body" color="secondary">
                Most common trigger
              </AppText>
              <AppText variant="body" color="accent">
                {formatCapitalize(summary.mostCommonTrigger)}
              </AppText>
            </View>
            <View style={styles.insightRow}>
              <AppText variant="body" color="secondary">
                Strongest forge
              </AppText>
              <AppText variant="body" color="energy">
                {formatCapitalize(summary.strongestForgeCategory)}
              </AppText>
            </View>
          </AppCard>
        ) : null}

        <AppCard tone="overlay">
          <AppText variant="body" color="calm" align="center">
            {'Command is trained in the return. The record shows where the fire asks for discipline.'}
          </AppText>
        </AppCard>
      </View>
    </AppScreen>
  );
}

function WeekItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.weekItem}>
      <AppText variant="display" color="energy" numberOfLines={1} adjustsFontSizeToFit>
        {value.toString()}
      </AppText>
      <AppText variant="caption" color="muted" uppercase numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  grid: { flexDirection: 'row', gap: theme.spacing.sm },
  stat: { flex: 1, minWidth: 0 },
  weekRow: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.sm },
  weekItem: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
});
