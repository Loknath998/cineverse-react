import { Component, useEffect } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { Footer } from "./components/site/footer";
import { Navbar } from "./components/site/navbar";
import { LibraryProvider } from "./lib/library";

import { Route as HomeRoute } from "./routes/index";
import { Route as AboutRoute } from "./routes/about";
import { Route as DiscoverRoute } from "./routes/discover";
import { Route as CollectionsRoute } from "./routes/collections.index";
import { Route as CollectionDetailRoute } from "./routes/collections.$id";
import { Route as MovieRoute } from "./routes/movie.$id";
import { Route as PersonRoute } from "./routes/person.$id";
import { Route as ProfileRoute } from "./routes/profile";
import { Route as LibraryRoute } from "./routes/library";
import { LibraryIndexRedirect } from "./routes/library.index";
import { Route as WatchlistRoute } from "./routes/library.watchlist";
import { Route as WatchedRoute } from "./routes/library.watched";
import { Route as FavoritesRoute } from "./routes/library.favorites";
import { Route as StatsRoute } from "./routes/library.stats";

function NotFound() {
  useEffect(() => {
    document.title = "Reel not found — CineVerse";
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="label-gold">404</div>
        <h1 className="mt-3 font-display text-3xl text-foreground">Reel not found</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          This page isn't in the archive. It may have been moved or never printed.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background transition-colors hover:bg-gold-soft"
          >
            Back to the lobby
          </Link>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-lg text-center">
          <div className="label-gold">Projection fault</div>
          <h1 className="mt-3 font-display text-2xl text-foreground">This page didn't load</h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">{error.message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="rounded-sm bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background hover:bg-gold-soft"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-sm border border-border px-5 py-2.5 font-sans text-xs tracking-wide text-foreground hover:bg-surface"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LibraryProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomeRoute.Element />} />
                <Route path="/about" element={<AboutRoute.Element />} />
                <Route path="/discover" element={<DiscoverRoute.Element />} />
                <Route path="/collections" element={<CollectionsRoute.Element />} />
                <Route path="/collections/:id" element={<CollectionDetailRoute.Element />} />
                <Route path="/movie/:id" element={<MovieRoute.Element />} />
                <Route path="/person/:id" element={<PersonRoute.Element />} />
                <Route path="/profile" element={<ProfileRoute.Element />} />
                <Route path="/library" element={<LibraryRoute.Element />}>
                  <Route index element={<LibraryIndexRedirect />} />
                  <Route path="watchlist" element={<WatchlistRoute.Element />} />
                  <Route path="watched" element={<WatchedRoute.Element />} />
                  <Route path="favorites" element={<FavoritesRoute.Element />} />
                  <Route path="stats" element={<StatsRoute.Element />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </LibraryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
