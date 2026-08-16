import { Link } from "../../lib/router";
import { ChevronRight, Star } from "lucide-react";
import type { ReactNode } from "react";

import type { MovieCard } from "../../lib/tmdb-map";

export function Score({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`font-mono text-[0.7rem] text-gold ${className}`}>
      {value ? value.toFixed(1) : "—"}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? (
          <p className="mt-1 font-sans text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PosterCard({ movie, width = "w-40 sm:w-44" }: { movie: MovieCard; width?: string }) {
  return (
    <Link
      to="/movie/$id"
      params={{ id: String(movie.id) }}
      className={`group block shrink-0 ${width} focus:outline-none`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-border/50 shadow-lg shadow-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:ring-gold/60 group-hover:shadow-xl group-hover:shadow-black/30">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center p-3 text-center font-display text-sm text-muted-foreground">
            {movie.title}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-8">
          <div className="font-display text-[0.8rem] leading-tight text-white">
            {movie.title}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[0.6rem] tracking-wider text-muted-foreground">
        <span>{movie.year}</span>
        <span className="opacity-40">·</span>
        <span className="truncate">{movie.director ?? movie.genres[0] ?? "Film"}</span>
        <Score value={movie.rating} className="ml-auto" />
      </div>
    </Link>
  );
}

export function PosterRail({
  title,
  subtitle,
  items,
  seeAll,
}: {
  title: string;
  subtitle?: string;
  items: MovieCard[];
  seeAll?: { to: string; search?: Record<string, unknown> };
}) {
  if (!items.length) return null;
  return (
    <section className="mb-14">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={
          seeAll ? (
            <Link
              to={seeAll.to as never}
              search={seeAll.search as never}
              className="label-gold flex items-center gap-1 hover:text-gold"
            >
              See all <ChevronRight className="size-3" />
            </Link>
          ) : null
        }
      />
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 hide-scrollbar">
        {items.map((m, i) => (
          <PosterCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}

export function PosterGrid({ items }: { items: MovieCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((m, i) => (
        <PosterCard key={m.id} movie={m} width="w-full" />
      ))}
    </div>
  );
}

export function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1 font-mono text-[0.65rem] text-gold">
      <Star className="size-3 fill-gold text-gold" />
      {value.toFixed(1)}
    </span>
  );
}
