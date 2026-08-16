import { createRoute } from "../lib/route";
import { Link, Outlet, useRouterState } from "../lib/router";

const TABS = [
  { to: "/library/watchlist", label: "Watchlist" },
  { to: "/library/watched", label: "Watched" },
  { to: "/library/favorites", label: "Favourites" },
  { to: "/library/stats", label: "Journal & stats" },
] as const;

export const Route = createRoute({
  path: "/library",
  head: () => ({
    meta: [
      { title: "Your library — CineVerse" },
      {
        name: "description",
        content: "Your watchlist, watched films, favourites and viewing statistics in one place.",
      },
      { property: "og:title", content: "Your library — CineVerse" },
      {
        property: "og:description",
        content: "Track what you want to watch, what you've seen and what you loved.",
      },
    ],
  }),
  component: LibraryLayout,
});

function LibraryLayout() {
  const pathname = useRouterState({ select: (s: any) => s.location.pathname });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <div className="label-gold">Your library</div>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        Everything you're keeping
      </h1>

      <nav className="mt-8 flex gap-6 overflow-x-auto border-b border-border/60 pb-px hide-scrollbar">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`pb-3 font-sans text-xs whitespace-nowrap transition-colors ${
              pathname === t.to
                ? "border-b-2 border-gold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
}
