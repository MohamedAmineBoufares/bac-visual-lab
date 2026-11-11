# Contributing

Thanks for helping. Teachers, students and developers are all welcome.

## Ways to help

- **Teachers:** review a simulation for correctness, suggest exam-style questions, flag chapters that
  matter most for the Bac.
- **Translators:** review Arabic and French UI strings in `src/i18n/messages.ts`.
- **Developers:** see [AGENTS.md](AGENTS.md) for conventions; they apply to humans too.

## Workflow

1. Open an issue first for anything bigger than a small fix.
2. Branch from `main`, keep changes focused.
3. Run `pnpm check` (types, lint, format, tests). It must pass.
4. For a new or changed simulation model, include unit tests against a known solution and say where the
   reference result comes from.
5. Open a pull request describing what changed and how you checked it (screenshots for UI changes,
   including Arabic/RTL and phone width).

## Adding a lesson

1. Create `src/sims/<name>/` with `model.ts` (+ tests), the view component and `quiz.ts`.
2. Add the strings (title, chapter, questions, explanations) to all three locales in
   `src/i18n/messages.ts`.
3. In `src/lessons/lessons.ts`, turn the chapter's `soon(...)` entry into a full entry with `ready`
   (card thumbnail, view, quiz). It then opens from the home and section pages.

**Teachers:** the chapter list and which sections study each chapter were written from the 4th-year
programmes as we know them. Corrections are very welcome.

## Content rules

- All explanations, wording and figures must be original. Don't copy from textbooks or exam sites.
- Exam papers may be used to decide which chapters and formulas matter, not as content.
