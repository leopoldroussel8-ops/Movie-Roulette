export const MOODS: { key: string; label: string; genres: number[] }[] = [
  { key: "funny", label: "Funny", genres: [35] },
  { key: "tense", label: "Tense", genres: [53] },
  { key: "emotional", label: "Emotional", genres: [18] },
  { key: "mindbending", label: "Mind-bending", genres: [878, 9648] },
  { key: "romantic", label: "Romantic", genres: [10749] },
  { key: "action", label: "Action", genres: [28] },
  { key: "horror", label: "Horror", genres: [27] },
  { key: "feelgood", label: "Feel-good", genres: [35, 10751] },
];

export const RUNTIME_OPTIONS = [
  { label: "Any length", value: null },
  { label: "Under 90 min", value: 90 },
  { label: "Under 2 hours", value: 120 },
  { label: "Under 3 hours", value: 180 },
];

export const YEAR_OPTIONS = [
  { label: "Any year", value: null },
  { label: "2020s", value: 2020 },
  { label: "2010 or later", value: 2010 },
  { label: "2000 or later", value: 2000 },
  { label: "1990 or later", value: 1990 },
  { label: "1980 or later", value: 1980 },
];

export const RATING_OPTIONS = [
  { label: "Any rating", value: null },
  { label: "6+ on TMDB", value: 6 },
  { label: "7+ on TMDB", value: 7 },
  { label: "8+ on TMDB", value: 8 },
];

// TMDB watch-provider IDs (stable across regions)
export const PROVIDERS = [
  { label: "Any platform", value: null },
  { label: "Netflix", value: 8 },
  { label: "Prime Video", value: 119 },
  { label: "Disney+", value: 337 },
  { label: "Apple TV+", value: 350 },
  { label: "Max", value: 1899 },
  { label: "Canal+", value: 381 },
];

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export function backdropUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : null;
}

export function profileUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w185${path}` : null;
}

export function logoUrl(path: string) {
  return `https://image.tmdb.org/t/p/w92${path}`;
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}` : `${m} min`;
}

export function yearOf(date: string | undefined) {
  return date ? date.slice(0, 4) : "—";
}
