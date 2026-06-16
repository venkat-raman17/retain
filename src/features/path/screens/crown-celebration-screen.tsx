import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppCard,
  AppDivider,
  AppHero,
  AppQuoteBlock,
  AppScreen,
  AppText,
  SealArt,
} from '@/shared/components';
import { theme } from '@/shared/design';
import { useSurfaceTone } from '@/shared/hooks';
import { Routes } from '@/navigation';

import { useDailyPath } from '../hooks/use-daily-path';

export function CrownCelebrationScreen() {
  const router = useRouter();
  const goldTone = useSurfaceTone({ kind: 'semantic', name: 'gold' });
  const { getCollectedCrownFragments, receiveCrown: commitCrown } = useDailyPath();

  const [fragments, setFragments] = useState<string[]>([]);
  const [receiving, setReceiving] = useState(false);
  const [received, setReceived] = useState(false);

  useEffect(() => {
    void getCollectedCrownFragments().then(setFragments);
  }, [getCollectedCrownFragments]);

  const receiveCrown = useCallback(async () => {
    setReceiving(true);
    try {
      await commitCrown();
      setReceived(true);
    } finally {
      setReceiving(false);
    }
  }, [commitCrown]);

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <AppHero
          tone={goldTone}
          align="center"
          eyebrow="Day 90"
          title="The Crown of Command"
          subtitle="Ninety days does not make a man finished. It proves he can be formed."
          art={<SealArt source={{ kind: 'arc', arcNumber: 9 }} size={124} color={goldTone.text} />}
        />

        <AppCard tone="raised" border="gold">
          <AppText variant="body" color="secondary">
            {"The fire rose. The gates were tested. The body argued. The shadows spoke."}
          </AppText>
          <AppText variant="body" color="secondary" style={styles.spacing}>
            {"You continued."}
          </AppText>
          <AppText variant="body" color="secondary" style={styles.spacing}>
            {"The crown is not decoration. It is responsibility."}
          </AppText>
          <AppText variant="body" color="secondary" style={styles.spacing}>
            {"You are now Crowned. Carry the fire into ordinary days."}
          </AppText>
        </AppCard>

        {/* Crown fragments collected */}
        {fragments.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="caption" color="muted" uppercase>
              {`${fragments.length} keys earned`}
            </AppText>
            {fragments.map((fragment, i) => (
              <AppCard key={i} tone="overlay" border="gold">
                <AppText variant="caption" color="energy">
                  {fragment}
                </AppText>
              </AppCard>
            ))}
          </View>
        ) : null}

        <AppDivider />

        {received ? (
          <>
            <AppText variant="subheading" color="energy" align="center">
              Crowned.
            </AppText>
            <AppText variant="body" color="secondary" align="center">
              {'The Long Path begins now. Continue in ordinary days.'}
            </AppText>
            <AppButton
              label="Begin the Long Path"
              fullWidth
              onPress={() => router.replace(Routes.path)}
            />
          </>
        ) : (
          <>
            <AppQuoteBlock
              quote="You are not done. You are formed enough to begin."
              attribution="The Crown"
            />
            <View style={styles.actions}>
              <AppButton
                label="Receive the Crown"
                fullWidth
                loading={receiving}
                onPress={() => void receiveCrown()}
              />
              <AppButton
                label="Review the Path"
                variant="secondary"
                fullWidth
                onPress={() =>
                  router.push({
                    pathname: '/chamber',
                    params: { day: '90' },
                  })
                }
              />
              <AppButton
                label="Read What Next?"
                variant="ghost"
                fullWidth
                onPress={() => router.push(Routes.codex)}
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
  spacing: { marginTop: theme.spacing.sm },
  section: { gap: theme.spacing.sm },
  actions: { gap: theme.spacing.sm },
});
