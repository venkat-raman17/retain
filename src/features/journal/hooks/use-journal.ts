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
  refresh: () => void;
  error: string | null;
}

export function useJournal(): UseJournal {
  const { journal } = useRepositories();
  const service = useMemo(() => new JournalService(journal, systemClock), [journal]);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumping this token re-runs the load effect — a clean, race-safe refresh that
  // keeps state-setting inside the async effect rather than in the effect body.
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    service
      .listEntries()
      .then((data) => {
        if (!active) return;
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, reloadToken]);

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

  return { entries, loading, addEntry, deleteEntry, refresh, error };
}
