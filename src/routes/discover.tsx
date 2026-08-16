import { createRoute } from "../lib/route";
import { Link, useNavigate } from "../lib/router";

import { PosterGrid, SectionHeader } from "../components/site/media";
import { discoverFilms, searchAll } from "../lib/tmdb.api";
import { GENRES } from "../lib/tmdb-map";

type Search = {
  q?: string | undefined;
  genre?: number | undefined;
  decade?: string | undefined;
  sort?: string | undefined;
  page?: number | undefined;
};

const SORTS = [
  { value: "popularity.desc", label: "Popular" },
  { value: "vote_average.desc", label: "Highest rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Box office" },
];

const DECADES = ["2020", "2010", "2000", "1990", "1980", "1970", "1960"];

export const Route = createRoute({
  path: "/discover",
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(search["q"] ? { q: String(search["q"]) } : {}),
    ...(search["genre"] ? { genre: Number(search["genre"]) } : {}),
    ...(search["decade"] ? { decade: String(search["decade"]) } : {}),
    ...(search["sort"] ? { sort: String(search["sort"]) } : {}),
    ...(search["page"] ? { page: Number(search["page"]) } : {}),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.q) {
      const results = await searchAll({ data: { q: deps.q } });
      return { mode: "search" as const, results, discover: null };
    }
    const discover = await discoverFilms({
      data: {
        ...(deps.genre ? { genres: [deps.genre] } : {}),
        ...(deps.decade ? { decade: deps.decade } : {}),
        ...(deps.sort ? { sort: deps.sort } : {}),
        page: deps.page ?? 1,
      },
    });
    return { mode: "discover" as const, results: null, discover };
  },
  head: () => ({
    meta: [
      { title: "Discover films — CineVerse" },
      {
        name: "description",
        content: "Search films, people and collections, or filter the archive by genre and decade.",
      },
      { property: "og:title", content: "Discover films — CineVerse" },
      {
        property: "og:description",
        content: "Search and filter thousands of films by genre, decade and rating.",
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const data = Route.useLoaderData() as {
    mode: "search" | "discover";
    results: Awaited<ReturnType<typeof searchAll>> | null;
    discover: Awaited<ReturnType<typeof discoverFilms>> | null;
  };
  const search = Route.useSearch() as Search;
  const navigate = useNavigate();

  const set = (patch: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch, page: undefined }) as Search });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <div className="label-gold">{data.mode === "search" ? "Search results" : "Discover"}</div>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        {data.mode === "search" ? `“${search.q}”` : "Browse the archive"}
      </h1>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => navigate({ search: {} })}
          className={`rounded-full border px-3 py-1.5 font-mono text-[0.6rem] tracking-wider ${
            !search.genre && !search.q
              ? "border-gold bg-gold/15 text-gold"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          ALL
        </button>
        {Object.entries(GENRES)
          .filter(([id]) => id !== "10770")
          .map(([id, name]) => (
            <button
              key={id}
              onClick={() => set({ genre: Number(id), q: undefined })}
              className={`rounded-full border px-3 py-1.5 font-mono text-[0.6rem] tracking-wider ${
                search.genre === Number(id)
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {name.toUpperCase()}
            </button>
          ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono">Decade</span>
          {DECADES.map((d) => (
            <button
              key={d}
              onClick={() => set({ decade: search.decade === d ? undefined : d, q: undefined })}
              className={`font-mono text-[0.6rem] tracking-wider ${
                search.decade === d ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="label-mono">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => set({ sort: s.value, q: undefined })}
              className={`font-mono text-[0.6rem] tracking-wider ${
                (search.sort ?? "popularity.desc") === s.value
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {data.mode === "search" && data.results ? (
        <div className="mt-12">
          {data.results.people.length ? (
            <section className="mb-14">
              <SectionHeader title="People" subtitle={`${data.results.people.length} matches`} />
              <div className="flex gap-5 overflow-x-auto pb-2 hide-scrollbar">
                {data.results.people.map((p) => (
                  <Link
                    key={p.id}
                    to="/person/$id"
                    params={{ id: String(p.id) }}
                    className="group w-28 shrink-0 text-center"
                  >
                    <div className="aspect-square overflow-hidden rounded-full bg-surface-2 ring-1 ring-border/60 group-hover:ring-gold/60">
                      {p.profile ? (
                        <img
                          src={p.profile}
                          alt={p.name}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="mt-2 font-display text-xs text-foreground">{p.name}</div>
                    <div className="label-mono">{p.role}</div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {data.results.collections.length ? (
            <section className="mb-14">
              <SectionHeader title="Collections" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.results.collections.map((c) => (
                  <Link
                    key={c.id}
                    to="/collections/$id"
                    params={{ id: String(c.id) }}
                    className="group relative aspect-[16/7] overflow-hidden rounded-xl ring-1 ring-border/50 hover:ring-gold/60"
                  >
                    {c.backdrop ? (
                      <img
                        src={c.backdrop}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover opacity-50 group-hover:opacity-70"
                      />
                    ) : null}
                    <span className="absolute inset-x-0 bottom-0 p-4 font-display text-sm text-foreground">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <SectionHeader title="Films" subtitle={`${data.results.films.length} results on page 1`} />
          {data.results.films.length ? (
            <PosterGrid items={data.results.films} />
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              Nothing matched. Try another title, director or actor.
            </p>
          )}
        </div>
      ) : null}

      {data.mode === "discover" && data.discover ? (
        <div className="mt-12">
          <SectionHeader
            title={search.genre ? `${GENRES[search.genre]} films` : "All films"}
            subtitle={`${data.discover.total.toLocaleString()} films · page ${search.page ?? 1}`}
          />
          <PosterGrid items={data.discover.items} />
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              disabled={(search.page ?? 1) <= 1}
              onClick={() =>
                navigate({ search: (prev: Search) => ({ ...prev, page: (prev.page ?? 1) - 1 }) })
              }
              className="rounded-xl border border-border px-4 py-2 font-mono text-[0.6rem] tracking-wider text-muted-foreground disabled:opacity-30 hover:text-foreground"
            >
              PREVIOUS
            </button>
            <span className="label-mono">
              {search.page ?? 1} / {data.discover.pages}
            </span>
            <button
              disabled={(search.page ?? 1) >= data.discover.pages}
              onClick={() =>
                navigate({ search: (prev: Search) => ({ ...prev, page: (prev.page ?? 1) + 1 }) })
              }
              className="rounded-xl border border-border px-4 py-2 font-mono text-[0.6rem] tracking-wider text-muted-foreground disabled:opacity-30 hover:text-foreground"
            >
              NEXT
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
