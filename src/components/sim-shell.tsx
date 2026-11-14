import { Maximize2, Minimize2, Pause, Play, RotateCcw } from "lucide-react";
import { type ComponentProps, type ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { SimStage, useFormat } from "@/components/sim";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Locale, localeDir } from "@/i18n/messages";
import { cn } from "@/lib/utils";
import { useSettings } from "@/settings/settings";

const PLAY_SECONDS = 4; // wall-clock seconds to sweep the time axis at ×1

/** The guided note shown while the simulation rests in one phase. */
export type Note<K extends string> = { title: K; body: K; step: number };

/**
 * The simulation clock: time in the model's unit from 0 to `tMax`, play/pause, speed and guided mode.
 * `phase` names the stretch of the experiment a time falls in; guided mode stops at each new one.
 */
export function useSimClock<P extends string>(tMax: number, start: number, phase: (t: number) => P) {
  const [time, setTime] = useState(start);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [guided, setGuided] = useState(false);

  // The loop owns the clock locally so a stop lands exactly on the frame that crossed a boundary;
  // it reads the newest `phase` each frame because the sliders change it mid-run.
  const latest = useRef({ time, phase });
  useEffect(() => {
    latest.current = { time, phase };
  });

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let t = latest.current.time;
    let last = performance.now();
    const step = (now: number) => {
      // Cap a frame at 50 ms so a stalled or background tab cannot jump over a whole phase.
      // rAF timestamps can predate the performance.now() taken at start, so clamp at 0 too.
      const wall = Math.min(Math.max(now - last, 0), 50) / 1000;
      const next = Math.min(tMax, t + wall * (tMax / PLAY_SECONDS) * Number(speed));
      last = now;
      // Guided mode works like a debugger: stop at each new phase until the student clicks Next.
      const halt = next >= tMax || (guided && latest.current.phase(next) !== latest.current.phase(t));
      t = next;
      setTime(next);
      if (halt) return setPlaying(false);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, guided, tMax]);

  return {
    time,
    tMax,
    phase: phase(time),
    playing,
    speed,
    guided,
    setSpeed,
    setGuided,
    resume: () => setPlaying(true),
    // Plays even with prefers-reduced-motion: the user asked for it and the motion is the lesson.
    togglePlay: () => {
      if (time >= tMax) setTime(0);
      setPlaying((v) => time >= tMax || !v);
    },
    reset: () => (setPlaying(false), setTime(0)),
  };
}

/**
 * Everything a lesson's simulation shares: the chart with its transport bar and guided notes, and the
 * layout around it. Phone: chart then tabs. Wide (tablet/projector): chart and a formula/circuit panel
 * side by side, sliders and quiz below. The lesson supplies the model-specific pieces.
 */
export function SimShell<P extends string, K extends string>(props: {
  clock: ReturnType<typeof useSimClock<P>>;
  notes: Record<P, Note<K>>;
  /** The lesson's own text, which the notes' keys point into. */
  text: Record<Locale, Record<K, string>>;
  /** The time axis is in ms. */
  chart: Omit<ComponentProps<typeof SimStage>, "t" | "tMax" | "callout" | "footer">;
  /** The `<ParamSlider>`s. */
  params: ReactNode;
  formula: ReactNode;
  schematic: ReactNode;
  /** The lazy 3D view: three.js only downloads when a student asks for 3D. */
  scene: ReactNode;
  quiz: ReactNode;
}) {
  const { clock } = props;
  const { settings, t: tr } = useSettings();
  const format = useFormat();
  const [view, setView] = useState("top");
  const [expanded, setExpanded] = useState(false);

  // The prerendered HTML carries both layouts and CSS shows one, so nothing jumps at any width.
  // Once the browser knows which, only that one stays mounted: one chart to redraw, one quiz.
  const root = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState<boolean>();
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (phone.current) setWide(getComputedStyle(phone.current).display === "none");
    });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const text = props.text[settings.locale];
  const note = props.notes[clock.phase];
  const callout = clock.guided && !clock.playing && (
    <div dir={localeDir[settings.locale]} role="status" className="flex flex-col gap-1">
      <p className="flex items-center justify-between gap-2 font-semibold">
        {text[note.title]}
        <span className="text-xs text-muted-foreground tabular-nums">
          {note.step}/{Object.keys(props.notes).length}
        </span>
      </p>
      <p className="text-muted-foreground">{text[note.body]}</p>
      {clock.time < clock.tMax && (
        <Button size="sm" className="mt-1 self-end" onClick={clock.resume}>
          {tr("next")}
          <Play />
        </Button>
      )}
    </div>
  );

  const stage = (
    <SimStage
      {...props.chart}
      tMax={clock.tMax}
      t={clock.time}
      callout={callout}
      footer={
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Button onClick={clock.togglePlay}>
            {clock.playing ? <Pause /> : <Play />}
            {clock.playing ? tr("pause") : tr("play")}
          </Button>
          <Button variant="outline" size="icon" aria-label={tr("reset")} onClick={clock.reset}>
            <RotateCcw />
          </Button>
          <ToggleGroup
            type="single"
            value={clock.speed}
            onValueChange={(v) => v && clock.setSpeed(v)}
            aria-label={tr("speed")}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="0.25">×{format(0.25)}</ToggleGroupItem>
            <ToggleGroupItem value="1">×1</ToggleGroupItem>
            <ToggleGroupItem value="4">×4</ToggleGroupItem>
          </ToggleGroup>
          <Label className="cursor-pointer">
            <Switch checked={clock.guided} onCheckedChange={clock.setGuided} />
            {tr("withInterp")}
          </Label>
          <span className="ms-auto text-sm font-semibold tabular-nums" dir="ltr">
            t = {format(clock.time, 1)} ms
          </span>
        </div>
      }
    />
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
      {view === "3d" ? (
        <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">{tr("loading")}</p>}>
          {props.scene}
        </Suspense>
      ) : (
        props.schematic
      )}
    </div>
  );

  const params = <div className="flex flex-col gap-6 border-2 border-edge bg-card p-4">{props.params}</div>;

  return (
    <div ref={root} className="@container">
      <div ref={phone} className="flex flex-col gap-5 @3xl:hidden">
        {wide !== true && (
          <>
            {stage}
            <Tabs defaultValue="params">
              <TabsList className="w-full">
                <TabsTrigger value="params">{tr("parameters")}</TabsTrigger>
                <TabsTrigger value="formula">{tr("formula")}</TabsTrigger>
                <TabsTrigger value="circuit">{tr("circuit")}</TabsTrigger>
                <TabsTrigger value="quiz">{tr("quiz")}</TabsTrigger>
              </TabsList>
              <TabsContent value="params">{params}</TabsContent>
              <TabsContent value="formula">{props.formula}</TabsContent>
              <TabsContent value="circuit">{circuit}</TabsContent>
              <TabsContent value="quiz">{props.quiz}</TabsContent>
            </Tabs>
          </>
        )}
      </div>
      {/* Enlarged, the chart and the right-hand panel share the width equally. */}
      <div
        className={cn(
          "hidden gap-6 @3xl:grid",
          expanded ? "@3xl:grid-cols-2" : "@3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
        )}
      >
        {wide !== false && (
          <>
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
                <TabsContent value="formula">{props.formula}</TabsContent>
                <TabsContent value="circuit">{circuit}</TabsContent>
              </Tabs>
              {props.quiz}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
