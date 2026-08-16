import { createRoute } from "../lib/route";
import { Link } from "../lib/router";
import { useEffect, useState } from "react";

import { SectionHeader } from "../components/site/media";
import { useLibrary } from "../lib/library";

type Profile = { name: string; handle: string; bio: string; favouriteEra: string };

const DEFAULTS: Profile = {
  name: "Guest Cinephile",
  handle: "@guest",
  bio: "Watching widely, rating honestly.",
  favouriteEra: "1970s",
};

const KEY = "cineverse.profile.v1";

export const Route = createRoute({
  path: "/profile",
  head: () => ({
    meta: [
      { title: "Your profile — CineVerse" },
      {
        name: "description",
        content: "Your CineVerse profile: taste summary, counts and viewing preferences.",
      },
      { property: "og:title", content: "Your profile — CineVerse" },
      {
        property: "og:description",
        content: "Manage your CineVerse identity and see your taste at a glance.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { ready, watched, watchlist, favorites, ratings, activity } = useLibrary();
  const [profile, setProfile] = useState<Profile>(DEFAULTS);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setProfile({ ...DEFAULTS, ...(JSON.parse(raw) as Profile) });
      } catch {
        /* ignore */
      }
    }
  }, []);

  const save = (next: Profile) => {
    setProfile(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setEditing(false);
  };

  const ratingValues = Object.values(ratings);
  const avg = ratingValues.length
    ? (ratingValues.reduce((s, v) => s + v, 0) / ratingValues.length).toFixed(1)
    : "—";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <section className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-gold-soft/60 to-surface-2 font-display text-5xl text-background ring-1 ring-border/60">
          {profile.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="label-gold">Member profile</div>
          {editing ? (
            <form
              className="mt-4 grid max-w-lg gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                save({
                  name: String(form.get("name") || DEFAULTS.name),
                  handle: String(form.get("handle") || DEFAULTS.handle),
                  bio: String(form.get("bio") || ""),
                  favouriteEra: String(form.get("favouriteEra") || DEFAULTS.favouriteEra),
                });
              }}
            >
              {(
                [
                  ["name", "Display name", profile.name],
                  ["handle", "Handle", profile.handle],
                  ["favouriteEra", "Favourite era", profile.favouriteEra],
                ] as const
              ).map(([field, label, value]) => (
                <label key={field} className="block">
                  <span className="label-mono">{label}</span>
                  <input
                    name={field}
                    defaultValue={value}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-gold"
                  />
                </label>
              ))}
              <label className="block">
                <span className="label-mono">Bio</span>
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-gold"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background hover:bg-gold-soft"
                >
                  Save profile
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-border px-5 py-2.5 font-sans text-xs tracking-wide text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="mt-3 font-display text-4xl text-foreground">{profile.name}</h1>
              <div className="mt-2 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
                {profile.handle} · favours the {profile.favouriteEra}
              </div>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-6 rounded-xl border border-border bg-surface px-5 py-2.5 font-sans text-xs tracking-wide text-foreground hover:border-gold/60"
              >
                Edit profile
              </button>
            </>
          )}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          title="Your numbers"
          subtitle="Live from your library"
          action={
            <Link to="/library/stats" className="label-gold hover:text-gold">
              Full journal
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              ["Watched", ready ? String(watched.length) : "—"],
              ["Watchlist", ready ? String(watchlist.length) : "—"],
              ["Favourites", ready ? String(favorites.length) : "—"],
              ["Average rating", ready ? avg : "—"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-surface p-5">
              <div className="label-mono">{k}</div>
              <div className="mt-2 font-display text-3xl text-gold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {ready && favorites.length ? (
        <section className="mt-14">
          <SectionHeader title="Favourite four" subtitle="Pinned to your profile" />
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {favorites.slice(0, 8).map((f) => (
              <Link
                key={f.id}
                to="/movie/$id"
                params={{ id: String(f.id) }}
                className="w-32 shrink-0"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-border/60 hover:ring-gold/60">
                  {f.poster ? (
                    <img
                      src={f.poster}
                      alt={f.title}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-2 font-display text-xs text-foreground">{f.title}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {ready && activity.length ? (
        <section className="mt-14">
          <SectionHeader title="Latest activity" />
          <ul className="divide-y divide-border/50 rounded-xl border border-border/60 bg-surface">
            {activity.slice(0, 6).map((a, i) => (
              <li key={`${a.id}-${a.at}-${i}`} className="flex items-center gap-3 px-4 py-3">
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
        </section>
      ) : null}
    </div>
  );
}
