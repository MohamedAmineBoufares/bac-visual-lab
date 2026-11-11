import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ReactNode, useEffect, useRef, useSyncExternalStore } from "react";
import { Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useSettings } from "@/settings/settings";

/** Drag to orbit, pinch or wheel to zoom. The scene only redraws when something changes. */
function Orbit() {
  const { camera, gl, invalidate } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.addEventListener("change", () => invalidate());
    return () => controls.dispose();
  }, [camera, gl, invalidate]);
  // Resizing the canvas clears it and on-demand mode doesn't redraw by itself; this component re-renders on resize.
  useEffect(() => invalidate());
  return null;
}

/** A text tag pinned to a point of the scene; it follows the point as the student turns the view. */
export type SceneLabel = { text: string; at: [number, number, number] };

/** Projects each label point to the canvas on every drawn frame and moves its tag there. */
type Place = (i: number, x: number, y: number, visible: boolean) => void;

/** Projects each label point to canvas pixels on every drawn frame. */
function LabelTracker({ labels, place }: { labels: SceneLabel[]; place: Place }) {
  useFrame(({ camera, size }) => {
    for (const [i, label] of labels.entries()) {
      const point = new Vector3(...label.at).project(camera);
      place(i, ((point.x + 1) / 2) * size.width, ((1 - point.y) / 2) * size.height, point.z < 1);
    }
  });
  return null;
}

const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-cb"] });
  return () => observer.disconnect();
};

const readToken = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim() || "#888888";

const tokens = [
  "sim-curve-1",
  "sim-curve-2",
  "sim-curve-3",
  "sim-point",
  "sim-highlight",
  "sim-axis",
  "foreground",
] as const;
export type SceneToken = (typeof tokens)[number];

/**
 * Resolves colour tokens to real values (three.js can't read `var(--…)`), re-reading them when the theme or
 * colour-blind mode changes. Usage: `const color = useTokenColors(); color("sim-curve-1")`.
 */
export function useTokenColors() {
  const joined = useSyncExternalStore(subscribeTheme, () => tokens.map(readToken).join("|"));
  const values = joined.split("|");
  return (name: SceneToken) => values[tokens.indexOf(name)] ?? "#888888";
}

/** Frame for a lesson's 3D view: canvas, lights, orbit controls, labels and a text alternative. */
export function Scene3D({ summary, labels, children }: { summary: string; labels: SceneLabel[]; children: ReactNode }) {
  const { t } = useSettings();
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const place: Place = (i, x, y, visible) => {
    const tag = tags.current[i];
    if (!tag) return;
    tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    tag.style.visibility = visible ? "visible" : "hidden";
  };
  return (
    <figure className="flex flex-col gap-2 border-2 border-edge bg-sim-canvas shadow-hard-sm">
      <div className="relative aspect-[4/3] w-full touch-none" role="img" aria-label={summary}>
        <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [3.4, 2.8, 7.4], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} />
          <Orbit />
          <LabelTracker labels={labels} place={place} />
          {children}
        </Canvas>
        {/* Tags are placed in canvas pixels, so physical left/top is intended here. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {labels.map((label, i) => (
            <span
              key={label.text}
              ref={(el) => {
                tags.current[i] = el;
              }}
              className="invisible absolute top-0 left-0 border border-edge bg-background px-1 text-xs whitespace-nowrap"
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="px-3 pb-2 text-xs text-muted-foreground">{t("view3dHint")}</figcaption>
    </figure>
  );
}
