import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

// Dev-only review board. In production builds the route 404s and its component is dropped from the bundle.
export const Route = createFileRoute("/design")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  component: import.meta.env.DEV ? DesignBoard : () => null,
});

const pages = [
  { label: "landing", path: "/" },
  { label: "home", path: "/app" },
  { label: "section", path: "/app/sections/sciences-experimentales" },
  { label: "lesson", path: "/app/lessons/rc-charging" },
];

const devices = [
  { name: "Phone", width: 390, height: 844, zoom: 1 },
  { name: "Tablet", width: 834, height: 1112, zoom: 0.75 },
  { name: "Projector", width: 1440, height: 900, zoom: 0.6 },
];

/** The same page at phone, tablet and projector widths. Each frame is a real iframe, so media queries apply. */
function DesignBoard() {
  const [path, setPath] = useState("/app/lessons/rc-charging");
  return (
    <div className="min-h-screen bg-secondary" dir="ltr">
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b-2 border-foreground bg-card px-4 py-3">
        <strong className="me-4">Design review</strong>
        {pages.map((p) => (
          <button
            key={p.path}
            type="button"
            onClick={() => setPath(p.path)}
            className={`border-2 border-foreground px-3 py-1 text-sm font-semibold ${path === p.path ? "bg-sim-highlight text-[#072841] shadow-hard-sm" : "bg-card"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-start gap-10 p-8">
        {devices.map((d) => (
          <figure key={d.name} className="flex flex-col gap-2">
            <figcaption className="text-sm font-semibold">
              {d.name} · {d.width}px
            </figcaption>
            {/* oxlint-disable-next-line react/iframe-missing-sandbox -- dev-only, same-origin page that needs scripts + storage */}
            <iframe
              title={`${d.name} preview`}
              src={path}
              className="border-2 border-foreground bg-background shadow-hard"
              style={{ width: d.width, height: d.height, zoom: d.zoom }}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
