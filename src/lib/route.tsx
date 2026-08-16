/**
 * Page definition helper: keeps the declarative `loader / head / component`
 * shape of each page while running on react-router + the local query cache.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { readCache, writeCache } from "./query";

type MetaTag = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  charSet?: string;
};

export type HeadConfig = { meta?: MetaTag[] };

type RouteOptions<TData, TSearch> = {
  /** Path pattern this page is mounted at, e.g. "/movie/:id". */
  path?: string;
  validateSearch?: (search: Record<string, unknown>) => TSearch;
  loaderDeps?: (ctx: { search: TSearch }) => unknown;
  loader?: (ctx: {
    params: Record<string, string | undefined>;
    deps: any;
    search: TSearch;
  }) => Promise<TData> | TData;
  head?: (ctx: { loaderData: TData | undefined }) => HeadConfig;
  component?: ComponentType;
};

function applyHead(head: HeadConfig | undefined) {
  if (!head?.meta) return;
  for (const tag of head.meta) {
    if (tag.title) {
      document.title = tag.title;
      continue;
    }
    const attr = tag.name ? "name" : tag.property ? "property" : null;
    const key = tag.name ?? tag.property;
    if (!attr || !key || tag.content === undefined) continue;
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", tag.content);
  }
}

function LoaderScreen() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1400px] items-center justify-center px-4">
      <div className="text-center">
        <div className="label-gold">Threading the projector</div>
        <div className="mx-auto mt-4 h-px w-32 animate-pulse bg-gold/60" />
      </div>
    </div>
  );
}

function LoadErrorScreen({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4">
      <div className="text-center">
        <div className="label-gold">Projection fault</div>
        <h1 className="mt-3 font-display text-2xl text-foreground">This page didn't load</h1>
        <p className="mt-2 font-sans text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={retry}
          className="mt-6 rounded-sm bg-gold px-5 py-2.5 font-sans text-xs tracking-wide text-background hover:bg-gold-soft"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export function createRoute<TData = unknown, TSearch = Record<string, unknown>>(
  options: RouteOptions<TData, TSearch>,
) {
  const DataContext = createContext<TData | undefined>(undefined);

  function useSearch(): TSearch {
    const [searchParams] = useSearchParams();
    const raw = useMemo(
      () => Object.fromEntries(searchParams.entries()),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams.toString()],
    );
    return (options.validateSearch ? options.validateSearch(raw) : raw) as TSearch;
  }

  function Element() {
    const params = useParams();
    const search = useSearch();
    const deps = options.loaderDeps ? options.loaderDeps({ search }) : null;
    const cacheKey = JSON.stringify([options.path ?? "", params, deps]);

    const [state, setState] = useState<{
      status: "loading" | "ready" | "error";
      data?: TData;
      error?: Error;
    }>(() => {
      if (!options.loader) return { status: "ready" };
      const cached = readCache<TData>(cacheKey);
      return cached !== undefined ? { status: "ready", data: cached } : { status: "loading" };
    });
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
      if (!options.loader) return;
      const cached = readCache<TData>(cacheKey);
      if (cached !== undefined && nonce === 0) {
        setState({ status: "ready", data: cached });
        return;
      }
      let alive = true;
      setState({ status: "loading" });
      Promise.resolve(options.loader({ params, deps, search }))
        .then((data) => {
          writeCache(cacheKey, data);
          if (alive) setState({ status: "ready", data });
        })
        .catch((error: Error) => {
          if (alive) setState({ status: "error", error });
        });
      return () => {
        alive = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey, nonce]);

    useEffect(() => {
      if (state.status === "loading") return;
      applyHead(options.head?.({ loaderData: state.data }));
    }, [state.status, state.data]);

    useEffect(() => {
      window.scrollTo({ top: 0 });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey]);

    if (state.status === "loading") return <LoaderScreen />;
    if (state.status === "error" && state.error) {
      return <LoadErrorScreen error={state.error} retry={() => setNonce((n) => n + 1)} />;
    }

    const Component = options.component;
    if (!Component) return null;

    return (
      <DataContext.Provider value={state.data}>
        <div className="animate-page-in"><Component /></div>
      </DataContext.Provider>
    );
  }

  return {
    Element,
    useSearch,
    useParams,
    useLoaderData: () => useContext(DataContext) as TData,
  };
}
