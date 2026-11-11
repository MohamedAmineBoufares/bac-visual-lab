import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormulaPanel, ParamSlider, SimStage, useFormat } from "@/components/sim";
import { Quiz } from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSettings } from "@/settings/settings";
import { tau, uC, uR } from "./model";

const T_MAX = 20; // ms shown on the time axis
const PLAY_SECONDS = 4; // wall-clock seconds to sweep T_MAX at ×1

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RcCharging() {
  const { t: tr } = useSettings();
  const format = useFormat();
  const [E, setE] = useState(5);
  const [R, setR] = useState(2.2);
  const [C, setC] = useState(1);
  const [time, setTime] = useState(T_MAX * 0.11);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const raf = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = ((now - last) / 1000) * (T_MAX / PLAY_SECONDS) * Number(speed);
      last = now;
      setTime((t) => {
        const next = t + dt;
        if (next >= T_MAX) {
          setPlaying(false);
          return T_MAX;
        }
        return next;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed]);

  // Reduced motion: jump to the final state instead of animating.
  const togglePlay = () => {
    if (prefersReducedMotion()) return setTime(T_MAX);
    if (time >= T_MAX) setTime(0);
    setPlaying((v) => time >= T_MAX || !v);
  };

  const p = { E, R, C };
  const series = [
    { label: "u_C", color: "var(--sim-curve-1)", fn: (t: number) => uC(p, t) },
    { label: "u_R", color: "var(--sim-curve-2)", dash: "10 6", fn: (t: number) => uR(p, t) },
  ];

  const stage = (
    <SimStage
      series={series.map((s) => ({ ...s, label: s.label.replace("_", "") }))}
      tMax={T_MAX}
      yMax={12}
      t={time}
      markers={tau(p) <= T_MAX ? [{ t: tau(p), label: "τ" }] : []}
      refLine={{ y: E, label: `E = ${format(E, 1)} V` }}
      xLabel="t (ms)"
      yLabel="u (V)"
      footer={
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Button onClick={togglePlay}>
            {playing ? <Pause /> : <Play />}
            {playing ? tr("pause") : tr("play")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={tr("reset")}
            onClick={() => (setPlaying(false), setTime(0))}
          >
            <RotateCcw />
          </Button>
          <ToggleGroup
            type="single"
            value={speed}
            onValueChange={(v) => v && setSpeed(v)}
            aria-label={tr("speed")}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="0.25">×0,25</ToggleGroupItem>
            <ToggleGroupItem value="1">×1</ToggleGroupItem>
            <ToggleGroupItem value="4">×4</ToggleGroupItem>
          </ToggleGroup>
          <span className="ms-auto text-sm font-semibold tabular-nums" dir="ltr">
            t = {format(time, 1)} ms
          </span>
        </div>
      }
    />
  );

  const formula = (
    <FormulaPanel
      badge={tr("formula")}
      caption={tr("formulaCaption")}
      tex={String.raw`u_C(t) = \htmlClass{live}{E}\left(1 - e^{-t/\htmlClass{live}{RC}}\right)`}
      substitutedTex={String.raw`= ${format(E, 1)}\,\text{V} \times \left(1 - e^{-t/${format(tau(p), 2)}\,\text{ms}}\right)`}
      readouts={[
        { label: "u_C =", value: `${format(uC(p, time))} V`, color: "var(--sim-curve-1)" },
        { label: "u_R =", value: `${format(uR(p, time))} V`, color: "var(--sim-curve-2)", dash: "4 3" },
        { label: String.raw`\tau =`, value: `${format(tau(p))} ms`, color: "var(--sim-axis)" },
      ]}
    />
  );

  const params = (
    <div className="flex flex-col gap-6 border-2 border-foreground bg-card p-4">
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
        label={tr("capacitance")}
        unit="µF"
        value={C}
        min={0.5}
        max={2}
        step={0.1}
        digits={1}
        onChange={setC}
      />
    </div>
  );

  return (
    <div className="@container">
      {/* Phone: stage then tabs. Wide (tablet/projector): stage + formula side by side, sliders and quiz below. */}
      <div className="flex flex-col gap-5 @3xl:hidden">
        {stage}
        <Tabs defaultValue="params">
          <TabsList className="w-full">
            <TabsTrigger value="params">{tr("parameters")}</TabsTrigger>
            <TabsTrigger value="formula">{tr("formula")}</TabsTrigger>
            <TabsTrigger value="quiz">{tr("quiz")}</TabsTrigger>
          </TabsList>
          <TabsContent value="params">{params}</TabsContent>
          <TabsContent value="formula">{formula}</TabsContent>
          <TabsContent value="quiz">
            <Quiz />
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden gap-6 @3xl:grid @3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-6">
          {stage}
          {params}
        </div>
        <div className="flex flex-col gap-6">
          {formula}
          <Quiz />
        </div>
      </div>
    </div>
  );
}
