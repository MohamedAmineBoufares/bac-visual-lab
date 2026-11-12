// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { reloadOnUpdate } from "./sw-update";

const setup = (controller: unknown) => {
  const sw = Object.assign(new EventTarget(), { controller });
  const reload = vi.fn<() => void>();
  const navigations: (() => void)[] = [];
  reloadOnUpdate((fn) => navigations.push(fn), sw, reload);
  const update = () => sw.dispatchEvent(new Event("controllerchange"));
  const navigate = () => navigations.forEach((fn) => fn());
  return { reload, update, navigate };
};

describe("reloadOnUpdate", () => {
  it("reloads at once when the visitor has not touched the page", () => {
    const { reload, update } = setup({});
    update();
    expect(reload).toHaveBeenCalledOnce();
  });

  it("waits for the next navigation once the visitor has interacted", () => {
    const { reload, update, navigate } = setup({});
    dispatchEvent(new Event("pointerdown"));
    update();
    expect(reload).not.toHaveBeenCalled();
    navigate();
    expect(reload).toHaveBeenCalledOnce();
  });

  it("ignores the first install, when the page had no service worker yet", () => {
    const { reload, update, navigate } = setup(null);
    update();
    navigate();
    expect(reload).not.toHaveBeenCalled();
  });

  it("does nothing where service workers are unavailable", () => {
    expect(() => reloadOnUpdate(() => {}, undefined)).not.toThrow();
  });
});
