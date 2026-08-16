import { useQuery } from "../../lib/query";
import { Link } from "../../lib/router";
import { Trash2 } from "lucide-react";

import { PosterCard, SectionHeader } from "./media";
import { useLibrary } from "../../lib/library";
import { getMoviesByIds } from "../../lib/tmdb.api";
import type { MovieCard } from "../../lib/tmdb-map";

export function useLibraryFilms(list: "watchlist" | "favorites" | "watched") {
  const lib = useLibrary();
  const ids = lib[list].map((e) => e.id);
  const query = useQuery({
    queryKey: ["library-films", ids],
    queryFn: () => getMoviesByIds({ data: { ids } }),
    enabled: lib.ready && ids.length > 0,
  });
  return { ids, films: (query.data ?? []) as MovieCard[], loading: query.isPending, lib };
}

export function LibraryList({
  list,
  title,
  subtitle,
  emptyCopy,
}: {
  list: "watchlist" | "favorites" | "watched";
  title: string;
  subtitle: string;
  emptyCopy: string;
}) {
  const { ids, films, loading, lib } = useLibraryFilms(list);

  if (!lib.ready) return <div className="label-mono">Loading your library…</div>;

  if (!ids.length) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-surface p-10 text-center">
        <div className="label-gold">{title}</div>
        <p className="mx-auto mt-3 max-w-sm font-sans text-sm text-muted-foreground">{emptyCopy}</p>
        <Link
          to="/discover"
          className="mt-6 inline-block rounded-xl bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background hover:bg-gold-soft"
        >
          Find something to watch
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title={title} subtitle={`${ids.length} films · ${subtitle}`} />
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {ids.slice(0, 12).map((id) => (
            <div key={id} className="aspect-[2/3] animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {films.map((m) => (
            <div key={m.id} className="group/entry relative">
              <PosterCard movie={m} width="w-full" />
              <button
                onClick={() => lib.remove(list, [m.id])}
                aria-label={`Remove ${m.title}`}
                className="absolute top-2 right-2 grid size-7 place-items-center rounded-xl bg-background/85 text-muted-foreground opacity-0 transition-opacity group-hover/entry:opacity-100 hover:text-gold"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
