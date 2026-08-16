/**
 * Offline demo dataset.
 *
 * The app renders real TMDB data when REACT_APP_TMDB_API_KEY is set. When the
 * key is missing — or a live request fails — every request is answered from
 * this deterministic in-memory catalogue instead, so no page ever throws and
 * the full UI stays browsable. Image paths are intentionally null so posters
 * fall back to the app's own placeholders rather than broken TMDB URLs.
 */

type Any = Record<string, any>;

const FILMS: {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genre_ids: number[];
  overview: string;
  tagline: string;
  original_language: string;
}[] = [
  { id: 101, title: "The Quiet Projection", release_date: "1974-09-12", vote_average: 8.4, vote_count: 4210, runtime: 121, genre_ids: [18, 80], overview: "A projectionist in a failing cinema begins editing the films he screens, and the town starts to remember its past differently.", tagline: "Every frame remembers.", original_language: "en" },
  { id: 102, title: "Neon Archive", release_date: "1988-04-01", vote_average: 7.9, vote_count: 3180, runtime: 138, genre_ids: [878, 53], overview: "In a city where memories are catalogued and sold, an archivist finds a reel that should not exist.", tagline: "Nothing is ever really deleted.", original_language: "en" },
  { id: 103, title: "Salt Flats", release_date: "2015-11-20", vote_average: 7.2, vote_count: 1890, runtime: 104, genre_ids: [18], overview: "Two estranged sisters drive across a drying lake bed to sell their mother's house.", tagline: "Some distances aren't measured in miles.", original_language: "en" },
  { id: 104, title: "The Long Take", release_date: "2001-06-08", vote_average: 8.1, vote_count: 5600, runtime: 156, genre_ids: [18, 36], overview: "A single unbroken night in a harbour town, told by the people who never left it.", tagline: "Don't blink.", original_language: "en" },
  { id: 105, title: "Comfort Watches", release_date: "2019-12-25", vote_average: 7.0, vote_count: 2210, runtime: 96, genre_ids: [35, 10749], overview: "A video store clerk prescribes films to strangers, and accidentally prescribes one to himself.", tagline: "Press play. Again.", original_language: "en" },
  { id: 106, title: "Gravel Kings", release_date: "1969-03-14", vote_average: 7.6, vote_count: 980, runtime: 112, genre_ids: [37, 28], overview: "Three brothers race the last dirt track before the highway swallows their valley.", tagline: "The dust settles on no one.", original_language: "en" },
  { id: 107, title: "Cold Open", release_date: "2022-08-19", vote_average: 6.8, vote_count: 1420, runtime: 99, genre_ids: [53, 9648], overview: "A late-night talk show host receives a threat that only makes sense on air.", tagline: "Live, in five.", original_language: "en" },
  { id: 108, title: "Aperture", release_date: "1996-05-03", vote_average: 8.0, vote_count: 4470, runtime: 127, genre_ids: [18, 10749], overview: "A war photographer returns home and can only see the world through a viewfinder.", tagline: "Focus is a choice.", original_language: "fr" },
  { id: 109, title: "Second Reel", release_date: "2008-10-10", vote_average: 7.4, vote_count: 3050, runtime: 118, genre_ids: [80, 53], overview: "A heist crew rehearses their robbery as a film shoot — until the rehearsal goes live.", tagline: "Take two.", original_language: "en" },
  { id: 110, title: "The Silent Frame", release_date: "1931-02-27", vote_average: 8.6, vote_count: 1560, runtime: 88, genre_ids: [18, 36], overview: "At the end of the silent era, a star refuses to speak — on screen or off.", tagline: "She said nothing. It was everything.", original_language: "en" },
  { id: 111, title: "Grain & Light", release_date: "2011-07-15", vote_average: 7.7, vote_count: 2640, runtime: 133, genre_ids: [878, 18], overview: "A colourist restoring a lost film discovers the negative is changing between passes.", tagline: "Restore nothing.", original_language: "ja" },
  { id: 112, title: "Matinee Country", release_date: "1983-06-24", vote_average: 7.1, vote_count: 1240, runtime: 101, genre_ids: [12, 10751], overview: "A summer of double features in a small town with one screen and no air conditioning.", tagline: "Two films, one ticket.", original_language: "en" },
  { id: 113, title: "Nightcrew", release_date: "2017-09-29", vote_average: 6.9, vote_count: 1980, runtime: 107, genre_ids: [80, 28], overview: "The crew that cleans crime scenes starts recognising the handwriting on the walls.", tagline: "Someone has to tidy up.", original_language: "es" },
  { id: 114, title: "Reel Two", release_date: "1992-04-17", vote_average: 7.3, vote_count: 2110, runtime: 115, genre_ids: [35, 18], overview: "A director loses the second reel of his masterpiece and reshoots it from memory.", tagline: "Memory is a rough cut.", original_language: "it" },
  { id: 115, title: "Above the Fold", release_date: "2005-01-21", vote_average: 7.8, vote_count: 3390, runtime: 124, genre_ids: [18, 53], overview: "A newsroom's last print edition uncovers the story that will close it.", tagline: "Stop the presses.", original_language: "en" },
  { id: 116, title: "Wide Shot", release_date: "2024-03-08", vote_average: 7.5, vote_count: 860, runtime: 110, genre_ids: [12, 878], overview: "A survey crew maps an island that appears on no chart, and each measurement changes it.", tagline: "Step back far enough.", original_language: "en" },
  { id: 117, title: "House Lights", release_date: "1978-11-02", vote_average: 8.2, vote_count: 2980, runtime: 142, genre_ids: [18, 27], overview: "An usher stays behind after the last screening of the season. The theatre does not empty.", tagline: "The show has ended. Please remain seated.", original_language: "en" },
  { id: 118, title: "Rushes", release_date: "2013-05-30", vote_average: 7.0, vote_count: 1730, runtime: 94, genre_ids: [35, 10402], overview: "A film-school band scores a movie that hasn't been shot yet.", tagline: "Music first.", original_language: "en" },
  { id: 119, title: "Final Cut Coast", release_date: "1999-08-13", vote_average: 7.9, vote_count: 4020, runtime: 129, genre_ids: [53, 9648], overview: "An editor finds a face in the background of every take she cuts.", tagline: "Look behind the actors.", original_language: "en" },
  { id: 120, title: "Double Feature", release_date: "2020-10-30", vote_average: 7.2, vote_count: 2450, runtime: 118, genre_ids: [27, 35], overview: "Two films, screened back to back, turn out to be the same story told from opposite ends.", tagline: "Stay for the second half.", original_language: "en" },
];

