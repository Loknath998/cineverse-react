import { Bookmark, Check, Heart, Star } from "lucide-react";
import { useState } from "react";

import { useLibrary } from "../../lib/library";
import type { MovieCard } from "../../lib/tmdb-map";

type Target = Pick<MovieCard, "id" | "title" | "poster" | "year" | "rating">;

const toEntry = (m: Target) => ({
  id: m.id,
  title: m.title,
  poster: m.poster,
  year: m.year,
  rating: m.rating,
});

export function MovieActions({ movie }: { movie: Target }) {
  const { has, toggle, rate, ratings, notes, setNote: saveNote, ready } = useLibrary();
  const [open, setOpen] = useState(false);
  const entry = toEntry(movie);
  const myRating = ratings[movie.id];
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(notes[movie.id] ?? "");

  const base =
    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-xs tracking-wide transition-colors";

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      <button
        onClick={() => toggle("watchlist", entry)}
        aria-pressed={ready && has("watchlist", movie.id)}
        className={`${base} ${
          ready && has("watchlist", movie.id)
            ? "border-gold bg-gold text-background"
            : "border-border bg-surface text-foreground hover:border-gold/60"
        }`}
      >
        <Bookmark className="size-3.5" />
        {ready && has("watchlist", movie.id) ? "On watchlist" : "Add to watchlist"}
      </button>

      <button
        onClick={() => toggle("watched", entry)}
        aria-pressed={ready && has("watched", movie.id)}
        className={`${base} ${
          ready && has("watched", movie.id)
            ? "border-gold/70 text-gold"
            : "border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <Check className="size-3.5" />
        {ready && has("watched", movie.id) ? "Watched" : "Mark watched"}
      </button>

      <button
        onClick={() => toggle("favorites", entry)}
        aria-label="Toggle favourite"
        aria-pressed={ready && has("favorites", movie.id)}
        className={`${base} ${
          ready && has("favorites", movie.id)
            ? "border-gold/70 text-gold"
            : "border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart className={`size-3.5 ${ready && has("favorites", movie.id) ? "fill-gold" : ""}`} />
        Favourite
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`${base} border-border text-muted-foreground hover:text-foreground`}
        >
          <Star className={`size-3.5 ${myRating ? "fill-gold text-gold" : ""}`} />
          {myRating ? `Your rating ${myRating}` : "Rate"}
        </button>
        {open ? (
          <div className="absolute left-0 z-30 mt-2 flex gap-1 rounded-xl border border-border bg-surface p-2 shadow-xl">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => {
                  rate(entry, n);
                  setOpen(false);
                }}
                className={`size-6 rounded-xl font-mono text-[0.6rem] transition-colors ${
                  myRating === n
                    ? "bg-gold text-background"
                    : "bg-surface-2 text-muted-foreground hover:bg-gold/30 hover:text-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        onClick={() => { setNote(notes[movie.id] ?? ""); setNoteOpen((v) => !v); }}
        className={`${base} border-border text-muted-foreground hover:text-foreground`}
      >
        {notes[movie.id] ? "Edit note" : "Add note"}
      </button>

      {noteOpen ? (
        <div className="absolute z-40 mt-14 w-[min(92vw,360px)] rounded-2xl border border-border bg-surface p-4 shadow-2xl">
          <div className="label-mono">Private movie note</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="What did you think?"
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-gold"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={() => setNoteOpen(false)} className="rounded-full border border-border px-3 py-1.5 font-mono text-[0.6rem] text-muted-foreground">Cancel</button>
            <button onClick={() => { saveNote(movie.id, note); setNoteOpen(false); }} className="rounded-full bg-gold px-3 py-1.5 font-mono text-[0.6rem] text-background">Save</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
