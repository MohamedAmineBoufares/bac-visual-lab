// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fr, render } from "@/test/render";
import { RlScene3D } from "./scene-3d";

// jsdom has no WebGL: the canvas and its meshes are skipped, everything a student can read is real.
vi.mock("@react-three/fiber", () => ({ Canvas: () => null, useFrame: () => {}, useThree: () => ({}) }));

const scene = (root: ParentNode) => root.querySelector('figure [role="img"]');

describe("RlScene3D text alternative", () => {
  it("describes the circuit with the live values", async () => {
    const root = await render(<RlScene3D p={{ E: 6, R: 50, L: 0.5 }} t={10} />);
    const summary = scene(root)?.getAttribute("aria-label") ?? "";
    expect(summary.startsWith(fr.rl3dLabel)).toBe(true);
    // At t = τ, i = 63,2 % of I₀ = 120 mA.
    expect(summary).toContain(
      "E = 6,0 V, R = 50 Ω, L = 0,50 H · t = 10,00 ms: i = 75,9 mA, u_L = 2,21 V, u_R = 3,79 V",
    );
  });

  it("follows the time", async () => {
    const root = await render(<RlScene3D p={{ E: 6, R: 50, L: 0.5 }} t={0} />);
    expect(scene(root)?.getAttribute("aria-label")).toContain("i = 0,0 mA, u_L = 6,00 V, u_R = 0,00 V");
  });

  it("names every part, hidden from screen readers since the summary already says it", async () => {
    const root = await render(<RlScene3D p={{ E: 6, R: 50, L: 0.5 }} t={0} />);
    const tags = root.querySelector('[aria-hidden="true"]');
    for (const part of [fr.lblGenerator, fr.lblResistor, fr.lblCoil, fr.lblField])
      expect(tags?.textContent).toContain(part);
  });
});
