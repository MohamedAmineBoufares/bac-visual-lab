# Contributing

Thanks for helping. Teachers, students and developers are all welcome.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report security problems privately, see [SECURITY.md](SECURITY.md).

## Ways to help

- **Teachers:** propose or improve a lesson with a lesson doc, no code needed: see
  [content/README.md](content/README.md). You can also review a simulation for correctness, suggest exam-style questions, flag chapters that
  matter most for the Bac.
- **Translators:** review Arabic and French UI strings in `src/i18n/messages.ts`, or report a wrong text with the
  [translation form](https://github.com/MohamedAmineBoufares/bac-visual-lab/issues/new?template=translation.yml).
- **Developers:** build a simulation for one of the chapters marked "coming soon", or fix a bug. See
  [AGENTS.md](AGENTS.md) for conventions; they apply to humans too.

## Workflow

1. Open an issue first for anything bigger than a small fix, so we can agree on the approach.
2. Fork the repository (or clone it if you have write access) and create a branch from an up-to-date
   `main` (see [Branches](#branches)). Never commit to `main` directly.
3. Keep each branch to one change: one feature or one fix.
4. Run `pnpm check` (types, lint, format, unit and accessibility tests, coverage floors). It must pass. For changes that
   affect loading or bundle size, also run `pnpm build`; it fails if a chunk goes over its size budget.
5. For a new or changed simulation model, include unit tests against a known solution and say where the
   reference result comes from.
6. Open a pull request against `main` (see [Pull requests](#pull-requests)).

## Branches

Name the branch after the kind of change, then a short description in kebab-case:

| Prefix  | Use it for                                         | Example                      |
| ------- | -------------------------------------------------- | ---------------------------- |
| `feat/` | A new feature: a simulation, a screen, an option   | `feat/rl-circuit-simulation` |
| `fix/`  | A bug fix: wrong result, broken layout, a11y issue | `fix/rtl-slider-direction`   |

```bash
git switch main
git pull
git switch -c feat/rl-circuit-simulation
```

For anything else (documentation, tooling, dependency updates) use `docs/` or `chore/` the same way.
If the branch closes an issue, you can add its number: `fix/42-quiz-reset`.

Start commit messages with the same word, followed by a short summary in the imperative:
`feat: add RL circuit simulation`, `fix: keep slider direction in Arabic`.

## Pull requests

Start the title with `feat:`, `fix:`, `docs:` or `chore:` and a short summary, like a commit message
(`fix: keep slider direction in Arabic`); a check fails otherwise. Pull requests are squash-merged and the
title becomes the commit on `main`.

Describe what changed and how you checked it. For UI changes add screenshots, including Arabic (RTL)
and phone width. List any new Arabic strings so a native speaker can review them.

**Every pull request is reviewed twice:**

- **By an AI agent**, which checks the code against the project rules in [AGENTS.md](AGENTS.md), looks
  for bugs, and comments on the pull request. Its comments are suggestions: answer or fix them, and say
  so if you think one is wrong.
- **By the maintainer** ([Mohamed Amine Boufares](https://github.com/MohamedAmineBoufares)), who reads
  the change, checks the physics or maths, and decides whether to merge.

A pull request is merged only after the maintainer approves it and `pnpm check` passes.

## Adding a lesson

1. Create `src/sims/<name>/` with `model.ts` (+ tests), the view component and `quiz.ts`.
2. Add the strings (title, chapter, questions, explanations) to all three locales in
   `src/i18n/messages.ts`.
3. In `src/lessons/lessons.ts`, turn the chapter's `soon(...)` entry into a full entry with `ready`
   (card thumbnail, view, quiz). Load the view with `lazy()` like the RC lesson, so it stays out of the
   first download. It then opens from the home and section pages.

**Teachers:** the chapter list and which sections study each chapter were written from the 4th-year
programmes as we know them. Corrections are very welcome.

## Content rules

- All explanations, wording and figures must be original. Don't copy from textbooks or exam sites.
- Exam papers may be used to decide which chapters and formulas matter, not as content.
