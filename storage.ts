"use client";

import { useCallback, useEffect, useState } from "react";
import type { Filters, MovieSummary, SavedMovie, WatchedMovie } from "./types";
import { DEFAULT_FILTERS } from "./types";

const KEYS = {
  watchlist: "mr:watchlist",
  watched: "mr:watched",
  filters: "mr:filters",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — the app keeps working in memory.
  }
}

/** Watchlist + watched movies + ratings, persisted in localStorage. */
export function useLibrary() {
  const [watchlist, setWatchlist] = useState<SavedMovie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWatchlist(read<SavedMovie[]>(KEYS.watchlist, []));
    setWatched(read<WatchedMovie[]>(KEYS.watched, []));
    setReady(true);
  }, []);

  const save = useCallback((m: MovieSummary) => {
    setWatchlist((prev) => {
      if (prev.some((x) => x.id === m.id)) return prev;
      const next = [
        {
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          release_date: m.release_date,
          vote_average: m.vote_average,
          savedAt: Date.now(),
        },
        ...prev,
      ];
      write(KEYS.watchlist, next);
      return next;
    });
  }, []);

  const removeSaved = useCallback((id: number) => {
    setWatchlist((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(KEYS.watchlist, next);
      return next;
    });
  }, []);

  const markWatched = useCallback((m: MovieSummary, rating = 0) => {
    setWatched((prev) => {
      if (prev.some((x) => x.id === m.id)) return prev;
      const next = [
        {
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          release_date: m.release_date,
          vote_average: m.vote_average,
          rating,
          watchedAt: Date.now(),
        },
        ...prev,
      ];
      write(KEYS.watched, next);
      return next;
    });
    // Watching a movie removes it from the watchlist
    setWatchlist((prev) => {
      const next = prev.filter((x) => x.id !== m.id);
      write(KEYS.watchlist, next);
      return next;
    });
  }, []);

  const rate = useCallback((id: number, rating: number) => {
    setWatched((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, rating } : x));
      write(KEYS.watched, next);
      return next;
    });
  }, []);

  const removeWatched = useCallback((id: number) => {
    setWatched((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(KEYS.watched, next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: number) => watchlist.some((x) => x.id === id),
    [watchlist]
  );
  const isWatched = useCallback(
    (id: number) => watched.some((x) => x.id === id),
    [watched]
  );

  return {
    ready,
    watchlist,
    watched,
    save,
    removeSaved,
    markWatched,
    rate,
    removeWatched,
    isSaved,
    isWatched,
  };
}

/** Roulette filters, persisted in localStorage. */
export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFilters({ ...DEFAULT_FILTERS, ...read<Partial<Filters>>(KEYS.filters, {}) });
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      write(KEYS.filters, next);
      return next;
    });
  }, []);

  return { filters, update, ready };
}
