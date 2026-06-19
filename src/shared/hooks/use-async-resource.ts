import { useCallback, useEffect, useMemo, useState } from 'react';

import { createLogger } from '@/shared/lib';

export interface AsyncResource<T> {
  /** The loaded value, or null until the first successful load. */
  data: T | null;
  loading: boolean;
  /** The last load error, or null. */
  error: unknown;
  /** Re-run `load`. Race-safe: a stale in-flight load never overwrites a newer one. */
  refresh: () => void;
}

export interface AsyncResourceOptions {
  /** Logger scope for load failures (via createLogger). Omit to stay silent. */
  scope?: string;
}

/**
 * The one async-load pattern for feature hooks: memoized load → loading flag →
 * data/error state → race-safe refresh. Replaces the bespoke
 * useEffect+useState+reloadToken boilerplate that was copied across ~12 hooks.
 *
 * `load` MUST be stable (wrap it in useCallback in the caller) or the effect
 * re-runs every render. Errors are logged when `scope` is given, never swallowed.
 */
export function useAsyncResource<T>(
  load: () => Promise<T>,
  opts: AsyncResourceOptions = {},
): AsyncResource<T> {
  const { scope } = opts;
  const log = useMemo(() => (scope ? createLogger(scope) : null), [scope]);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let active = true;
    load()
      .then((value) => {
        if (!active) return;
        setData(value);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err);
        log?.error('Failed to load resource', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load, reloadToken, log]);

  return { data, loading, error, refresh };
}
