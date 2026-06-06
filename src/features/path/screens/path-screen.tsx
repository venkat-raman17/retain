import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  copy,
  getDailyPathContent,
  getMilestoneRiteById,
  getPrinciples,
  getArchetypeProfile,
} from '@/content';
import {
  AppButton,
  AppCard,
  AppQuoteBlock,
  AppScreen,
  AppHeader,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { Routes } from '@/navigation';

import { usePath } from '../hooks/use-path';

export function PathScreen() {
  const router = useRouter();
  const { currentDay, isRunning, vow, loading, beginPath } = usePath();

  const todaysContent = getDailyPathContent(currentDay > 0 ? currentDay : 1);
  const milestoneRite = todaysContent?.milestoneRiteId
    ? getMilestoneRiteById(todaysContent.milestoneRiteId)
    : null;
  const archetype = todaysContent?.archetype
    ? getArchetypeProfile(todaysContent.archetype)
    : null;
  const principle = getPrinciples()[0];

  return (
    <AppScreen
      scroll
      footer={
        <AppButton
          label={copy.actions.pause}
          variant="support"
          fullWidth
          onPress={() => router.push(Routes.pause)}
        />
      }
    >
      <View style={styles.container}>
        <AppHeader
          eyebrow={isRunning ? `Day ${currentDay}` : copy.path.eyebrow}
          title={todaysContent?.title ?? copy.path.title}
          subtitle={todaysContent?.openingLine ?? copy.path.description}
        />

        {!isRunning && !loading ? (
          <AppCard tone="overlay" style={styles.section}>
            {vow ? (
              <AppQuoteBlock quote={vow} attribution="Your vow" />
            ) : null}
            <AppButton label="Begin the practice" onPress={() => void beginPath()} />
          </AppCard>
        ) : (
          <>
            {vow ? (
              <AppCard tone="overlay" style={styles.section}>
                <AppQuoteBlock quote={vow} attribution="Your vow" />
              </AppCard>
            ) : null}

            {todaysContent ? (
              <>
                {/* The command */}
                <AppCard tone="raised" style={styles.section}>
                  <AppText variant="caption" color="accent" uppercase>
                    {"Today's command"}
                  </AppText>
                  <AppText variant="subheading">
                    {todaysContent.command}
                  </AppText>
                </AppCard>

                {/* Teaching */}
                <AppCard style={styles.section}>
                  <AppText variant="caption" color="muted" uppercase>
                    Teaching
                  </AppText>
                  <AppText variant="body" color="secondary">
                    {todaysContent.teachingBody}
                  </AppText>
                </AppCard>

                {/* Practice + Forge challenge */}
                <View style={styles.row}>
                  <AppCard tone="overlay" style={styles.halfCard}>
                    <AppText variant="caption" color="accent" uppercase>
                      Practice
                    </AppText>
                    <AppText variant="body" color="secondary">
                      {todaysContent.practice}
                    </AppText>
                  </AppCard>
                  <AppCard tone="overlay" style={styles.halfCard}>
                    <AppText variant="caption" color="energy" uppercase>
                      Forge
                    </AppText>
                    <AppText variant="body" color="secondary">
                      {todaysContent.forgeChallenge}
                    </AppText>
                  </AppCard>
                </View>

                {/* Journal prompt */}
                <AppCard>
                  <AppText variant="caption" color="accent" uppercase>
                    Journal prompt
                  </AppText>
                  <AppText variant="body" color="secondary">
                    {todaysContent.journalPrompt}
                  </AppText>
                  <AppButton
                    label="Open journal"
                    variant="ghost"
                    onPress={() => router.push(Routes.journal)}
                  />
                </AppCard>

                {/* Archetype */}
                {archetype ? (
                  <AppCard tone="overlay">
                    <AppText variant="caption" color="muted" uppercase>
                      Archetype · {archetype.name}
                    </AppText>
                    <AppText variant="body" color="secondary">
                      {archetype.retainLine}
                    </AppText>
                  </AppCard>
                ) : null}

                {/* Milestone rite */}
                {milestoneRite ? (
                  <AppCard tone="raised" style={styles.section}>
                    <AppText variant="caption" color="energy" uppercase>
                      Milestone rite
                    </AppText>
                    <AppText variant="subheading">{milestoneRite.title}</AppText>
                    <AppText variant="body" color="secondary">
                      {milestoneRite.ceremonialPassage}
                    </AppText>
                    <AppText variant="caption" color="energy" uppercase style={styles.top}>
                      Vow renewal
                    </AppText>
                    <AppText variant="body" color="calm">
                      {milestoneRite.vowRenewal}
                    </AppText>
                    <AppText variant="caption" color="muted" style={styles.top}>
                      {milestoneRite.seal}
                    </AppText>
                  </AppCard>
                ) : null}

                {/* Evening account + Seal */}
                <AppCard tone="overlay">
                  <AppText variant="caption" color="muted" uppercase>
                    Evening account
                  </AppText>
                  <AppText variant="body" color="secondary">
                    {todaysContent.eveningAccount}
                  </AppText>
                </AppCard>

                <AppQuoteBlock quote={todaysContent.seal} attribution={`Day ${currentDay}`} />
              </>
            ) : (
              /* Fallback if no daily content for this day */
              principle ? (
                <AppCard>
                  <AppText variant="caption" color="accent" uppercase>
                    Principle
                  </AppText>
                  <AppText variant="subheading" style={styles.top}>
                    {principle.title}
                  </AppText>
                  <AppText variant="body" color="secondary">
                    {principle.body}
                  </AppText>
                </AppCard>
              ) : null
            )}

            <View style={styles.actions}>
              <AppButton
                label="Forge energy"
                variant="secondary"
                fullWidth
                onPress={() => router.push(Routes.forge)}
              />
            </View>
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  section: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  halfCard: { flex: 1, gap: theme.spacing.xs },
  top: { marginTop: theme.spacing.sm },
  actions: { gap: theme.spacing.md },
});