const PEOPLE = [
  { id: 501, name: "Ana Belmonte", known_for_department: "Directing", biography: "A director known for patient, wide-lensed studies of small towns and long nights.", birthday: "1961-04-02", place_of_birth: "Valencia, Spain" },
  { id: 502, name: "Idris Kovač", known_for_department: "Acting", biography: "A character actor who moved from stage to screen and never quite left either.", birthday: "1974-11-19", place_of_birth: "Sarajevo, Bosnia" },
  { id: 503, name: "Mira Osei", known_for_department: "Acting", biography: "Lead of a decade of quiet dramas, celebrated for what she leaves unsaid.", birthday: "1985-07-07", place_of_birth: "Accra, Ghana" },
  { id: 504, name: "Tomás Lindqvist", known_for_department: "Camera", biography: "A cinematographer who shoots almost entirely on available light.", birthday: "1968-01-30", place_of_birth: "Gothenburg, Sweden" },
  { id: 505, name: "Junko Arai", known_for_department: "Editing", biography: "An editor whose cuts are studied frame by frame in film schools.", birthday: "1979-09-05", place_of_birth: "Kyoto, Japan" },
  { id: 506, name: "Peter Nkomo", known_for_department: "Sound", biography: "Composer and sound designer working mostly with recorded rooms.", birthday: "1970-03-22", place_of_birth: "Bulawayo, Zimbabwe" },
  { id: 507, name: "Helena Fournier", known_for_department: "Writing", biography: "Screenwriter of ensemble pieces set across single nights.", birthday: "1982-06-11", place_of_birth: "Lyon, France" },
  { id: 508, name: "Sam Redgrave", known_for_department: "Acting", biography: "Began as a stunt performer, now a fixture of ensemble crime films.", birthday: "1990-02-14", place_of_birth: "Manchester, England" },
];

