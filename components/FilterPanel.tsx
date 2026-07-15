"use client";

import { useEffect, useState } from "react";
import type { Filters } from "@/lib/types";
import {
  MOODS,
  PROVIDERS,
  RATING_OPTIONS,
  RUNTIME_OPTIONS,
  YEAR_OPTIONS,
} from "@/lib/constants";

export default function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/genres")
      .then((r) => (r.ok ? r.json() : { genres: [] }))
      .then((d) => {
        if (!cancelled) setGenres(d.genres ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-label="Movie filters" className="flex flex-col gap-4">
      <div>
        <p className="meta mb-2">Mood</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              className="chip"
              aria-pressed={filters.mood === m.key}
              onClick={() =>
                onChange({ mood: filters.mood === m.key ? null : m.key })
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="meta">Max runtime</span>
          <select
            className="field"
            value={filters.maxRuntime ?? ""}
            onChange={(e) =>
              onChange({ maxRuntime: e.target.value ? Number(e.target.value) : null })
            }
          >
            {RUNTIME_OPTIONS.map((o) => (
              <option key={o.label} value={o.value ?? ""}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="meta">Release year</span>
          <select
            className="field"
            value={filters.yearFrom ?? ""}
            onChange={(e) =>
              onChange({ yearFrom: e.target.value ? Number(e.target.value) : null })
            }
          >
            {YEAR_OPTIONS.map((o) => (
              <option key={o.label} value={o.value ?? ""}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="meta">Min rating</span>
          <select
            className="field"
            value={filters.minRating ?? ""}
            onChange={(e) =>
              onChange({ minRating: e.target.value ? Number(e.target.value) : null })
            }
          >
            {RATING_OPTIONS.map((o) => (
              <option key={o.label} value={o.value ?? ""}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="meta">Genre</span>
          <select
            className="field"
            value={filters.genre ?? ""}
            onChange={(e) =>
              onChange({ genre: e.target.value ? Number(e.target.value) : null })
            }
          >
            <option value="">Any genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex w-full max-w-56 flex-col gap-1.5">
          <span className="meta">Platform</span>
          <select
            className="field"
            value={filters.provider ?? ""}
            onChange={(e) =>
              onChange({ provider: e.target.value ? Number(e.target.value) : null })
            }
          >
            {PROVIDERS.map((p) => (
              <option key={p.label} value={p.value ?? ""}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <button
          className="chip mb-1"
          aria-pressed={filters.hideWatched}
          onClick={() => onChange({ hideWatched: !filters.hideWatched })}
        >
          Hide movies I&apos;ve watched
        </button>
      </div>
    </section>
  );
}
