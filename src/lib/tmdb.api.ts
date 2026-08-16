import { defineApi } from "./define-api";
import { z } from "zod";

import { tmdb } from "./tmdb";
import { img, mapMovie, GENRES } from "./tmdb-map";
import type {
  CollectionCard,
  MovieCard,
  MovieDetail,
  PersonCard,
  PersonDetail,
  Rail,
} from "./tmdb-map";

type List<T> = { results: T[]; total_results?: number; total_pages?: number };

const FRANCHISE_SEEDS = [
  // Hollywood / global
  "The Godfather", "The Lord of the Rings", "The Hobbit", "Alien", "Predator", "Blade Runner",
  "Kill Bill", "Before Sunrise", "Toy Story", "The Dark Knight", "Mad Max", "John Wick",
  "Star Wars", "Indiana Jones", "Harry Potter", "The Matrix", "Mission: Impossible", "Jurassic Park",
  "Pirates of the Caribbean", "The Hunger Games", "Fast & Furious", "Planet of the Apes", "Bourne",
  "Rocky", "Rambo", "Shrek", "How to Train Your Dragon", "Kung Fu Panda", "Transformers", "Terminator",
  "The Conjuring", "Scream", "Evil Dead", "Spider-Man", "X-Men", "Avengers", "Guardians of the Galaxy",
  "Deadpool", "Venom", "The Maze Runner", "Divergent", "Fantastic Beasts", "Creed", "The Karate Kid",
  "Pink Panther", "Despicable Me", "Ice Age", "Madagascar", "Cars", "The Incredibles", "Toy Story",
  "Frozen", "Finding Nemo", "Monsters, Inc.", "The Lion King", "Pirates", "Men in Black", "Back to the Future",
  "Die Hard", "Lethal Weapon", "The Expendables", "Saw", "Final Destination", "Insidious", "Halloween",
  "Friday the 13th", "A Nightmare on Elm Street", "Resident Evil", "Mortal Kombat", "Ghostbusters",
  "National Treasure", "Now You See Me", "The Equalizer", "Taken", "The Transporter", "Ocean's",
  "Sherlock Holmes", "Kingsman", "Paddington", "Narnia", "Tron", "Avatar", "Godzilla", "Pacific Rim",
  "A Quiet Place", "Top Gun", "Bad Boys", "Rush Hour", "Zoolander", "Austin Powers", "Scary Movie",
  "The Pink Panther", "Mamma Mia!", "Downton Abbey",

  // Indian / Hindi
  "Baahubali", "Krrish", "Dhoom", "Golmaal", "Hera Pheri", "Housefull", "Singham", "Don",
  "Race", "Bhaag Milkha Bhaag", "Munna Bhai", "Welcome", "Dhamaal", "Bhool Bhulaiyaa", "Stree",
  "Drishyam", "Gangs of Wasseypur", "Tanu Weds Manu", "Bhediya", "Varun Dhawan", "Yash Raj",
  "Indian Cinema", "Khiladi", "Dabangg", "Tiger", "Brahmastra", "Lage Raho Munna Bhai",

  // Tamil
  "Kaithi", "Vikram", "Indian", "Singam", "Muni", "Kanchana", "Chandramukhi", "Panchatanthiram",
  "Anniyan", "Vettaiyaadu Vilaiyaadu", "Saamy", "Pokkiri", "Thuppakki", "Kaththi", "Master",
  "Leo", "Jailer", "Sivaji", "Enthiran", "2.0", "Mankatha", "Billa", "Viswasam", "Vedalam",
  "Ajith Kumar", "Vijay", "Suriya", "Dhanush", "Rajinikanth", "Kamal Haasan", "Suriya Singam",
  "Lokesh Cinematic Universe", "LCU", "Vada Chennai", "Pariyerum Perumal",

  // Telugu
  "Baahubali", "RRR", "Pushpa", "Pushpa 2", "K.G.F", "Salaar", "Arjun Reddy", "Agent",
  "Goodachari", "Hit", "Awe", "Karthikeya", "Nani", "Allu Arjun", "Mahesh Babu", "Pawan Kalyan",
  "Prabhas", "Jr NTR", "Ram Charan", "Ravi Teja",

  // Malayalam
  "Drishyam", "Lucifer", "Empuraan", "Aadu", "Ezra", "Bangalore Days", "Premam", "C U Soon",
  "Thondimuthalum Driksakshiyum", "Mohanlal", "Mammootty", "Dileep", "Fahadh Faasil",

  // Kannada
  "K.G.F", "Kantara", "Ugramm", "Charlie 777", "Avane Srimannarayana", "Rakshit Shetty", "Yash",
  "Sudeep", "Kantara: A Legend",
].filter((value, index, arr) => arr.indexOf(value) === index);

