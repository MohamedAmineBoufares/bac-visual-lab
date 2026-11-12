# AGENTS.md

Guidance for AI coding assistants (and humans) working in this repo. Keep it short and current.

## Project

Bac Visual Lab: interactive maths/physics simulations for Tunisian Bac students. Frontend only, PWA
later, FR/EN/AR with RTL. UI is reviewed at phone/tablet/projector widths on `/design` (dev only).
Read [README.md](README.md) and [docs/design.md](docs/design.md) before larger changes.

## Commands

- Node 22.12+ and pnpm 12 (pinned in `packageManager`). Keep dependencies on their latest releases.
- `pnpm install` (pnpm only; never commit `package-lock.json` or `yarn.lock`)
- `pnpm dev` / `pnpm build`
- `pnpm check` must pass before you call work done (types, oxlint, oxfmt, Vitest with coverage floors in `vite.config.ts`; new logic needs tests, and never lower a floor)
- `pnpm dlx shadcn@latest add <name>` to add shadcn components. After adding, fix any `from "cn"` import
  to `from "@/lib/utils"` and restyle to the house look (see below).

## Rules

- Routing: TanStack Router, file-based, in `src/routes/`. Never edit `src/routeTree.gen.ts`. Use `<Link>`
  with typed `to`/`params`; validate params in `loader`/`beforeLoad` and `throw notFound()`.
- Pages live under `src/routes/{-$locale}/`: French at bare paths (`/app`), English and Arabic at `/en/…`
  and `/ar/…`. Links use `to="/{-$locale}/…"` and inherit the locale. Each route sets its title and
  description with `head: () => pageMeta(…)` (`src/seo.ts`); a new indexable page also goes in
  `pagePaths()` so the build prerenders it and lists it in `sitemap.xml`.
- Every page is prerendered at build time (`src/entry-server.tsx`, `scripts/prerender.ts`) and hydrated, so
  render code must run in Node and give the same HTML as the browser: `window`, `localStorage` and
  `document` only in effects or event handlers, and `useSyncExternalStore` needs a server snapshot.
- `/design` must stay dev-only (`import.meta.env.DEV` guard), never linked from the app.
- No database. Content is typed TS modules (code-split per route); progress/settings live in
  `localStorage`. Reconsider IndexedDB only if local data outgrows that.
- The React Compiler runs through `@rolldown/plugin-babel` + `reactCompilerPreset` (see `vite.config.ts`): don't add `useMemo`/`useCallback`/`memo` for speed.
- TypeScript strict, no `any`, no `as` casts to silence errors. `noUncheckedIndexedAccess` is on.
- Each lesson has a doc in `content/lessons/<id>.md` (see `content/README.md`). To build one, follow
  `content/BUILD.md`. Keep its sections in step with `lessons.ts`; `src/lessons/docs.test.ts` checks it.
- Lessons are listed in `src/lessons/lessons.ts`; home, section and lesson pages are built from it. Never
  hard-code lesson cards or fake progress. Quiz progress is stored by `src/lessons/progress.ts`.
- Simulation physics/maths live in `src/sims/<name>/model.ts` as pure functions with unit tests against a
  known solution (e.g. RC: u_C(τ) = 63.2 % of E). No React in models.
- 3D views use three.js through `@react-three/fiber`, wrapped in `<Scene3D>` (`src/components/scene-3d.tsx`:
  orbit controls, render on demand, text alternative). Load them lazily from the "Circuit" tab's 3D toggle so three.js never
  reaches other pages; its chunk has its own budget. Drive them from the model, not a second clock, and
  read colours with `useTokenColors()`. No drei or other three.js add-ons without asking.
- Formulas are TeX rendered by `<Formula>` (KaTeX). Mark slider-bound terms with `\htmlClass{live}{…}`.
  Formulas and plots are always LTR, even in Arabic.
- All UI text goes through `t(key)` from `useSettings()`; add the key to **all three** locales in
  `src/i18n/messages.ts`. Arabic strings need review by a native speaker; mark new ones in the PR.
- Use logical CSS (`ms-*`, `me-*`, `start`, `end`, `rtl:` variants), never `left/right` for layout.
- Colours only via tokens (`bg-primary`, `text-muted-foreground`, `stroke-sim-curve-1`, …) defined in
  `src/index.css`. Never raw hex in components, except `text-[#072841]` on the always-light highlight.
- Curves/states never rely on colour alone: add a dash pattern, marker, or text label.
- Respect `prefers-reduced-motion`: no autoplay and no decorative motion. A simulation the user starts with Play still animates (the motion is the content).
- Layout responds to its container (`@container`, `@3xl:` …), so screens work inside the design board.
- House look: white background, square corners (`--radius: 0`), 2px `border-edge`, hard offset
  shadows (`shadow-hard`, `shadow-hard-sm`).
- Don't copy text or figures from CNP textbooks; all content is original.
- Don't add dependencies for a few lines of code. Ask before adding anything heavy (charts, 3D, physics engines).

## Figma

Design tokens mirror the Figma file (collections `Color · Light`, `Color · Dark`, `Sim · *`). The Figma
file is reference only; code is the source of truth once a screen is approved.
