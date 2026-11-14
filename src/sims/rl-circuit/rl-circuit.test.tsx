// @vitest-environment jsdom
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { byLabel, byText, fr, key, press, render } from "@/test/render";
import { rlText } from "./messages";
import { RlCircuit } from "./rl-circuit";

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

describe("RlCircuit", () => {
  it("starts at t = τ = 10 ms with i = 63 % of 120 mA", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    expect(clock(root)).toBe("t = 10,0 ms");
    expect(root.textContent).toContain("10,00 ms");
    expect(root.textContent).toContain("75,9 mA");
    expect(byText(root, "τ")).not.toEqual([]);
  });

  it("plays and pauses, a stalled tab counting as one 50 ms frame", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    await press(button(root, fr.play));
    for (let k = 0; k < 4; k++) await frame(); // 4 × 50 ms at ×1 = 5 ms of circuit time
    expect(clock(root)).toBe("t = 15,0 ms");
    await frame(5000);
    expect(clock(root)).toBe("t = 16,3 ms");
    await press(button(root, fr.pause));
    expect(pending).toBeUndefined();
  });

  it("stops at the end of the axis, then plays again from 0", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    await press(byText(root, "×4")[0]);
    await press(button(root, fr.play));
    // oxlint-disable-next-line no-unmodified-loop-condition -- frame() runs the queued callback, which clears `pending`
    for (let k = 0; k < 30 && pending; k++) await frame();
    expect(clock(root)).toBe("t = 100,0 ms");
    await press(button(root, fr.play));
    expect(clock(root)).toBe("t = 0,0 ms");
  });

  it("reset goes back to 0", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    await press(byLabel(root, fr.reset)[0]);
    expect(clock(root)).toBe("t = 0,0 ms");
  });

  it("guided mode explains the phase and halts when the next one starts", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    await press(root.querySelector('[role="switch"]'));
    const status = () => root.querySelector('figure [role="status"]')?.textContent ?? "";
    expect(status()).toContain(rlText.fr.rlTauT);
    await press(button(root, fr.next));
    // oxlint-disable-next-line no-unmodified-loop-condition -- frame() runs the queued callback, which clears `pending`
    for (let k = 0; k < 400 && pending; k++) await frame();
    expect(pending).toBeUndefined();
    expect(status()).toContain(rlText.fr.rlSlowingT);
  });

  it("the L slider changes τ", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    const [, , thumbL] = root.querySelectorAll('[role="slider"]');
    await key(thumbL, "End"); // 1 H → τ = 20 ms
    expect(root.textContent).toContain("20,00 ms");
  });

  it("switches the circuit to 3D and back", async () => {
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    await press(byText(root, fr.circuit).find((el) => el.getAttribute("role") === "tab"));
    const schematics = [...root.querySelectorAll('svg[role="img"]')];
    expect(schematics.some((s) => s.getAttribute("aria-label")?.startsWith(rlText.fr.rlSchematic))).toBe(true);
    await press(byText(root, fr.view3d)[0]);
    const scene3d = () => root.querySelector(`[aria-label^="${rlText.fr.rl3dLabel}"]`);
    // Wait for the lazy chunk; slow CI runners need more than a fixed delay.
    for (let k = 0; k < 100 && !scene3d(); k++) await act(() => new Promise((r) => setTimeout(r, 50)));
    expect(scene3d()?.getAttribute("aria-label")).toContain("t = 10,00 ms");
    await press(byText(root, fr.topView)[0]);
    expect(scene3d()).toBeNull();
  });
});

describe("layout", () => {
  it("keeps only the layout on screen once the width is known", async () => {
    // jsdom applies no CSS, so the phone layout counts as shown; a real observer reports on observe().
    vi.stubGlobal(
      "ResizeObserver",
      class {
        cb: (entries: never[]) => void;
        constructor(cb: (entries: never[]) => void) {
          this.cb = cb;
        }
        observe() {
          this.cb([]);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    const root = await render(<RlCircuit lessonId="rl-circuit" />);
    expect(root.querySelectorAll("figure")).toHaveLength(1);
    vi.unstubAllGlobals();
  });
});