function uniqueMovies<T extends { id: number }>(items: T[]): T[] {
  return [...new Map(items.filter(Boolean).map((item) => [item.id, item])).values()];
}

function uniqueMappedMovies(items: any[]): MovieCard[] {
  return uniqueMovies(items.filter((m) => m && m.id)).map(mapMovie);
}

export const getHome = defineApi({ method: "GET" }).handler(async (): Promise<{
  hero: MovieDetail;
  rails: Rail[];
  moods: { id: number; name: string; backdrop: string | null }[];
}> => {
  const [trending, nowPlaying, topRated, classics, popular, tamil] = await Promise.all([
    tmdb<List<any>>("/trending/movie/week"),
    tmdb<List<any>>("/movie/now_playing", { page: 1 }),
    tmdb<List<any>>("/movie/top_rated", { page: 1 }),
    tmdb<List<any>>("/discover/movie", {
      "primary_release_date.lte": "1985-12-31",
      sort_by: "vote_average.desc",
      "vote_count.gte": 800,
    }),
    tmdb<List<any>>("/movie/popular", { page: 1 }),
    tmdb<List<any>>("/discover/movie", {
      with_original_language: "ta",
      sort_by: "popularity.desc",
      "vote_count.gte": 25,
      region: "IN",
      page: 1,
    }),
  ]);

  const heroId = trending.results[0]!.id;
  const heroRaw = await tmdb<any>(`/movie/${heroId}`, {
    append_to_response: "videos",
  });
  const hero = {
    ...mapMovie(heroRaw),
    tagline: heroRaw.tagline ?? "",
    release: heroRaw.release_date ?? "",
    language: (heroRaw.original_language ?? "").toUpperCase(),
    trailer:
      heroRaw.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key ??
      null,
  } as MovieDetail;

  const moodGenres = [18, 878, 35, 53, 80, 10749];
  const usedBackdrops = new Set<string>();
  const moods: { id: number; name: string; backdrop: string | null }[] = [];
  for (const id of moodGenres) {
    const r = await tmdb<List<any>>("/discover/movie", {
      with_genres: id,
      sort_by: "vote_count.desc",
      without_genres: moodGenres.filter((g) => g !== id).join("|"),
    });
    const pick = r.results.find(
      (m: any) => m.backdrop_path && !usedBackdrops.has(m.backdrop_path),
    );
    if (pick?.backdrop_path) usedBackdrops.add(pick.backdrop_path);
    moods.push({
      id,
      name: GENRES[id] ?? "Film",
      backdrop: img(pick?.backdrop_path, "w780"),
    });
  }

  const rails: Rail[] = [
    {
      key: "now",
      title: "In projection now",
      subtitle: "Playing in theatres this week",
      items: uniqueMappedMovies(nowPlaying.results).slice(0, 12),
    },
    {
      key: "long-take",
      title: "The Long Take",
      subtitle: "The highest-rated films in the archive",
      items: uniqueMappedMovies(topRated.results).slice(0, 12),
    },
    {
      key: "restored",
      title: "Restored & Rediscovered",
      subtitle: "Pre-1985, cared for frame by frame",
      items: uniqueMappedMovies(classics.results).slice(0, 12),
    },
    {
      key: "popular",
      title: "What members are watching",
      subtitle: "Most logged films right now",
      items: uniqueMappedMovies(popular.results).slice(0, 12),
    },
    {
      key: "tamil",
      title: "Tamil cinema",
      subtitle: "Stories from Tamil film",
      items: uniqueMappedMovies(tamil.results).slice(0, 12),
    },
  ];

  return { hero, rails, moods };
});

