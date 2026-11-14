# Design notes

Decisions agreed so far (November 2026). The design is reviewed as live code at `/design` (dev only).

## Product

- Audience: Tunisian lycée students preparing the Bac (all four sections: Sciences expérimentales,
  Mathématiques, Sciences techniques, Informatique) and their teachers.
- One lesson = one simulation + live formula panel + 2–3 exam-style questions.
- A simulation is tagged to several sections/levels instead of being duplicated.
- Frontend only. No accounts; progress is stored locally.

## Visual direction: "Méditerranée", boxy

- White background, deep navy (`#072841`) text and 2px borders, square corners, hard offset shadows.
- Sidi Bou Said blue (`--primary`), terracotta (`--accent`), saffron highlight (`--sim-highlight`).
- The saffron highlight links a slider's value badge to the matching term in the formula.
- Dark theme uses a warm charcoal palette with soft `border-edge` lines and black shadows; the logo keeps its `brand` colours in both themes. All text pairs meet WCAG AA (≥ 4.5:1); curves and points ≥ 3:1
  against the canvas, in every theme, including colour-blind mode.

## Display settings (stored on the device)

| Setting      | Values                                                                         | Mechanism                         |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------- |
| Language     | FR, EN, AR                                                                     | `lang`, `dir` on `<html>`         |
| Theme        | light, dark                                                                    | `data-theme`                      |
| Font         | default (Readex Pro + Noto Sans Arabic), readable (Atkinson Hyperlegible Next) | `data-font`                       |
| Text size    | S, M, L, XL                                                                    | `data-size` scales root font size |
| Colour-blind | on/off (Okabe-Ito palette)                                                     | `data-cb`, sim colours only       |

Curves are never distinguished by colour alone: each has a dash pattern and a direct label.

## Routes

| Path                     | Page                                                  |
| ------------------------ | ----------------------------------------------------- |
| `/`                      | Landing: what it is, how it works, contribute, footer |
| `/app`                   | App home: sections, continue                          |
| `/app/sections/$section` | Chapters of a section                                 |
| `/app/lessons/$lessonId` | One simulation lesson                                 |
| `/design`                | Design review board, development only                 |

Every page except `/design` also exists in English and Arabic under `/en` and `/ar` (`/en/app`,
`/ar/app/lessons/rc-charging`); French, the language of the Bac, keeps the bare paths. The URL decides
the language, so search engines can index all three (hreflang links tie them together), and the language
switch navigates to the same page in the other language.

## Data

No database. Lesson content and metadata are TypeScript modules, so they are type-checked, tree-shaken
and code-split per route. Progress and settings are a few KB in `localStorage`. SQLite in the browser
(WASM, ~1 MB) would cost more data than it saves for students on limited mobile plans.

## Simulation anatomy

```
model.ts      pure functions, unit-tested against known solutions
messages.ts   the lesson's own text in fr / en / ar, loaded with the simulation
<Sim>.tsx     sliders, formula and model, inside SimShell (clock, transport bar, guided notes, layout):
  SimStage      SVG plot, always LTR, transport bar (play, reset, speed, time)
  ParamSlider   symbol, label, value badge, min/max; keyboard-operable (Radix Slider)
  FormulaPanel  KaTeX formula with live terms, substituted numbers, legend readout
  Scene3D       optional three.js view of the setup, lazy-loaded; sizes and motion follow the model
  Quiz          exam-style question with checked feedback (text + colour)
```

Layout uses container queries: narrow = stage + tabs (Paramètres / Formule / Circuit / Quiz); wide = stage and
a Formule / Circuit tab panel side by side, sliders and quiz below. The enlarge button makes the two columns
equal. Circuit switches between a top-view SVG schematic (default) and the 3D view.

## Open decisions

- The other five simulations for the first vertical slice (verify chapters against the official CNP programme).
- Primary language default (currently French).
