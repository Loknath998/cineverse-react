/**
 * TMDB HTTP client (browser).
 *
 * Configure REACT_APP_TMDB_API_KEY in .env — either a v3 API key or a v4
 * read-access token (the token form is detected automatically).
 *
 * With no key configured, or if a live request fails, the request is answered
 * from the bundled offline catalogue (see ./tmdb-demo) so the app always
 * renders instead of surfacing an error screen.
 */

import { demoResponse } from "./tmdb-demo";

const BASE = "https://api.themoviedb.org/3";

const API_KEY = (process.env.REACT_APP_TMDB_API_KEY ?? "").trim();
export const DEMO_MODE = API_KEY === "";

let warned = false;
function warnOnce(reason: string) {
  if (warned) return;
  warned = true;
  // Informational only — never thrown, so the UI keeps rendering.
  console.info(`[CineVerse] Using bundled demo film data (${reason}).`);
}

export async function tmdb<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  if (DEMO_MODE) {
    warnOnce("REACT_APP_TMDB_API_KEY is not set");
    return demoResponse(path, params) as T;
  }

  try {
    const bearer = API_KEY.startsWith("ey");
    const url = new URL(BASE + path);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
    if (!bearer) url.searchParams.set("api_key", API_KEY);

    const res = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
        ...(bearer ? { authorization: `Bearer ${API_KEY}` } : {}),
      },
    });

    if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
    return (await res.json()) as T;
  } catch (error) {
    warnOnce(`live request failed: ${(error as Error).message}`);
    return demoResponse(path, params) as T;
  }
}
