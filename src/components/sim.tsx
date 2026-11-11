import { type ReactNode, useId } from "react";
import { Formula } from "@/components/formula";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useSettings } from "@/settings/settings";

const fmt = (locale: string, n: number, digits = 2) =>
  new Intl.NumberFormat(locale === "ar" ? "ar-TN" : locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);

export function useFormat() {
  const { settings } = useSettings();
  return (n: number, digits = 2) => fmt(settings.locale, n, digits);
}

/** Labelled slider. The value badge shares --sim-highlight with the live term in FormulaPanel. */
export function ParamSlider(props: {
  symbolTex: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  onChange: (v: number) => void;
}) {
  const { settings } = useSettings();
  const format = useFormat();
  const id = useId();
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Formula tex={props.symbolTex} className="text-lg" />
        <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
          {props.label}
        </label>
        <output
          htmlFor={id}
          className="ms-auto border-2 border-foreground bg-sim-highlight px-2 py-0.5 text-sm font-semibold text-[#072841] tabular-nums"
        >
          {format(props.value, props.digits)} {props.unit}
        </output>
      </div>
      <Slider
        id={id}
        dir={settings.locale === "ar" ? "rtl" : "ltr"}
        min={props.min}
        max={props.max}
        step={props.step}
        value={[props.value]}
        onValueChange={([v]) => v !== undefined && props.onChange(v)}
        aria-label={props.label}
      />
      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>
          {format(props.min, props.digits)} {props.unit}
        </span>
        <span>
          {format(props.max, props.digits)} {props.unit}
        </span>
      </div>
    </div>
  );
}

export type Series = { label: string; color: string; dash?: string; fn: (t: number) => number };

/**
 * SVG plot of y(t) series over [0, tMax]. Always LTR (time flows left to right, as in exams).
 * Curves carry a dash pattern and a direct label so colour is never the only cue.
 */
