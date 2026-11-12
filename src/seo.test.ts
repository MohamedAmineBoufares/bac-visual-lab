import { describe, expect, it } from "vitest";
import { headTags, localeOfPath, localizePath, pageMeta, pagePaths, sitemap, toLocale } from "./seo";
import { site } from "./site";

describe("locale in the URL", () => {
  it("reads the optional segment: none is French, only en/ar are prefixes", () => {
    expect(toLocale(undefined)).toBe("fr");
    expect(toLocale("en")).toBe("en");
    expect(toLocale("ar")).toBe("ar");
    // /fr/... would duplicate the bare French pages; anything else is not a language.
    expect(toLocale("fr")).toBeUndefined();
    expect(toLocale("app")).toBeUndefined();
  });

  it("finds the locale a path is written in", () => {
    expect(localeOfPath("/")).toBe("fr");
    expect(localeOfPath("/app")).toBe("fr");
    expect(localeOfPath("/en")).toBe("en");
    expect(localeOfPath("/ar/app/lessons/rc-charging")).toBe("ar");
    expect(localeOfPath("/english")).toBe("fr");
  });

  it("moves a path between languages", () => {
    expect(localizePath("/", "en")).toBe("/en");
    expect(localizePath("/app", "ar")).toBe("/ar/app");
    expect(localizePath("/en/app", "ar")).toBe("/ar/app");
    expect(localizePath("/ar/app/sections/mathematiques", "fr")).toBe("/app/sections/mathematiques");
    expect(localizePath("/en", "fr")).toBe("/");
    expect(localizePath("/en", "en")).toBe("/en");
  });
});

describe("head tags", () => {
  it("appends the site name to page titles, once", () => {
    expect(pageMeta("Charge", "d").meta[0]).toEqual({ title: `Charge · ${site.name}` });
    expect(pageMeta(site.name, "d").meta[0]).toEqual({ title: site.name });
  });

  it("gives a page its canonical URL and every translation", () => {
    const tags = headTags({ path: "/en/app", title: "Home", description: "Lead" });
    expect(tags).toContain(`<link data-seo rel="canonical" href="${site.url}/en/app">`);
    expect(tags).toContain(`hreflang="fr" href="${site.url}/app"`);
    expect(tags).toContain(`hreflang="ar" href="${site.url}/ar/app"`);
    expect(tags).toContain(`hreflang="x-default" href="${site.url}/app"`);
    expect(tags).toContain(`<meta data-seo property="og:locale" content="en_US">`);
    expect(tags).not.toContain("noindex");
  });

  it("escapes text and keeps missing pages out of the index", () => {
    const tags = headTags({ path: "/zz", title: `<a & "b">`, description: "", noindex: true });
    expect(tags).toContain("<title data-seo>&lt;a &amp; &quot;b&quot;&gt;</title>");
    expect(tags).toContain(`<meta data-seo name="robots" content="noindex">`);
    expect(tags).not.toContain("canonical");
  });
});

describe("sitemap", () => {
  it("lists the landing, the app, every section and only lessons that exist", () => {
    const paths = pagePaths();
    expect(paths).toEqual(
      expect.arrayContaining(["/", "/app", "/app/sections/mathematiques", "/app/lessons/rc-charging"]),
    );
    expect(paths).not.toContain("/app/lessons/rl-circuit"); // coming soon: no page yet
  });

  it("has each page once per locale, each with its alternates", () => {
    const xml = sitemap(["/", "/app"]);
    expect(xml.match(/<url>/g)).toHaveLength(6);
    expect(xml).toContain(`<loc>${site.url}/ar/app</loc>`);
    expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="en" href="${site.url}/en"/>`);
  });
});
