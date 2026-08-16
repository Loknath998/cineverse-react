import { createRoute } from "../lib/route";

import { LibraryList } from "../components/site/library-list";

export const Route = createRoute({
  path: "/library/favorites",
  component: () => (
    <LibraryList
      list="favorites"
      title="Favourites"
      subtitle="the ones you return to"
      emptyCopy="Tap the heart on any film to keep it here as a permanent favourite."
    />
  ),
});
