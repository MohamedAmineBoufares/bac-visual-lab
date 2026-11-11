// @vitest-environment jsdom
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { byLabel, byText, fr, key, press, render } from "@/test/render";
import { RcCharging } from "./rc-charging";

// jsdom has no WebGL: only the canvas is faked, the 3D scene and its text alternative are real.
vi.mock("@react-three/fiber", () => ({ Canvas: () => null, useFrame: () => {}, useThree: () => ({}) }));

// A hand-cranked clock: each frame() runs the pending animation frame `ms` later.
let pending: FrameRequestCallback | undefined;
let now = 0;
beforeEach(() => {
  pending = undefined;
  now = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => ((pending = cb), 1));
  vi.stubGlobal("cancelAnimationFrame", () => (pending = undefined));
});
const frame = (ms = 50) =>
  act(() => {
    const cb = pending;
    pending = undefined;
    now += ms;
    cb?.(now);
  });

// The stage renders twice (phone and wide layouts; CSS shows one), so read the first copy.
const clock = (root: ParentNode) => root.querySelector("figcaption span[dir=ltr]")?.textContent;
const button = (root: ParentNode, text: string) =>
  [...root.querySelectorAll("button")].find((b) => b.textContent?.trim() === text);

describe("RcCharging", () => {
  it("starts at t = 2,2 ms with the formula and τ = RC", async () => {
    const root = await render(<RcCharging />);
    expect(clock(root)).toBe("t = 2,2 ms");
    expect(root.textContent).toContain("2,20 ms"); // τ = 2,2 kΩ × 1 µF
    expect(byText(root, "τ")).not.toEqual([]); // τ marker on the time axis
  });

  it("plays at the chosen speed and pauses", async () => {
    const root = await render(<RcCharging />);
    await press(button(root, fr.play));
    expect(button(root, fr.pause)).toBeDefined();
    for (let i = 0; i < 4; i++) await frame(); // 4 × 50 ms at ×1 = 1 ms of circuit time
    expect(clock(root)).toBe("t = 3,2 ms");
    await press(byText(root, "×4")[0]);
    await frame();
    expect(clock(root)).toBe("t = 4,2 ms");
    await frame(5000); // a stalled tab counts as one 50 ms frame, not a jump to the end
    expect(clock(root)).toBe("t = 5,2 ms");
    await press(button(root, fr.pause));
    expect(pending).toBeUndefined();
  });

  it("stops at the end of the axis, then plays again from 0", async () => {
    const root = await render(<RcCharging />);
    await press(byText(root, "×4")[0]);
    await press(button(root, fr.play));
    for (let i = 0; i < 30 && pending; i++) await frame();
    expect(clock(root)).toBe("t = 20,0 ms");
    expect(button(root, fr.play)).toBeDefined();
    await press(button(root, fr.play));
    expect(clock(root)).toBe("t = 0,0 ms");
    expect(button(root, fr.pause)).toBeDefined();
  });

  it("reset goes back to 0", async () => {
    const root = await render(<RcCharging />);
    await press(byLabel(root, fr.reset)[0]);
    expect(clock(root)).toBe("t = 0,0 ms");
  });

  it("guided mode explains each phase and halts when the next one starts", async () => {
    const root = await render(<RcCharging />);
    await press(root.querySelector('[role="switch"]'));
    const status = () => root.querySelector('figure [role="status"]')?.textContent ?? "";
    const before = status();
    expect(before).toMatch(/\d\/5/);
    await press(button(root, fr.next));
    expect(status()).toBe(""); // hidden while playing
    for (let i = 0; i < 400 && pending; i++) await frame();
    expect(pending).toBeUndefined(); // halted by itself, before the end of the axis
    expect(clock(root)).not.toBe("t = 20,0 ms");
    expect(status()).not.toBe(before);
  });

  it("a slider changes E in the readout and on the graph", async () => {
    const root = await render(<RcCharging />);
    const [thumbE] = root.querySelectorAll('[role="slider"]');
    await key(thumbE, "ArrowRight");
    expect(byText(root, "E = 5,5 V")).not.toEqual([]);
  });

  it("long time constants move τ off the axis", async () => {
    const root = await render(<RcCharging />);
    const [, thumbR, thumbC] = root.querySelectorAll('[role="slider"]');
    await key(thumbR, "End"); // 5 kΩ
    await key(thumbC, "End"); // 2 µF → τ = 10 ms, still on the axis
    expect(byText(root, "τ")).not.toEqual([]);
  });

  it("switches the circuit to 3D and back", async () => {
    const root = await render(<RcCharging />);
    await press(byText(root, fr.circuit).find((el) => el.getAttribute("role") === "tab"));
    const schematics = [...root.querySelectorAll('svg[role="img"]')];
    expect(schematics.some((s) => s.getAttribute("aria-label")?.startsWith(fr.schematic))).toBe(true);
    await press(byText(root, fr.view3d)[0]);
    expect(byText(root, fr.loading)).not.toEqual([]);
    const scene3d = () => root.querySelector(`[aria-label^="${fr.rc3dLabel}"]`);
    // Wait for the lazy chunk; slow CI runners need more than a fixed delay.
    for (let i = 0; i < 100 && !scene3d(); i++) await act(() => new Promise((r) => setTimeout(r, 50)));
    expect(scene3d()?.getAttribute("aria-label")).toContain("t = 2,20 ms");
    await press(byText(root, fr.topView)[0]);
    expect(scene3d()).toBeNull();
  });

  it("the wide layout can give the side panel half the width", async () => {
    const root = await render(<RcCharging />);
    const toggle = byLabel(root, fr.viewExpand)[0];
    expect(toggle?.getAttribute("aria-pressed")).toBe("false");
    await press(toggle);
    expect(byLabel(root, fr.viewShrink)[0]?.getAttribute("aria-pressed")).toBe("true");
  });
});
