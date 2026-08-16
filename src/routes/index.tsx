import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { MovieActions } from "../components/site/movie-actions";
import { PosterRail, SectionHeader } from "../components/site/media";
import { getHome } from "../lib/tmdb.api";
import { fmtRuntime } from "../lib/tmdb-map";

export const Route = createRoute({
  path: "/",
  loader: () => getHome(),
  head: () => ({
    meta: [
      { title: "CineVerse — Tonight's projection" },
      {
        name: "description",
        content:
          "A curated home for film discovery: trending features, restored classics and what members are watching now.",
      },
      { property: "og:title", content: "CineVerse — Tonight's projection" },
      {
        property: "og:description",
        content: "Curated rails of trending films, restored classics and theatre releases.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { hero, rails, moods } = Route.useLoaderData() as Awaited<ReturnType<typeof getHome>>;

  return (
    <div>
      <section className="relative isolate">
        {hero.backdrop ? (
          <img
            src={hero.backdrop}
            alt={`${hero.title} backdrop`}
            className="absolute inset-0 z-0 size-full object-cover object-top opacity-45"
          />
        ) : null}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/95 via-background/68 to-background/20" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
          <div className="label-gold">Tonight's projection</div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] text-foreground sm:text-6xl">
            {hero.title}
          </h1>
          {hero.tagline ? (
            <p className="mt-3 max-w-xl font-display text-lg italic text-gold-soft">
              {hero.tagline}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
            <span>{hero.year}</span>
            <span className="opacity-40">·</span>
            <span>{fmtRuntime(hero.runtime)}</span>
            <span className="opacity-40">·</span>
            <span>{hero.genres.slice(0, 3).join(" / ")}</span>
            <span className="opacity-40">·</span>
            <span className="text-gold">{hero.rating.toFixed(1)} TMDB</span>
          </div>
          <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
            {hero.overview}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {hero.trailer ? (
              <a
                href={`https://www.youtube.com/watch?v=${encodeURIComponent(hero.trailer)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
              >
                Play trailer
              </a>
            ) : null}
            <Link
              to="/movie/$id"
              params={{ id: String(hero.id) }}
              className="rounded-xl border border-border bg-surface px-5 py-2.5 font-sans text-xs tracking-wide text-foreground hover:border-gold/60"
            >
              Film details
            </Link>
            <MovieActions movie={hero} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <section className="mb-14">
          <SectionHeader
            title="Choose a mood"
            subtitle="Start from a feeling, not a franchise"
            action={
              <Link to="/discover" className="label-gold hover:text-gold">
                Open discover
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {moods.map((mood) => (
              <Link
                key={mood.id}
                to="/discover"
                search={{ genre: mood.id }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border/50 hover:ring-gold/60"
              >
                {mood.backdrop ? (
                  <img
                    src={mood.backdrop}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover opacity-45 transition-all duration-500 group-hover:scale-105 group-hover:opacity-65"
                  />
                ) : null}
                <span className="absolute inset-0 grid place-items-center font-display text-sm text-foreground">
                  {mood.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {rails.map((rail) => (
          <PosterRail
            key={rail.key}
            title={rail.title}
            subtitle={rail.subtitle}
            items={rail.items}
            seeAll={{ to: "/discover" }}
          />
        ))}
      </div>
    </div>
  );
}