export const getMovie = defineApi({ method: "GET" })
  .inputValidator((d: { id: number }) => z.object({ id: z.number() }).parse(d))
  .handler(async ({ data }): Promise<MovieDetail> => {
    const m = await tmdb<any>(`/movie/${data.id}`, {
      append_to_response: "credits,similar,recommendations,images,videos,reviews,watch/providers,keywords,external_ids",
      include_image_language: "en,null",
    });

    const crew: any[] = m.credits?.crew ?? [];
    const directorPerson = crew.find((c) => c.job === "Director");
    const providersRaw = m["watch/providers"]?.results?.IN ?? m["watch/providers"]?.results?.US ?? {};
    const providers = [
      ...(providersRaw.flatrate ?? []).map((p: any) => ({ ...p, kind: "Streaming" })),
      ...(providersRaw.rent ?? []).map((p: any) => ({ ...p, kind: "Rent" })),
      ...(providersRaw.buy ?? []).map((p: any) => ({ ...p, kind: "Buy" })),
    ]
      .slice(0, 4)
      .map((p: any) => ({
        name: p.provider_name,
        logo: img(p.logo_path, "w92"),
        kind: p.kind,
      }));

    return {
      ...mapMovie(m),
      tagline: m.tagline ?? "",
      status: m.status ?? "",
      release: m.release_date ?? "",
      language: (m.original_language ?? "").toUpperCase(),
      languages: (m.spoken_languages ?? []).map((l: any) => l.english_name),
      countries: (m.production_countries ?? []).map((c: any) => c.name),
      budget: m.budget ?? 0,
      revenue: m.revenue ?? 0,
      homepage: m.homepage ?? "",
      keywords: (m.keywords?.keywords ?? []).slice(0, 12).map((k: any) => k.name),
      externalIds: m.external_ids ?? {},
      imdb: m.imdb_id ?? null,
      director: directorPerson?.name ?? "Unknown",
      directorId: directorPerson?.id ?? null,
      writers: [
        ...new Set(crew.filter((c) => c.department === "Writing").map((c) => c.name as string)),
      ].slice(0, 4),
      cast: (m.credits?.cast ?? []).slice(0, 12).map((c: any) => ({
        id: c.id,
        name: c.name,
        role: c.known_for_department ?? "Acting",
        character: c.character ?? "",
        profile: img(c.profile_path, "w300"),
      })) as PersonCard[],
      crew: crew
        .filter((c) =>
          ["Director", "Screenplay", "Writer", "Director of Photography", "Original Music Composer", "Editor", "Producer"].includes(
            c.job,
          ),
        )
        .slice(0, 10)
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          role: c.job,
          profile: img(c.profile_path, "w300"),
        })) as PersonCard[],
      similar: uniqueMappedMovies(m.similar?.results ?? []).slice(0, 12),
      recommended: uniqueMappedMovies(m.recommendations?.results ?? []).slice(0, 12),
      logo: img(m.images?.logos?.find((l: any) => l.iso_639_1 === "en" || l.iso_639_1 === null)?.file_path, "w500"),
      images: (m.images?.backdrops ?? [])
        .slice(0, 8)
        .map((i: any) => img(i.file_path, "w780"))
        .filter(Boolean) as string[],
      trailer:
        m.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key ??
        null,
      collection: m.belongs_to_collection
        ? {
            id: m.belongs_to_collection.id,
            name: m.belongs_to_collection.name,
            backdrop: img(m.belongs_to_collection.backdrop_path, "w780"),
          }
        : null,
      reviews: (m.reviews?.results ?? []).slice(0, 3).map((r: any) => ({
        id: r.id,
        author: r.author,
        content: r.content,
        rating: r.author_details?.rating ?? null,
        date: r.created_at,
      })),
      reviewCount: m.reviews?.total_results ?? 0,
      providers,
    };
  });

