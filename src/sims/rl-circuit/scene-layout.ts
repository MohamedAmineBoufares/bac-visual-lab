/**
 * Pure layout for the RL 3D scene (no three.js here, so it can be tested). The circuit is a loop in the x–y
 * plane: generator on the left wire, resistor on the top wire, coil on the right wire.
 */
import { charge, i, iFinal, type RlParams } from "./model";

export const LOOP = { x: 2.4, y: 1.2 };

type Point = [number, number];

/** The closed loop that conventional current follows: up through the generator, right, down through the coil. */
const path: Point[] = [
  [-LOOP.x, -LOOP.y],
  [-LOOP.x, LOOP.y],
  [LOOP.x, LOOP.y],
  [LOOP.x, -LOOP.y],
  [-LOOP.x, -LOOP.y],
];
const lengths = path.slice(1).map((b, k) => {
  const a = path[k] ?? b;
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
});
export const PATH_LENGTH = lengths.reduce((s, l) => s + l, 0);

/** Point at distance `s` along the loop, wrapping round. */
export const pointAt = (s: number): Point => {
  let rest = ((s % PATH_LENGTH) + PATH_LENGTH) % PATH_LENGTH;
  for (const [k, len] of lengths.entries()) {
    const a = path[k];
    const b = path[k + 1];
    if (!a || !b) break;
    if (rest <= len) return [a[0] + ((b[0] - a[0]) * rest) / len, a[1] + ((b[1] - a[1]) * rest) / len];
    rest -= len;
  }
  return path[0] ?? [0, 0];
};

/** How far the dots have moved: proportional to the charge that has flowed, so they start slowly then run at I₀. */
export const dotShift = (p: RlParams, t: number) => charge(p, t) / 2000;

/** Number of turns drawn on the coil: more turns for a larger L. */
export const coilTurns = (p: RlParams) => Math.round(4 + p.L * 8);

export const MAX_RINGS = 6;
/** Field rings around the coil: their number grows with i / I₀. */
export const fieldRings = (p: RlParams, t: number) => Math.round((MAX_RINGS * i(p, t)) / iFinal(p));
