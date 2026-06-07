import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { copy, getDailyPathContent } from '@/content';
import {
  AppButton,
  AppCard,
  AppIconButton,
  AppQuoteBlock,
  AppScreen,
  AppHeader,
  AppStatCard,
  AppText,
  FadeInRise,
  GateSigil,
  ScreenCrest,
  symbolStroke,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';
import { Routes } from '@/navigation';
import { ThemePickerModal } from '@/features/settings/screens/theme-picker-modal';

import { usePath } from '../hooks/use-path';
import { usePathProgress } from '../hooks/use-path-progress';
import { useDailyPath } from '../hooks/use-daily-path';

export function PathScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentDay, isRunning, vow, loading, beginPath, profile, refresh: refreshPath } = usePath();
  const { summary, refresh: refreshProgress } = usePathProgress();
  const { isCrownUnlocked: checkCrownUnlocked } = useDailyPath();
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshPath();
      refreshProgress();
    }, [refreshPath, refreshProgress]),
  );

  const isCrownUnlocked = profile ? checkCrownUnlocked(profile, currentDay) : false;

  const day = currentDay > 0 ? currentDay : 1;
  const todaysContent = getDailyPathContent(day);
  const hasMilestone = Boolean(todaysContent?.milestoneRiteId);

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
        {/* Header row — gate crest behind, title + theme picker in front */}
        <View>
          <ScreenCrest>
            <GateSigil size={110} color={colors.textMuted} strokeWidth={symbolStroke(110)} />
          </ScreenCrest>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <AppHeader
              eyebrow={isRunning ? `Day ${currentDay}` : copy.path.notStarted.eyebrow}
              title={todaysContent?.title ?? copy.path.notStarted.title}
              subtitle={todaysContent?.openingLine ?? copy.path.notStarted.subtitle}
            />
          </View>
          <AppIconButton
            accessibilityLabel="Choose theme"
            onPress={() => setThemePickerOpen(true)}
            size={36}
          >
            {/* Three-dot palette sigil */}
            <View style={styles.paletteIcon}>
              {[colors.primary, colors.textSecondary, colors.textMuted].map((c, i) => (
                <View key={i} style={[styles.paletteDot, { backgroundColor: c }]} />
              ))}
            </View>
          </AppIconButton>
        </View>
        </View>

        {!isRunning && !loading ? (
          <AppCard tone="overlay" style={styles.section}>
            {vow ? <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} /> : null}
            <AppText variant="body" color="secondary">
              {copy.path.notStarted.body}
            </AppText>
            <AppButton label={copy.path.notStarted.begin} onPress={() => void beginPath()} />
          </AppCard>
        ) : (
          <>
            {/* Vow */}
            {vow ? (
              <AppCard tone="overlay" style={styles.section}>
                <AppQuoteBlock quote={vow} attribution={copy.path.vowAttribution} />
              </AppCard>
            ) : null}

            {/* Stats — short labels so they never wrap */}
            {summary ? (
              <View style={styles.statsGrid}>
                <AppStatCard label={copy.path.stats.day} value={currentDay.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.streak} value={summary.longestPathDays.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.urges} value={summary.urgesObserved.toString()} style={styles.stat} />
                <AppStatCard label={copy.path.stats.forge} value={summary.forgeActs.toString()} style={styles.stat} />
              </View>
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

            {/* Primary action — the center of the daily experience */}
            {hasMilestone ? (
              <AppText variant="caption" color="energy" align="center">
                {copy.path.milestoneHint}
              </AppText>
            ) : null}
            <AppButton label={copy.path.openChamber} fullWidth onPress={openChamber} />

            {/* Secondary actions */}
            <View style={styles.row}>
              <AppButton
                label={copy.path.logForge}
                variant="secondary"
                style={styles.halfAction}
                onPress={() => router.push(Routes.forge)}
              />
              <AppButton
                label={copy.path.journalTonight}
                variant="secondary"
                style={styles.halfAction}
                onPress={() => router.push(Routes.journal)}
              />
            </View>
            <AppButton
              label={copy.path.viewMap}
              variant="ghost"
              fullWidth
              onPress={() => router.push(Routes.pathMap)}
            />

            {/* Two quiet teasers only — the full lesson lives in the chamber */}
            {todaysContent ? (
              <>
                <FadeInRise index={0}>
                  <PreviewCard
                    label={copy.path.previewCommand}
                    body={todaysContent.command}
                    onPress={openChamber}
                  />
                </FadeInRise>
                <FadeInRise index={1}>
                  <PreviewCard
                    label={copy.path.previewEvening}
                    body={todaysContent.eveningAccount}
                    onPress={openChamber}
                  />
                </FadeInRise>
              </>
            ) : (
              <AppCard tone="overlay">
                <AppText variant="body" color="secondary" align="center">
                  {copy.path.longPathComplete}
                </AppText>
              </AppCard>
            )}

            {/* Record a lapse — quiet, never shaming */}
            <AppButton
              label={copy.path.recordLapse}
              variant="ghost"
              fullWidth
              onPress={() => router.push(Routes.lapse)}
            />
          </>
        )}
      </View>

      <ThemePickerModal
        visible={themePickerOpen}
        onClose={() => setThemePickerOpen(false)}
      />
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  section: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.md },
  halfAction: { flex: 1 },
  statsGrid: { flexDirection: 'row', gap: theme.spacing.sm },
  stat: { flex: 1, minWidth: 0 },
  paletteIcon: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  paletteDot: { width: 5, height: 5, borderRadius: 2.5 },
});
