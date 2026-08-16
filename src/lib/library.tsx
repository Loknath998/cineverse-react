import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/** Client-side library store (watchlist, favorites, watched, ratings). */

export type LibraryEntry = {
  id: number;
  title: string;
  poster: string | null;
  year: string;
  rating: number;
  addedAt: number;
};

type Activity = {
  id: number;
  title: string;
  poster: string | null;
  kind: "rated" | "watched" | "watchlist" | "favorite";
  value?: number;
  at: number;
};

type State = {
  watchlist: LibraryEntry[];
  favorites: LibraryEntry[];
  watched: LibraryEntry[];
  ratings: Record<number, number>;
  notes: Record<number, string>;
  activity: Activity[];
};

const EMPTY: State = { watchlist: [], favorites: [], watched: [], ratings: {}, notes: {}, activity: [] };
const KEY = "cineverse.library.v1";

type Ctx = State & {
  ready: boolean;
  has: (list: "watchlist" | "favorites" | "watched", id: number) => boolean;
  toggle: (
    list: "watchlist" | "favorites" | "watched",
    movie: Omit<LibraryEntry, "addedAt">,
  ) => void;
  rate: (movie: Omit<LibraryEntry, "addedAt">, value: number) => void;
  setNote: (movieId: number, note: string) => void;
  remove: (list: "watchlist" | "favorites" | "watched", ids: number[]) => void;
  reorderFavorites: (ids: number[]) => void;
};

const LibraryContext = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const has = useCallback(
    (list: "watchlist" | "favorites" | "watched", id: number) =>
      state[list].some((e) => e.id === id),
    [state],
  );

  const toggle = useCallback<Ctx["toggle"]>((list, movie) => {
    setState((prev) => {
      const exists = prev[list].some((e) => e.id === movie.id);
      const next = exists
        ? prev[list].filter((e) => e.id !== movie.id)
        : [{ ...movie, addedAt: Date.now() }, ...prev[list]];
      const activity: Activity[] = exists
        ? prev.activity
        : [
            {
              id: movie.id,
              title: movie.title,
              poster: movie.poster,
              kind: (list === "favorites"
                ? "favorite"
                : list === "watched"
                  ? "watched"
                  : "watchlist") as Activity["kind"],
              at: Date.now(),
            },
            ...prev.activity,
          ].slice(0, 30);
      return { ...prev, [list]: next, activity };
    });
  }, []);

  const rate = useCallback<Ctx["rate"]>((movie, value) => {
    setState((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [movie.id]: value },
      watched: prev.watched.some((e) => e.id === movie.id)
        ? prev.watched
        : [{ ...movie, addedAt: Date.now() }, ...prev.watched],
      activity: [
        {
          id: movie.id,
          title: movie.title,
          poster: movie.poster,
          kind: "rated" as const,
          value,
          at: Date.now(),
        },
        ...prev.activity,
      ].slice(0, 30),
    }));
  }, []);

  const setNote = useCallback<Ctx["setNote"]>((movieId, note) => {
    setState((prev) => {
      const notes = { ...prev.notes };
      if (note.trim()) notes[movieId] = note;
      else delete notes[movieId];
      return { ...prev, notes };
    });
  }, []);

  const remove = useCallback<Ctx["remove"]>((list, ids) => {
    setState((prev) => ({ ...prev, [list]: prev[list].filter((e) => !ids.includes(e.id)) }));
  }, []);

  const reorderFavorites = useCallback((ids: number[]) => {
    setState((prev) => ({
      ...prev,
      favorites: ids
        .map((id) => prev.favorites.find((f) => f.id === id))
        .filter(Boolean) as LibraryEntry[],
    }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ ...state, ready, has, toggle, rate, setNote, remove, reorderFavorites }),
    [state, ready, has, toggle, rate, setNote, remove, reorderFavorites],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
