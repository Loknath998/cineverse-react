import { createRoute } from "../lib/route";

import { LibraryList } from "../components/site/library-list";

export const Route = createRoute({
  path: "/library/watched",
  component: () => (
    <LibraryList
      list="watched"
      title="Watched"
      subtitle="logged in your journal"
      emptyCopy="Mark films as watched or rate them and they'll appear here as your viewing journal."
    />
  ),
});
