import { useFormat } from "@/components/sim";
import { useSettings } from "@/settings/settings";
import { rcText } from "./messages";
import { type RcParams, uC, uR } from "./model";

// Loop corners in viewBox units.
const LEFT = 70;
const RIGHT = 330;
const T = 50;
const B = 210;
const MID = (T + B) / 2;
const PLATE = 15; // half the gap between capacitor plates

/**
 * The circuit seen from above, as a schematic. Each part fills with its own quantity: the resistor with u_R
 * (it is "busy" while current flows), the capacitor with u_C. Values and percentages are written next to
 * them so the fill is never the only cue.
 */
export function RcSchematic({ p, t }: { p: RcParams; t: number }) {
  const { settings, t: tr } = useSettings();
  const s = rcText[settings.locale];
  const format = useFormat();
  const charge = uC(p, t) / p.E;
  const drop = uR(p, t) / p.E;
  const current = uR(p, t) / p.R; // V / kΩ = mA
  const pct = (x: number) => `${format(x * 100, 0)} %`;
  const wire = { stroke: "var(--sim-axis)", strokeWidth: 3, fill: "none" };

  return (
    <figure className="border-2 border-edge bg-sim-canvas shadow-hard-sm">
      <svg
        viewBox="-30 0 430 250"
        className="block h-auto w-full"
        direction="ltr"
        role="img"
        aria-label={`${s.schematic}: u_C = ${format(uC(p, t))} V (${pct(charge)}), u_R = ${format(uR(p, t))} V, i = ${format(current)} mA`}
        fontSize="12"
        fill="var(--foreground)"
      >
        {/* Wires, with gaps for the components */}
        <path d={`M${LEFT} ${MID - 8} V${T} H160 M240 ${T} H${RIGHT} V${MID - PLATE}`} {...wire} />
        <path d={`M${RIGHT} ${MID + PLATE} V${B} H${LEFT} V${MID + 8}`} {...wire} />

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
          {tr("lblResistor")} · R = {format(p.R, 1)} kΩ
        </text>
        <text x={200} y={T + 30} textAnchor="middle">
          u_R = {format(uR(p, t))} V ({pct(drop)})
        </text>

        {/* Capacitor: + plate on top, filling from the − plate up to u_C / E */}
        <rect
          x={RIGHT - 28}
          y={MID + PLATE - 2 * PLATE * charge}
          width={56}
          height={2 * PLATE * charge}
          fill="var(--sim-curve-1)"
        />
        <rect
          x={RIGHT - 28}
          y={MID - PLATE}
          width={56}
          height={2 * PLATE}
          fill="none"
          stroke="var(--sim-curve-1)"
          strokeDasharray="3 3"
        />
        <line
          x1={RIGHT - 30}
          x2={RIGHT + 30}
          y1={MID - PLATE}
          y2={MID - PLATE}
          stroke="var(--foreground)"
          strokeWidth={4}
        />
        <line
          x1={RIGHT - 30}
          x2={RIGHT + 30}
          y1={MID + PLATE}
          y2={MID + PLATE}
          stroke="var(--foreground)"
          strokeWidth={4}
        />
        <text x={RIGHT + 34} y={MID - PLATE + 4}>
          +q
        </text>
        <text x={RIGHT + 34} y={MID + PLATE + 4}>
          −q
        </text>
        <text x={RIGHT - 36} y={MID - 4} textAnchor="end" fontWeight="600">
          {s.lblCapacitor} · C = {format(p.C, 1)} µF
        </text>
        <text x={RIGHT - 36} y={MID + 12} textAnchor="end">
          u_C = {format(uC(p, t))} V ({pct(charge)})
        </text>

        {/* Current: conventional direction on the bottom wire, fading as i falls */}
        <g opacity={0.2 + drop * 0.8}>
          <path d={`M206 ${B - 7} L194 ${B} L206 ${B + 7} Z`} fill="var(--sim-point)" />
          <text x={200} y={B + 24} textAnchor="middle">
            i = {format(current)} mA
          </text>
        </g>
      </svg>
    </figure>
  );
}
