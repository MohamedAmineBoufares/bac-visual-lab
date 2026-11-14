import { type SceneLabel, Scene3D, useTokenColors } from "@/components/scene-3d";
import { useFormat } from "@/components/sim";
import { useSettings } from "@/settings/settings";
import { rlText } from "./messages";
import { i, type RlParams, uL, uR } from "./model";
import { LOOP, PATH_LENGTH, coilTurns, dotShift, fieldRings, pointAt } from "./scene-layout";

const WIRE = 0.05;
const DOTS = 24;
const COIL_H = 1.4; // height of the coil on the right wire
const COIL_R = 0.3;

/** A straight wire from a to b in the x–y plane. */
function Wire({ a, b, color }: { a: [number, number]; b: [number, number]; color: string }) {
  const [w, h] = [Math.abs(b[0] - a[0]) || WIRE, Math.abs(b[1] - a[1]) || WIRE];
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]}>
      <boxGeometry args={[w, h, WIRE]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/** Generator, resistor and coil in series; every size and glow follows E, R, L and t. */
export function RlScene3D({ p, t }: { p: RlParams; t: number }) {
  const { settings, t: tr } = useSettings();
  const s = rlText[settings.locale];
  const format = useFormat();
  const color = useTokenColors();
  const wire = color("sim-axis");

  const genH = 0.6 + (p.E / 12) * 1.6; // taller generator for a larger E
  const resL = 0.6 + (p.R / 100) * 1.2; // longer resistor for a larger R
  const glow = uR(p, t) / p.E; // the resistor glows with u_R = R·i
  const turns = coilTurns(p);
  const rings = fieldRings(p, t);

  const labels: SceneLabel[] = [
    { text: `${tr("lblGenerator")} · E`, at: [-LOOP.x, genH / 2 + 0.25, 0] },
    { text: `${tr("lblResistor")} · R`, at: [0, LOOP.y + 0.3, 0] },
    { text: `${s.lblCoil} · L`, at: [LOOP.x + COIL_R + 0.5, COIL_H / 2 + 0.2, 0] },
    { text: s.lblField, at: [LOOP.x, -COIL_H / 2 - 0.35, 0] },
  ];

  const summary = `${s.rl3dLabel} · E = ${format(p.E, 1)} V, R = ${format(p.R, 0)} Ω, L = ${format(p.L, 2)} H · t = ${format(t)} ms: i = ${format(i(p, t), 1)} mA, u_L = ${format(uL(p, t))} V, u_R = ${format(uR(p, t))} V`;

  return (
    <Scene3D summary={summary} labels={labels}>
      <group>
        {/* Wires (the right side stops at the coil) */}
        <Wire a={[-LOOP.x, LOOP.y]} b={[LOOP.x, LOOP.y]} color={wire} />
        <Wire a={[-LOOP.x, -LOOP.y]} b={[LOOP.x, -LOOP.y]} color={wire} />
        <Wire a={[-LOOP.x, -LOOP.y]} b={[-LOOP.x, LOOP.y]} color={wire} />
        <Wire a={[LOOP.x, LOOP.y]} b={[LOOP.x, COIL_H / 2]} color={wire} />
        <Wire a={[LOOP.x, -LOOP.y]} b={[LOOP.x, -COIL_H / 2]} color={wire} />

        {/* Generator: + terminal on top, marked by the nub */}
        <mesh position={[-LOOP.x, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, genH, 32]} />
          <meshStandardMaterial color={color("foreground")} />
        </mesh>
        <mesh position={[-LOOP.x, genH / 2 + 0.06, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />
          <meshStandardMaterial color={color("sim-highlight")} />
        </mesh>

        {/* Resistor, glowing with u_R */}
        <mesh position={[0, LOOP.y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, resL, 32]} />
          <meshStandardMaterial
            color={color("sim-curve-2")}
            emissive={color("sim-curve-2")}
            emissiveIntensity={glow * 0.9}
          />
        </mesh>

        {/* Coil: a core tube wound with turns (more turns for a larger L) */}
        <mesh position={[LOOP.x, 0, 0]}>
          <cylinderGeometry args={[COIL_R * 0.7, COIL_R * 0.7, COIL_H, 24]} />
          <meshStandardMaterial color={color("sim-axis")} transparent opacity={0.35} />
        </mesh>
        {Array.from({ length: turns }, (_, k) => (
          <mesh
            key={k}
            position={[LOOP.x, -COIL_H / 2 + ((k + 0.5) * COIL_H) / turns, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[COIL_R, 0.035, 8, 32]} />
            <meshStandardMaterial color={color("foreground")} />
          </mesh>
        ))}

        {/* Field rings: wider loops round the coil, one more each time i grows by I₀/6 */}
        {Array.from({ length: rings }, (_, k) => (
          <mesh key={k} position={[LOOP.x, 0, 0]} rotation={[0, (k * Math.PI) / 6, 0]}>
            <torusGeometry args={[COIL_H / 2 + 0.15, 0.02, 6, 48]} />
            <meshStandardMaterial color={color("sim-curve-1")} transparent opacity={0.6} />
          </mesh>
        ))}

        {/* Moving charges in the wires: their shift is proportional to the charge that has flowed */}
        {Array.from({ length: DOTS }, (_, k) => {
          const [x, y] = pointAt((k * PATH_LENGTH) / DOTS + dotShift(p, t));
          return (
            <mesh key={k} position={[x, y, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color={color("sim-point")} />
            </mesh>
          );
        })}
      </group>
    </Scene3D>
  );
}
