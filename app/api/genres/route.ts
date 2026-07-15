import { tmdb, tmdbErrorResponse } from "@/lib/tmdb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await tmdb<{ genres: { id: number; name: string }[] }>(
      "/genre/movie/list"
    );
    return Response.json(data);
  } catch (err) {
    return tmdbErrorResponse(err);
  }
}