export const getPerson = defineApi({ method: "GET" })
  .inputValidator((d: { id: number }) => z.object({ id: z.number() }).parse(d))
  .handler(async ({ data }): Promise<PersonDetail> => {
    const p = await tmdb<any>(`/person/${data.id}`, {
      append_to_response: "combined_credits,images",
    });

    const castCredits = (p.combined_credits?.cast ?? []).filter(
      (c: any) => c.media_type === "movie",
    );
    const crewCredits = (p.combined_credits?.crew ?? []).filter(
      (c: any) => c.media_type === "movie",
    );
    const allCredits = uniqueMovies([...castCredits, ...crewCredits]);
    const primary = p.known_for_department === "Acting" ? castCredits : crewCredits;

    const knownFor = uniqueMovies(primary)
      .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 6)
      .map(mapMovie);

    const credits = uniqueMovies(allCredits.filter((c: any) => c.release_date))
      .sort((a: any, b: any) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
      .map(mapMovie);

    const rated = primary.filter((c: any) => c.vote_count > 50);
    const averageRating = rated.length
      ? Math.round(
          (rated.reduce((s: number, c: any) => s + c.vote_average, 0) / rated.length) * 10,
        ) / 10
      : 0;

    const tally = new Map<number, PersonCard & { count: number }>();
    const topFilms = knownFor.slice(0, 4);
    const creditSets = await Promise.all(
      topFilms.map((f) => tmdb<any>(`/movie/${f.id}/credits`).catch(() => null)),
    );
    for (const set of creditSets) {
      if (!set) continue;
      const people = [
        ...(set.cast ?? []).slice(0, 8),
        ...(set.crew ?? []).filter((c: any) =>
          ["Director", "Director of Photography", "Original Music Composer", "Editor"].includes(
            c.job,
          ),
        ),
      ];
      for (const person of people) {
        if (person.id === p.id) continue;
        const existing = tally.get(person.id);
        if (existing) existing.count += 1;
        else
          tally.set(person.id, {
            id: person.id,
            name: person.name,
            role: person.job ?? person.known_for_department ?? "Acting",
            profile: img(person.profile_path, "w185"),
            count: 1,
          });
      }
    }

    const years = primary
      .map((c: any) => (c.release_date ?? "").slice(0, 4))
      .filter(Boolean)
      .sort();

    return {
      id: p.id,
      name: p.name,
      biography: p.biography ?? "",
      birthday: p.birthday ?? null,
      deathday: p.deathday ?? null,
      place: p.place_of_birth ?? null,
      department: p.known_for_department ?? "Acting",
      profile: img(p.profile_path, "h632"),
      popularity: Math.round(p.popularity ?? 0),
      knownFor,
      credits,
      crewCredits: crewCredits
        .filter((c: any) => c.release_date)
        .sort((a: any, b: any) => (b.release_date ?? "").localeCompare(a.release_date ?? ""))
        .map(mapMovie),
      images: (p.images?.profiles ?? [])
        .slice(0, 6)
        .map((i: any) => img(i.file_path, "w300"))
        .filter(Boolean) as string[],
      collaborators: [...tally.values()].sort((a, b) => b.count - a.count).slice(0, 6),
      averageRating,
      creditCount: allCredits.length,
      firstYear: years[0] ?? "—",
    };
  });

