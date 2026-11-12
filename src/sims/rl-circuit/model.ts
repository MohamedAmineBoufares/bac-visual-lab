/**
 * RL circuit, current build-up after the switch closes (analytical solution).
 * Units: E in V, R in Ω, L in H, t in ms; currents in mA, energy in mJ.
 */
export type RlParams = { E: number; R: number; L: number };

/** τ = L/R, in ms. */
export const tau = ({ R, L }: RlParams) => (1000 * L) / R;

/** Final current I₀ = E/R, in mA. */
export const iFinal = ({ E, R }: RlParams) => (1000 * E) / R;

/** Current i(t) = (E/R)(1 − e^(−t/τ)), in mA. */
export const i = (p: RlParams, t: number) => iFinal(p) * (1 - Math.exp(-t / tau(p)));

/** Coil voltage u_L(t) = L di/dt = E e^(−t/τ). */
export const uL = (p: RlParams, t: number) => p.E * Math.exp(-t / tau(p));

/** Resistor voltage u_R(t) = R i(t) = E − u_L(t) (series loop law). */
export const uR = (p: RlParams, t: number) => p.E - uL(p, t);

/** Energy stored in the coil ½Li², in mJ. */
export const energy = (p: RlParams, t: number) => 0.5 * p.L * (i(p, t) / 1000) ** 2 * 1000;

/** Current after the switch opens, starting from I₀: i(t) = I₀ e^(−t/τ), in mA. */
export const iOff = (p: RlParams, t: number) => iFinal(p) * Math.exp(-t / tau(p));

/** Charge that has flowed since the switch closed, ∫i dt, in µC (mA × ms). */
export const charge = (p: RlParams, t: number) => iFinal(p) * (t - tau(p) * (1 - Math.exp(-t / tau(p))));

/** Stage of the build-up at time t, used to pick the interpretation shown to the student. */
export type RlPhase = "start" | "rising" | "tau" | "slowing" | "steady";

export const phase = (p: RlParams, t: number): RlPhase => {
  const r = t / tau(p);
  if (r < 0.15) return "start";
  if (r < 0.85) return "rising";
  if (r < 1.25) return "tau";
  if (r < 5) return "slowing";
  return "steady";
};
