import React from "react";
import {
  Link as RRLink,
  Outlet,
  useLocation,
  useNavigate as useRRNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

type AnyLinkProps = React.ComponentProps<typeof RRLink> & {
  params?: Record<string, string | number>;
  search?: Record<string, unknown> | ((prev: Record<string, string>) => Record<string, unknown>);
};

function buildTo(
  to: string | { pathname?: string; search?: string },
  params?: Record<string, string | number>,
  search?: Record<string, unknown> | ((prev: Record<string, string>) => Record<string, unknown>)
) {
  let path = typeof to === "string" ? to : (to.pathname ?? "/");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`$${key}`, encodeURIComponent(String(value)));
      path = path.replace(`:${key}`, encodeURIComponent(String(value)));
    });
  }

  if (search) {
    const current = new URLSearchParams();
    if (typeof search === "function") {
      const next = search({});
      Object.entries(next || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") current.set(key, String(value));
      });
    } else {
      Object.entries(search).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") current.set(key, String(value));
      });
    }
    const query = current.toString();
    if (query) path += `?${query}`;
  }

  return path;
}

export function Link({ params, search, to, ...props }: AnyLinkProps) {
  return <RRLink {...props} to={buildTo(to as any, params, search)} />;
}

export { Outlet, useParams };

export function useNavigate() {
  const navigate = useRRNavigate();
  const location = useLocation();

  return (to: any, options?: any) => {
    if (typeof to === "string") return navigate(to, options);

    if (to && typeof to === "object" && "search" in to) {
      const params = new URLSearchParams(location.search);
      const prev: Record<string, string> = {};
      params.forEach((value, key) => { prev[key] = value; });

      const next = typeof to.search === "function" ? to.search(prev) : to.search;
      const q = new URLSearchParams();
      Object.entries(next || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") q.set(key, String(value));
      });

      const query = q.toString();
      return navigate(`${location.pathname}${query ? `?${query}` : ""}`, options);
    }

    return navigate(to?.to ?? ".", options);
  };
}

export function useRouterState({ select }: { select: (state: any) => any }) {
  const location = useLocation();
  return select({ location });
}

export function useSearch() {
  const [params] = useSearchParams();
  const result: Record<string, string> = {};
  params.forEach((value, key) => { result[key] = value; });
  return result;
}