export const searchAll = defineApi({ method: "GET" })
  .inputValidator((d: { q: string }) => z.object({ q: z.string() }).parse(d))
  .handler(
    async ({
      data,
    }): Promise<{
      films: MovieCard[];
      people: PersonCard[];
      collections: CollectionCard[];
      total: number;
    }> => {
      const q = data.q.trim();
      if (!q) return { films: [], people: [], collections: [], total: 0 };
      const [movies, people, collections] = await Promise.all([
        tmdb<List<any>>("/search/movie", { query: q, include_adult: "false" }),
        tmdb<List<any>>("/search/person", { query: q, include_adult: "false" }),
        tmdb<List<any>>("/search/collection", { query: q }),
      ]);
      return {
        films: uniqueMappedMovies(movies.results),
        people: people.results.slice(0, 8).map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.known_for_department ?? "Acting",
          profile: img(p.profile_path, "w185"),
          count: (p.known_for ?? []).length,
        })),
        collections: collections.results.slice(0, 6).map((c: any) => ({
          id: c.id,
          name: c.name,
          overview: c.overview ?? "",
          poster: img(c.poster_path, "w342"),
          backdrop: img(c.backdrop_path, "w780"),
          count: 0,
          posters: [],
        })),
        total: (movies.total_results ?? 0) + (people.total_results ?? 0),
      };
    },
  );

export const discoverFilms = defineApi({ method: "GET" })
  .inputValidator(
    (d: {
      genres?: number[];
      decade?: string;
      sort?: string;
      page?: number;
      maxRuntime?: number;
      country?: string;
    }) =>
      z
        .object({
          genres: z.array(z.number()).optional(),
          decade: z.string().optional(),
          sort: z.string().optional(),
          page: z.number().optional(),
          maxRuntime: z.number().optional(),
          country: z.string().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data }): Promise<{ items: MovieCard[]; total: number; pages: number }> => {
    const params: Record<string, string | number | undefined> = {
      sort_by: data.sort || "popularity.desc",
      page: data.page ?? 1,
      include_adult: "false",
      "vote_count.gte": data.sort === "vote_average.desc" ? 500 : 0,
    };
    if (data.genres?.length) params["with_genres"] = data.genres.join(",");
    if (data.decade) {
      params["primary_release_date.gte"] = `${data.decade}-01-01`;
      params["primary_release_date.lte"] = `${Number(data.decade) + 9}-12-31`;
    }
    if (data.maxRuntime) params["with_runtime.lte"] = data.maxRuntime;
    if (data.country) params["with_origin_country"] = data.country;

    const r = await tmdb<List<any>>("/discover/movie", params);
    return {
      items: uniqueMappedMovies(r.results),
      total: r.total_results ?? 0,
      pages: Math.min(r.total_pages ?? 1, 500),
    };
  });

export const getCollectionsPage = defineApi({ method: "GET" }).handler(async (): Promise<{
  featured: CollectionCard;
  presents: CollectionCard[];
  sagas: CollectionCard[];
  community: { slug: string; title: string; genre: number; count: number; posters: string[] }[];
}> => {
  // Resolve a broad set of human-friendly franchise seeds to real TMDB collections.
  // Prefer exact/near-exact names and collections containing at least two films so a
  // noisy TMDB search result never becomes a fake-looking single-film collection.
  const found = await Promise.all(
    FRANCHISE_SEEDS.map(async (seed) => {
      const r = await tmdb<List<any>>("/search/collection", { query: seed }).catch(() => ({ results: [] }));
      const normalized = seed.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      return r.results
        .filter((c: any) => c?.id && c?.name)
        .sort((a: any, b: any) => {
          const an = String(a.name).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
          const bn = String(b.name).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
          const score = (name: string) =>
            name === normalized ? 100 : name.includes(normalized) ? 70 : normalized.includes(name) ? 60 : 0;
          return score(bn) - score(an);
        })[0] ?? null;
    }),
  );
  const ids = [...new Set(found.filter(Boolean).map((c: any) => c.id as number))];
  const details = (
    await Promise.all(ids.map((id) => tmdb<any>(`/collection/${id}`).catch(() => null)))
  ).filter((c: any) => c?.id && Array.isArray(c.parts) && c.parts.length >= 2);

  const cards: CollectionCard[] = details.map((c: any) => ({
    id: c.id,
    name: c.name,
    overview: c.overview ?? "",
    poster: img(c.poster_path, "w342"),
    backdrop: img(c.backdrop_path, "w1280"),
    count: (c.parts ?? []).length,
    posters: (c.parts ?? [])
      .slice(0, 6)
      .map((p: any) => img(p.poster_path, "w185"))
      .filter(Boolean) as string[],
  }));

  const sorted = [...cards].sort((a, b) => b.count - a.count);
  const featured = sorted[0]!;

  const communityGenres = [
    { slug: "shot-at-night", title: "Films Shot at Night", genre: 80 },
    { slug: "the-long-year", title: "Science Fiction, Sorted", genre: 878 },
    { slug: "comfort-watches", title: "Comfort Watches, Ranked", genre: 35 },
  ];
  const community = await Promise.all(
    communityGenres.map(async (g) => {
      const r = await tmdb<List<any>>("/discover/movie", {
        with_genres: g.genre,
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
      });
      return {
        ...g,
        count: r.total_results ?? 0,
        posters: r.results
          .slice(0, 5)
          .map((m: any) => img(m.poster_path, "w185"))
          .filter(Boolean) as string[],
      };
    }),
  );

  return {
    featured,
    presents: sorted.slice(1, 25),
    sagas: sorted.slice(25, 85),
    community,
  };
});

