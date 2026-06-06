import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getDailyPathContent } from '@/content';
import {
  AppButton,
  AppCard,
  AppQuoteBlock,
  AppScreen,
  AppHeader,
  AppStatCard,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { systemClock } from '@/shared/lib';
import { Routes } from '@/navigation';
import { useRepositories } from '@/shared/storage';

import { usePath } from '../hooks/use-path';
import { usePathProgress } from '../hooks/use-path-progress';
import { DailyPathService } from '../services/daily-path-service';

export function PathScreen() {
  const router = useRouter();
  const repos = useRepositories();
  const { currentDay, isRunning, vow, loading, beginPath, profile } = usePath();
  const { summary } = usePathProgress();

  const dailyPathService = useMemo(
    () => new DailyPathService(repos.profile, repos.path, repos.contentProgress, systemClock),
    [repos],
  );
  const isCrownUnlocked = profile ? dailyPathService.isCrownUnlocked(profile, currentDay) : false;

  const day = currentDay > 0 ? currentDay : 1;
  const todaysContent = getDailyPathContent(day);
  const hasMilestone = Boolean(todaysContent?.milestoneRiteId);

  const openChamber = () =>
    router.push({ pathname: '/chamber', params: { day: day.toString() } });

  return (
    <AppScreen
      scroll
      footer={
        <AppButton
          label="I Feel the Fire"
          variant="support"
          fullWidth
          onPress={() => router.push(Routes.pause)}
        />
      }
    >
      <View style={styles.container}>
        <AppHeader
          eyebrow={isRunning ? `Day ${currentDay}` : 'The Path'}
          title={todaysContent?.title ?? 'The Practice Begins'}
          subtitle={todaysContent?.openingLine ?? 'Pause. Choose. Transmute.'}
        />

        {!isRunning && !loading ? (
          <AppCard tone="overlay" style={styles.section}>
            {vow ? <AppQuoteBlock quote={vow} attribution="Your vow" /> : null}
            <AppText variant="body" color="secondary">
              {'The path begins in the pause. Begin when you are ready.'}
            </AppText>
            <AppButton label="Begin the practice" onPress={() => void beginPath()} />
          </AppCard>
        ) : (
          <>
            {/* Vow */}
            {vow ? (
              <AppCard tone="overlay" style={styles.section}>
                <AppQuoteBlock quote={vow} attribution="Your vow" />
              </AppCard>
            ) : null}

            {/* Stats — short labels so they never wrap */}
            {summary ? (
              <View style={styles.statsGrid}>
                <AppStatCard label="Day" value={summary.currentPathDays.toString()} style={styles.stat} />
                <AppStatCard label="Streak" value={summary.longestPathDays.toString()} style={styles.stat} />
                <AppStatCard label="Urges" value={summary.urgesObserved.toString()} style={styles.stat} />
                <AppStatCard label="Forge" value={summary.forgeActs.toString()} style={styles.stat} />
              </View>
            ) : null}

            {/* Crown unlock banner */}
            {isCrownUnlocked ? (
              <AppCard tone="raised" border="gold">
                <AppText variant="caption" color="energy" uppercase>
                  The Crown is earned
                </AppText>
                <AppText variant="body" color="secondary">
                  {'Ninety days. You have been formed. Receive the Crown.'}
                </AppText>
                <AppButton label="Receive the Crown" onPress={() => router.push(Routes.crown)} />
              </AppCard>
            ) : null}

            {/* Primary action — the center of the daily experience */}
            {hasMilestone ? (
              <AppText variant="caption" color="energy" align="center">
                {"A milestone rite awaits within today's chamber."}
              </AppText>
            ) : null}
            <AppButton label="Open Today's Chamber" fullWidth onPress={openChamber} />

            {/* Secondary actions */}
            <View style={styles.row}>
              <AppButton
                label="Log a Forge Act"
                variant="secondary"
                style={styles.halfAction}
                onPress={() => router.push(Routes.forge)}
              />
              <AppButton
                label="Journal Tonight"
                variant="secondary"
                style={styles.halfAction}
                onPress={() => router.push(Routes.journal)}
              />
            </View>
            <AppButton
              label="View the Map"
              variant="ghost"
              fullWidth
              onPress={() => router.push(Routes.pathMap)}
            />

            {/* Two quiet teasers only — the full lesson lives in the chamber */}
            {todaysContent ? (
              <>
                <PreviewCard
                  label="Today's command"
                  body={todaysContent.command}
                  onPress={openChamber}
                />
                <PreviewCard
                  label="Evening account"
                  body={todaysContent.eveningAccount}
                  onPress={openChamber}
                />
              </>
            ) : (
              <AppCard tone="overlay">
                <AppText variant="body" color="secondary" align="center">
                  {'The daily chambers are complete. Walk the Long Path — revisit any day from the map.'}
                </AppText>
              </AppCard>
            )}

            {/* Record a lapse — quiet, never shaming */}
            <AppButton
              label="Record a lapse and return"
              variant="ghost"
              fullWidth
              onPress={() => router.push(Routes.lapse)}
            />
          </>
        )}
      </View>
    </AppScreen>
  );
}

function PreviewCard({
  label,
  body,
  color = 'accent',
  onPress,
}: {
  label: string;
  body: string;
  color?: 'accent' | 'energy' | 'muted';
  onPress: () => void;
}) {
  return (
    <AppCard tone="overlay" onPress={onPress}>
      <AppText variant="caption" color={color} uppercase>
        {label}
      </AppText>
      <AppText variant="body" color="secondary" numberOfLines={2}>
        {body}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  section: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  halfAction: { flex: 1 },
  statsGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  stat: { flex: 1, minWidth: 0 },
});
