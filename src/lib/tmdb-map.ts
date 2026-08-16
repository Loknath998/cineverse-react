/** Shared, client-safe TMDB shapes and mappers. */

export type MovieCard = {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  backdrop: string | null;
  logo?: string | null;
  rating: number;
  votes: number;
  overview: string;
  genres: string[];
  runtime?: number;
  director?: string;
  character?: string;
  job?: string;
};

export type PersonCard = {
  id: number;
  name: string;
  role: string;
  profile: string | null;
  character?: string;
  count?: number;
};

export type CollectionCard = {
  id: number;
  name: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  count: number;
  posters: string[];
};

export type Rail = { key: string; title: string; subtitle: string; items: MovieCard[] };

export type MovieDetail = MovieCard & {
  tagline: string;
  status: string;
  release: string;
  language: string;
  languages: string[];
  countries: string[];
  budget: number;
  revenue: number;
  homepage: string;
  imdb: string | null;
  cast: PersonCard[];
  crew: PersonCard[];
  director: string;
  directorId: number | null;
  writers: string[];
  similar: MovieCard[];
  recommended: MovieCard[];
  images: string[];
  trailer: string | null;
  collection: { id: number; name: string; backdrop: string | null } | null;
  reviews: { id: string; author: string; content: string; rating: number | null; date: string }[];
  reviewCount: number;
  providers: { name: string; logo: string | null; kind: string }[];
  keywords: string[];
  externalIds: Record<string, unknown>;
};

export type PersonDetail = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place: string | null;
  department: string;
  profile: string | null;
  popularity: number;
  knownFor: MovieCard[];
  credits: MovieCard[];
  crewCredits: MovieCard[];
  images: string[];
  collaborators: PersonCard[];
  averageRating: number;
  creditCount: number;
  firstYear: string;
};

export const IMG = "https://image.tmdb.org/t/p";
export const img = (path: string | null | undefined, size = "w500") =>
  path ? `${IMG}/${size}${path}` : null;

type RawMovie = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  overview?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  character?: string;
  job?: string;
};

export const GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function mapMovie(m: RawMovie): MovieCard {
  const date = m.release_date || m.first_air_date || "";
  return {
    id: m.id,
    title: m.title || m.name || "Untitled",
    year: date ? date.slice(0, 4) : "—",
    poster: img(m.poster_path, "w500"),
    backdrop: img(m.backdrop_path, "w1280"),
    rating: Math.round((m.vote_average ?? 0) * 10) / 10,
    votes: m.vote_count ?? 0,
    overview: m.overview ?? "",
    genres: m.genres
      ? m.genres.map((g) => g.name)
      : (m.genre_ids ?? []).map((id) => GENRES[id]).filter((n): n is string => Boolean(n)),
    ...(m.runtime ? { runtime: m.runtime } : {}),
    ...(m.character ? { character: m.character } : {}),
    ...(m.job ? { job: m.job } : {}),
  };
}

export const fmtRuntime = (mins?: number) =>
  mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "—";

export const fmtMoney = (n: number) =>
  n ? `$${n >= 1_000_000 ? (n / 1_000_000).toFixed(0) + "M" : (n / 1000).toFixed(0) + "K"}` : "—";
