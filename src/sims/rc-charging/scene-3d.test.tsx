// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { useTokenColors } from "@/components/scene-3d";
import { fr, render } from "@/test/render";
import { rcText } from "./messages";
import { RcScene3D } from "./scene-3d";

// jsdom has no WebGL: the canvas and its meshes are skipped, everything a student can read is real.
vi.mock("@react-three/fiber", () => ({ Canvas: () => null, useFrame: () => {}, useThree: () => ({}) }));

const scene = (root: ParentNode) => root.querySelector('figure [role="img"]');

describe("RcScene3D text alternative", () => {
  it("describes the circuit with the live values", async () => {
    const root = await render(<RcScene3D p={{ E: 5, R: 2.2, C: 1 }} t={2.2} />);
    const summary = scene(root)?.getAttribute("aria-label") ?? "";
    expect(summary.startsWith(rcText.fr.rc3dLabel)).toBe(true);
    // At t = τ, u_C = 63,2 % of E.
    expect(summary).toContain("E = 5,0 V, R = 2,2 kΩ, C = 1,0 µF · t = 2,20 ms: u_C = 3,16 V, u_R = 1,84 V");
    expect(root.querySelector("figcaption")?.textContent).toBe(fr.view3dHint);
  });

  it("follows the time and the parameters", async () => {
    const root = await render(<RcScene3D p={{ E: 10, R: 1, C: 1 }} t={0} />);
    expect(scene(root)?.getAttribute("aria-label")).toContain("u_C = 0,00 V, u_R = 10,00 V");
  });

  it("names every part, hidden from screen readers since the summary already says it", async () => {
    const root = await render(<RcScene3D p={{ E: 5, R: 2.2, C: 1 }} t={0} />);
    const tags = root.querySelector('[aria-hidden="true"]');
    for (const part of [
      fr.lblGenerator,
      fr.lblResistor,
      rcText.fr.lblCapacitor,
      rcText.fr.lblPlatePlus,
      rcText.fr.lblPlateMinus,
    ])
      expect(tags?.textContent).toContain(part);
  });
});

describe("useTokenColors", () => {
  it("reads token values and re-reads them when the theme changes", async () => {
    const seen: string[] = [];
    const Probe = () => (seen.push(useTokenColors()("sim-curve-1")), null);
    await render(<Probe />);
    expect(seen.at(-1)).toBe("#888888"); // no stylesheet in jsdom: the fallback
    document.documentElement.style.setProperty("--sim-curve-1", "#123456");
    await act(async () => {
      document.documentElement.dataset.theme = "dark";
      await new Promise((r) => setTimeout(r));
    });
    expect(seen.at(-1)).toBe("#123456");
  });
});
