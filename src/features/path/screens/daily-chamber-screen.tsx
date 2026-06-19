import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  copy,
  getDailyPathContent,
  getMilestoneRiteById,
  getArchetypeProfile,
  getLineagePassage,
} from '@/content';
import {
  AppButton,
  AppCard,
  AppDivider,
  AppHero,
  AppQuoteBlock,
  AppScreen,
  AppText,
  FadeInRise,
  Halo,
  PressableScale,
  SealArt,
  type SealArtSource,
  SectionBand,
  SplitRow,
  useCountUp,
} from '@/shared/components';
import { theme, type ArchetypeTone } from '@/shared/design';
import { useDayTheme, type SurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';
import { haptics } from '@/shared/lib';
import { Routes } from '@/navigation';
import { useDayQuest } from '@/features/quest/hooks/use-day-quest';
import { useHonors } from '@/features/honors/hooks/use-honors';
import { isMilestoneDay } from '@/features/progress/domain/progression';
import type { Achievement } from '@/content/schemas';

import { useDailyPath } from '../hooks/use-daily-path';

export function DailyChamberScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string }>();
  const dayNumber = params.day ? parseInt(params.day, 10) : 1;

  const { markDayOpened, markDayCompleted } = useDailyPath();
  const { quest, refresh: refreshQuest } = useDayQuest(dayNumber);
  const { summary: honorsSummary, checkAndAward, refresh: refreshHonors } = useHonors();

  const [secretRevealed, setSecretRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [newHonors, setNewHonors] = useState<Achievement[]>([]);

  useEffect(() => {
    void markDayOpened(dayNumber);
  }, [markDayOpened, dayNumber]);

  const content = getDailyPathContent(dayNumber);
  const archetype = content?.archetype ? getArchetypeProfile(content.archetype) : null;
  const milestoneRite = content?.milestoneRiteId ? getMilestoneRiteById(content.milestoneRiteId) : null;
  const lineage = content?.lineagePassageId ? getLineagePassage(content.lineagePassageId) : null;

  // Each day carries its OWN tone — the archetype hue, shifted deterministically
  // per day — so consecutive days, even of one archetype, look distinct.
  const tone = useDayTheme({
    day: dayNumber,
    archetype: (content?.archetype ?? 'monk') as ArchetypeTone,
    arcNumber: content?.arcNumber ?? 1,
  });
  const { colors } = useTheme();
  const isMilestone = isMilestoneDay(dayNumber);
  const milestoneGold = colors.gold;

  const completeDay = useCallback(async () => {
    await markDayCompleted(dayNumber);
    refreshQuest();
    const awarded = await checkAndAward();
    refreshHonors();
    setNewHonors(awarded);
    setCompleted(true);
    haptics.notify('success');
  }, [markDayCompleted, dayNumber, refreshQuest, checkAndAward, refreshHonors]);

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
        {/* Hero — the day's archetype sigil in the archetype tone; milestone days
            wear their rite medallion in gold to mark the sealed rite. */}
        <AppHero
          tone={tone}
          eyebrow={`Day ${dayNumber} · ${content.arcTitle}`}
          title={content.title}
          subtitle={content.openingLine}
          art={
            isMilestone ? (
              <SealArt source={{ kind: 'rite', day: dayNumber }} size={104} color={milestoneGold} />
            ) : content.archetype ? (
              <SealArt
                source={{
                  kind: 'day',
                  day: dayNumber,
                  archetype: content.archetype,
                  arcNumber: content.arcNumber,
                  accentColor: tone.base,
                }}
                size={104}
                color={tone.text}
              />
            ) : undefined
          }
        />

        {/* Archetype spine — the day's mode of formation, led by the investiture
            and the day-specific reason this archetype governs today. */}
        {archetype ? (
          <SectionBand tone={tone} style={styles.spineBand}>
            <AppText variant="caption" uppercase style={{ color: tone.text }}>
              {`${copy.chamber.archetypeSpine.lead} ${archetype.name}`}
            </AppText>
            <AppText variant="body" color="secondary">
              {content.archetypeExpression || content.invocation || archetype.essence}
            </AppText>
            <SplitRow>
              <AppCard tone="overlay" style={styles.halfCard}>
                <AppText variant="caption" color="accent" uppercase>{copy.chamber.labels.light}</AppText>
                <AppText variant="caption" color="secondary">{archetype.light}</AppText>
              </AppCard>
              <AppCard tone="overlay" style={styles.halfCard}>
                <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.shadow}</AppText>
                <AppText variant="caption" color="secondary">{archetype.shadow}</AppText>
              </AppCard>
            </SplitRow>
            <SplitRow>
              <AppCard tone="overlay" style={styles.halfCard}>
                <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.discipline}</AppText>
                <AppText variant="caption" color="secondary">{archetype.discipline}</AppText>
              </AppCard>
              <AppCard tone="overlay" style={styles.halfCard}>
                <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.temptation}</AppText>
                <AppText variant="caption" color="secondary">{archetype.temptation}</AppText>
              </AppCard>
            </SplitRow>
            <AppText variant="body" color="primary" align="center">
              {archetype.retainLine}
            </AppText>
          </SectionBand>
        ) : null}

        {/* Teaching */}
        <AppCard>
          <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.teaching}</AppText>
          <AppText variant="body" color="secondary" style={styles.body}>
            {content.teachingBody}
          </AppText>
        </AppCard>

        {/* Lineage — a passage from the traditions the practice draws on. */}
        {lineage ? (
          <AppCard tone="overlay">
            <AppText variant="caption" color="muted" uppercase>{copy.chamber.labels.lineage}</AppText>
            <AppQuoteBlock
              quote={lineage.text}
              attribution={lineage.verbatim ? `${lineage.attribution} · ${lineage.work}` : lineage.attribution}
            />
            {lineage.verbatim ? (
              <AppText variant="caption" color="muted">{copy.chamber.lineage.inspiration}</AppText>
            ) : null}
          </AppCard>
        ) : null}

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
          <AppCard
            tone="overlay"
            style={styles.halfCard}
            onPress={() => router.push(Routes.forge)}
          >
            <AppText variant="caption" color="energy" uppercase>{copy.chamber.labels.forge}</AppText>
            <AppText variant="body" color="secondary">{content.forgeChallenge}</AppText>
            <AppText variant="caption" color="accent">{copy.forge.todaysObjective.accept} →</AppText>
          </AppCard>
        </SplitRow>

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

        {/* Quest objectives */}
        {quest ? (
          <SectionBand tone={tone}>
            <AppText variant="caption" uppercase style={{ color: tone.text }}>
              {quest.cleared ? 'Trial complete' : 'Trial objectives'}
            </AppText>
            {quest.objectives.filter((o) => !o.optional).map((obj) => {
              const actionable = obj.kind === 'boundary_checkin' && !obj.complete;
              return (
                <PressableScale
                  key={obj.id}
                  disabled={!actionable}
                  onPress={actionable ? () => router.push(Routes.boundaries as never) : undefined}
                >
                  <View style={styles.objective}>
                    <AppText variant="caption" color={obj.complete ? 'energy' : 'muted'}>
                      {obj.complete ? '✓' : '·'}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={obj.complete ? 'primary' : 'muted'}
                      style={styles.objectiveLabel}
                    >
                      {obj.label}
                    </AppText>
                    {actionable ? (
                      <AppText variant="caption" color="accent">→</AppText>
                    ) : null}
                  </View>
                </PressableScale>
              );
            })}
          </SectionBand>
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

        {/* Complete / reward — gated: user must reveal the secret first */}
        {completed ? (
          <CompletionReveal
            trialName={quest?.trial.name ?? `Day ${dayNumber}`}
            rewardEmbers={quest?.trial.rewardEmbers ?? 0}
            hasKey={Boolean(quest?.trial.rewardKeyId)}
            totalEmbers={honorsSummary?.totalEmbers ?? 0}
            stationTitle={honorsSummary?.station?.title}
            newHonors={newHonors}
            tone={tone}
            seal={
              content.archetype
                ? {
                    kind: 'day',
                    day: dayNumber,
                    archetype: content.archetype,
                    arcNumber: content.arcNumber,
                    accentColor: tone.base,
                  }
                : { kind: 'rite', day: dayNumber }
            }
            identityLine={archetype ? `${copy.chamber.complete.identity} ${archetype.name}.` : undefined}
            onReturn={() => router.back()}
          />
        ) : secretRevealed ? (
          <>
            <AppButton
              label={`Complete Day ${dayNumber}`}
              fullWidth
              onPress={() => void completeDay()}
            />
            <AppButton label={copy.chamber.return} variant="ghost" fullWidth onPress={() => router.back()} />
          </>
        ) : (
          <>
            <AppCard tone="overlay">
              <AppText variant="caption" color="muted" align="center">
                {copy.chamber.complete.gate}
              </AppText>
            </AppCard>
            <AppButton label={copy.chamber.return} variant="ghost" fullWidth onPress={() => router.back()} />
          </>
        )}
      </View>
    </AppScreen>
  );
}

