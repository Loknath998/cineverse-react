import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { MovieActions } from "../components/site/movie-actions";
import { PosterRail, SectionHeader } from "../components/site/media";
import { getMovie } from "../lib/tmdb.api";
import { fmtMoney, fmtRuntime } from "../lib/tmdb-map";

export const Route = createRoute({
  path: "/movie/$id",
  loader: ({ params }) => getMovie({ data: { id: Number(params.id) } }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Film unavailable — CineVerse" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} (${loaderData.year}) — CineVerse`;
    const description =
      loaderData.overview.slice(0, 155) || `Cast, crew and details for ${loaderData.title}.`;
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
  component: MoviePage,
});

function MoviePage() {
  const m = Route.useLoaderData() as Awaited<ReturnType<typeof getMovie>>;

  const facts: [string, string][] = [
    ["Released", m.release || "—"],
    ["Runtime", fmtRuntime(m.runtime)],
    ["Status", m.status || "—"],
    ["Language", m.languages[0] ?? m.language],
    ["Country", m.countries[0] ?? "—"],
    ["Budget", fmtMoney(m.budget)],
    ["Revenue", fmtMoney(m.revenue)],
    ["Votes", m.votes.toLocaleString()],
  ];

  return (
    <div>
      <section className="relative isolate">
        {m.backdrop ? (
          <img
            src={m.backdrop}
            alt=""
            className="absolute inset-0 z-0 size-full object-cover object-top opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/90 via-background/68 to-background/20" />
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-4 pt-14 pb-12 sm:px-8 md:grid-cols-[240px_1fr]">
          <div className="w-40 overflow-hidden rounded-2xl ring-1 ring-border/60 shadow-2xl md:w-full">
            {m.poster ? (
              <img src={m.poster} alt={`${m.title} poster`} className="size-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="label-gold">{m.genres.join(" · ")}</div>
            {m.logo ? (
              <img src={m.logo} alt={m.title} className="mt-3 max-h-20 max-w-[min(520px,90%)] object-contain object-left" />
            ) : (
              <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-5xl">
                {m.title}
              </h1>
            )}
            {m.tagline ? (
              <p className="mt-2 font-display text-base italic text-gold-soft">{m.tagline}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
              <span>{m.year}</span>
              <span className="opacity-40">·</span>
              <span>{fmtRuntime(m.runtime)}</span>
              <span className="opacity-40">·</span>
              {m.directorId ? (
                <Link
                  to="/person/$id"
                  params={{ id: String(m.directorId) }}
                  className="text-gold hover:underline"
                >
                  Dir. {m.director}
                </Link>
              ) : (
                <span>Dir. {m.director}</span>
              )}
              <span className="opacity-40">·</span>
              <span className="text-gold">{m.rating.toFixed(1)}</span>
            </div>
            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
              {m.overview}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {m.trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(m.trailer)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
                >
                  Trailer
                </a>
              ) : null}
              <MovieActions movie={m} />
            </div>
            {m.providers.length ? (
              <div className="mt-6 flex items-center gap-3">
                <span className="label-mono">Where to watch</span>
                {m.providers.map((p) => (
                  <span
                    key={`${p.name}-${p.kind}`}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1"
                  >
                    {p.logo ? (
                      <img src={p.logo} alt="" className="size-4 rounded-xl" loading="lazy" />
                    ) : null}
                    <span className="font-mono text-[0.6rem] text-muted-foreground">
                      {p.name} · {p.kind}
                    </span>
                  </span>
                ))}
              </div>
            ) : null}            {m.keywords?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {m.keywords.slice(0, 8).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-border/70 bg-surface/70 px-3 py-1 font-mono text-[0.58rem] tracking-wider text-muted-foreground">
                    #{keyword.replace(/\s+/g, "-")}
                  </span>
                ))}
              </div>
            ) : null}

          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <section className="mb-14 grid gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <SectionHeader title="Cast" subtitle="Top billing" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {m.cast.map((p) => (
                <Link
                  key={`${p.id}-${p.character}`}
                  to="/person/$id"
                  params={{ id: String(p.id) }}
                  className="group flex items-center gap-3"
                >
                  <div className="size-12 shrink-0 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border/60 group-hover:ring-gold/60">
                    {p.profile ? (
                      <img
                        src={p.profile}
                        alt={p.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-display text-xs text-foreground">{p.name}</div>
                    <div className="truncate font-mono text-[0.6rem] text-muted-foreground">
                      {p.character}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <SectionHeader title="Crew" subtitle="Key departments" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {m.crew.map((c) => (
                  <Link
                    key={`${c.id}-${c.role}`}
                    to="/person/$id"
                    params={{ id: String(c.id) }}
                    className="rounded-xl border border-border/60 bg-surface px-3 py-2 hover:border-gold/50"
                  >
                    <div className="label-mono">{c.role}</div>
                    <div className="mt-1 font-display text-xs text-foreground">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <SectionHeader title="Details" />
            <dl className="divide-y divide-border/50 rounded-xl border border-border/60 bg-surface">
              {facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                  <dt className="label-mono">{k}</dt>
                  <dd className="font-sans text-xs text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            {m.writers.length ? (
              <p className="mt-4 font-sans text-xs text-muted-foreground">
                <span className="label-mono">Written by</span>
                <br />
                {m.writers.join(", ")}
              </p>
            ) : null}
            {m.collection ? (
              <Link
                to="/collections/$id"
                params={{ id: String(m.collection.id) }}
                className="group relative mt-6 block aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-border/60 hover:ring-gold/60"
              >
                {m.collection.backdrop ? (
                  <img
                    src={m.collection.backdrop}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover opacity-45 group-hover:opacity-65"
                  />
                ) : null}
                <span className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="label-gold">Part of</span>
                  <span className="font-display text-sm text-foreground">{m.collection.name}</span>
                </span>
              </Link>
            ) : null}
          </aside>
        </section>

        {m.images.length ? (
          <section className="mb-14">
            <SectionHeader title="Stills" subtitle="Frames from the film" />
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 hide-scrollbar">
              {m.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-40 w-auto shrink-0 rounded-xl object-cover ring-1 ring-border/50"
                />
              ))}
            </div>
          </section>
        ) : null}

        {m.reviews.length ? (
          <section className="mb-14">
            <SectionHeader title="Reviews" subtitle={`${m.reviewCount} logged reviews`} />
            <div className="grid gap-4 md:grid-cols-3">
              {m.reviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-border/60 bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-foreground">{r.author}</span>
                    {r.rating ? (
                      <span className="font-mono text-[0.6rem] text-gold">{r.rating}/10</span>
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-6 font-sans text-xs leading-relaxed text-muted-foreground">
                    {r.content}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <PosterRail title="Similar films" subtitle="Same wavelength" items={m.similar} />
        <PosterRail title="Recommended next" subtitle="If you liked this" items={m.recommended} />
      </div>
    </div>
  );
}
