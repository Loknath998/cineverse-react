/**
 * Minimal async-data hook with a shared in-memory cache — enough for the
 * app's read-only TMDB queries, without a data-fetching dependency.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Entry = { value: unknown; at: number };

const CACHE = new Map<string, Entry>();
const TTL = 5 * 60 * 1000;

export function readCache<T>(key: string): T | undefined {
  const hit = CACHE.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > TTL) {
    CACHE.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function writeCache(key: string, value: unknown) {
  CACHE.set(key, { value, at: Date.now() });
}

export function clearCache() {
  CACHE.clear();
}

export type QueryResult<T> = {
  data: T | undefined;
  error: Error | undefined;
  isPending: boolean;
  refetch: () => void;
};

export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
}: {
  queryKey: unknown[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
}): QueryResult<T> {
  const key = JSON.stringify(queryKey);
  const fnRef = useRef(queryFn);
  fnRef.current = queryFn;

  const [state, setState] = useState<{ data: T | undefined; error: Error | undefined }>(() => ({
    data: readCache<T>(key),
    error: undefined,
  }));
  const [pending, setPending] = useState(enabled && readCache<T>(key) === undefined);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setPending(false);
      return;
    }
    const cached = readCache<T>(key);
    if (cached !== undefined && nonce === 0) {
      setState({ data: cached, error: undefined });
      setPending(false);
      return;
    }

    let alive = true;
    setPending(true);
    fnRef
      .current()
      .then((value) => {
        writeCache(key, value);
        if (alive) {
          setState({ data: value, error: undefined });
          setPending(false);
        }
      })
      .catch((error: Error) => {
        if (alive) {
          setState({ data: undefined, error });
          setPending(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [key, enabled, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { data: state.data, error: state.error, isPending: pending, refetch };
}
