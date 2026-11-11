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
