import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, getDailyPathContent, getMilestoneRiteById, getArchetypeProfile } from '@/content';
import {
  AppButton,
  AppCard,
  AppDivider,
  AppHero,
  AppQuoteBlock,
  AppScreen,
  AppText,
  SealArt,
  SectionBand,
  SplitRow,
} from '@/shared/components';
import { theme, type ArchetypeTone } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { Routes } from '@/navigation';

import { useDailyPath } from '../hooks/use-daily-path';

export function DailyChamberScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string }>();
  const dayNumber = params.day ? parseInt(params.day, 10) : 1;

  const { markDayOpened, markDayCompleted } = useDailyPath();

  const [secretRevealed, setSecretRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    void markDayOpened(dayNumber);
  }, [markDayOpened, dayNumber]);

  const content = getDailyPathContent(dayNumber);
  const archetype = content?.archetype ? getArchetypeProfile(content.archetype) : null;
  const milestoneRite = content?.milestoneRiteId ? getMilestoneRiteById(content.milestoneRiteId) : null;

  // The chamber takes the day's archetype as its identity color.
  const tone = useSurfaceTone({ kind: 'archetype', id: (content?.archetype ?? 'monk') as ArchetypeTone });

  const completeDay = useCallback(async () => {
    await markDayCompleted(dayNumber);
    setCompleted(true);
    setTimeout(() => router.back(), 400);
  }, [markDayCompleted, dayNumber, router]);

  if (!content) {
    return (
      <AppScreen scroll>
        <View style={styles.container}>
          <AppText variant="title" align="center">
            {copy.chamber.locked.title}
          </AppText>
          <AppText variant="body" color="secondary" align="center">
            {copy.chamber.locked.body}
          </AppText>
          <AppButton label={copy.chamber.return} variant="ghost" onPress={() => router.back()} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        {/* Hero — the day's archetype sigil in the archetype tone. */}
        <AppHero
          tone={tone}
          eyebrow={`Day ${dayNumber} · ${content.arcTitle}`}
          title={content.title}
          subtitle={content.openingLine}
          art={
            content.archetype ? (
              <SealArt source={{ kind: 'archetype', archetype: content.archetype }} size={92} color={tone.text} />
            ) : undefined
          }
        />

        {/* Teaching */}
        <AppCard>
          <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.teaching}</AppText>
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
              ? (copy.chamber.secret.types[content.secretContentType] ??
                copy.chamber.secret.defaultLabel)
              : copy.chamber.secret.defaultLabel}
          </AppText>
          {secretRevealed ? (
            <AppText variant="body" color="secondary" style={styles.body}>
              {content.secretBody}
            </AppText>
          ) : (
            <AppText variant="caption" color="muted">
              {copy.chamber.secret.lockedHint}
            </AppText>
          )}
        </AppCard>

        {/* Command — the day's central instruction, set in the archetype tone. */}
        <SectionBand tone={tone}>
          <AppText variant="caption" uppercase style={{ color: tone.text }}>
            {copy.chamber.labels.command}
          </AppText>
          <AppText variant="subheading" style={styles.body}>{content.command}</AppText>
        </SectionBand>

        {/* Practice + Forge */}
        <SplitRow>
          <AppCard tone="overlay" style={styles.halfCard}>
            <AppText variant="caption" color="accent" uppercase>{copy.chamber.labels.practice}</AppText>
            <AppText variant="body" color="secondary">{content.practice}</AppText>
          </AppCard>
          <AppCard tone="overlay" style={styles.halfCard}>
            <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.forge}</AppText>
            <AppText variant="body" color="secondary">{content.forgeChallenge}</AppText>
          </AppCard>
        </SplitRow>

        {/* Journal prompt */}
        <AppCard>
          <AppText variant="caption" color="accent" uppercase>{copy.chamber.labels.journalPrompt}</AppText>
          <AppText variant="body" color="secondary">{content.journalPrompt}</AppText>
          <AppButton
            label={copy.chamber.labels.openJournal}
            variant="ghost"
            onPress={() =>
              router.push({
                pathname: Routes.journal,
                params: { initialType: 'morning', initialPrompt: content.journalPrompt },
              })
            }
          />
        </AppCard>

        {/* Archetype */}
        {archetype ? (
          <AppCard tone="overlay">
            <View style={styles.archetypeHead}>
              <AppText variant="caption" color="muted" uppercase style={styles.flex}>
                {`Archetype · ${archetype.name}`}
              </AppText>
              <SealArt source={{ kind: 'archetype', archetype: archetype.id }} size={40} color={tone.base} />
            </View>
            <AppText variant="body" color="secondary">{archetype.retainLine}</AppText>
          </AppCard>
        ) : null}

        {/* Milestone rite */}
        {milestoneRite ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.milestoneRite}</AppText>
            <AppText variant="subheading">{milestoneRite.title}</AppText>
            <AppText variant="body" color="secondary" style={styles.body}>
              {milestoneRite.ceremonialPassage}
            </AppText>
            <AppDivider />
            <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.vowRenewal}</AppText>
            <AppText variant="body" color="calm" style={styles.body}>{milestoneRite.vowRenewal}</AppText>
          </AppCard>
        ) : null}

        {/* Evening account */}
        <AppCard tone="overlay">
          <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.eveningAccount}</AppText>
          <AppText variant="body" color="secondary">{content.eveningAccount}</AppText>
        </AppCard>

        {/* Crown fragment */}
        {content.crownFragment ? (
          <AppCard tone="raised" border="gold">
            <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.keyEarned}</AppText>
            <AppQuoteBlock quote={content.crownFragment} attribution={`Day ${dayNumber}`} />
          </AppCard>
        ) : null}

        {/* Closing seal — a ceremonial centered statement. */}
        <View style={styles.sealWrap}>
          <AppText variant="seal" color="gold" align="center">
            {content.seal}
          </AppText>
        </View>

        {/* Complete button — gated: user must open the hidden instruction first */}
        {completed ? (
          <AppText variant="body" color="calm" align="center">
            {copy.chamber.complete.done}
          </AppText>
        ) : secretRevealed ? (
          <AppButton
            label={`Complete Day ${dayNumber}`}
            fullWidth
            onPress={() => void completeDay()}
          />
        ) : (
          <AppCard tone="overlay">
            <AppText variant="caption" color="muted" align="center">
              {copy.chamber.complete.gate}
            </AppText>
          </AppCard>
        )}

        <AppButton label={copy.chamber.return} variant="ghost" fullWidth onPress={() => router.back()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  body: { marginTop: theme.spacing.xs },
  halfCard: { flex: 1, gap: theme.spacing.xs },
  archetypeHead: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  flex: { flex: 1 },
  sealWrap: { paddingVertical: theme.spacing.md },
});
