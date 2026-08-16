import { createRoute } from "../lib/route";
import { Link } from "../lib/router";

import { SectionHeader } from "../components/site/media";
import { useLibrary } from "../lib/library";
import { GENRES } from "../lib/tmdb-map";

export const Route = createRoute({
  path: "/library/stats",
  component: Stats,
});

function Stats() {
  const { ready, watched, watchlist, favorites, ratings, activity } = useLibrary();

  if (!ready) return <div className="label-mono">Loading your journal…</div>;

  const ratingValues = Object.values(ratings);
  const avg = ratingValues.length
    ? (ratingValues.reduce((s, v) => s + v, 0) / ratingValues.length).toFixed(1)
    : "—";
  const decades = new Map<string, number>();
  for (const e of watched) {
    const d = e.year !== "—" ? `${e.year.slice(0, 3)}0s` : "Unknown";
    decades.set(d, (decades.get(d) ?? 0) + 1);
  }
  const decadeRows = [...decades.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxDecade = decadeRows[0]?.[1] ?? 1;

  const cards: [string, string][] = [
    ["Films watched", String(watched.length)],
    ["On watchlist", String(watchlist.length)],
    ["Favourites", String(favorites.length)],
    ["Your average", avg],
    ["Films rated", String(ratingValues.length)],
  ];

  return (
    <div>
      <SectionHeader title="Journal & stats" subtitle="Built from your own activity" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border/60 bg-surface p-5">
            <div className="label-mono">{k}</div>
            <div className="mt-2 font-display text-3xl text-gold">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <SectionHeader title="Decades you watch" subtitle="Distribution of logged films" />
          {decadeRows.length ? (
            <ul className="space-y-3">
              {decadeRows.map(([d, n]) => (
                <li key={d} className="flex items-center gap-4">
                  <span className="w-16 font-mono text-[0.65rem] text-muted-foreground">{d}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <span
                      className="block h-full rounded-full bg-gold"
                      style={{ width: `${(n / maxDecade) * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-[0.65rem] text-gold">{n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              Log a few films and your decade profile appears here.
            </p>
          )}
        </section>

        <section>
          <SectionHeader title="Recent activity" subtitle="Your last 10 actions" />
          {activity.length ? (
            <ul className="divide-y divide-border/50 rounded-xl border border-border/60 bg-surface">
              {activity.slice(0, 10).map((a, i) => (
                <li key={`${a.id}-${a.at}-${i}`} className="flex items-center gap-3 px-4 py-3">
                  {a.poster ? (
                    <img src={a.poster} alt="" className="h-12 w-8 rounded-xl object-cover" />
                  ) : null}
                  <Link
                    to="/movie/$id"
                    params={{ id: String(a.id) }}
                    className="font-display text-xs text-foreground hover:text-gold"
                  >
                    {a.title}
                  </Link>
                  <span className="ml-auto font-mono text-[0.6rem] text-muted-foreground">
                    {a.kind === "rated" ? `rated ${a.value}/10` : a.kind}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-muted-foreground">
              No activity yet — rate or save a film to start your journal.
            </p>
          )}
        </section>
      </div>

      <section className="mt-12">
        <SectionHeader title="Keep exploring" subtitle="Genres to fill the gaps" />
        <div className="flex flex-wrap gap-2">
          {[18, 878, 80, 35, 53, 16, 10749, 37].map((id) => (
            <Link
              key={id}
              to="/discover"
              search={{ genre: id, sort: "vote_average.desc" }}
              className="rounded-full border border-border px-3 py-1.5 font-mono text-[0.6rem] tracking-wider text-muted-foreground hover:border-gold/60 hover:text-gold"
            >
              {(GENRES[id] ?? "").toUpperCase()}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
