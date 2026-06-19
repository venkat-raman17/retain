import { useCallback, useMemo, useState } from 'react';

import { useAsyncResource } from '@/shared/hooks';
import { systemClock } from '@/shared/lib';
import { useRepositories } from '@/shared/storage';

import type { JournalEntry, JournalEntryDraft } from '../domain/journal-entry';
import { JournalService } from '../services/journal-service';

export interface UseJournal {
  entries: JournalEntry[];
  loading: boolean;
  addEntry: (draft: JournalEntryDraft) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => void;
  error: string | null;
}

export function useJournal(): UseJournal {
  const { journal } = useRepositories();
  const service = useMemo(() => new JournalService(journal, systemClock), [journal]);

  const load = useCallback(() => service.listEntries(), [service]);
  const { data, loading, refresh } = useAsyncResource(load, { scope: 'journal' });

  // Validation error from addEntry — distinct from a load failure.
  const [error, setError] = useState<string | null>(null);

  const addEntry = useCallback(
    async (draft: JournalEntryDraft) => {
      const result = await service.addEntry(draft);
      if (result.ok) {
        setError(null);
        refresh();
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
      refresh();
    },
    [service, refresh],
  );

  return { entries: data ?? [], loading, addEntry, deleteEntry, refresh, error };
}
