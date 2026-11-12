import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Plugin } from "vite";

// What src/entry-server.tsx exports, built to dist-ssr by `vite build --ssr` before the client build.
type Entry = {
  render: (path: string) => Promise<{ html: string; head: string; lang: string; dir: string }>;
  pagePaths: () => string[];
  sitemap: (paths: string[]) => string;
  localizePath: (path: string, locale: "fr" | "en" | "ar") => string;
  locales: readonly ("fr" | "en" | "ar")[];
  site: { url: string };
};

/**
 * Writes one static HTML page per route and locale (/app → app.html, /en/app → en/app.html), plus 404.html,
 * sitemap.xml and robots.txt. Crawlers and link previews get real content and tags, and the first paint
 * no longer waits for JavaScript. Runs before the PWA plugin (closeBundleOrder "post") so the service
 * worker precaches these pages, not the empty shell.
 */
export const prerender = (): Plugin => ({
  name: "bvl:prerender",
  apply: (_, env) => env.command === "build" && !env.isSsrBuild,
  closeBundle: {
    order: "pre",
    sequential: true,
    async handler() {
      const entry = (await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href)) as Entry;
      const template = await readFile("dist/index.html", "utf8");
      const fonts = await readdir("dist/assets");
      // The heading font, so the hero title (the LCP element) does not wait for the CSS to find it.
      const fontFor = (dir: string) =>
        fonts.find((f) => f.startsWith(`readex-pro-${dir === "rtl" ? "arabic" : "latin"}-wght-normal-`));

      const write = async (path: string, file: string) => {
        const { html, head, lang, dir } = await entry.render(path);
        // <!--$!--> marks a boundary left to the client: the page would ship a placeholder.
        if (html.includes("<!--$!-->")) throw new Error(`prerender: ${path} still suspends after the warm-up pass`);
        const font = fontFor(dir);
        const preload = font
          ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>\n`
          : "";
        const page = template
          .replace(/<html [^>]*>/, `<html lang="${lang}" dir="${dir}">`)
          .replace("</head>", `${preload}${head}\n</head>`)
          .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
        if (!page.includes(html)) throw new Error(`prerender: no <div id="root"></div> in dist/index.html`);
        await mkdir(dirname(`dist/${file}`), { recursive: true });
        await writeFile(`dist/${file}`, page);
      };

      const paths = entry.pagePaths();
      for (const path of paths)
        for (const locale of entry.locales) {
          const localized = entry.localizePath(path, locale);
          await write(localized, localized === "/" ? "index.html" : `${localized.slice(1)}.html`);
        }
      await write("/404", "404.html");
      await writeFile("dist/sitemap.xml", entry.sitemap(paths));
      await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${entry.site.url}/sitemap.xml\n`);
      console.log(`Prerendered ${paths.length * entry.locales.length} pages, 404.html, sitemap.xml, robots.txt.`);
    },
  },
});
