# Building a lesson from its doc

Instructions for the developer or AI agent turning `content/lessons/<id>.md` (status `accepted`) into a
simulation. Read [AGENTS.md](../AGENTS.md) first; its rules apply. `rc-charging` is the reference: compare
[its doc](lessons/rc-charging.md) with `src/sims/rc-charging/`.

The doc is the spec. Where it is ambiguous or the physics looks wrong, stop and ask in the pull request
instead of guessing.

## Steps

1. **Model** (`src/sims/<id>/model.ts`): pure functions for every formula in "Formules", in the doc's units.
   Steps in "Étapes commentées" become a phase function like `phase()` in the RC model.
2. **Tests** (`src/sims/<id>/model.test.ts`): one test per row of "Valeurs de référence", using the doc's
   numbers.
3. **Strings**: the title and chapter in `src/i18n/messages.ts`; slider labels, step explanations and quiz
   text in `src/sims/<id>/messages.ts`. All three locales in both. The French text comes from the doc; translate to English and Arabic, and list the Arabic strings
   in the pull request for native review.
4. **Quiz** (`src/sims/<id>/quiz.ts`): the doc's questions, keyed by message keys.
5. **Simulation** (`src/sims/<id>/<id>.tsx`): one `ParamSlider` per row of "Ce que l'élève règle" (same
   min, max, step and initial value), `SimStage`/`Series` for the curves, `FormulaPanel` with the
   slider-bound terms wrapped in `\htmlClass{live}{…}`, and the `Quiz`.
6. **Circuit views**, if the doc has a "Vue 3D" section. Both live in a "Circuit" tab next to "Formule", with a
   "Vue de dessus / 3D" toggle and the enlarge button (see `src/sims/rc-charging/rc-charging.tsx`):
   - **Top view** (`schematic.tsx`, the default): an SVG schematic of the same objects. Each one fills with
     the quantity in its "Change avec" column, with the value and percentage written beside it.
   - **3D** (`scene-3d.tsx`): one object per row of the table, inside `<Scene3D summary=… labels=…>` from
     `@/components/scene-3d`, with a label per object, lazy-loaded so three.js only downloads when the
     student picks 3D. Sizes and motion come from the model functions, never a separate
     clock; put the layout maths in a pure `scene-layout.ts` with a test. Colours come from
     `useTokenColors()`, and shape or size must tell objects apart without colour.
7. **Catalogue** (`src/lessons/lessons.ts`): replace the `soon(...)` entry with a full one with `ready`
   (lazy `Sim`, `quiz`, `thumb`). Its `sections` must equal the doc's `sections`.
8. **Doc**: set `status: built`, bump `version`, add a History row (newest first) and copy it to the front
   matter.
9. `pnpm check` must pass. It also checks every doc against the catalogue (`src/lessons/docs.test.ts`).
