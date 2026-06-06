import { useCallback, useEffect, useMemo, useState } from 'react';

import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { JournalEntry, JournalEntryDraft } from '../domain/journal-entry';
import { JournalService } from '../services/journal-service';

export interface UseJournal {
  entries: JournalEntry[];
  loading: boolean;
  addEntry: (draft: JournalEntryDraft) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  error: string | null;
}

export function useJournal(): UseJournal {
  const { journal } = useRepositories();
  const service = useMemo(() => new JournalService(journal, systemClock), [journal]);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setEntries(await service.listEntries());
    setLoading(false);
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addEntry = useCallback(
    async (draft: JournalEntryDraft) => {
      const result = await service.addEntry(draft);
      if (result.ok) {
        setError(null);
        await refresh();
        return true;
      }
      setError(result.error);
      return false;
    },
    [service, refresh],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      await service.deleteEntry(id);
      await refresh();
    },
    [service, refresh],
  );

  return { entries, loading, addEntry, deleteEntry, refresh, error };
}
