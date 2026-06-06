import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { copy } from '@/content';
import { AppText, Button, Card, Divider, Screen, ScreenHeader } from '@/shared/components';
import { theme } from '@/shared/design';

import type { JournalEntry } from '../domain/journal-entry';
import { useJournal } from '../hooks/use-journal';

function EntryRow({ entry }: { entry: JournalEntry }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" color="accent" uppercase>
        {entry.kind}
      </AppText>
      <AppText variant="body">{entry.body}</AppText>
    </View>
  );
}

export function JournalScreen() {
  const { entries, addEntry, loading, error } = useJournal();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (body.trim().length === 0) return;
    setSaving(true);
    const saved = await addEntry({ body });
    setSaving(false);
    if (saved) setBody('');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ScreenHeader
          eyebrow={copy.journal.eyebrow}
          title={copy.journal.title}
          subtitle={copy.journal.description}
        />

        <Card style={styles.composer}>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write a reflection…"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            multiline
          />
          {error ? (
            <AppText variant="caption" color="support">
              {error}
            </AppText>
          ) : null}
          <Button
            label={copy.actions.save}
            onPress={() => void onSave()}
            loading={saving}
            disabled={body.trim().length === 0}
          />
        </Card>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EntryRow entry={item} />}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            loading ? null : (
              <AppText variant="body" color="muted">
                {copy.journal.empty}
              </AppText>
            )
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: theme.spacing.lg },
  composer: { gap: theme.spacing.md },
  input: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  list: { paddingBottom: theme.spacing.xl, gap: theme.spacing.xs },
  row: { gap: theme.spacing.xs, paddingVertical: theme.spacing.md },
});
