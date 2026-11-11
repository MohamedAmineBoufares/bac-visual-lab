import { BoxGeometry } from "three";
import { type SceneLabel, Scene3D, useTokenColors } from "@/components/scene-3d";
import { useFormat } from "@/components/sim";
import { useSettings } from "@/settings/settings";
import { type RcParams, uC, uR } from "./model";
import { GAP, LOOP, MAX_PLATE_CHARGES, PATH_LENGTH, dotShift, plateCharges, pointAt } from "./scene-layout";

const WIRE = 0.05;
const DOTS = 24;
const PLATE_W = 1.3;

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

/** Generator, resistor and capacitor in series; every size and glow follows E, R, C and t. */
export function RcScene3D({ p, t }: { p: RcParams; t: number }) {
  const { t: tr } = useSettings();
  const format = useFormat();
  const color = useTokenColors();
  const wire = color("sim-axis");

  const genH = 0.6 + (p.E / 12) * 1.6; // taller generator for a larger E
  const resL = 0.6 + p.R * 0.25; // longer resistor for a larger R
  const depth = 0.4 + p.C * 0.6; // plate area grows with C (C = εS/d)
  const fill = uC(p, t) / p.E; // the "bottle" is full when u_C = E
  const glow = uR(p, t) / p.E; // the resistor glows while current flows
  const charges = plateCharges(p, t);
  const tank = new BoxGeometry(PLATE_W, 2 * GAP, depth);

  const marks = Array.from({ length: charges }, (_, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return [(col - 2) * 0.24, (row - (MAX_PLATE_CHARGES / 5 - 1) / 2) * (depth / 4.5)] as const;
  });

  const labels: SceneLabel[] = [
    { text: `${tr("lblGenerator")} · E`, at: [-LOOP.x, genH / 2 + 0.25, 0] },
    { text: `${tr("lblResistor")} · R`, at: [0, LOOP.y + 0.3, 0] },
    { text: `${tr("lblCapacitor")} · C`, at: [LOOP.x, -LOOP.y - 0.15, 0] },
    { text: tr("lblPlatePlus"), at: [LOOP.x + PLATE_W / 2, GAP + 0.25, depth / 2] },
    { text: tr("lblPlateMinus"), at: [LOOP.x + PLATE_W / 2, -GAP + 0.1, depth / 2] },
  ];

  const summary = `${tr("rc3dLabel")} · E = ${format(p.E, 1)} V, R = ${format(p.R, 1)} kΩ, C = ${format(p.C, 1)} µF · t = ${format(t)} ms: u_C = ${format(uC(p, t))} V, u_R = ${format(uR(p, t))} V`;

  return (
    <Scene3D summary={summary} labels={labels}>
      <group>
        {/* Wires (the right side stops at the plates) */}
        <Wire a={[-LOOP.x, LOOP.y]} b={[LOOP.x, LOOP.y]} color={wire} />
        <Wire a={[-LOOP.x, -LOOP.y]} b={[LOOP.x, -LOOP.y]} color={wire} />
        <Wire a={[-LOOP.x, -LOOP.y]} b={[-LOOP.x, LOOP.y]} color={wire} />
        <Wire a={[LOOP.x, LOOP.y]} b={[LOOP.x, GAP]} color={wire} />
        <Wire a={[LOOP.x, -LOOP.y]} b={[LOOP.x, -GAP]} color={wire} />

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

        {/* Capacitor: + plate on top, − plate below, a tank between them filling to u_C / E */}
        {[GAP, -GAP].map((y) => (
          <mesh key={y} position={[LOOP.x, y, 0]}>
            <boxGeometry args={[PLATE_W, 0.06, depth]} />
            <meshStandardMaterial color={color("foreground")} />
          </mesh>
        ))}
        <lineSegments position={[LOOP.x, 0, 0]}>
          <edgesGeometry args={[tank]} />
          <lineBasicMaterial color={color("sim-curve-1")} />
        </lineSegments>
        <mesh position={[LOOP.x, -GAP + GAP * fill, 0]}>
          <boxGeometry args={[PLATE_W - 0.04, Math.max(2 * GAP * fill, 0.001), depth - 0.04]} />
          <meshStandardMaterial color={color("sim-curve-1")} transparent opacity={0.7} />
        </mesh>

        {/* Charges: spheres (+) on the top plate, flat cubes (−) under the bottom one, so sign isn't colour-only */}
        {marks.map(([x, z], i) => (
          <group key={i}>
            <mesh position={[LOOP.x + x, GAP + 0.1, z]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color={color("sim-point")} />
            </mesh>
            <mesh position={[LOOP.x + x, -GAP - 0.09, z]}>
              <boxGeometry args={[0.13, 0.04, 0.13]} />
              <meshStandardMaterial color={color("sim-curve-3")} />
            </mesh>
          </group>
        ))}

        {/* Moving charges in the wires: their shift is proportional to the charge that has flowed */}
        {Array.from({ length: DOTS }, (_, i) => {
          const [x, y] = pointAt((i * PATH_LENGTH) / DOTS + dotShift(p, t));
          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color={color("sim-point")} />
            </mesh>
          );
        })}
      </group>
    </Scene3D>
  );
}
