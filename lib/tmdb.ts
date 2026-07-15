/**
 * Server-only TMDB client.
 *
 * Configuration (set in .env.local locally, or in your host's env settings):
 *   TMDB_API_KEY      — a TMDB v3 API key            (use this OR the token below)
 *   TMDB_ACCESS_TOKEN — a TMDB v4 Read Access Token  (preferred if you have it)
 *   TMDB_REGION       — optional, watch-provider region, defaults to "FR"
 *   TMDB_LANGUAGE     — optional, defaults to "en-US"
 *
 * The key is only ever read inside API route handlers, so it is never
 * shipped to the browser.
 */

const BASE = "https://api.themoviedb.org/3";

export const TMDB_REGION = process.env.TMDB_REGION || "FR";
export const TMDB_LANGUAGE = process.env.TMDB_LANGUAGE || "en-US";

export class TmdbConfigError extends Error {
  constructor() {
    super(
      "TMDB is not configured. Set TMDB_API_KEY or TMDB_ACCESS_TOKEN in your environment."
    );
    this.name = "TmdbConfigError";
  }
}

export async function tmdb<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!token && !apiKey) throw new TmdbConfigError();

  const url = new URL(BASE + path);
  url.searchParams.set("language", TMDB_LANGUAGE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  if (!token && apiKey) url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    headers: token
      ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
      : { Accept: "application/json" },
    // Cache TMDB responses for an hour on the server
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export function tmdbErrorResponse(err: unknown) {
  if (err instanceof TmdbConfigError) {
    return Response.json(
      { error: "missing_key", message: err.message },
      { status: 503 }
    );
  }
  console.error(err);
  return Response.json(
    { error: "tmdb_error", message: "Could not reach the movie database." },
    { status: 502 }
  );
}
