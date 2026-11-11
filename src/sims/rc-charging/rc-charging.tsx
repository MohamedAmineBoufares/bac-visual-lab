import { Maximize2, Minimize2, Pause, Play, RotateCcw } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FormulaPanel, ParamSlider, SimStage, useFormat } from "@/components/sim";
import { Quiz } from "@/components/quiz";
import { rcQuiz } from "@/sims/rc-charging/quiz";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MessageKey } from "@/i18n/messages";
import { localeDir } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";
import { phase, type RcPhase, tau, uC, uR } from "./model";
import { RcSchematic } from "./schematic";

const notes: Record<RcPhase, { title: MessageKey; body: MessageKey; step: number }> = {
  start: { title: "rcStartT", body: "rcStartB", step: 1 },
  rising: { title: "rcRisingT", body: "rcRisingB", step: 2 },
  tau: { title: "rcTauT", body: "rcTauB", step: 3 },
  slowing: { title: "rcSlowingT", body: "rcSlowingB", step: 4 },
  steady: { title: "rcSteadyT", body: "rcSteadyB", step: 5 },
};

// three.js loads only when a student opens the 3D tab.
const RcScene3D = lazy(() => import("./scene-3d").then((m) => ({ default: m.RcScene3D })));

const T_MAX = 20; // ms shown on the time axis
const PLAY_SECONDS = 4; // wall-clock seconds to sweep T_MAX at ×1

export function RcCharging() {
  const { settings, t: tr } = useSettings();
  const [guided, setGuided] = useState(false);
  const format = useFormat();
  const [E, setE] = useState(5);
  const [R, setR] = useState(2.2);
  const [C, setC] = useState(1);
  const [time, setTime] = useState(T_MAX * 0.11);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const raf = useRef(0);
  const [view, setView] = useState("top");
  const [expanded, setExpanded] = useState(false);

  // The loop owns the clock locally so a stop lands exactly on the frame that crossed a boundary.
  const timeRef = useRef(time);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (!playing) return;
    const p = { E, R, C };
    let t = timeRef.current;
    let last = performance.now();
    const step = (now: number) => {
      // Cap a frame at 50 ms so a stalled or background tab cannot jump over a whole phase.
      // rAF timestamps can predate the performance.now() taken at start, so clamp at 0 too.
      const wall = Math.min(Math.max(now - last, 0), 50) / 1000;
      const next = Math.min(T_MAX, t + wall * (T_MAX / PLAY_SECONDS) * Number(speed));
      last = now;
      // Guided mode works like a debugger: stop at each new phase until the student clicks Next.
      const halt = next >= T_MAX || (guided && phase(p, next) !== phase(p, t));
      t = next;
      setTime(next);
      if (halt) return setPlaying(false);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed, guided, E, R, C]);

  // Plays even with prefers-reduced-motion: the user asked for it and the motion is the lesson.
  const togglePlay = () => {
    if (time >= T_MAX) setTime(0);
    setPlaying((v) => time >= T_MAX || !v);
  };

  const p = { E, R, C };
  const series = [
    { label: "u_C", color: "var(--sim-curve-1)", fn: (t: number) => uC(p, t) },
    { label: "u_R", color: "var(--sim-curve-2)", dash: "10 6", fn: (t: number) => uR(p, t) },
  ];

  const note = notes[phase(p, time)];
  const callout = guided && !playing && (
    <div dir={localeDir[settings.locale]} role="status" className="flex flex-col gap-1">
      <p className="flex items-center justify-between gap-2 font-semibold">
        {tr(note.title)}
        <span className="text-xs text-muted-foreground tabular-nums">{note.step}/5</span>
      </p>
      <p className="text-muted-foreground">{tr(note.body)}</p>
      {time < T_MAX && (
        <Button size="sm" className="mt-1 self-end" onClick={() => setPlaying(true)}>
          {tr("next")}
          <Play />
        </Button>
      )}
    </div>
  );

  const stage = (
    <SimStage
      series={series.map((s) => ({ ...s, label: s.label.replace("_", "") }))}
      tMax={T_MAX}
      yMax={12}
      t={time}
      callout={callout}
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
          <Label className="cursor-pointer">
            <Switch checked={guided} onCheckedChange={setGuided} />
            {tr("withInterp")}
          </Label>
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

  const view3d = (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">{tr("loading")}</p>}>
      <RcScene3D p={p} t={time} />
    </Suspense>
  );

  // The 2D view is the default so three.js only downloads when a student asks for 3D.
  const circuit = (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => v && setView(v)}
        aria-label={tr("circuit")}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="top">{tr("topView")}</ToggleGroupItem>
        <ToggleGroupItem value="3d">{tr("view3d")}</ToggleGroupItem>
      </ToggleGroup>
      {view === "3d" ? view3d : <RcSchematic p={p} t={time} />}
    </div>
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
      {/* Phone: stage then tabs. Wide (tablet/projector): stage + formula/circuit side by side, sliders and quiz below. */}
      <div className="flex flex-col gap-5 @3xl:hidden">
        {stage}
        <Tabs defaultValue="params">
          <TabsList className="w-full">
            <TabsTrigger value="params">{tr("parameters")}</TabsTrigger>
            <TabsTrigger value="formula">{tr("formula")}</TabsTrigger>
            <TabsTrigger value="circuit">{tr("circuit")}</TabsTrigger>
            <TabsTrigger value="quiz">{tr("quiz")}</TabsTrigger>
          </TabsList>
          <TabsContent value="params">{params}</TabsContent>
          <TabsContent value="formula">{formula}</TabsContent>
          <TabsContent value="circuit">{circuit}</TabsContent>
          <TabsContent value="quiz">
            <Quiz lessonId="rc-charging" questions={rcQuiz} />
          </TabsContent>
        </Tabs>
      </div>
      {/* Enlarged, the chart and the right-hand panel share the width equally. */}
      <div
        className={cn(
          "hidden gap-6 @3xl:grid",
          expanded ? "@3xl:grid-cols-2" : "@3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
        )}
      >
        <div className="flex flex-col gap-6">
          {stage}
          {params}
        </div>
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="formula">
            <div className="flex gap-2">
              <TabsList className="flex-1">
                <TabsTrigger value="formula">{tr("formula")}</TabsTrigger>
                <TabsTrigger value="circuit">{tr("circuit")}</TabsTrigger>
              </TabsList>
              <Button
                variant="outline"
                size="icon"
                aria-pressed={expanded}
                aria-label={tr(expanded ? "viewShrink" : "viewExpand")}
                title={tr(expanded ? "viewShrink" : "viewExpand")}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </div>
            <TabsContent value="formula">{formula}</TabsContent>
            <TabsContent value="circuit">{circuit}</TabsContent>
          </Tabs>
          <Quiz lessonId="rc-charging" questions={rcQuiz} />
        </div>
      </div>
    </div>
  );
}
