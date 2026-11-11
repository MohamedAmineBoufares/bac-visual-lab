import { type ComponentType, lazy } from "react";
import type { MessageKey } from "@/i18n/messages";
import type { Section } from "@/screens/sections";
import { rcQuiz } from "@/sims/rc-charging/quiz";

export type Question = { prompt: MessageKey; options: MessageKey[]; answer: MessageKey; explain: MessageKey };

export type Lesson = {
  id: string;
  subject: "physics" | "chemistry" | "math";
  /** Bac sections whose 4th-year programme includes this chapter. */
  sections: Section["slug"][];
  title: MessageKey;
  /** Chapter or theme shown under the title. */
  chapter: MessageKey;
  level: MessageKey;
  /** Set once the simulation exists; without it the chapter shows as "coming soon". */
  ready?: {
    /** SVG path (viewBox -10 -6 220 90) drawn on the lesson card. */
    thumb: string;
    Sim: ComponentType;
    quiz: Question[];
  };
};

export type ReadyLesson = Lesson & { ready: NonNullable<Lesson["ready"]> };

const E = "sciences-experimentales";
const M = "mathematiques";
const T = "sciences-techniques";
const I = "informatique";

const soon = (
  id: string,
  subject: Lesson["subject"],
  sections: Lesson["sections"],
  title: MessageKey,
  chapter: MessageKey,
): Lesson => ({ id, subject, sections, title, chapter, level: "level4" });

/**
 * The 4th-year (Bac) maths and physical sciences (physics, chemistry) programmes, one entry per chapter.
 * Section lists follow the official programmes as we know them; a teacher's review is welcome (see CONTRIBUTING.md).
 */
export const lessons: Lesson[] = [
  {
    id: "rc-charging",
    subject: "physics",
    sections: [E, M, T],
    title: "rcTitle",
    chapter: "rcChapter",
    level: "level4",
    ready: {
      thumb: "M0 70 C 40 20 90 8 200 4",
      Sim: lazy(() => import("@/sims/rc-charging/rc-charging").then((m) => ({ default: m.RcCharging }))),
      quiz: rcQuiz,
    },
  },
  soon("rl-circuit", "physics", [E, M, T], "tRl", "thElec"),
  soon("rlc-free", "physics", [E, M, T], "tRlcFree", "thElec"),
  soon("rlc-forced", "physics", [E, M, T], "tRlcForced", "thElec"),
  soon("filters", "physics", [M, T], "tFilters", "thElec"),
  soon("mech-free", "physics", [E, M, T], "tMechFree", "thMech"),
  soon("mech-forced", "physics", [M, T], "tMechForced", "thMech"),
  soon("mechanical-waves", "physics", [E, M, T], "tWaves", "thWaves"),
  soon("light-diffraction", "physics", [E, M, T], "tLight", "thWaves"),
  soon("atomic-spectrum", "physics", [E, M, T], "tAtom", "thAtom"),
  soon("nuclear-reactions", "physics", [E, M, T], "tNuclear", "thAtom"),

  soon("reaction-kinetics", "chemistry", [E, M, T], "tKinetics", "thEvolution"),
  soon("chemical-equilibrium", "chemistry", [E, M, T], "tEquilibrium", "thEvolution"),
  soon("mass-action", "chemistry", [E, M], "tMassAction", "thEvolution"),
  soon("ph", "chemistry", [E, M, T], "tPh", "thAcidBase"),
  soon("acid-base-titration", "chemistry", [E, M, T], "tTitration", "thAcidBase"),
  soon("electrochemical-cells", "chemistry", [E, M, T], "tCells", "thElectrochem"),
  soon("electrolysis", "chemistry", [E, M], "tElectrolysis", "thElectrochem"),
  soon("esterification", "chemistry", [E, M], "tEster", "thOrganic"),
  soon("amides", "chemistry", [E], "tAmides", "thOrganic"),

  soon("limits-continuity", "math", [E, M, T, I], "tLimits", "thAnalysis"),
  soon("differentiability", "math", [E, M, T, I], "tDeriv", "thAnalysis"),
  soon("sequences", "math", [E, M, T, I], "tSequences", "thAnalysis"),
  soon("inverse-functions", "math", [M, T], "tInverse", "thAnalysis"),
  soon("antiderivatives", "math", [E, M, T, I], "tPrimitives", "thAnalysis"),
  soon("integration", "math", [E, M, T, I], "tIntegrals", "thAnalysis"),
  soon("logarithm", "math", [E, M, T, I], "tLog", "thAnalysis"),
  soon("exponential", "math", [E, M, T, I], "tExp", "thAnalysis"),
  soon("differential-equations", "math", [E, M, T], "tDiffEq", "thAnalysis"),
  soon("complex-numbers", "math", [E, M, T, I], "tComplex", "thAlgebra"),
  soon("arithmetic", "math", [M, I], "tArith", "thAlgebra"),
  soon("solid-geometry", "math", [E, M, T, I], "tSpace", "thGeometry"),
  soon("isometries", "math", [M], "tIsom", "thGeometry"),
  soon("similarities", "math", [M], "tSimil", "thGeometry"),
  soon("conics", "math", [M], "tConics", "thGeometry"),
  soon("probability", "math", [E, M, T, I], "tProba", "thProba"),
  soon("bivariate-statistics", "math", [E, T, I], "tStats", "thProba"),
];

export const isReady = (l: Lesson): l is ReadyLesson => l.ready !== undefined;

/** Only lessons with a simulation have a page. */
export const findLesson = (id: string): ReadyLesson | undefined => lessons.filter(isReady).find((l) => l.id === id);
