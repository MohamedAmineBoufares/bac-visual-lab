import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createAppRouter, currentPage } from "./router";
import { headTags, localeOfPath } from "./seo";
import { SettingsProvider } from "./settings/settings";

/** Starts the app in `root`: hydrates a prerendered page, or renders from scratch (dev server). */
export const mount = async (root: HTMLElement) => {
  const router = createAppRouter();
  const prerendered = root.hasChildNodes();
  // Tells the router it is hydrating server HTML, so it renders the same tree (no client-only Suspense wrappers).
  if (prerendered) router.ssr = { manifest: undefined };
  // Each navigation swaps the title, description, canonical and hreflang tags for the new page's.
  router.subscribe("onResolved", () => {
    for (const el of document.head.querySelectorAll("[data-seo]")) el.remove();
    document.head.insertAdjacentHTML("beforeend", headTags(currentPage(router)));
  });
  // The prerendered HTML was rendered from resolved routes, so resolve them (and load their chunks) first.
  await router.load();

  const app = (
    <StrictMode>
      <SettingsProvider locale={localeOfPath(location.pathname)}>
        <RouterProvider router={router} />
      </SettingsProvider>
    </StrictMode>
  );
  if (prerendered) hydrateRoot(root, app);
  else createRoot(root).render(app);
  return router;
};
