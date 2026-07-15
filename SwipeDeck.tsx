"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import type { MovieSummary } from "@/lib/types";
import { posterUrl, yearOf } from "@/lib/constants";

type Verdict = "skip" | "save";

export default function SwipeDeck({
  movie,
  nextMovie,
  onSkip,
  onSave,
  onWatch,
}: {
  movie: MovieSummary;
  nextMovie: MovieSummary | null;
  onSkip: () => void;
  onSave: () => void;
  onWatch: () => void;
}) {
  const [leaving, setLeaving] = useState<Verdict | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-12, 12]);
  const saveOpacity = useTransform(x, [40, 140], [0, 1]);
  const skipOpacity = useTransform(x, [-140, -40], [1, 0]);
  const pending = useRef<Verdict | null>(null);

  // Keyboard: ← skip, → save, Enter watch tonight
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") decide("skip");
      else if (e.key === "ArrowRight") decide("save");
      else if (e.key === "Enter" && !(e.target as HTMLElement)?.closest("button, a"))
        onWatch();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.id]);

  function decide(v: Verdict) {
    if (leaving) return;
    pending.current = v;
    setLeaving(v);
  }

  function commit() {
    const v = pending.current;
    pending.current = null;
    setLeaving(null);
    x.set(0);
    if (v === "skip") onSkip();
    if (v === "save") onSave();
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Next card peeking behind */}
      {nextMovie?.poster_path && (
        <div
          aria-hidden
          className="absolute inset-x-3 top-2 -z-10 aspect-[2/3] scale-[0.97] overflow-hidden rounded-2xl border border-line bg-panel opacity-60"
        >
          <Image
            src={posterUrl(nextMovie.poster_path, "w342")!}
            alt=""
            fill
            sizes="384px"
            className="object-cover blur-[1px]"
          />
        </div>
      )}

      <AnimatePresence mode="popLayout" onExitComplete={commit}>
        <motion.article
          key={movie.id}
          aria-label={`${movie.title}, drag right to save or left to skip`}
          drag="x"
          dragElastic={0.7}
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 120 || info.velocity.x > 600) decide("save");
            else if (info.offset.x < -120 || info.velocity.x < -600) decide("skip");
          }}
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={
            leaving
              ? {
                  x: leaving === "save" ? 480 : -480,
                  rotate: leaving === "save" ? 14 : -14,
                  opacity: 0,
                }
              : { opacity: 1, scale: 1, y: 0, x: 0 }
          }
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative aspect-[2/3] cursor-grab touch-pan-y overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] active:cursor-grabbing"
        >
          {movie.poster_path && (
            <Image
              src={posterUrl(movie.poster_path, "w780")!}
              alt={`Poster of ${movie.title}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 384px"
              className="pointer-events-none select-none object-cover"
            />
          )}

          {/* Verdict stamps while dragging */}
          <motion.span
            style={{ opacity: saveOpacity }}
            className="absolute left-4 top-4 rounded-md border-2 border-tungsten px-3 py-1 text-sm font-bold uppercase tracking-widest text-tungsten"
          >
            Save
          </motion.span>
          <motion.span
            style={{ opacity: skipOpacity }}
            className="absolute right-4 top-4 rounded-md border-2 border-mist px-3 py-1 text-sm font-bold uppercase tracking-widest text-mist"
          >
            Skip
          </motion.span>

          {/* Info gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/70 to-transparent px-5 pb-5 pt-20">
            <p className="meta mb-1.5">
              {yearOf(movie.release_date)} · ★ {movie.vote_average.toFixed(1)}
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight">
              {movie.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
              {movie.overview}
            </p>
          </div>
        </motion.article>
      </AnimatePresence>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => decide("skip")}
          className="btn btn-ghost h-12 px-5 text-sm"
          aria-label="Skip this movie (left arrow)"
        >
          ← Skip
        </button>
        <button
          onClick={onWatch}
          className="btn btn-primary h-14 px-7 text-base shadow-[0_0_40px_-8px_rgba(230,169,78,0.5)]"
        >
          Watch Tonight
        </button>
        <button
          onClick={() => decide("save")}
          className="btn btn-ghost h-12 px-5 text-sm"
          aria-label="Save this movie to your watchlist (right arrow)"
        >
          Save →
        </button>
      </div>
      <p className="meta mt-3 text-center">
        Swipe, or use ← → and Enter
      </p>
    </div>
  );
}
