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
3. **Strings** (`src/i18n/messages.ts`): titles, slider labels, step explanations and quiz text in all three
   locales. The French text comes from the doc; translate to English and Arabic, and list the Arabic strings
   in the pull request for native review.
4. **Quiz** (`src/sims/<id>/quiz.ts`): the doc's questions, keyed by message keys.
5. **Simulation** (`src/sims/<id>/<id>.tsx`): one `ParamSlider` per row of "Ce que l'élève règle" (same
   min, max, step and initial value), `SimStage`/`Series` for the curves, `FormulaPanel` with the
   slider-bound terms wrapped in `\htmlClass{live}{…}`, and the `Quiz`.
6. **Catalogue** (`src/lessons/lessons.ts`): replace the `soon(...)` entry with a full one with `ready`
   (lazy `Sim`, `quiz`, `thumb`). Its `sections` must equal the doc's `sections`.
7. **Doc**: set `status: built`, bump `version`, add a History row (newest first) and copy it to the front
   matter.
8. `pnpm check` must pass. It also checks every doc against the catalogue (`src/lessons/docs.test.ts`).
