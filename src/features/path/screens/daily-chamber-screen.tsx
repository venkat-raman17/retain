import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getDailyPathContent, getMilestoneRiteById, getArchetypeProfile } from '@/content';
import {
  AppButton,
  AppCard,
  AppChip,
  AppDivider,
  AppQuoteBlock,
  AppScreen,
  AppText,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { systemClock } from '@/shared/lib';
import { Routes } from '@/navigation';
import { useRepositories } from '@/shared/storage';

import { DailyPathService } from '../services/daily-path-service';

const SECRET_LABELS: Record<string, string> = {
  hidden_teaching: 'Hidden Teaching',
  ancient_key: 'Ancient Key',
  archetype_trial: 'Trial',
  forge_assignment: 'Forge Assignment',
  night_warning: 'Night Warning',
  lapse_medicine: 'Lapse Medicine',
  crown_fragment: 'Crown Fragment',
};

export function DailyChamberScreen() {
  const router = useRouter();
  const repos = useRepositories();
  const params = useLocalSearchParams<{ day?: string }>();
  const dayNumber = params.day ? parseInt(params.day, 10) : 1;

  const service = useMemo(
    () => new DailyPathService(repos.profile, repos.path, repos.contentProgress, systemClock),
    [repos],
  );

  const [secretRevealed, setSecretRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    void service.markDayOpened(dayNumber);
  }, [service, dayNumber]);

  const content = getDailyPathContent(dayNumber);
  const archetype = content?.archetype ? getArchetypeProfile(content.archetype) : null;
  const milestoneRite = content?.milestoneRiteId ? getMilestoneRiteById(content.milestoneRiteId) : null;

  const completeDay = useCallback(async () => {
    await service.markDayCompleted(dayNumber);
    setCompleted(true);
    setTimeout(() => router.back(), 400);
  }, [service, dayNumber, router]);

  if (!content) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppText variant="title" align="center">
            This chamber is not yet open.
          </AppText>
          <AppText variant="body" color="secondary" align="center">
            {"Walk today's fire first."}
          </AppText>
          <AppButton label="Return" variant="ghost" onPress={() => router.back()} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <AppChip label={`Day ${dayNumber}`} tone="energy" selected />
          <AppChip label={content.arcTitle} tone="accent" />
        </View>

        <AppText variant="title">{content.title}</AppText>
        <AppText variant="body" color="secondary">
          {content.openingLine}
        </AppText>

        {/* Teaching */}
        <AppCard>
          <AppText variant="caption" color="muted" uppercase>Teaching</AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {content.teachingBody}
          </AppText>
        </AppCard>

        {/* Secret — revealed on tap */}
        <AppCard
          tone="overlay"
          border={secretRevealed ? 'gold' : 'subtle'}
          onPress={() => !secretRevealed && setSecretRevealed(true)}
        >
          <AppText variant="caption" color="energy" uppercase>
            {secretRevealed
              ? (SECRET_LABELS[content.secretContentType] ?? 'Secret')
              : 'Reveal the secret'}
          </AppText>
          {secretRevealed ? (
            <AppText variant="body" color="secondary" style={styles.body}>
              {content.secretBody}
            </AppText>
          ) : (
            <AppText variant="caption" color="muted">
              {"Tap to open this day's hidden instruction."}
            </AppText>
          )}
        </AppCard>

        {/* Command */}
        <AppCard tone="raised">
          <AppText variant="caption" color="accent" uppercase>{"Today's command"}</AppText>
          <AppText variant="subheading" style={styles.body}>{content.command}</AppText>
        </AppCard>

        {/* Practice + Forge row */}
        <View style={styles.row}>
          <AppCard tone="overlay" style={styles.halfCard}>
            <AppText variant="caption" color="accent" uppercase>Practice</AppText>
            <AppText variant="body" color="secondary">{content.practice}</AppText>
          </AppCard>
          <AppCard tone="overlay" style={styles.halfCard}>
            <AppText variant="caption" color="energy" uppercase>Forge</AppText>
            <AppText variant="body" color="secondary">{content.forgeChallenge}</AppText>
          </AppCard>
        </View>

        {/* Journal prompt */}
        <AppCard>
          <AppText variant="caption" color="accent" uppercase>Journal prompt</AppText>
          <AppText variant="body" color="secondary">{content.journalPrompt}</AppText>
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
              {`Archetype · ${archetype.name}`}
            </AppText>
            <AppText variant="body" color="secondary">{archetype.retainLine}</AppText>
          </AppCard>
        ) : null}

        {/* Milestone rite */}
        {milestoneRite ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>Milestone rite</AppText>
            <AppText variant="subheading">{milestoneRite.title}</AppText>
            <AppText variant="body" color="secondary" style={styles.body}>
              {milestoneRite.ceremonialPassage}
            </AppText>
            <AppDivider />
            <AppText variant="caption" color="energy" uppercase>Vow renewal</AppText>
            <AppText variant="body" color="calm" style={styles.body}>{milestoneRite.vowRenewal}</AppText>
          </AppCard>
        ) : null}

        {/* Evening account */}
        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" uppercase>Evening account</AppText>
          <AppText variant="body" color="secondary">{content.eveningAccount}</AppText>
        </AppCard>

        {/* Crown fragment */}
        {content.crownFragment ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>Key earned</AppText>
            <AppQuoteBlock quote={content.crownFragment} attribution={`Day ${dayNumber}`} />
          </AppCard>
        ) : null}

        <AppQuoteBlock quote={content.seal} attribution={`Day ${dayNumber}`} />

        {/* Complete button */}
        {completed ? (
          <AppText variant="body" color="calm" align="center">
            {"Day recorded. Well walked."}
          </AppText>
        ) : (
          <AppButton
            label={`Complete Day ${dayNumber}`}
            fullWidth
            onPress={() => void completeDay()}
          />
        )}

        <AppButton label="Return" variant="ghost" fullWidth onPress={() => router.back()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  header: { flexDirection: 'row', gap: theme.spacing.sm },
  body: { marginTop: theme.spacing.xs },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  halfCard: { flex: 1, gap: theme.spacing.xs },
});
