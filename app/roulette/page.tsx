"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Filters, MovieSummary } from "@/lib/types";
import { useFilters, useLibrary } from "@/lib/storage";
import FilterPanel from "@/components/FilterPanel";
import SwipeDeck from "@/components/SwipeDeck";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";

type Status = "idle" | "loading" | "ready" | "error" | "missing_key";

function filterParams(f: Filters) {
  const p = new URLSearchParams();
  if (f.mood) p.set("mood", f.mood);
  if (f.maxRuntime) p.set("maxRuntime", String(f.maxRuntime));
  if (f.yearFrom) p.set("yearFrom", String(f.yearFrom));
  if (f.minRating) p.set("minRating", String(f.minRating));
  if (f.genre) p.set("genre", String(f.genre));
  if (f.provider) p.set("provider", String(f.provider));
  return p;
}

export default function RoulettePage() {
  const router = useRouter();
  const { filters, update, ready: filtersReady } = useFilters();
  const { watched, save, ready: libraryReady } = useLibrary();

  const [queue, setQueue] = useState<MovieSummary[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const seen = useRef<Set<number>>(new Set());
  const requestId = useRef(0);

  const watchedIds = useMemo(
    () => new Set(watched.map((w) => w.id)),
    [watched]
  );

  const load = useCallback(
    async (reset: boolean) => {
      const id = ++requestId.current;
      if (reset) {
        seen.current = new Set();
        setQueue([]);
      }
      setStatus("loading");
      try {
        const res = await fetch(`/api/discover?${filterParams(filters)}`);
        const data = await res.json();
        if (id !== requestId.current) return;
        if (!res.ok) {
          if (data.error === "missing_key") setStatus("missing_key");
          else {
            setErrorMsg(data.message ?? "Unknown error.");
            setStatus("error");
          }
          return;
        }
        const fresh: MovieSummary[] = (data.results as MovieSummary[]).filter(
          (m) =>
            !seen.current.has(m.id) &&
            !(filters.hideWatched && watchedIds.has(m.id))
        );
        fresh.forEach((m) => seen.current.add(m.id));
        setQueue((prev) => (reset ? fresh : [...prev, ...fresh]));
        setStatus("ready");
      } catch {
        if (id !== requestId.current) return;
        setErrorMsg("Check your connection and try again.");
        setStatus("error");
      }
    },
    [filters, watchedIds]
  );

  // Reload whenever filters change (after initial hydration)
  useEffect(() => {
    if (filtersReady && libraryReady) load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtersReady,
    libraryReady,
    filters.mood,
    filters.maxRuntime,
    filters.yearFrom,
    filters.minRating,
    filters.genre,
    filters.provider,
    filters.hideWatched,
  ]);

  // Top up the queue when it runs low
  useEffect(() => {
    if (status === "ready" && queue.length > 0 && queue.length < 4) load(false);
  }, [queue.length, status, load]);

  const current = queue[0] ?? null;
  const next = queue[1] ?? null;

  const advance = useCallback(() => setQueue((prev) => prev.slice(1)), []);

  const surprise = useCallback(() => {
    if (queue.length === 0) return;
    const pick = queue[Math.floor(Math.random() * queue.length)];
    router.push(`/movie/${pick.id}`);
  }, [queue, router]);

  if (!filtersReady || !libraryReady) return <Spinner label="Warming up" />;

  return (
    <div className="flex flex-col gap-8">
      <FilterPanel filters={filters} onChange={update} />

      <div className="flex justify-center">
        <button
          onClick={surprise}
          disabled={queue.length === 0}
          className="btn btn-ghost px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          🎲 Surprise Me
        </button>
      </div>

      {status === "missing_key" && (
        <ErrorState message="The server has no TMDB API key configured. Add TMDB_API_KEY to the environment and redeploy — see the README." />
      )}

      {status === "error" && (
        <ErrorState message={errorMsg} onRetry={() => load(true)} />
      )}

      {status === "loading" && queue.length === 0 && (
        <Spinner label="Loading the reel" />
      )}

      {status === "ready" && queue.length === 0 && (
        <EmptyState
          title="Nothing matches these filters"
          body="You've either seen it all or the net is too tight. Loosen a filter or two and spin again."
        />
      )}

      {current && (
        <SwipeDeck
          movie={current}
          nextMovie={next}
          onSkip={advance}
          onSave={() => {
            save(current);
            advance();
          }}
          onWatch={() => router.push(`/movie/${current.id}`)}
        />
      )}
    </div>
  );
}
