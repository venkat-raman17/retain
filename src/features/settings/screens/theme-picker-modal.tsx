import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { theme as staticTheme } from '@/shared/design';
import { THEME_IDS, THEME_META, type ThemeId } from '@/shared/design/themes';
import { useTheme } from '@/shared/hooks/use-theme';
import { useThemeControls } from '@/shared/hooks/use-theme';
import { AppText } from '@/shared/components/text';

interface ThemePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Full-screen modal for selecting a premium theme.
 * Shows 4 theme cards in a 2×2 grid. Tapping a card switches and persists
 * the theme immediately, then closes the modal.
 */
export function ThemePickerModal({ visible, onClose }: ThemePickerModalProps) {
  const { colors } = useTheme();
  const { themeId: activeId, setThemeId } = useThemeControls();

  const handleSelect = async (id: ThemeId) => {
    await setThemeId(id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.72)' }]} onPress={onClose}>
        {/* Card — stop propagation so tapping the card doesn't close the modal */}
        <Pressable style={[styles.sheet, { backgroundColor: colors.surfaceOverlay, borderColor: colors.border }]}>
          <AppText variant="caption" color="muted" uppercase align="center" style={styles.heading}>
            Choose your theme
          </AppText>

          <View style={styles.grid}>
            {THEME_IDS.map((id) => {
              const meta = THEME_META[id];
              const isActive = id === activeId;
              return (
                <Pressable
                  key={id}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isActive ? colors.primary : colors.border,
                      borderWidth: isActive ? 1.5 : StyleSheet.hairlineWidth,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => void handleSelect(id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`Select ${meta.name} theme`}
                >
                  {/* Swatch strip */}
                  <View style={styles.swatchRow}>
                    {meta.swatches.map((hex, i) => (
                      <View
                        key={i}
                        style={[
                          styles.swatch,
                          { backgroundColor: hex },
                          i === 0 ? styles.swatchFirst : null,
                          i === meta.swatches.length - 1 ? styles.swatchLast : null,
                        ]}
                      />
                    ))}
                  </View>

                  {/* Label */}
                  <View style={styles.cardBody}>
                    <AppText variant="label" color={isActive ? 'energy' : 'secondary'} weight="semibold">
                      {meta.name}
                    </AppText>
                    {isActive ? (
                      <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Dismiss */}
          <Pressable onPress={onClose} style={styles.dismiss} accessibilityRole="button" accessibilityLabel="Close">
            <AppText variant="caption" color="muted" uppercase>
              Close
            </AppText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: staticTheme.spacing.xl,
  },
  sheet: {
    width: '100%',
    borderRadius: staticTheme.radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: staticTheme.spacing.xl,
    gap: staticTheme.spacing.xl,
  },
  heading: {
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: staticTheme.spacing.md,
  },
  card: {
    width: '47%',
    borderRadius: staticTheme.radii.lg,
    overflow: 'hidden',
  },
  swatchRow: {
    flexDirection: 'row',
    height: 14,
  },
  swatch: {
    flex: 1,
  },
  swatchFirst: {
    borderTopLeftRadius: staticTheme.radii.lg - 1,
  },
  swatchLast: {
    borderTopRightRadius: staticTheme.radii.lg - 1,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: staticTheme.spacing.md,
    paddingVertical: staticTheme.spacing.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: staticTheme.spacing.sm,
  },
});
