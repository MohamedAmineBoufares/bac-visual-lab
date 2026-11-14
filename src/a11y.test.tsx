// @vitest-environment jsdom
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import axe from "axe-core";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { isReady, lessons } from "./lessons/lessons";
import { routeTree } from "./routeTree.gen";
import { SettingsProvider } from "./settings/settings";

beforeAll(() => {
  // jsdom lacks ResizeObserver, which Radix reads.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
});

let unmount = () => {};
afterEach(() => unmount());

const render = async (path: string) => {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  const container = document.body.appendChild(document.createElement("div"));
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>,
    );
    await router.load();
  });
  // Let lazy simulations resolve.
  await act(() => new Promise((r) => setTimeout(r, 50)));
  unmount = () => (act(() => root.unmount()), container.remove());
};

describe("accessibility (axe)", () => {
  for (const path of [
    "/",
    "/app",
    "/app/sections/mathematiques",
    ...lessons.filter(isReady).flatMap((l) => [`/app/lessons/${l.id}`, `/ar/app/lessons/${l.id}`]),
  ]) {
    it(`has no violations on ${path}`, async () => {
      await render(path);
      // jsdom applies no CSS: contrast is checked on the tokens instead, and landmark-unique
      // would count the subject nav twice although only one of its two layouts is ever shown.
      const { violations } = await axe.run(document.body, {
        rules: { "color-contrast": { enabled: false }, "landmark-unique": { enabled: false } },
      });
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
});
