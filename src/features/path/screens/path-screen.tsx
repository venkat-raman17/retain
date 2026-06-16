import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy } from '@/content';
import {
  AppButton,
  AppCard,
  AppHero,
  AppIconButton,
  AppQuoteBlock,
  AppScreen,
  AppStatCard,
  AppText,
  FadeInRise,
  PathPulse,
  SealArt,
  SectionBand,
  SplitRow,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { useTheme } from '@/shared/hooks/use-theme';
import { Routes } from '@/navigation';
import { ThemePickerModal } from '@/features/settings/screens/theme-picker-modal';

import { usePath } from '../hooks/use-path';
import { usePathProgress } from '../hooks/use-path-progress';
import { useDailyPath } from '../hooks/use-daily-path';
import { useDailyBrief } from '../hooks/use-daily-brief';

export function PathScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentDay, isRunning, vow, loading, beginPath, profile, refresh: refreshPath } = usePath();
  const { summary, refresh: refreshProgress } = usePathProgress();
  const { isCrownUnlocked: checkCrownUnlocked } = useDailyPath();
  const { brief, refresh: refreshBrief } = useDailyBrief();
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshPath();
      refreshProgress();
      refreshBrief();
    }, [refreshPath, refreshProgress, refreshBrief]),
  );

  const isCrownUnlocked = profile ? checkCrownUnlocked(profile, currentDay) : false;

  // The screen's identity color follows today's arc; the Gate (arc 1) before start.
  const arcNumber = isRunning && brief ? brief.arcNumber : 1;
  const tone = useSurfaceTone({ kind: 'arc', arcNumber });

  const day = currentDay > 0 ? currentDay : 1;
  const hasMilestone = Boolean(brief?.milestoneRiteId);

  const openChamber = () =>
    router.push({ pathname: '/chamber', params: { day: day.toString() } });

  return (
    <AppScreen
      scroll
      vignette
      footer={
        <AppButton
          label={copy.path.feelTheFire}
          variant="support"
          fullWidth
          onPress={() => router.push(Routes.pause)}
        />
      }
    >
      <View style={styles.container}>
        {/* Theme picker — a quiet control above the hero. */}
        <View style={styles.topBar}>
          <AppIconButton accessibilityLabel="Choose theme" onPress={() => setThemePickerOpen(true)} size={36}>
            <View style={styles.paletteIcon}>
              {[colors.primary, colors.textSecondary, colors.textMuted].map((c, i) => (
                <View key={i} style={[styles.paletteDot, { backgroundColor: c }]} />
              ))}
            </View>
          </AppIconButton>
        </View>

        {!isRunning && !loading ? (
          <>
            <AppHero
              tone={tone}
              align="center"
              eyebrow={copy.path.notStarted.eyebrow}
              title={copy.path.notStarted.title}
              subtitle={copy.path.notStarted.subtitle}
              art={<SealArt source={{ kind: 'arc', arcNumber: 1 }} size={92} color={tone.text} />}
            />
            <AppCard tone="overlay" style={styles.section}>
              {vow ? <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} /> : null}
              <AppText variant="body" color="secondary">
                {copy.path.notStarted.body}
              </AppText>
              <AppButton label={copy.path.notStarted.begin} onPress={() => void beginPath()} />
            </AppCard>
          </>
        ) : (
          <>
            {/* Living hero — the 9-arc pulse is the focal art, in today's arc tone. */}
            <AppHero
              tone={tone}
              align="center"
              eyebrow={brief?.greeting ?? `Day ${currentDay}`}
              title={brief?.arcTitle || `Day ${currentDay}`}
              halo={false}
            >
              <PathPulse
                currentDay={currentDay}
                arcTitle={brief?.arcTitle}
                litColor={tone.base}
                size={208}
              />
            </AppHero>

            {/* Vow — set in the arc tone. */}
            {vow ? (
              <SectionBand tone={tone}>
                <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} />
              </SectionBand>
            ) : null}

            {/* Crown unlock banner */}
            {isCrownUnlocked ? (
              <AppCard tone="raised" border="gold">
                <AppText variant="caption" color="energy" uppercase>
                  {copy.path.crown.label}
                </AppText>
                <AppText variant="body" color="secondary">
                  {copy.path.crown.body}
                </AppText>
                <AppButton label={copy.path.crown.action} onPress={() => router.push(Routes.crown)} />
              </AppCard>
            ) : null}

            {/* Time-of-day focus — changes morning → night. */}
            {brief?.focus ? (
              <FadeInRise index={0}>
                <FocusCard
                  label={brief.focus.label}
                  body={brief.focus.body}
                  eyebrowColor={tone.text}
                  onPress={openChamber}
                />
              </FadeInRise>
            ) : (
              <AppCard tone="overlay">
                <AppText variant="body" color="secondary" align="center">
                  {copy.path.longPathComplete}
                </AppText>
              </AppCard>
            )}

            {/* Today's teaching — the rotating daily codex, surfaced from the library. */}
            {brief?.teaching ? (
              <FadeInRise index={1}>
                <AppCard tone="overlay" onPress={() => router.push(Routes.codex)}>
                  <AppText variant="caption" uppercase style={{ color: tone.text }}>
                    {brief.teaching.eyebrow}
                  </AppText>
                  <AppText variant="subheading">{brief.teaching.title}</AppText>
                  <AppText variant="body" color="secondary" numberOfLines={3}>
                    {brief.teaching.body}
                  </AppText>
                </AppCard>
              </FadeInRise>
            ) : null}

            {/* Primary action — the center of the daily experience. */}
            {hasMilestone ? (
              <AppText variant="caption" color="energy" align="center">
                {copy.path.milestoneHint}
              </AppText>
            ) : null}
            <AppButton label={copy.path.openChamber} fullWidth onPress={openChamber} />

            {/* Compact stat band — Day now lives in the pulse, so show the rest. */}
            {summary ? (
              <View style={styles.statsGrid}>
                <AppStatCard label={copy.path.stats.streak} value={summary.longestPathDays.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.urges} value={summary.urgesObserved.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.forge} value={summary.forgeActs.toString()} style={styles.stat} />
              </View>
            ) : null}

            {/* Secondary actions */}
            <SplitRow>
              <AppButton label={copy.path.logForge} variant="secondary" fullWidth onPress={() => router.push(Routes.forge)} />
              <AppButton label={copy.path.journalTonight} variant="secondary" fullWidth onPress={() => router.push(Routes.journal)} />
            </SplitRow>
            <AppButton label={copy.path.viewMap} variant="ghost" fullWidth onPress={() => router.push(Routes.pathMap)} />

            {/* Record a lapse — quiet, never shaming */}
            <AppButton label={copy.path.recordLapse} variant="ghost" fullWidth onPress={() => router.push(Routes.lapse)} />
          </>
        )}
      </View>

      <ThemePickerModal visible={themePickerOpen} onClose={() => setThemePickerOpen(false)} />
    </AppScreen>
  );
}

function FocusCard({
  label,
  body,
  eyebrowColor,
  onPress,
}: {
  label: string;
  body: string;
  eyebrowColor: string;
  onPress: () => void;
}) {
  return (
    <AppCard tone="overlay" onPress={onPress}>
      <AppText variant="caption" uppercase style={{ color: eyebrowColor }}>
        {label}
      </AppText>
      <AppText variant="body" color="secondary" numberOfLines={3}>
        {body}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end' },
  section: { gap: theme.spacing.sm },
  statsGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  stat: { flex: 1, minWidth: 0 },
  paletteIcon: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  paletteDot: { width: 5, height: 5, borderRadius: 2.5 },
});
