"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLibrary } from "@/lib/storage";
import { posterUrl, yearOf } from "@/lib/constants";
import { EmptyState, Spinner, Stars } from "@/components/ui";

export default function WatchedPage() {
  const { ready, watched, rate, removeWatched } = useLibrary();

  if (!ready) return <Spinner />;

  if (watched.length === 0) {
    return (
      <EmptyState
        title="Nothing watched yet"
        body="When you finish a movie, mark it as watched and rate it. Rated movies stay out of your roulette."
        ctaHref="/roulette"
        ctaLabel="Find something to watch"
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Watched</h1>
      <p className="mt-1 text-sm text-mist">
        {watched.length} movie{watched.length > 1 ? "s" : ""} rated on this
        device. These stay hidden from the roulette when the filter is on.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        <AnimatePresence>
          {watched.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex items-center gap-4 rounded-xl border border-line bg-panel/60 p-3"
            >
              <Link
                href={`/movie/${m.id}`}
                className="relative block h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-line"
                aria-label={`Open ${m.title}`}
              >
                {m.poster_path && (
                  <Image
                    src={posterUrl(m.poster_path, "w342")!}
                    alt={m.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-medium">{m.title}</p>
                <p className="meta mt-0.5">{yearOf(m.release_date)}</p>
                <div className="mt-1.5">
                  <Stars
                    value={m.rating}
                    onChange={(v) => rate(m.id, v)}
                    label={`Rate ${m.title}`}
                  />
                </div>
              </div>
              <button
                onClick={() => removeWatched(m.id)}
                className="btn btn-ghost shrink-0 px-3 py-1.5 text-xs text-mist"
                aria-label={`Remove ${m.title} from watched`}
              >
                Remove
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
