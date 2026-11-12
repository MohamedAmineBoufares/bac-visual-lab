import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { prerender } from "react-dom/static";
import { localeDir } from "./i18n/messages";
import { createAppRouter, currentPage } from "./router";
import { headTags, localeOfPath } from "./seo";
import { SettingsProvider } from "./settings/settings";

export { locales } from "./i18n/messages";
export { localizePath, pagePaths, sitemap } from "./seo";
export { site } from "./site";

/** Prerenders one path at build time (see scripts/prerender.ts): the page's HTML, head tags and <html> attributes. */
export const render = async (path: string) => {
  const router = createAppRouter({ history: createMemoryHistory({ initialEntries: [path] }), isServer: true });
  await router.load();
  const locale = localeOfPath(path);
  const page = (
    <SettingsProvider locale={locale}>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
  // `prerender` waits for the lazy simulations to load, but outlines big boundaries behind inline $RC
  // scripts that hydration into #root rejects (React error 418). Once loaded, renderToString inlines them.
  await prerender(page);
  const html = renderToString(page);
  return { html, head: headTags(currentPage(router)), lang: locale, dir: localeDir[locale] };
};
