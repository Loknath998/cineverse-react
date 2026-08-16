import { createRoute } from "../lib/route";
import { Link } from "../lib/router";
import { useState } from "react";

import { PosterGrid, PosterRail, SectionHeader } from "../components/site/media";
import { getPerson } from "../lib/tmdb.api";

export const Route = createRoute({
  path: "/person/$id",
  loader: ({ params }) => getPerson({ data: { id: Number(params.id) } }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Person unavailable — CineVerse" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — CineVerse`;
    const description =
      loaderData.biography.slice(0, 155) ||
      `${loaderData.name}: ${loaderData.creditCount} film credits in ${loaderData.department}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(loaderData.profile
          ? [
              { property: "og:image", content: loaderData.profile },
              { name: "twitter:image", content: loaderData.profile },
            ]
          : []),
      ],
    };
  },
  component: PersonPage,
});

function PersonPage() {
  const p = Route.useLoaderData() as Awaited<ReturnType<typeof getPerson>>;
  const [visible, setVisible] = useState(48);

  const stats: [string, string][] = [
    ["Credits", String(p.creditCount)],
    ["Avg. rating", p.averageRating ? p.averageRating.toFixed(1) : "—"],
    ["Active since", p.firstYear],
    ["Department", p.department],
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <section className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div>
          <div className="overflow-hidden rounded-xl ring-1 ring-border/60">
            {p.profile ? (
              <img src={p.profile} alt={p.name} className="size-full object-cover" />
            ) : (
              <div className="grid aspect-[2/3] place-items-center font-display text-muted-foreground">
                {p.name}
              </div>
            )}
          </div>
          <dl className="mt-5 divide-y divide-border/50 rounded-xl border border-border/60 bg-surface">
            {stats.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between px-4 py-2.5">
                <dt className="label-mono">{k}</dt>
                <dd className="font-sans text-xs text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <div className="label-gold">{p.department}</div>
          <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {p.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-3 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
            {p.birthday ? <span>Born {p.birthday}</span> : null}
            {p.deathday ? <span>· Died {p.deathday}</span> : null}
            {p.place ? <span>· {p.place}</span> : null}
          </div>
          {p.biography ? (
            <p className="mt-6 max-w-3xl font-sans text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {p.biography}
            </p>
          ) : null}

          {p.images.length ? (
            <div className="mt-8 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {p.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-28 w-auto shrink-0 rounded-xl object-cover ring-1 ring-border/50"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-16">
        <PosterRail title="Known for" subtitle="Signature work" items={p.knownFor} />

        {p.collaborators.length ? (
          <section className="mb-14">
            <SectionHeader title="Frequent collaborators" subtitle="Shared credits across films" />
            <div className="flex gap-5 overflow-x-auto pb-2 hide-scrollbar">
              {p.collaborators.map((c) => (
                <Link
                  key={c.id}
                  to="/person/$id"
                  params={{ id: String(c.id) }}
                  className="group w-28 shrink-0 text-center"
                >
                  <div className="aspect-square overflow-hidden rounded-full bg-surface-2 ring-1 ring-border/60 group-hover:ring-gold/60">
                    {c.profile ? (
                      <img
                        src={c.profile}
                        alt={c.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 font-display text-xs text-foreground">{c.name}</div>
                  <div className="label-mono">
                    {c.role} · {c.count} films
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <SectionHeader title="Filmography" subtitle={`${p.credits.length} unique film credits, newest first`} />
        <PosterGrid items={p.credits.slice(0, visible)} />
        {visible < p.credits.length ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setVisible((n) => Math.min(n + 48, p.credits.length))}
              className="rounded-full border border-border bg-surface px-5 py-2.5 font-mono text-[0.62rem] tracking-wider text-muted-foreground transition hover:border-gold/60 hover:text-foreground"
            >
              LOAD MORE · {p.credits.length - visible} LEFT
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
