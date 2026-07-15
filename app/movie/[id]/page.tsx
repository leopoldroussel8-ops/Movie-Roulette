"use client";

import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MovieDetail } from "@/lib/types";
import {
  backdropUrl,
  formatRuntime,
  logoUrl,
  posterUrl,
  profileUrl,
  yearOf,
} from "@/lib/constants";
import { useLibrary } from "@/lib/storage";
import { ErrorState, Spinner, Stars } from "@/components/ui";

type Status = "loading" | "ready" | "error";

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    ready,
    save,
    removeSaved,
    isSaved,
    isWatched,
    markWatched,
    removeWatched,
    rate,
    watched,
  } = useLibrary();

  const load = useCallback(() => {
    setStatus("loading");
    setShowTrailer(false);
    fetch(`/api/movie/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message ?? "Could not load this movie.");
        setMovie(data);
        setStatus("ready");
      })
      .catch((e: Error) => {
        setErrorMsg(e.message);
        setStatus("error");
      });
  }, [id]);

  useEffect(load, [load]);

  if (status === "loading" || !ready) return <Spinner label="Rolling film" />;
  if (status === "error" || !movie)
    return <ErrorState message={errorMsg} onRetry={load} />;

  const saved = isSaved(movie.id);
  const seen = isWatched(movie.id);
  const myRating = watched.find((w) => w.id === movie.id)?.rating ?? 0;
  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path, "w500");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-10"
    >
      {/* Backdrop hero */}
      <div className="relative -mx-4 -mt-6 sm:-mx-6">
        <div className="relative h-[44dvh] min-h-72 w-full overflow-hidden sm:h-[56dvh]">
          {backdrop ? (
            <Image
              src={backdrop}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-panel" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-night/20" />
        </div>

        <div className="mx-auto -mt-28 flex w-full max-w-6xl flex-col items-start gap-6 px-4 sm:-mt-36 sm:flex-row sm:px-6">
          {poster && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-xl border border-line shadow-2xl sm:w-52"
            >
              <Image
                src={poster}
                alt={`Poster of ${movie.title}`}
                fill
                sizes="208px"
                className="object-cover"
              />
            </motion.div>
          )}

          <div className="relative pt-1 sm:pt-24">
            <p className="meta mb-2">
              {yearOf(movie.release_date)}
              {movie.runtime ? ` · ${formatRuntime(movie.runtime)}` : ""}
              {" · ★ "}
              {movie.vote_average.toFixed(1)}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-2 text-sm italic text-mist">{movie.tagline}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g.id} className="chip cursor-default">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/roulette" className="btn btn-ghost px-5 py-2.5 text-sm">
          ← Back to the roulette
        </Link>
        <button
          onClick={() => (saved ? removeSaved(movie.id) : save(movie))}
          className={`btn px-5 py-2.5 text-sm ${saved ? "btn-primary" : "btn-ghost"}`}
        >
          {saved ? "✓ Saved" : "Save for later"}
        </button>
        <button
          onClick={() =>
            seen ? removeWatched(movie.id) : markWatched(movie)
          }
          className={`btn px-5 py-2.5 text-sm ${seen ? "btn-primary" : "btn-ghost"}`}
        >
          {seen ? "✓ Watched" : "Mark as watched"}
        </button>
        {seen && (
          <Stars value={myRating} onChange={(v) => rate(movie.id, v)} />
        )}
      </div>

      {/* Overview + facts */}
      <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="meta mb-3">Story</h2>
          <p className="max-w-2xl leading-relaxed text-ivory/90">
            {movie.overview}
          </p>
        </div>
        <dl className="flex flex-col gap-3 text-sm">
          {movie.director && (
            <div>
              <dt className="meta">Director</dt>
              <dd className="mt-0.5">{movie.director}</dd>
            </div>
          )}
          {movie.runtime ? (
            <div>
              <dt className="meta">Runtime</dt>
              <dd className="mt-0.5">{formatRuntime(movie.runtime)}</dd>
            </div>
          ) : null}
          <div>
            <dt className="meta">TMDB rating</dt>
            <dd className="mt-0.5">
              ★ {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votes)
            </dd>
          </div>
        </dl>
      </div>

      {/* Trailer */}
      {movie.trailerKey && (
        <section>
          <h2 className="meta mb-3">Trailer</h2>
          <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-line bg-panel">
            {showTrailer ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1`}
                title={`${movie.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                onClick={() => setShowTrailer(true)}
                className="group absolute inset-0 flex items-center justify-center"
                aria-label={`Play the trailer for ${movie.title}`}
              >
                {backdrop && (
                  <Image
                    src={backdrop}
                    alt=""
                    fill
                    sizes="768px"
                    className="object-cover opacity-50 transition-opacity group-hover:opacity-70"
                  />
                )}
                <span className="btn btn-primary relative px-7 py-3 text-sm">
                  ▶ Play trailer
                </span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* Streaming providers */}
      <section>
        <h2 className="meta mb-3">Where to watch</h2>
        {movie.providers.flatrate.length ||
        movie.providers.rent.length ||
        movie.providers.buy.length ? (
          <div className="flex flex-col gap-3">
            {(
              [
                ["Streaming", movie.providers.flatrate],
                ["Rent", movie.providers.rent],
                ["Buy", movie.providers.buy],
              ] as const
            ).map(([label, list]) =>
              list.length ? (
                <div key={label} className="flex items-center gap-3">
                  <span className="meta w-20 shrink-0">{label}</span>
                  <div className="flex flex-wrap gap-2">
                    {list.map((p) => (
                      <Image
                        key={`${label}-${p.provider_id}`}
                        src={logoUrl(p.logo_path)}
                        alt={p.provider_name}
                        title={p.provider_name}
                        width={40}
                        height={40}
                        className="rounded-lg border border-line"
                      />
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {movie.providers.link && (
              <a
                href={movie.providers.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 w-fit text-sm text-tungsten underline-offset-4 hover:underline"
              >
                See all options on TMDB ↗
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-mist">
            No streaming availability listed for your region right now.
          </p>
        )}
      </section>

      {/* Cast */}
      {movie.cast.length > 0 && (
        <section>
          <h2 className="meta mb-3">Cast</h2>
          <ul className="flex gap-4 overflow-x-auto pb-2">
            {movie.cast.map((c) => (
              <li key={c.id} className="w-24 shrink-0 text-center">
                <div className="relative mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full border border-line bg-panel">
                  {c.profile_path ? (
                    <Image
                      src={profileUrl(c.profile_path)!}
                      alt={c.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-2xl text-mist">
                      {c.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium leading-tight">{c.name}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-mist">
                  {c.character}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Similar movies */}
      {movie.similar.length > 0 && (
        <section>
          <h2 className="meta mb-3">If not this one</h2>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {movie.similar.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/movie/${m.id}`}
                  className="group block"
                  aria-label={`Open ${m.title}`}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-line bg-panel">
                    <Image
                      src={posterUrl(m.poster_path, "w342")!}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 33vw, 12vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs text-mist group-hover:text-ivory">
                    {m.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
}