export const getCollection = defineApi({ method: "GET" })
  .inputValidator((d: { id: number }) => z.object({ id: z.number() }).parse(d))
  .handler(
    async ({
      data,
    }): Promise<{
      id: number;
      name: string;
      overview: string;
      backdrop: string | null;
      poster: string | null;
      parts: MovieCard[];
      runtime: number;
      average: number;
    }> => {
      const c = await tmdb<any>(`/collection/${data.id}`);
      const parts: MovieCard[] = uniqueMappedMovies(c.parts ?? [])
        .sort((a: MovieCard, b: MovieCard) => a.year.localeCompare(b.year));
      const details = await Promise.all(
        parts.slice(0, 12).map((p) => tmdb<any>(`/movie/${p.id}`).catch(() => null)),
      );
      const runtime = details.reduce((s, d) => s + (d?.runtime ?? 0), 0);
      const withRuntime = parts.map((p, i) => ({
        ...p,
        ...(details[i]?.runtime ? { runtime: details[i].runtime } : {}),
        director:
          details[i]?.credits?.crew?.find?.((x: any) => x.job === "Director")?.name ?? undefined,
      }));
      const rated = parts.filter((p) => p.votes > 20);
      return {
        id: c.id,
        name: c.name,
        overview: c.overview ?? "",
        backdrop: img(c.backdrop_path, "w1280"),
        poster: img(c.poster_path, "w500"),
        parts: withRuntime,
        runtime,
        average: rated.length
          ? Math.round((rated.reduce((s, p) => s + p.rating, 0) / rated.length) * 10) / 10
          : 0,
      };
    },
  );

export const getMoviesByIds = defineApi({ method: "POST" })
  .inputValidator((d: { ids: number[] }) => z.object({ ids: z.array(z.number()) }).parse(d))
  .handler(async ({ data }): Promise<MovieCard[]> => {
    const unique = [...new Set(data.ids)].slice(0, 60);
    const results = await Promise.all(
      unique.map((id) =>
        tmdb<any>(`/movie/${id}`, { append_to_response: "credits" }).catch(() => null),
      ),
    );
    return results.filter(Boolean).map((m: any) => ({
      ...mapMovie(m),
      director: m.credits?.crew?.find((c: any) => c.job === "Director")?.name ?? "—",
    }));
  });

export const getListFilms = defineApi({ method: "GET" })
  .inputValidator((d: { genre: number }) => z.object({ genre: z.number() }).parse(d))
  .handler(async ({ data }): Promise<MovieCard[]> => {
    const r = await tmdb<List<any>>("/discover/movie", {
      with_genres: data.genre,
      sort_by: "vote_average.desc",
      "vote_count.gte": 1000,
    });
    return uniqueMappedMovies(r.results);
  });
