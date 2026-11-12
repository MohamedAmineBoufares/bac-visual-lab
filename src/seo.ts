import { type Locale, locales, messages } from "@/i18n/messages";
import { isReady, lessons } from "@/lessons/lessons";
import { sections } from "@/screens/sections";
import { site } from "@/site";

// French, the language of the Bac, lives at the bare paths (/app); the others get a prefix (/en/app).
const prefixed = locales.filter((l) => l !== "fr");
const prefix = new RegExp(`^/(${prefixed.join("|")})(?=/|$)`);

/** The `{-$locale}` URL segment as a locale: none is French, an unknown one (or "fr") is not a page. */
export const toLocale = (param: string | undefined): Locale | undefined =>
  param === undefined ? "fr" : prefixed.find((l) => l === param);

/** The locale a path is written in. */
export const localeOfPath = (path: string): Locale => toLocale(prefix.exec(path)?.[1]) ?? "fr";

/** The same page in another language: /en/app → /ar/app, /app → /en/app, /en → /. */
export const localizePath = (path: string, locale: Locale) => {
  const bare = path.replace(prefix, "") || "/";
  if (locale === "fr") return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
};

/** UI text for a route's `{-$locale}` param, for `head()` which runs outside React. */
export const textFor = (param: string | undefined) => messages[toLocale(param) ?? "fr"];

/** A route's `head()`: the page title (site name appended) and its search-result description. */
export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: title === site.name ? title : `${title} · ${site.name}` },
    { name: "description", content: description },
  ],
});

export type Page = { path: string; title: string; description: string; noindex?: boolean };

const ogLocale: Record<Locale, string> = { fr: "fr_TN", en: "en_US", ar: "ar_TN" };
const url = (path: string) => site.url + path;
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Title, description, canonical, hreflang and Open Graph tags for one page, as HTML. Every tag carries
 * `data-seo` so the client can swap them on navigation (the prerendered page ships the same tags).
 */
export const headTags = ({ path, title, description, noindex }: Page) => {
  const locale = localeOfPath(path);
  const tag = (name: string, attrs: Record<string, string>) =>
    `<${name} data-seo ${Object.entries(attrs)
      .map(([k, v]) => `${k}="${escape(v)}"`)
      .join(" ")}>`;
  const tags = [
    `<title data-seo>${escape(title)}</title>`,
    tag("meta", { name: "description", content: description }),
    tag("meta", { property: "og:type", content: "website" }),
    tag("meta", { property: "og:site_name", content: site.name }),
    tag("meta", { property: "og:title", content: title }),
    tag("meta", { property: "og:description", content: description }),
    tag("meta", { property: "og:locale", content: ogLocale[locale] }),
    tag("meta", { name: "twitter:card", content: "summary" }),
  ];
  if (noindex) return [...tags, tag("meta", { name: "robots", content: "noindex" })].join("\n");
  return [
    ...tags,
    tag("meta", { property: "og:url", content: url(path) }),
    tag("link", { rel: "canonical", href: url(path) }),
    ...locales.map((l) => tag("link", { rel: "alternate", hreflang: l, href: url(localizePath(path, l)) })),
    tag("link", { rel: "alternate", hreflang: "x-default", href: url(localizePath(path, "fr")) }),
  ].join("\n");
};

/** Every indexable page, in French (bare) form. Chapters still "coming soon" have no page of their own. */
export const pagePaths = () => [
  "/",
  "/app",
  ...sections.map((s) => `/app/sections/${s.slug}`),
  ...lessons.filter(isReady).map((l) => `/app/lessons/${l.id}`),
];

/** sitemap.xml: each page once per locale, each entry listing its translations (hreflang). */
export const sitemap = (paths: string[]) => {
  const urls = paths.flatMap((p) =>
    locales.map((l) => {
      const alternates = locales
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${url(localizePath(p, a))}"/>`)
        .join("");
      return `<url><loc>${url(localizePath(p, l))}</loc>${alternates}</url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
};
