import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll } from "vitest";
import { messages } from "@/i18n/messages";
import { SettingsProvider } from "@/settings/settings";

/** French UI text, the default locale, so tests find elements by what the student reads. */
export const fr = messages.fr;

beforeAll(() => {
  // jsdom lacks ResizeObserver, which Radix reads.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
});

let cleanup = () => {};
afterEach(() => cleanup());

/** Renders inside the settings provider and returns the container. Unmounted after each test. */
export const render = async (ui: ReactNode) => {
  const container = document.body.appendChild(document.createElement("div"));
  const root = createRoot(container);
  await act(async () => root.render(<SettingsProvider>{ui}</SettingsProvider>));
  cleanup = () => (act(() => root.unmount()), container.remove());
  return container;
};

/** Radix buttons react to pointer or mouse down (tabs) or click (the rest); send all of them. */
export const press = (el: Element | null | undefined) =>
  act(() => {
    if (!el) throw new Error("element to press not found");
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"])
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0 }));
    if (el instanceof HTMLElement) el.click();
  });

export const key = (el: Element | null | undefined, k: string) =>
  act(() => {
    if (!el) throw new Error("element for key not found");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
  });

/** Every element whose own text (ignoring icons and other child elements) is exactly `text`. */
export const byText = (root: ParentNode, text: string) =>
  [...root.querySelectorAll("*")].filter(
    (el) =>
      [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join("")
        .trim() === text,
  );

export const byLabel = (root: ParentNode, label: string) => [...root.querySelectorAll(`[aria-label="${label}"]`)];
