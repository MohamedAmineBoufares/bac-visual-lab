/**
 * RC charging, analytical solution. Units: E in V, R in kΩ, C in µF, t in ms
 * (kΩ × µF = ms, so tau comes out in ms directly).
 */
export type RcParams = { E: number; R: number; C: number };

export const tau = ({ R, C }: RcParams) => R * C;

/** Capacitor voltage u_C(t) = E (1 − e^(−t/τ)) */
export const uC = (p: RcParams, t: number) => p.E * (1 - Math.exp(-t / tau(p)));

/** Resistor voltage u_R(t) = E − u_C(t) (series loop law) */
export const uR = (p: RcParams, t: number) => p.E - uC(p, t);

/** Stage of the charge at time t, used to pick the interpretation shown to the student. */
export type RcPhase = "start" | "rising" | "tau" | "slowing" | "steady";

export const phase = (p: RcParams, t: number): RcPhase => {
  const r = t / tau(p);
  if (r < 0.15) return "start";
  if (r < 0.85) return "rising";
  if (r < 1.25) return "tau";
  if (r < 5) return "slowing";
  return "steady";
};
