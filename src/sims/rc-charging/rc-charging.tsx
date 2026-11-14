import { lazy, useState } from "react";
import { Quiz } from "@/components/quiz";
import { FormulaPanel, ParamSlider, useFormat } from "@/components/sim";
import { type Note, SimShell, useSimClock } from "@/components/sim-shell";
import { useSettings } from "@/settings/settings";
import { type RcKey, rcText } from "./messages";
import { phase, type RcPhase, tau, uC, uR } from "./model";
import { rcQuiz } from "./quiz";
import { RcSchematic } from "./schematic";

const notes: Record<RcPhase, Note<RcKey>> = {
  start: { title: "rcStartT", body: "rcStartB", step: 1 },
  rising: { title: "rcRisingT", body: "rcRisingB", step: 2 },
  tau: { title: "rcTauT", body: "rcTauB", step: 3 },
  slowing: { title: "rcSlowingT", body: "rcSlowingB", step: 4 },
  steady: { title: "rcSteadyT", body: "rcSteadyB", step: 5 },
};

// three.js loads only when a student opens the 3D tab.
const RcScene3D = lazy(() => import("./scene-3d").then((m) => ({ default: m.RcScene3D })));

const T_MAX = 20; // ms shown on the time axis

export function RcCharging({ lessonId }: { lessonId: string }) {
  const { settings, t: tr } = useSettings();
  const s = rcText[settings.locale];
  const format = useFormat();
  const [E, setE] = useState(5);
  const [R, setR] = useState(2.2);
  const [C, setC] = useState(1);
  const p = { E, R, C };
  const clock = useSimClock(T_MAX, T_MAX * 0.11, (t) => phase(p, t));
  const { time } = clock;

  return (
    <SimShell
      clock={clock}
      notes={notes}
      text={rcText}
      chart={{
        series: [
          { label: "uC", color: "var(--sim-curve-1)", fn: (t) => uC(p, t) },
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
            unit="kΩ"
            value={R}
            min={0.5}
            max={5}
            step={0.1}
            digits={1}
            onChange={setR}
          />
          <ParamSlider
            symbolTex="C"
            label={s.capacitance}
            unit="µF"
            value={C}
            min={0.5}
            max={2}
            step={0.1}
            digits={1}
            onChange={setC}
          />
        </>
      }
      formula={
        <FormulaPanel
          badge={tr("formula")}
          caption={s.formulaCaption}
          tex={String.raw`u_C(t) = \htmlClass{live}{E}\left(1 - e^{-t/\htmlClass{live}{RC}}\right)`}
          substitutedTex={String.raw`= ${format(E, 1)}\,\text{V} \times \left(1 - e^{-t/${format(tau(p), 2)}\,\text{ms}}\right)`}
          readouts={[
            { label: "u_C =", value: `${format(uC(p, time))} V`, color: "var(--sim-curve-1)" },
            { label: "u_R =", value: `${format(uR(p, time))} V`, color: "var(--sim-curve-2)", dash: "4 3" },
            { label: String.raw`\tau =`, value: `${format(tau(p))} ms`, color: "var(--sim-axis)" },
          ]}
        />
      }
      schematic={<RcSchematic p={p} t={time} />}
      scene={<RcScene3D p={p} t={time} />}
      quiz={<Quiz lessonId={lessonId} questions={rcQuiz} text={rcText} />}
    />
  );
}
