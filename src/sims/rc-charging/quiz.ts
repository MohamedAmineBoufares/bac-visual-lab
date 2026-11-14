import type { RcKey } from "./messages";
import type { Question } from "@/lessons/lessons";

export const rcQuiz: Question<RcKey>[] = [
  { prompt: "q1", options: ["q1a", "q1b", "q1c"], answer: "q1b", explain: "q1x" },
  { prompt: "q2", options: ["q2a", "q2b", "q2c"], answer: "q2b", explain: "q2x" },
  { prompt: "q3", options: ["q3a", "q3b", "q3c"], answer: "q3c", explain: "q3x" },
];
