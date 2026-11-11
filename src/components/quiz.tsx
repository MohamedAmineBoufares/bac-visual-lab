import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/lessons/lessons";
import { recordCorrect } from "@/lessons/progress";
import { cn } from "@/lib/utils";
import { useSettings } from "@/settings/settings";

/** One question at a time; a correct answer is saved to the lesson's progress. */
export function Quiz({ lessonId, questions }: { lessonId: string; questions: Question[] }) {
  const { t } = useSettings();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const question = questions[index];
  if (!question) return null;
  const last = index === questions.length - 1;

  const check = () => {
    setChecked(true);
    if (choice === question.answer) recordCorrect(lessonId, index);
  };
  const goTo = (i: number) => {
    setIndex(i);
    setChoice("");
    setChecked(false);
  };

  return (
    <section className="flex flex-col gap-3 border-2 border-foreground bg-card p-4 shadow-hard">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">
          {t("quiz")} ·{" "}
          <span className="tabular-nums">
            {index + 1}/{questions.length}
          </span>
        </h2>
      </header>
      <p>{t(question.prompt)}</p>
      <RadioGroup
        value={choice}
        onValueChange={(v) => (setChoice(v), setChecked(false))}
        className="gap-2"
        aria-label={t(question.prompt)}
      >
        {question.options.map((key) => {
          const state = !checked
            ? choice === key
              ? "selected"
              : "idle"
            : key === question.answer
              ? "correct"
              : choice === key
                ? "wrong"
                : "idle";
          return (
            <label
              key={key}
              className={cn(
                "flex cursor-pointer items-center gap-3 border-2 p-3",
                state === "idle" && "border-foreground/30",
                state === "selected" && "border-primary shadow-hard-sm",
                state === "correct" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
              )}
            >
              <RadioGroupItem value={key} />
              <span className="flex-1">{t(key)}</span>
              {state === "correct" && (
                <span className="flex items-center gap-1 text-sm font-semibold text-success">
                  <Check className="size-4" />
                  {t("correct")}
                </span>
              )}
              {state === "wrong" && (
                <span className="flex items-center gap-1 text-sm font-semibold text-destructive">
                  <X className="size-4" />
                  {t("wrong")}
                </span>
              )}
            </label>
          );
        })}
      </RadioGroup>
      <p role="status" className="text-sm text-muted-foreground empty:hidden">
        {checked && t(question.explain)}
      </p>
      {checked ? (
        <Button className="self-start" onClick={() => goTo(last ? 0 : index + 1)}>
          {t(last ? "reset" : "next")}
        </Button>
      ) : (
        <Button className="self-start" disabled={!choice} onClick={check}>
          {t("check")}
        </Button>
      )}
    </section>
  );
}
