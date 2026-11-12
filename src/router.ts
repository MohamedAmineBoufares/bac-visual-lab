import { type AnyRouter, createRouter, isNotFound, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { Page } from "./seo";
import { site } from "./site";

/** The app's router. Prerendering passes a memory history and `isServer` (said explicitly so tests render as Node does). */
export const createAppRouter = (server?: { history: RouterHistory; isServer: true }) =>
  createRouter({
    routeTree,
    ...server,
    defaultPreload: "intent",
    scrollRestoration: true,
    // Only page changes animate: in-page jumps (#subject-*) would lift the named titles above the sticky bar.
    // Not the first load either: there is no page to come from, and an aborted transition would fail hydration.
    defaultViewTransition: { types: ({ fromLocation, pathChanged }) => (fromLocation && pathChanged ? [] : false) },
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

/** The page the router has resolved, with the title and description its routes' `head()` gave. */
export const currentPage = (router: AnyRouter): Page => {
  const { matches, location } = router.state;
  const meta = matches.flatMap((m) => m.meta ?? []);
  const missing = matches.some((m) => isNotFound(m.error));
  return {
    path: location.pathname,
    title: missing ? `404 · ${site.name}` : (meta.findLast((m) => m?.title)?.title ?? site.name),
    description: meta.findLast((m) => m?.name === "description")?.content ?? "",
    noindex: missing,
  };
};
