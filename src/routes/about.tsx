import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { SectionHeader } from "../components/site/media";

const PRINCIPLES = [
  {
    title: "Metadata with respect",
    body: "Every credit, runtime and release date comes from TMDB's community-maintained archive — no invented data, no filler.",
  },
  {
    title: "Curation over queues",
    body: "Rails are programmed like a season at a repertory cinema: a mood, an era, a restoration, a room full of people watching.",
  },
  {
    title: "Your library is yours",
    body: "Watchlist, ratings and favourites live in your browser. Nothing is sold, tracked or ranked against you.",
  },
];

export const Route = createRoute({
  path: "/about",
  head: () => ({
    meta: [
      { title: "About CineVerse — how the archive works" },
      {
        name: "description",
        content:
          "CineVerse is a film discovery surface built on TMDB data: curated rails, deep credits, franchise sagas and a private personal library.",
      },
      { property: "og:title", content: "About CineVerse — how the archive works" },
      {
        property: "og:description",
        content: "Why CineVerse exists, where the data comes from, and how curation works.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8">
      <div className="label-gold">About</div>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-6xl">
        A projection room for people who love the medium.
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
        CineVerse is a discovery surface, not a streaming service. It exists to help you find the
        next film worth an evening — through curated rails, complete franchise sagas, deep credits
        and honest ratings.
      </p>

      <section className="mt-16">
        <SectionHeader title="How we work" subtitle="Three principles" />
        <div className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <article key={p.title} className="rounded-xl border border-border/60 bg-surface p-6">
              <h2 className="font-display text-lg text-foreground">{p.title}</h2>
              <p className="mt-3 font-sans text-xs leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <SectionHeader title="Data & credits" />
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Film, person and collection data is provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="text-gold hover:underline"
            >
              The Movie Database (TMDB)
            </a>
            . CineVerse is not endorsed or certified by TMDB. Posters, backdrops and stills remain
            the property of their respective rights holders.
          </p>
        </div>
        <div>
          <SectionHeader title="Start somewhere" />
          <div className="flex flex-wrap gap-3">
            <Link
              to="/discover"
              className="rounded-xl bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background hover:bg-gold-soft"
            >
              Browse the archive
            </Link>
            <Link
              to="/collections"
              className="rounded-xl border border-border bg-surface px-5 py-2.5 font-sans text-xs tracking-wide text-foreground hover:border-gold/60"
            >
              Explore collections
            </Link>
            <Link
              to="/library/watchlist"
              className="rounded-xl border border-border bg-surface px-5 py-2.5 font-sans text-xs tracking-wide text-foreground hover:border-gold/60"
            >
              Open your library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
