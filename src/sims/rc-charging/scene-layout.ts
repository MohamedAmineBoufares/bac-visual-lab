/**
 * Pure layout for the RC 3D scene (no three.js here, so it can be tested). The circuit is a loop in the x–y
 * plane: generator on the left wire, resistor on the top wire, capacitor on the right wire.
 */
import { type RcParams, uC } from "./model";

export const LOOP = { x: 2.4, y: 1.2 };
/** Half the gap between the capacitor plates. */
export const GAP = 0.6;

type Point = [number, number];

/**
 * The wire path that conventional current follows, from the − plate round to the + plate:
 * down to the bottom wire, through the generator (− to +), along the top wire and the resistor, into the + plate.
 */
const path: Point[] = [
  [LOOP.x, -GAP],
  [LOOP.x, -LOOP.y],
  [-LOOP.x, -LOOP.y],
  [-LOOP.x, LOOP.y],
  [LOOP.x, LOOP.y],
  [LOOP.x, GAP],
];
const lengths = path.slice(1).map((b, i) => {
  const a = path[i] ?? b;
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
});
export const PATH_LENGTH = lengths.reduce((s, l) => s + l, 0);

/** Point at distance `s` along the path, wrapping round so a dot reaching the + plate reappears at the − plate. */
export const pointAt = (s: number): Point => {
  let rest = ((s % PATH_LENGTH) + PATH_LENGTH) % PATH_LENGTH;
  for (const [i, len] of lengths.entries()) {
    const a = path[i];
    const b = path[i + 1];
    if (!a || !b) break;
    if (rest <= len) return [a[0] + ((b[0] - a[0]) * rest) / len, a[1] + ((b[1] - a[1]) * rest) / len];
    rest -= len;
  }
  return path[0] ?? [0, 0];
};

/** Charge on the + plate, in µC (C in µF times u_C in V). */
export const charge = (p: RcParams, t: number) => p.C * uC(p, t);

/** How far the dots in the wires have moved: proportional to the charge that has flowed, so they slow as i falls. */
export const dotShift = (p: RcParams, t: number) => charge(p, t) * 0.8;

export const MAX_PLATE_CHARGES = 20;
/** Number of + (and −) marks drawn on each plate: grows with q = C·u_C, capped so the plate stays readable. */
export const plateCharges = (p: RcParams, t: number) => Math.min(MAX_PLATE_CHARGES, Math.round(charge(p, t) * 1.2));
