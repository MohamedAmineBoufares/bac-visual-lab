import { useFormat } from "@/components/sim";
import { useSettings } from "@/settings/settings";
import { i, iFinal, type RlParams, uL, uR } from "./model";

// Loop corners in viewBox units.
const LEFT = 70;
const RIGHT = 330;
const T = 50;
const B = 210;
const MID = (T + B) / 2;
const COIL = 40; // half the coil's height
const TURNS = 5;

/**
 * The RL circuit seen from above. The resistor fills with u_R / E and the coil with u_L / E; the current arrow
 * grows with i / I₀. Values and percentages are written beside each part so the fill is never the only cue.
 */
export function RlSchematic({ p, t }: { p: RlParams; t: number }) {
  const { t: tr } = useSettings();
  const format = useFormat();
  const drop = uR(p, t) / p.E;
  const back = uL(p, t) / p.E;
  const share = i(p, t) / iFinal(p);
  const pct = (x: number) => `${format(x * 100, 0)} %`;
  const wire = { stroke: "var(--sim-axis)", strokeWidth: 3, fill: "none" };
  const turn = (2 * COIL) / TURNS;
  // The coil as a row of half-loops bulging outwards from the right wire.
  const coil = `a${turn / 2} ${turn / 2} 0 0 1 0 ${turn} `.repeat(TURNS);

  return (
    <figure className="border-2 border-edge bg-sim-canvas shadow-hard-sm">
      <svg
        viewBox="-30 0 430 250"
        className="block h-auto w-full"
        direction="ltr"
        role="img"
        aria-label={`${tr("rlSchematic")}: i = ${format(i(p, t), 1)} mA (${pct(share)}), u_L = ${format(uL(p, t))} V, u_R = ${format(uR(p, t))} V`}
        fontSize="12"
        fill="var(--foreground)"
      >
        {/* Wires, with gaps for the components */}
        <path d={`M${LEFT} ${MID - 8} V${T} H160 M240 ${T} H${RIGHT} V${MID - COIL}`} {...wire} />
        <path d={`M${RIGHT} ${MID + COIL} V${B} H${LEFT} V${MID + 8}`} {...wire} />

        {/* Generator: long plate is +, short plate is − */}
        <line x1={LEFT - 22} x2={LEFT + 22} y1={MID - 8} y2={MID - 8} stroke="var(--foreground)" strokeWidth={3} />
        <line x1={LEFT - 11} x2={LEFT + 11} y1={MID + 8} y2={MID + 8} stroke="var(--foreground)" strokeWidth={6} />
        <text x={LEFT + 28} y={MID - 12}>
          +
        </text>
        <text x={LEFT - 28} y={MID + 4} textAnchor="end" fontWeight="600">
          {tr("lblGenerator")}
        </text>
        <text x={LEFT - 28} y={MID + 20} textAnchor="end">
          E = {format(p.E, 1)} V
        </text>

        {/* Resistor: fills with u_R / E */}
        <rect x={160} y={T - 12} width={80} height={24} fill="var(--sim-curve-2)" fillOpacity={0.15} />
        <rect x={160} y={T - 12} width={80 * drop} height={24} fill="var(--sim-curve-2)" />
        <rect x={160} y={T - 12} width={80} height={24} fill="none" stroke="var(--foreground)" strokeWidth={2} />
        <text x={200} y={T - 20} textAnchor="middle" fontWeight="600">
          {tr("lblResistor")} · R = {format(p.R, 0)} Ω
        </text>
        <text x={200} y={T + 30} textAnchor="middle">
          u_R = {format(uR(p, t))} V ({pct(drop)})
        </text>

        {/* Coil: a box behind the turns fills from the bottom with u_L / E */}
        <rect
          x={RIGHT - 4}
          y={MID - COIL}
          width={turn / 2 + 8}
          height={2 * COIL}
          fill="var(--sim-curve-1)"
          fillOpacity={0.15}
        />
        <rect
          x={RIGHT - 4}
          y={MID + COIL - 2 * COIL * back}
          width={turn / 2 + 8}
          height={2 * COIL * back}
          fill="var(--sim-curve-1)"
        />
        <path d={`M${RIGHT} ${MID - COIL} ${coil}`} stroke="var(--foreground)" strokeWidth={3} fill="none" />
        <text x={RIGHT - 12} y={MID - 4} textAnchor="end" fontWeight="600">
          {tr("lblCoil")} · L = {format(p.L, 2)} H
        </text>
        <text x={RIGHT - 12} y={MID + 12} textAnchor="end">
          u_L = {format(uL(p, t))} V ({pct(back)})
        </text>

        {/* Current: conventional direction on the bottom wire, growing with i / I₀ */}
        <g opacity={0.2 + share * 0.8}>
          <path
            d={`M${206 + 6 * share} ${B - 7 - 4 * share} L194 ${B} L${206 + 6 * share} ${B + 7 + 4 * share} Z`}
            fill="var(--sim-point)"
          />
          <text x={200} y={B + 28} textAnchor="middle">
            i = {format(i(p, t), 1)} mA ({pct(share)})
          </text>
        </g>
      </svg>
    </figure>
  );
}
