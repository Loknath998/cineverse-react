import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { MovieActions } from "../components/site/movie-actions";
import { SectionHeader } from "../components/site/media";
import { getCollection } from "../lib/tmdb.api";
import { fmtRuntime } from "../lib/tmdb-map";
import type { MovieCard } from "../lib/tmdb-map";

export const Route = createRoute({
  path: "/collections/$id",
  loader: ({ params }) => getCollection({ data: { id: Number(params.id) } }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Collection unavailable — CineVerse" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} — CineVerse Collections`;
    const description =
      loaderData.overview.slice(0, 155) ||
      `All ${loaderData.parts.length} films in ${loaderData.name}, in release order.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(loaderData.backdrop
          ? [
              { property: "og:image", content: loaderData.backdrop },
              { name: "twitter:image", content: loaderData.backdrop },
            ]
          : []),
      ],
    };
  },
  component: CollectionDetail,
});

function CollectionDetail() {
  const c = Route.useLoaderData() as Awaited<ReturnType<typeof getCollection>>;

  return (
    <div>
      <section className="relative isolate">
        {c.backdrop ? (
          <img
            src={c.backdrop}
            alt=""
            className="absolute inset-0 z-0 size-full object-cover object-top opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/90 via-background/68 to-background/20" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-16 pb-12 sm:px-8">
          <Link to="/collections" className="label-gold hover:text-gold">
            ← All collections
          </Link>
          <h1 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-foreground sm:text-5xl">
            {c.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
            <span>{c.parts.length} films</span>
            <span className="opacity-40">·</span>
            <span>{fmtRuntime(c.runtime)} total</span>
            <span className="opacity-40">·</span>
            <span className="text-gold">{c.average.toFixed(1)} average</span>
          </div>
          {c.overview ? (
            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              {c.overview}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-8">
        <SectionHeader title="The saga in order" subtitle="Chronological release order" />
        <ol className="space-y-5">
          {c.parts.map((m: MovieCard, i: number) => (
            <li
              key={m.id}
              className="grid gap-5 rounded-xl border border-border/60 bg-surface p-4 sm:grid-cols-[92px_1fr]"
            >
              <Link
                to="/movie/$id"
                params={{ id: String(m.id) }}
                className="block w-20 overflow-hidden rounded-xl ring-1 ring-border/60 sm:w-full"
              >
                {m.poster ? (
                  <img
                    src={m.poster}
                    alt={`${m.title} poster`}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : null}
              </Link>
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-[0.6rem] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    to="/movie/$id"
                    params={{ id: String(m.id) }}
                    className="font-display text-lg text-foreground hover:text-gold"
                  >
                    {m.title}
                  </Link>
                  <span className="font-mono text-[0.6rem] text-muted-foreground">
                    {m.year} · {fmtRuntime(m.runtime)} · {m.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl line-clamp-3 font-sans text-xs leading-relaxed text-muted-foreground">
                  {m.overview}
                </p>
                <div className="mt-4">
                  <MovieActions movie={m} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
