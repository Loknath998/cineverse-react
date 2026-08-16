import { Link, useNavigate, useRouterState } from "../../lib/router";
import { Moon, Search, Sun, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { searchAll } from "../../lib/tmdb.api";
import type { MovieCard, PersonCard, CollectionCard } from "../../lib/tmdb-map";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/collections", label: "Collections" },
  { to: "/library/watchlist", label: "Library" },
] as const;

type SearchResults = { films: MovieCard[]; people: PersonCard[]; collections: CollectionCard[] };
type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("cineverse-theme") === "light" ? "light" : "dark";
}

export function Navbar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults>({ films: [], people: [], collections: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s: any) => s.location.pathname });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("cineverse-theme", theme);
  }, [theme]);

  useEffect(() => {
    const value = q.trim();
    if (!value) {
      setResults({ films: [], people: [], collections: [] });
      return;
    }
    const timer = window.setTimeout(async () => {
      const found = await searchAll({ data: { q: value } });
      setResults({ films: found.films.slice(0, 5), people: found.people.slice(0, 4), collections: found.collections.slice(0, 3) });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("cineverse-theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to.split("/").slice(0, 2).join("/"));

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/discover", search: { q: q.trim() } });
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-8">
        <Link to="/" className="font-display text-base tracking-[0.22em] whitespace-nowrap">
          CINE<span className="text-gold">VERSE</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`font-sans text-xs tracking-wide transition-colors ${isActive(n.to) ? "border-b border-gold pb-1 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div ref={searchRef} className="relative z-[60] ml-auto">
          <form className="flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1.5 shadow-sm" onSubmit={submitSearch}>
            <Search className="size-3.5 text-muted-foreground" />
            <input value={q} onFocus={() => setSearchOpen(true)} onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }} placeholder="Search films, people" aria-label="Search films and people" className="w-28 bg-transparent font-sans text-xs text-foreground outline-none placeholder:text-muted-foreground sm:w-48" />
            {q ? <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground"><X className="size-3" /></button> : null}
          </form>

          {searchOpen && q.trim() && (results.films.length || results.people.length || results.collections.length) ? (
            <div className="absolute right-0 top-12 z-[100] w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-border/80 bg-surface/98 p-2 shadow-2xl backdrop-blur-xl">
              {results.films.length ? <div><div className="label-mono px-2 py-2">Films</div>{results.films.map((m) => <Link key={m.id} to="/movie/$id" params={{ id: String(m.id) }} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2"><img src={m.poster ?? ""} alt="" className="h-12 w-8 rounded-lg object-cover bg-surface-2" /><div className="min-w-0"><div className="truncate font-display text-sm text-foreground">{m.title}</div><div className="font-mono text-[0.6rem] text-muted-foreground">{m.year} · ⭐ {m.rating.toFixed(1)}</div></div></Link>)}</div> : null}
              {results.people.length ? <div className="mt-1 border-t border-border/50 pt-1"><div className="label-mono px-2 py-2">People</div>{results.people.map((p) => <Link key={p.id} to="/person/$id" params={{ id: String(p.id) }} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2"><img src={p.profile ?? ""} alt="" className="size-9 rounded-full object-cover bg-surface-2" /><div><div className="font-display text-sm text-foreground">{p.name}</div><div className="font-mono text-[0.6rem] text-muted-foreground">{p.role}</div></div></Link>)}</div> : null}
              {results.collections.length ? <div className="mt-1 border-t border-border/50 pt-1"><div className="label-mono px-2 py-2">Collections</div>{results.collections.map((c) => <Link key={c.id} to="/collections/$id" params={{ id: String(c.id) }} onClick={() => setSearchOpen(false)} className="block rounded-xl p-2 hover:bg-surface-2"><div className="font-display text-sm text-foreground">{c.name}</div><div className="font-mono text-[0.6rem] text-muted-foreground">{c.count || "TMDB"} films</div></Link>)}</div> : null}
              <button onClick={submitSearch as any} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-left font-mono text-[0.6rem] tracking-wider text-gold hover:bg-surface-2">VIEW ALL RESULTS →</button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === "light"}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="group flex h-8 items-center gap-0.5 rounded-full border border-border/70 bg-surface p-0.5 text-muted-foreground transition hover:border-gold/60"
        >
          <span className={`grid size-6 place-items-center rounded-full transition-all duration-200 ${theme === "light" ? "bg-gold text-primary-foreground shadow-sm" : "group-hover:text-gold"}`}>
            <Sun className="size-3.5" aria-hidden="true" />
          </span>
          <span className={`grid size-6 place-items-center rounded-full transition-all duration-200 ${theme === "dark" ? "bg-surface-2 text-foreground shadow-sm" : "group-hover:text-gold"}`}>
            <Moon className="size-3.5" aria-hidden="true" />
          </span>
        </button>

        <Link to="/profile" aria-label="Your profile" className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold/40 text-primary-foreground">
          <User className="size-3.5" />
        </Link>
      </div>

      <nav className="flex items-center gap-5 overflow-x-auto border-t border-border/40 px-4 py-2 md:hidden hide-scrollbar">
        {NAV.map((n) => <Link key={n.to} to={n.to} className={`font-sans text-xs whitespace-nowrap ${isActive(n.to) ? "text-gold" : "text-muted-foreground"}`}>{n.label}</Link>)}
        <Link to="/about" className="font-sans text-xs whitespace-nowrap text-muted-foreground">About</Link>
      </nav>
    </header>
  );
}