const JOBS = [
  "Director",
  "Screenplay",
  "Director of Photography",
  "Original Music Composer",
  "Editor",
  "Producer",
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rotate<T>(items: T[], seed: string): T[] {
  const offset = hash(seed) % Math.max(items.length, 1);
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function listFor(seed: string) {
  const results = rotate(FILMS, seed).map((f) => ({ ...f, poster_path: null, backdrop_path: null }));
  return { results, total_results: results.length * 9, total_pages: 9 };
}

function filmFor(id: number) {
  const base = FILMS.find((f) => f.id === id) ?? FILMS[hash(String(id)) % FILMS.length]!;
  return { ...base, id };
}

function personFor(id: number) {
  const base = PEOPLE.find((p) => p.id === id) ?? PEOPLE[hash(String(id)) % PEOPLE.length]!;
  return { ...base, id };
}

function creditsFor(seed: string) {
  const people = rotate(PEOPLE, seed);
  return {
    cast: people.map((p, i) => ({
      id: p.id,
      name: p.name,
      known_for_department: "Acting",
      character: ["Themself", "The Projectionist", "Ada", "The Visitor", "Marlow", "The Sister", "Detective Reyes", "The Usher"][i % 8],
      profile_path: null,
      popularity: 40 - i,
    })),
    crew: JOBS.map((job, i) => {
      const p = people[(i + 2) % people.length]!;
      return {
        id: p.id,
        name: p.name,
        job,
        department: job === "Screenplay" ? "Writing" : "Production",
        profile_path: null,
      };
    }),
  };
}

function movieDetail(id: number) {
  const f = filmFor(id);
  const credits = creditsFor(`movie-${id}`);
  const similar = listFor(`similar-${id}`);
  const recommendations = listFor(`recommended-${id}`);
  return {
    ...f,
    poster_path: null,
    backdrop_path: null,
    status: "Released",
    budget: 12_000_000 + (hash(String(id)) % 40) * 1_000_000,
    revenue: 48_000_000 + (hash(String(id)) % 90) * 1_000_000,
    homepage: "",
    imdb_id: null,
    genres: f.genre_ids.map((g) => ({ id: g, name: GENRE_NAMES[g] ?? "Drama" })),
    spoken_languages: [{ english_name: "English" }],
    production_countries: [{ name: "United States" }],
    belongs_to_collection: { id: 900 + (id % 5), name: "The Projection Room Collection", backdrop_path: null },
    credits,
    similar,
    recommendations,
    images: { backdrops: [] },
    videos: { results: [] },
    reviews: {
      results: [
        {
          id: `r-${id}-1`,
          author: "reel_notes",
          content:
            "Watched this on a rainy Tuesday and it rearranged my week. The pacing is deliberate and the final act earns every minute of it.",
          author_details: { rating: 9 },
          created_at: "2024-02-11T18:04:00.000Z",
        },
        {
          id: `r-${id}-2`,
          author: "second_screening",
          content:
            "Better the second time. What reads as slow at first is really the film teaching you how to watch it.",
          author_details: { rating: 8 },
          created_at: "2023-11-02T09:20:00.000Z",
        },
      ],
      total_results: 2,
    },
    "watch/providers": { results: { US: { flatrate: [], rent: [], buy: [] } } },
  };
}

const GENRE_NAMES: Record<number, string> = {
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
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function personDetail(id: number) {
  const p = personFor(id);
  const cast = listFor(`person-cast-${id}`).results.map((f, i) => ({
    ...f,
    media_type: "movie",
    popularity: 60 - i,
    character: ["Themself", "Ada", "Marlow", "The Sister"][i % 4],
  }));
  const crew = listFor(`person-crew-${id}`).results.slice(0, 10).map((f, i) => ({
    ...f,
    media_type: "movie",
    popularity: 40 - i,
    job: JOBS[i % JOBS.length],
  }));
  return {
    ...p,
    profile_path: null,
    deathday: null,
    popularity: 24,
    combined_credits: { cast, crew },
    images: { profiles: [] },
  };
}

function collectionDetail(id: number, name?: string) {
  const parts = listFor(`collection-${id}`).results.slice(0, 6);
  return {
    id,
    name: name ?? COLLECTION_NAMES[hash(String(id)) % COLLECTION_NAMES.length]!,
    overview:
      "A run of films that belong together — programmed as one sitting, restored from the best surviving elements.",
    poster_path: null,
    backdrop_path: null,
    parts,
  };
}

const COLLECTION_NAMES = [
  "The Projection Room Collection",
  "Night Shift Trilogy",
  "The Archive Cycle",
  "Harbour Town Films",
  "The Grain Series",
];

/** Answer a TMDB request path from the offline catalogue. */
export function demoResponse(path: string, params: Record<string, any> = {}): Any {
  const seed = path + JSON.stringify(params);

  let m = path.match(/^\/movie\/(\d+)\/credits$/);
  if (m) return creditsFor(`movie-${m[1]}`);

  m = path.match(/^\/movie\/(\d+)$/);
  if (m) return movieDetail(Number(m[1]));

  m = path.match(/^\/person\/(\d+)$/);
  if (m) return personDetail(Number(m[1]));

  m = path.match(/^\/collection\/(\d+)$/);
  if (m) return collectionDetail(Number(m[1]));

  if (path === "/search/person") {
    const results = rotate(PEOPLE, seed).map((p) => ({
      ...p,
      profile_path: null,
      known_for: FILMS.slice(0, 3),
    }));
    return { results, total_results: results.length };
  }

  if (path === "/search/collection") {
    const query = typeof params["query"] === "string" ? params["query"] : "";
    const id = 900 + (hash(query || seed) % 60);
    const c = collectionDetail(id, query || undefined);
    return { results: [{ ...c, poster_path: null, backdrop_path: null }], total_results: 1 };
  }

  // /trending, /movie/*, /discover/movie, /search/movie and anything else list-shaped
  return listFor(seed);
}