export function SimStage(props: {
  series: Series[];
  tMax: number;
  yMax: number;
  t: number;
  markers?: { t: number; label: string }[];
  refLine?: { y: number; label: string };
  xLabel: string;
  yLabel: string;
  footer?: ReactNode;
  /** Guided note pinned to the first curve's point; flips side so it stays inside the plot. */
  callout?: ReactNode;
}) {
  const W = 640,
    H = 320,
    L = 48,
    R = 16,
    T = 20,
    B = 36;
  const x = (t: number) => L + (t / props.tMax) * (W - L - R);
  const y = (v: number) => H - B - (v / props.yMax) * (H - T - B);
  const path = (fn: (t: number) => number) =>
    Array.from({ length: 161 }, (_, i) => (i / 160) * props.tMax)
      .map((t, i) => `${i ? "L" : "M"}${x(t).toFixed(1)} ${y(fn(t)).toFixed(1)}`)
      .join(" ");
  const clipId = useId();
  const px = x(props.t);
  const first = props.series[0];
  const py = first ? y(first.fn(props.t)) : H / 2;
  const right = px < W / 2;
  const below = py < H / 2;
  return (
    <figure className="border-2 border-foreground bg-sim-canvas shadow-hard">
      <div className="relative" dir="ltr">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          direction="ltr"
          role="img"
          aria-label={props.series.map((s) => s.label).join(", ")}
        >
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={x((i / 10) * props.tMax)}
              x2={x((i / 10) * props.tMax)}
              y1={T}
              y2={H - B}
              className="stroke-sim-grid"
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={L}
              x2={W - R}
              y1={y((i / 5) * props.yMax)}
              y2={y((i / 5) * props.yMax)}
              className="stroke-sim-grid"
            />
          ))}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} className="stroke-sim-axis" strokeWidth={2} />
          <line x1={L} x2={L} y1={T} y2={H - B} className="stroke-sim-axis" strokeWidth={2} />
          <text x={W - R} y={H - 10} textAnchor="end" className="fill-muted-foreground text-[13px]">
            {props.xLabel}
          </text>
          <text x={8} y={14} className="fill-muted-foreground text-[13px]">
            {props.yLabel}
          </text>
          {props.refLine && (
            <g>
              <line
                x1={L}
                x2={W - R}
                y1={y(props.refLine.y)}
                y2={y(props.refLine.y)}
                className="stroke-sim-axis"
                strokeDasharray="6 6"
              />
              <text
                x={W - R - 4}
                y={y(props.refLine.y) - 6}
                textAnchor="end"
                className="fill-muted-foreground text-[13px]"
              >
                {props.refLine.label}
              </text>
            </g>
          )}
          {props.markers?.map((m) => (
            <g key={m.label}>
              <line x1={x(m.t)} x2={x(m.t)} y1={T} y2={H - B} className="stroke-sim-axis" strokeDasharray="3 4" />
              <text x={x(m.t)} y={H - B + 18} textAnchor="middle" className="fill-foreground text-[14px] italic">
                {m.label}
              </text>
            </g>
          ))}
          {props.series.map((s) => (
            <g key={s.label}>
              {/* Whole curve faint, the part already traced up to t drawn solid. */}
              <path
                d={path(s.fn)}
                fill="none"
                stroke={s.color}
                strokeWidth={3.5}
                strokeDasharray={s.dash}
                opacity={0.25}
              />
              <path
                d={path(s.fn)}
                fill="none"
                stroke={s.color}
                strokeWidth={3.5}
                strokeDasharray={s.dash}
                clipPath={`url(#${clipId})`}
              />
              <text
                x={x(props.tMax * 0.8)}
                y={y(s.fn(props.tMax * 0.8)) + (s.fn(props.tMax * 0.8) > props.yMax / 2 ? 22 : -10)}
                fill={s.color}
                className="text-[15px] font-semibold"
              >
                {s.label}
              </text>
            </g>
          ))}
          <clipPath id={clipId}>
            <rect x={0} y={0} width={px} height={H} />
          </clipPath>
          <line x1={px} x2={px} y1={T} y2={H - B} className="stroke-sim-axis" strokeDasharray="3 5" opacity={0.6} />
          {props.series.map((s) => {
            const sy = y(s.fn(props.t));
            return (
              <g key={s.label}>
                <line x1={L} x2={px} y1={sy} y2={sy} stroke={s.color} strokeDasharray="3 5" opacity={0.6} />
                <rect
                  x={px - 7}
                  y={sy - 7}
                  width={14}
                  height={14}
                  className="fill-sim-point stroke-foreground"
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </svg>
        {props.callout && (
          <>
            <span
              className="pointer-events-none absolute size-7 -translate-1/2 border-2 border-foreground motion-safe:animate-ping"
              style={{ left: `${(px / W) * 100}%`, top: `${(py / H) * 100}%` }}
              aria-hidden="true"
            />
            <div
              className={cn(
                "absolute w-[min(16rem,45%)] border-2 border-foreground bg-card p-2.5 text-sm shadow-hard-sm transition-[left,top] duration-300 ease-out",
                right ? "ms-4" : "-translate-x-full -ms-4",
                below ? "mt-4" : "-translate-y-full -mt-4",
              )}
              style={{ left: `${(px / W) * 100}%`, top: `${(py / H) * 100}%` }}
            >
              {props.callout}
            </div>
          </>
        )}
      </div>
      {props.footer && <figcaption className="border-t-2 border-foreground bg-card">{props.footer}</figcaption>}
    </figure>
  );
}

/** Formula card: TeX with live terms, the same formula with numbers, and a legend readout. */
export function FormulaPanel(props: {
  badge: string;
  caption: string;
  tex: string;
  substitutedTex: string;
  readouts: { label: string; value: string; color: string; dash?: string }[];
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3 border-2 border-foreground bg-card p-4 shadow-hard", props.className)}>
      <header className="flex flex-wrap items-center gap-2">
        <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-semibold">{props.badge}</span>
        <span className="text-sm text-muted-foreground">{props.caption}</span>
      </header>
      <div className="overflow-x-auto py-1 text-xl" dir="ltr">
        <Formula tex={props.tex} display />
      </div>
      <div className="overflow-x-auto text-muted-foreground" dir="ltr">
        <Formula tex={props.substitutedTex} />
      </div>
      <hr className="border-t-2 border-foreground" />
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {props.readouts.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <svg width="20" height="6" aria-hidden="true">
              <line x1="0" x2="20" y1="3" y2="3" stroke={r.color} strokeWidth="3.5" strokeDasharray={r.dash} />
            </svg>
            <Formula tex={r.label} />
            <span className="font-semibold tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
