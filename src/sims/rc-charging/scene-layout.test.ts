import { describe, expect, it } from "vitest";
import { tau } from "./model";
import { GAP, LOOP, MAX_PLATE_CHARGES, PATH_LENGTH, dotShift, plateCharges, pointAt } from "./scene-layout";

const p = { E: 5, R: 2, C: 1.5 };

describe("RC 3D layout", () => {
  it("runs the path from the − plate to the + plate and wraps round", () => {
    expect(pointAt(0)).toEqual([LOOP.x, -GAP]);
    expect(pointAt(PATH_LENGTH - 1e-9)[1]).toBeCloseTo(GAP);
    expect(pointAt(PATH_LENGTH + 0.3)).toEqual(pointAt(0.3));
    expect(pointAt(-0.3)).toEqual(pointAt(PATH_LENGTH - 0.3));
  });
  it("puts no charge on the plates at t = 0 and more as the capacitor charges", () => {
    expect(plateCharges(p, 0)).toBe(0);
    expect(plateCharges(p, 5 * tau(p))).toBeGreaterThan(plateCharges(p, tau(p)));
    expect(plateCharges({ E: 12, R: 1, C: 2 }, 100)).toBe(MAX_PLATE_CHARGES);
  });
  it("moves the dots less and less as the current falls", () => {
    const first = dotShift(p, tau(p)) - dotShift(p, 0);
    const second = dotShift(p, 2 * tau(p)) - dotShift(p, tau(p));
    expect(second).toBeLessThan(first);
  });
});
