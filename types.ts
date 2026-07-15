export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null;
  tagline: string;
  genres: { id: number; name: string }[];
  trailerKey: string | null;
  director: string | null;
  cast: CastMember[];
  similar: MovieSummary[];
  providers: {
    link: string | null;
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
  };
}

export interface Filters {
  mood: string | null;
  maxRuntime: number | null; // minutes
  yearFrom: number | null;
  minRating: number | null;
  genre: number | null;
  provider: number | null;
  hideWatched: boolean;
}

export interface SavedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  savedAt: number;
}

export interface WatchedMovie extends Omit<SavedMovie, "savedAt"> {
  rating: number; // 0 = unrated, 1–5 stars
  watchedAt: number;
}

export const DEFAULT_FILTERS: Filters = {
  mood: null,
  maxRuntime: null,
  yearFrom: null,
  minRating: null,
  genre: null,
  provider: null,
  hideWatched: true,
};
