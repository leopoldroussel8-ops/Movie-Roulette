import { NextRequest } from "next/server";
import { tmdb, tmdbErrorResponse, TMDB_REGION } from "@/lib/tmdb";
import { MOODS } from "@/lib/constants";
import type { MovieSummary } from "@/lib/types";

export const runtime = "nodejs";

interface DiscoverResponse {
  page: number;
  total_pages: number;
  results: MovieSummary[];
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;

  const genreSet = new Set<number>();
  const mood = MOODS.find((m) => m.key === q.get("mood"));
  if (mood) mood.genres.forEach((g) => genreSet.add(g));
  const genre = q.get("genre");
  if (genre) genreSet.add(Number(genre));

  const params: Record<string, string | number | boolean | undefined> = {
    sort_by: "popularity.desc",
    include_adult: false,
    "vote_count.gte": 200,
    with_genres: genreSet.size ? [...genreSet].join(",") : undefined,
    "with_runtime.lte": q.get("maxRuntime") || undefined,
    "primary_release_date.gte": q.get("yearFrom")
      ? `${q.get("yearFrom")}-01-01`
      : undefined,
    "vote_average.gte": q.get("minRating") || undefined,
  };

  const provider = q.get("provider");
  if (provider) {
    params.with_watch_providers = provider;
    params.watch_region = TMDB_REGION;
  }

  try {
    // First call to learn how many pages match, then sample a random page
    // so the roulette feels different every spin.
    const first = await tmdb<DiscoverResponse>("/discover/movie", {
      ...params,
      page: 1,
    });
    const maxPage = Math.min(first.total_pages, 20);
    const requestedPage = Number(q.get("page") || 0);
    const page =
      requestedPage > 0
        ? Math.min(requestedPage, maxPage || 1)
        : Math.max(1, Math.ceil(Math.random() * (maxPage || 1)));

    const data =
      page === 1 ? first : await tmdb<DiscoverResponse>("/discover/movie", { ...params, page });

    const results = data.results.filter((m) => m.poster_path && m.overview);
    return Response.json({ results, totalPages: maxPage });
  } catch (err) {
    return tmdbErrorResponse(err);
  }
}
