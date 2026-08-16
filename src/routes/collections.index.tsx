import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { SectionHeader } from "../components/site/media";
import { getCollectionsPage } from "../lib/tmdb.api";
import type { CollectionCard } from "../lib/tmdb-map";

export const Route = createRoute({
  path: "/collections/",
  loader: () => getCollectionsPage(),
  head: () => ({
    meta: [
      { title: "Collections & sagas — CineVerse" },
      {
        name: "description",
        content:
          "Franchise sagas, curated CineVerse Presents programmes and community lists, all built from real film data.",
      },
      { property: "og:title", content: "Collections & sagas — CineVerse" },
      {
        property: "og:description",
        content: "Explore franchise sagas and curated programmes across film history.",
      },
    ],
  }),
  component: CollectionsPage,
});

function CollectionTile({ c, tall = false }: { c: CollectionCard; tall?: boolean }) {
  return (
    <Link
      to="/collections/$id"
      params={{ id: String(c.id) }}
      className={`group relative block overflow-hidden rounded-xl ring-1 ring-border/50 hover:ring-gold/60 ${
        tall ? "aspect-[4/3]" : "aspect-[16/9]"
      }`}
    >
      {c.backdrop ?? c.poster ? (
        <img
          src={(c.backdrop ?? c.poster) as string}
          alt=""
          loading="lazy"
          className="size-full object-cover opacity-45 transition-all duration-500 group-hover:scale-105 group-hover:opacity-65"
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
        <div className="label-gold">{c.count} films</div>
        <div className="mt-1 font-display text-lg leading-tight text-white">{c.name}</div>
        {c.posters.length ? (
          <div className="mt-3 flex gap-1">
            {c.posters.slice(0, 5).map((p) => (
              <img key={p} src={p} alt="" loading="lazy" className="h-10 w-7 rounded-xl object-cover" />
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function CollectionsPage() {
  const { featured, presents, sagas, community } = Route.useLoaderData() as Awaited<
    ReturnType<typeof getCollectionsPage>
  >;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <div className="label-gold">Collections</div>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-5xl">
        Films that belong together
      </h1>
      <p className="mt-3 max-w-xl font-sans text-sm text-muted-foreground">
        Sagas, trilogies and curated programmes — assembled from complete franchise data.
      </p>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <CollectionTile c={featured} tall />
        <div className="grid gap-5">
          {presents.slice(0, 2).map((c: CollectionCard) => (
            <CollectionTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader title="CineVerse Presents" subtitle="Programmed sequences worth a weekend" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {presents.map((c: CollectionCard) => (
            <CollectionTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader title="Franchise sagas" subtitle="Watch the whole arc in order" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sagas.map((c: CollectionCard) => (
            <CollectionTile key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="mt-16 mb-8">
        <SectionHeader title="Community lists" subtitle="Ranked by members and critics" />
        <div className="grid gap-5 md:grid-cols-3">
          {community.map((l: { slug: string; title: string; genre: number; count: number; posters: string[] }) => (
            <Link
              key={l.slug}
              to="/discover"
              search={{ genre: l.genre, sort: "vote_average.desc" }}
              className="group rounded-xl border border-border/60 bg-surface p-5 hover:border-gold/50"
            >
              <div className="label-mono">{l.count.toLocaleString()} films</div>
              <div className="mt-2 font-display text-base text-foreground group-hover:text-gold">
                {l.title}
              </div>
              <div className="mt-4 flex gap-1">
                {l.posters.map((p) => (
                  <img
                    key={p}
                    src={p}
                    alt=""
                    loading="lazy"
                    className="h-16 w-11 rounded-xl object-cover"
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
