// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it } from "vitest";
import { DisplaySettings } from "@/components/app-bar";
import { byLabel, byText, fr, press, render } from "@/test/render";
import { useSettings } from "./settings";

const html = document.documentElement;
const stored = () => JSON.parse(localStorage.getItem("bvl.settings") ?? "{}");
beforeEach(() => localStorage.clear());

// Used outside any provider, to check useSettings throws.
const Bare = () => (useSettings(), null);

describe("display settings", () => {
  it("each choice applies to the page and is saved", async () => {
    const root = await render(<DisplaySettings />);
    await press(root.querySelector("button"));
    // The popover is portalled to <body>.
    await press(byText(document.body, fr.dark)[0]);
    await press(byText(document.body, fr.fontReadable)[0]);
    await press(byLabel(document.body, `${fr.textSize} XL`)[0]);
    await press(document.body.querySelector('[role="switch"]'));
    expect(html.dataset).toMatchObject({ theme: "dark", font: "readable", size: "xl", cb: "on" });
    expect(stored()).toMatchObject({ theme: "dark", font: "readable", size: "xl", colorBlind: true });
  });

  it("pressing the selected option again keeps it", async () => {
    const root = await render(<DisplaySettings />);
    await press(root.querySelector("button"));
    await press(byText(document.body, fr.light)[0]);
    expect(html.dataset.theme).toBe("light");
  });

  it("starts from saved settings, and ignores corrupt storage", async () => {
    localStorage.setItem("bvl.settings", JSON.stringify({ locale: "ar" }));
    await render(<DisplaySettings />);
    expect([html.lang, html.dir]).toEqual(["ar", "rtl"]);

    localStorage.setItem("bvl.settings", "{not json");
    await render(<DisplaySettings />);
    expect(html.lang).toBe("fr");
  });

  it("follows a change made in another tab", async () => {
    await render(<DisplaySettings />);
    localStorage.setItem("bvl.settings", JSON.stringify({ theme: "dark" }));
    await act(() => window.dispatchEvent(new StorageEvent("storage", { key: "bvl.settings" })));
    expect(html.dataset.theme).toBe("dark");
    await act(() => window.dispatchEvent(new StorageEvent("storage", { key: "other" })));
    expect(html.dataset.theme).toBe("dark");
  });

  it("useSettings outside the provider is a programming error", async () => {
    const root = createRoot(document.createElement("div"));
    await expect(act(async () => root.render(<Bare />))).rejects.toThrow(/inside SettingsProvider/);
  });
});
