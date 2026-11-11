import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";

// shortcut: one hard-coded question for the design prototype; real quizzes come from simulation metadata.
const question = { prompt: "q1", options: ["q1a", "q1b", "q1c"], answer: "q1b" } satisfies {
  prompt: MessageKey;
  options: MessageKey[];
  answer: MessageKey;
};

export function Quiz() {
  const { t } = useSettings();
  const [choice, setChoice] = useState<string>("");
  const [checked, setChecked] = useState(false);
  return (
    <section className="flex flex-col gap-3 border-2 border-foreground bg-card p-4 shadow-hard">
      <header className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{t("quiz")} · 1/3</h3>
      </header>
      <p>{t(question.prompt)}</p>
      <RadioGroup value={choice} onValueChange={(v) => (setChoice(v), setChecked(false))} className="gap-2">
        {question.options.map((key) => {
          const state =
            !checked || choice !== key
              ? choice === key
                ? "selected"
                : "idle"
              : key === question.answer
                ? "correct"
                : "wrong";
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
      <Button className="self-start" disabled={!choice} onClick={() => setChecked(true)}>
        {t("check")}
      </Button>
    </section>
  );
}
