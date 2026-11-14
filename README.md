# Bac Visual Lab

Interactive simulations that help Tunisian baccalauréat students **see** maths and physics.
Move a slider, watch the curve change, and see which term of the formula did it.

> Status: **early**. The full 4th-year maths, physics and chemistry catalogue (37 chapters) is listed in
> `src/lessons/lessons.ts`. Two chapters have their simulation (charging a capacitor in an RC circuit, and
> the RL circuit); the others show as "coming soon" until theirs is built. Building them is where help is most welcome.

## Goals

- Intuition first: every lesson is one simulation with sliders, a live formula and 2–3 exam-style questions.
- Built for phones on slow data, and for teachers projecting in class.
- French, English and Arabic (right-to-left) interface. Formulas always read left to right.
- Accessible to everyone who uses it.
- Frontend only. No accounts, no backend; progress stays on the device.

## What works today

- **Lesson catalogue.** Every 4th-year chapter, tagged with the Bac sections that study it
  (Sciences expérimentales, Mathématiques, Sciences techniques, Informatique). Pick a section to see its
  chapters grouped by subject, with search that ignores accents and case.
- **RC circuit lesson.** Sliders for E, R and C, the charging curves of u<sub>C</sub> and u<sub>R</sub>,
  a live formula whose highlighted terms follow the sliders, a top-view schematic and a labelled 3D view of the circuit you can turn and enlarge next to the chart (the
  capacitor fills like a tank, charges flow in the wires and slow down, the resistor glows with u<sub>R</sub>),
  and a 3-question quiz with explanations.
- **RL circuit lesson.** The same anatomy for a coil: current build-up, guided steps, schematic, 3D view and quiz.
- **Progress.** Correct quiz answers are saved in `localStorage` and shown on the home page under
  "Reprendre". Progress and settings never leave the device. The deployed site counts page views with
  Cloudflare Web Analytics (no cookies, no personal data); see `index.html`.
- **Fast and offline.** KaTeX and each simulation load only on the pages that use them (entry chunk
  ~105 kB gzip), and three.js (~240 kB gzip) only when a 3D tab is opened; `pnpm build` fails if a chunk goes over its size budget. Installable as a PWA, and once
  visited the app works with no connection.
- **Accessibility.** Keyboard-operable sliders, a skip link, a text alternative for every chart, WCAG AA
  contrast in both themes, light/dark theme, readable font option, text size S–XL, colour-blind mode and
  `prefers-reduced-motion`. Automated axe checks run on the main pages with the tests.

## Getting started

Requires Node 22.12+; it is developed and checked in CI on Node 26 (`nvm use` reads `.nvmrc`, and so does CI) and [pnpm](https://pnpm.io) 12 (`corepack enable` installs the pinned version).
pnpm refuses packages published less than a day ago (`minimumReleaseAge`); if an install fails on a brand-new release, wait a day rather than turning the check off.

```bash
pnpm install
pnpm dev            # app at http://localhost:3000
```

Open `http://localhost:3000/design` for the design review board (development only): the same page at
phone (390px), tablet (834px) and projector (1440px) widths side by side.

| Script         | What it does                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm dev`     | Vite dev server                                                                                    |
| `pnpm build`   | Type-check, prerender every page to static HTML in `dist/` (with sitemap), then the size budget    |
| `pnpm preview` | Serve the production build (use it to test offline mode)                                           |
| `pnpm test`    | Unit and accessibility tests (Vitest, axe-core in jsdom), with coverage floors in `vite.config.ts` |
| `pnpm lint`    | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                                   |
| `pnpm format`  | [oxfmt](https://oxc.rs/docs/guide/usage/formatter) (Prettier-compatible)                           |
| `pnpm check`   | Everything CI runs on each pull request: types, lint, format check, tests                          |

## Stack

Vite 8 (Rolldown) · React 19.3 (stable `<ViewTransition>`) with the [React Compiler](https://react.dev/learn/react-compiler) · TypeScript 7 (strict) · [TanStack Router](https://tanstack.com/router) (file-based) · Tailwind CSS v4 · [shadcn/ui](https://ui.shadcn.com) (Radix) ·
KaTeX · three.js with React Three Fiber · lucide icons · vite-plugin-pwa · self-hosted fonts (Readex Pro, Noto Sans Arabic, Atkinson Hyperlegible Next).

## Project layout

```
src/
  routes/{-$locale}/     file-based routes, French bare, /en and /ar prefixed: / (landing), /app, /app/sections/$section, /app/lessons/$lessonId
  routes/design.tsx      /design, the review board (dev only)
  seo.ts                 locale URLs, page titles, canonical/hreflang/Open Graph tags, sitemap
  entry-server.tsx       renders one page to HTML at build time (scripts/prerender.ts writes the files)
  routeTree.gen.ts       generated by the router plugin, do not edit
  site.ts                site name and canonical URL, author name, repository URL
  index.css              design tokens (CSS variables) + Tailwind theme
  i18n/messages.ts       shared UI strings for fr / en / ar (each lesson's own text is in its sims/ folder)
  settings/              display settings (locale, theme, font, size, colour-blind) → <html> attributes
  components/ui/         shadcn components (restyled: square corners, hard shadows)
  components/            app components: Formula, ParamSlider, SimStage, FormulaPanel, Scene3D, Quiz, AppBar
  lessons/               lessons.ts (the chapter catalogue) + progress.ts (quiz progress in localStorage)
  sims/<simulation>/     one folder per simulation: model.ts (pure, unit-tested), view, scene-3d.tsx, quiz.ts
  screens/               Home, Chapters, Lesson; sections.ts (Bac sections, kept small for route loaders)
  a11y.test.tsx          axe checks on the main pages
scripts/bundle-budget.mjs  gzip size limits per chunk, run by `pnpm build`
docs/                    design notes and decisions
```

Each simulation is split into a **pure model** (numbers in, numbers out, unit-tested against known
solutions), a **renderer**, a **formula panel** and, optionally, a **3D view** driven by the same model. See [docs/design.md](docs/design.md).

## Deploying

The build in `dist/` is static HTML, one file per page and language (`/app` → `app.html`, `/en/app` →
`en/app.html`), plus `404.html`, `sitemap.xml` and `robots.txt`. The site is deployed as Cloudflare Workers
static assets (`wrangler.jsonc`). On another host, serve it as plain static files with extensionless URLs
and **no** SPA fallback, so unknown paths get `404.html` with a real 404 status. Set the production origin in `site.url` (`src/site.ts`): canonical
links, hreflang and the sitemap use it. Serve over HTTPS so the service worker (offline mode) registers.

## Contributing

Contributions are welcome, especially from teachers. Repository: <https://github.com/MohamedAmineBoufares/bac-visual-lab>.
Read [CONTRIBUTING.md](CONTRIBUTING.md) first: it covers branch names, checks, and how pull requests are
reviewed (by the maintainer and by an AI agent). Physics and maths must be correct; every model needs
tests against a known result.

## Content and copyright

Chapters follow the official Tunisian programmes, but all explanations, wording and illustrations are
original. Do not copy text or figures from CNP textbooks or other copyrighted sources.

## License

[MIT](LICENSE) © 2026 Mohamed Amine Boufares.
