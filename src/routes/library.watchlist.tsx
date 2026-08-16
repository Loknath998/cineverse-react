import { createRoute } from "../lib/route";

import { LibraryList } from "../components/site/library-list";

export const Route = createRoute({
  path: "/library/watchlist",
  component: () => (
    <LibraryList
      list="watchlist"
      title="Watchlist"
      subtitle="queued for a future evening"
      emptyCopy="Nothing queued yet. Add films from any detail page and they'll wait here for you."
    />
  ),
});
