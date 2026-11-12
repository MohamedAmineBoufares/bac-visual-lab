// @vitest-environment jsdom
import { createMemoryHistory } from "@tanstack/react-router";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render as prerender } from "./entry-server";
import { messages } from "./i18n/messages";
import { mount } from "./mount";
import { createAppRouter, currentPage } from "./router";
import { site } from "./site";
import { fr, press } from "./test/render";

const { en, ar } = messages;
const page = async (path: string) => {
  const router = createAppRouter({ history: createMemoryHistory({ initialEntries: [path] }), isServer: true });
  await router.load();
  return currentPage(router);
};

describe("page head", () => {
  it("titles and describes each page in the language of its URL", async () => {
    expect(await page("/")).toMatchObject({ title: `${fr.landTitle} · ${site.name}`, description: fr.landLead });
    expect(await page("/en/app")).toMatchObject({ title: `${en.homeTitle} · ${site.name}`, noindex: false });
    expect((await page("/en/app/sections/mathematiques")).description).toContain(en.secMath);
    expect((await page("/ar/app/lessons/rc-charging")).title).toBe(`${ar.rcTitle} · ${site.name}`);
  });

  it("treats /fr, unknown languages and unknown lessons as a 404 kept out of the index", async () => {
    for (const path of ["/fr/app", "/zz", "/app/lessons/rlc-free"])
      expect(await page(path)).toMatchObject({ title: `404 · ${site.name}`, noindex: true });
  });
});

describe("prerendered page", () => {
  afterEach(() => vi.restoreAllMocks());

  it("hydrates without a mismatch, then changes language by URL", async () => {
    const path = "/en/app/lessons/rc-charging";
    const { html } = await prerender(path);
    expect(html).toContain(en.rcTitle);
    expect(html).not.toContain("<!--$!-->"); // the lazy simulation is in the HTML, not left to the client

    history.replaceState(null, "", path);
    const root = document.body.appendChild(document.createElement("div"));
    root.innerHTML = html;
    // A browser runs the router's inline scroll script, which removes itself; innerHTML runs no scripts.
    for (const s of root.querySelectorAll("script")) s.remove();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const uncaught = vi.fn<(e: ErrorEvent) => void>();
    window.addEventListener("error", uncaught);
    await act(() => mount(root));
    await act(() => new Promise((r) => setTimeout(r, 50)));
    window.removeEventListener("error", uncaught);
    // Server and client renderers share this test process; React warns about that, which a browser never sees.
    const real = errors.mock.calls.filter(([m]) => !String(m).includes("multiple renderers"));
    expect(real).toEqual([]);
    expect(uncaught).not.toHaveBeenCalled();
    expect(document.title).toBe(`${en.rcTitle} · ${site.name}`);

    await press([...root.querySelectorAll('[role="radio"]')].find((b) => b.textContent === "ع"));
    await act(() => new Promise((r) => setTimeout(r, 50)));
    expect(location.pathname).toBe("/ar/app/lessons/rc-charging");
    expect(root.querySelector("h1")?.textContent).toBe(ar.rcTitle);
    expect(document.documentElement).toMatchObject({ lang: "ar", dir: "rtl" });
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${site.url}/ar/app/lessons/rc-charging`,
    );
  });
});