/**
 * The day-complete ritual beat. Composed from existing primitives — a seal
 * blooming inside a halo, an embers count-up, and any honors unlocked. An
 * affirmation of the return, never a score; honors Reduce Motion via the static
 * Halo and the count-up's own snap behavior.
 */
function CompletionReveal({
  trialName,
  rewardEmbers,
  hasKey,
  totalEmbers,
  stationTitle,
  newHonors,
  tone,
  seal,
  identityLine,
  onReturn,
}: {
  trialName: string;
  rewardEmbers: number;
  hasKey: boolean;
  totalEmbers: number;
  stationTitle?: string;
  newHonors: Achievement[];
  tone: SurfaceTone;
  seal: SealArtSource;
  identityLine?: string;
  onReturn: () => void;
}) {
  const { colors } = useTheme();
  const embersDisplay = useCountUp(totalEmbers, 1200);
  return (
    <AppCard tone="raised" border="gold">
      <FadeInRise index={0}>
        <View style={styles.revealSeal}>
          <View style={styles.haloBox}>
            <Halo color={tone.base} size={132} style={StyleSheet.absoluteFill} />
            <SealArt source={seal} size={92} color={colors.gold} />
          </View>
        </View>
      </FadeInRise>

      <AppText variant="caption" color="energy" uppercase align="center">
        {copy.chamber.complete.cleared}
      </AppText>
      <AppText variant="subheading" align="center">
        {trialName}
      </AppText>
      {identityLine ? (
        <AppText variant="body" color="gold" align="center">
          {identityLine}
        </AppText>
      ) : null}

      <View style={styles.revealEmbers}>
        <AppText variant="display" color="energy" align="center" numberOfLines={1} adjustsFontSizeToFit>
          {embersDisplay.toString()}
        </AppText>
        <AppText variant="caption" color="muted" align="center" uppercase>
          {`${copy.chamber.complete.embersEarned} · +${rewardEmbers}${hasKey ? ` · ${copy.chamber.complete.keyEarned}` : ''}`}
        </AppText>
      </View>

      {newHonors.length > 0 ? (
        <View style={styles.newHonors}>
          <AppText variant="caption" color="energy" uppercase align="center">
            {newHonors.length === 1
              ? copy.chamber.complete.honorUnlocked
              : copy.chamber.complete.honorsUnlocked}
          </AppText>
          {newHonors.map((h, i) => (
            <FadeInRise key={h.id} index={i + 1}>
              <AppText variant="label" color="primary" align="center">
                {h.title}
              </AppText>
            </FadeInRise>
          ))}
        </View>
      ) : null}

      {stationTitle ? (
        <AppText variant="caption" color="gold" align="center" uppercase>
          {`${copy.chamber.complete.stationLabel} · ${stationTitle}`}
        </AppText>
      ) : null}

      <AppText variant="caption" color="secondary" align="center" style={styles.body}>
        {copy.chamber.complete.done}
      </AppText>
      <AppButton label={copy.chamber.return} variant="secondary" fullWidth onPress={onReturn} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  body: { marginTop: theme.spacing.xs },
  halfCard: { flex: 1, gap: theme.spacing.xs },
  spineBand: { gap: theme.spacing.md },
  sealWrap: { paddingVertical: theme.spacing.md },
  objective: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs },
  objectiveLabel: { flex: 1 },
  newHonors: { gap: theme.spacing.xs, marginVertical: theme.spacing.xs },
  revealSeal: { alignItems: 'center', marginBottom: theme.spacing.sm },
  haloBox: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  revealEmbers: { gap: 2, marginVertical: theme.spacing.xs },
});
