import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { copy } from '@/content';
import { VOW_PRESETS, type UserProfile } from '@/features/path/domain/user-profile';
import {
  AppButton,
  AppSelectList,
  AppText,
  AppTextInput,
  type SelectOption,
} from '@/shared/components';
import { theme as staticTheme } from '@/shared/design';
import { useTheme } from '@/shared/hooks/use-theme';

const CUSTOM = '__custom__';

const OPTIONS: SelectOption<string>[] = [
  ...VOW_PRESETS.map((v) => ({ value: v.id, label: v.text })),
  { value: CUSTOM, label: copy.settings.vowModal.customOption },
];

interface VowEditorModalProps {
  visible: boolean;
  profile: UserProfile | null;
  onClose: () => void;
  onSave: (selectedVow: string | null, customVow: string | null) => Promise<void>;
}

/** Edit the vow after onboarding — pick a preset or write a custom one. */
export function VowEditorModal({ visible, profile, onClose, onSave }: VowEditorModalProps) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.72)' }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surfaceOverlay, borderColor: colors.border }]}
        >
          {/* Mounted only while open, so the picker seeds from the stored vow each time. */}
          {visible ? <VowEditorBody profile={profile} onClose={onClose} onSave={onSave} /> : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function VowEditorBody({
  profile,
  onClose,
  onSave,
}: {
  profile: UserProfile | null;
  onClose: () => void;
  onSave: (selectedVow: string | null, customVow: string | null) => Promise<void>;
}) {
  const [choice, setChoice] = useState<string>(() =>
    profile?.customVow ? CUSTOM : (profile?.selectedVow ?? VOW_PRESETS[0]?.id ?? CUSTOM),
  );
  const [customText, setCustomText] = useState(() => profile?.customVow ?? '');
  const [saving, setSaving] = useState(false);

  const isCustom = choice === CUSTOM;
  const canSave = isCustom ? customText.trim().length > 0 : true;

  const save = async () => {
    setSaving(true);
    try {
      if (isCustom) await onSave(null, customText.trim());
      else await onSave(choice, null);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppText variant="caption" color="muted" uppercase align="center">
        {copy.settings.vowModal.title}
      </AppText>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <AppSelectList options={OPTIONS} value={choice} onChange={setChoice} />
        {isCustom ? (
          <AppTextInput
            label={copy.onboarding.vow.customLabel}
            placeholder={copy.onboarding.vow.customPlaceholder}
            value={customText}
            onChangeText={setCustomText}
            maxLength={280}
            multiline
          />
        ) : null}
      </ScrollView>
      <AppButton
        label={copy.settings.vowModal.save}
        fullWidth
        disabled={!canSave}
        loading={saving}
        onPress={() => void save()}
      />
      <AppButton label={copy.settings.cancel} variant="ghost" fullWidth onPress={onClose} />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: staticTheme.spacing.xl },
  sheet: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: staticTheme.radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: staticTheme.spacing.xl,
    gap: staticTheme.spacing.lg,
  },
  scroll: { gap: staticTheme.spacing.md },
});
