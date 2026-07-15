import { NextRequest } from "next/server";
import { tmdb, tmdbErrorResponse, TMDB_REGION } from "@/lib/tmdb";
import type { MovieDetail, MovieSummary } from "@/lib/types";

export const runtime = "nodejs";

interface TmdbDetail {
  id: number;
  title: string;
  overview: string;
  tagline: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  videos: { results: { key: string; site: string; type: string; official: boolean }[] };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { name: string; job: string }[];
  };
  recommendations: { results: MovieSummary[] };
  ["watch/providers"]: {
    results: Record<
      string,
      {
        link: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string }[];
      }
    >;
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ error: "bad_id", message: "Invalid movie id." }, { status: 400 });
  }

  try {
    const d = await tmdb<TmdbDetail>(`/movie/${id}`, {
      append_to_response: "videos,credits,recommendations,watch/providers",
    });

    const trailer =
      d.videos.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
      ) || d.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

    const region = d["watch/providers"]?.results?.[TMDB_REGION];

    const detail: MovieDetail = {
      id: d.id,
      title: d.title,
      overview: d.overview,
      tagline: d.tagline,
      poster_path: d.poster_path,
      backdrop_path: d.backdrop_path,
      release_date: d.release_date,
      runtime: d.runtime,
      vote_average: d.vote_average,
      vote_count: d.vote_count,
      genres: d.genres,
      trailerKey: trailer?.key ?? null,
      director: d.credits.crew.find((c) => c.job === "Director")?.name ?? null,
      cast: d.credits.cast.slice(0, 10),
      similar: d.recommendations.results
        .filter((m) => m.poster_path)
        .slice(0, 8),
      providers: {
        link: region?.link ?? null,
        flatrate: region?.flatrate ?? [],
        rent: region?.rent ?? [],
        buy: region?.buy ?? [],
      },
    };

    return Response.json(detail);
  } catch (err) {
    return tmdbErrorResponse(err);
  }
}
