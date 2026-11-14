import { lazy, useState } from "react";
import { Quiz } from "@/components/quiz";
import { FormulaPanel, ParamSlider, useFormat } from "@/components/sim";
import { type Note, SimShell, useSimClock } from "@/components/sim-shell";
import { useSettings } from "@/settings/settings";
import { type RlKey, rlText } from "./messages";
import { energy, i, iFinal, phase, type RlPhase, tau, uL, uR } from "./model";
import { rlQuiz } from "./quiz";
import { RlSchematic } from "./schematic";

const notes: Record<RlPhase, Note<RlKey>> = {
  start: { title: "rlStartT", body: "rlStartB", step: 1 },
  rising: { title: "rlRisingT", body: "rlRisingB", step: 2 },
  tau: { title: "rlTauT", body: "rlTauB", step: 3 },
  slowing: { title: "rlSlowingT", body: "rlSlowingB", step: 4 },
  steady: { title: "rlSteadyT", body: "rlSteadyB", step: 5 },
};

// three.js loads only when a student opens the 3D tab.
const RlScene3D = lazy(() => import("./scene-3d").then((m) => ({ default: m.RlScene3D })));

const T_MAX = 100; // ms shown on the time axis

export function RlCircuit({ lessonId }: { lessonId: string }) {
  const { settings, t: tr } = useSettings();
  const s = rlText[settings.locale];
  const format = useFormat();
  const [E, setE] = useState(6);
  const [R, setR] = useState(50);
  const [L, setL] = useState(0.5);
  const p = { E, R, L };
  const clock = useSimClock(T_MAX, 10, (t) => phase(p, t));
  const { time } = clock;

  return (
    <SimShell
      clock={clock}
      notes={notes}
      text={rlText}
      chart={{
        series: [
          { label: "uL", color: "var(--sim-curve-1)", fn: (t) => uL(p, t) },
          { label: "uR", color: "var(--sim-curve-2)", dash: "10 6", fn: (t) => uR(p, t) },
        ],
        yMax: 12,
        markers: tau(p) <= T_MAX ? [{ t: tau(p), label: "τ" }] : [],
        refLine: { y: E, label: `E = ${format(E, 1)} V` },
        xLabel: "t (ms)",
        yLabel: "u (V)",
      }}
      params={
        <>
          <ParamSlider
            symbolTex="E"
            label={tr("emf")}
            unit="V"
            value={E}
            min={1}
            max={12}
            step={0.5}
            digits={1}
            onChange={setE}
          />
          <ParamSlider
            symbolTex="R"
            label={tr("resistance")}
            unit="Ω"
            value={R}
            min={10}
            max={100}
            step={5}
            digits={0}
            onChange={setR}
          />
          <ParamSlider
            symbolTex="L"
            label={s.inductance}
            unit="H"
            value={L}
            min={0.1}
            max={1}
            step={0.05}
            digits={2}
            onChange={setL}
          />
        </>
      }
      formula={
        <FormulaPanel
          badge={tr("formula")}
          caption={s.rlFormulaCaption}
          tex={String.raw`i(t) = \frac{\htmlClass{live}{E}}{\htmlClass{live}{R}}\left(1 - e^{-t/\htmlClass{live}{\tau}}\right) \qquad \tau = \frac{L}{R}`}
          substitutedTex={String.raw`= ${format(iFinal(p), 1)}\,\text{mA} \times \left(1 - e^{-t/${format(tau(p), 2)}\,\text{ms}}\right)`}
          readouts={[
            { label: "i =", value: `${format(i(p, time), 1)} mA`, color: "var(--sim-point)" },
            { label: "u_L =", value: `${format(uL(p, time))} V`, color: "var(--sim-curve-1)" },
            { label: "u_R =", value: `${format(uR(p, time))} V`, color: "var(--sim-curve-2)", dash: "4 3" },
            { label: String.raw`\tau =`, value: `${format(tau(p))} ms`, color: "var(--sim-axis)" },
            { label: String.raw`E_L =`, value: `${format(energy(p, time))} mJ`, color: "var(--sim-axis)" },
          ]}
        />
      }
      schematic={<RlSchematic p={p} t={time} />}
      scene={<RlScene3D p={p} t={time} />}
      quiz={<Quiz lessonId={lessonId} questions={rlQuiz} text={rlText} />}
    />
  );
}
