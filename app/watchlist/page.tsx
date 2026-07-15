"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLibrary } from "@/lib/storage";
import { posterUrl, yearOf } from "@/lib/constants";
import { EmptyState, Spinner } from "@/components/ui";

export default function WatchlistPage() {
  const { ready, watchlist, removeSaved, markWatched } = useLibrary();

  if (!ready) return <Spinner />;

  if (watchlist.length === 0) {
    return (
      <EmptyState
        title="Your watchlist is empty"
        body="Swipe right on anything that looks good — it lands here, waiting for the right evening."
        ctaHref="/roulette"
        ctaLabel="Spin the roulette"
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>
      <p className="mt-1 text-sm text-mist">
        {watchlist.length} movie{watchlist.length > 1 ? "s" : ""} saved on this
        device.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        <AnimatePresence>
          {watchlist.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group"
            >
              <Link href={`/movie/${m.id}`} aria-label={`Open ${m.title}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-panel">
                  {m.poster_path && (
                    <Image
                      src={posterUrl(m.poster_path, "w342")!}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
              </Link>
              <p className="mt-2 line-clamp-1 text-sm font-medium">{m.title}</p>
              <p className="meta mt-0.5">
                {yearOf(m.release_date)} · ★ {m.vote_average.toFixed(1)}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() =>
                    markWatched({
                      id: m.id,
                      title: m.title,
                      poster_path: m.poster_path,
                      release_date: m.release_date,
                      vote_average: m.vote_average,
                      vote_count: 0,
                      overview: "",
                      backdrop_path: null,
                    })
                  }
                  className="btn btn-ghost px-3 py-1.5 text-xs"
                >
                  Watched it
                </button>
                <button
                  onClick={() => removeSaved(m.id)}
                  className="btn btn-ghost px-3 py-1.5 text-xs text-mist"
                  aria-label={`Remove ${m.title} from watchlist`}
                >
                  Remove
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
