import { describe, expect, it } from "vitest";
import { phase, tau, uC, uR } from "./model";

const p = { E: 5, R: 2, C: 1.5 };

describe("RC charging", () => {
  it("tau = R·C", () => expect(tau(p)).toBe(3));
  it("starts discharged", () => expect(uC(p, 0)).toBe(0));
  it("reaches 63.2 % of E at t = τ", () => expect(uC(p, tau(p)) / p.E).toBeCloseTo(1 - Math.exp(-1), 10));
  it("is ~99.3 % charged after 5τ", () => expect(uC(p, 5 * tau(p)) / p.E).toBeGreaterThan(0.993));
  it("satisfies the loop law u_C + u_R = E", () => expect(uC(p, 1.7) + uR(p, 1.7)).toBeCloseTo(p.E, 12));
  it("names the phase around τ and 5τ", () => {
    expect(phase(p, 0)).toBe("start");
    expect(phase(p, 1.5)).toBe("rising");
    expect(phase(p, tau(p))).toBe("tau");
    expect(phase(p, 2 * tau(p))).toBe("slowing");
    expect(phase(p, 5 * tau(p))).toBe("steady");
  });
});
