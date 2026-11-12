import { describe, expect, it } from "vitest";
import { charge, energy, i, iFinal, iOff, phase, tau, uL, uR } from "./model";

// Reference values from content/lessons/rl-circuit.md.
const p = { E: 6, R: 50, L: 0.5 };

describe("RL circuit", () => {
  it("tau = L/R = 10 ms", () => expect(tau(p)).toBe(10));
  it("final current E/R = 120 mA", () => expect(iFinal(p)).toBe(120));
  it("starts with i = 0 and u_L = E", () => {
    expect(i(p, 0)).toBe(0);
    expect(uL(p, 0)).toBe(6);
  });
  it("reaches 63.2 % of I₀ at t = τ", () => expect(i(p, 10)).toBeCloseTo(75.85, 2));
  it("is above 99.3 % of I₀ after 5τ", () => expect(i(p, 50) / iFinal(p)).toBeGreaterThan(0.993));
  it("stores ½LI₀² = 3.6 mJ in steady state", () => expect(energy(p, 1e6)).toBeCloseTo(3.6, 10));
  it("falls to 36.8 % of I₀ one τ after the switch opens", () => expect(iOff(p, 10)).toBeCloseTo(44.15, 2));
  it("satisfies the loop law u_L + u_R = E, with u_R = R·i", () => {
    expect(uL(p, 7) + uR(p, 7)).toBeCloseTo(p.E, 12);
    expect(uR(p, 7)).toBeCloseTo((p.R * i(p, 7)) / 1000, 12);
  });
  it("lets charge flow slowly at first, then at the rate I₀", () => {
    expect(charge(p, 0)).toBe(0);
    expect(charge(p, 100) - charge(p, 90)).toBeCloseTo(iFinal(p) * 10, 0);
    expect(charge(p, 10) - charge(p, 0)).toBeLessThan(charge(p, 20) - charge(p, 10));
  });
  it("names the phase around τ and 5τ", () => {
    expect(phase(p, 0)).toBe("start");
    expect(phase(p, 5)).toBe("rising");
    expect(phase(p, 10)).toBe("tau");
    expect(phase(p, 20)).toBe("slowing");
    expect(phase(p, 50)).toBe("steady");
  });
});
