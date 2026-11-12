import { describe, expect, it } from "vitest";
import { tau } from "./model";
import { LOOP, MAX_RINGS, PATH_LENGTH, coilTurns, dotShift, fieldRings, pointAt } from "./scene-layout";

const p = { E: 6, R: 50, L: 0.5 };
const near = (a: [number, number], b: [number, number]) => {
  expect(a[0]).toBeCloseTo(b[0], 9);
  expect(a[1]).toBeCloseTo(b[1], 9);
};

describe("RL 3D layout", () => {
  it("runs round the closed loop and wraps", () => {
    expect(pointAt(0)).toEqual([-LOOP.x, -LOOP.y]);
    near(pointAt(2 * LOOP.y), [-LOOP.x, LOOP.y]);
    near(pointAt(PATH_LENGTH + 0.3), pointAt(0.3));
    near(pointAt(-0.3), pointAt(PATH_LENGTH - 0.3));
  });
  it("draws more coil turns for a larger L", () => expect(coilTurns({ ...p, L: 1 })).toBeGreaterThan(coilTurns(p)));
  it("has no field at t = 0 and the full field in steady state", () => {
    expect(fieldRings(p, 0)).toBe(0);
    expect(fieldRings(p, tau(p))).toBe(4); // 63 % of 6 rings
    expect(fieldRings(p, 10 * tau(p))).toBe(MAX_RINGS);
  });
  it("moves the dots slowly at first, then faster as i grows", () => {
    const first = dotShift(p, tau(p)) - dotShift(p, 0);
    const second = dotShift(p, 2 * tau(p)) - dotShift(p, tau(p));
    expect(second).toBeGreaterThan(first);
  });
});
