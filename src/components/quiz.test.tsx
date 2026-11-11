// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Quiz } from "@/components/quiz";
import { rcQuiz } from "@/sims/rc-charging/quiz";
import { byText, fr, press, render } from "@/test/render";

const option = (root: ParentNode, text: string) =>
  byText(root, text)[0]?.closest("label")?.querySelector('[role="radio"]');
const button = (root: ParentNode, text: string) =>
  [...root.querySelectorAll("button")].find((b) => b.textContent?.trim() === text);
const saved = () => JSON.parse(localStorage.getItem("bvl.progress") ?? "{}");

describe("Quiz", () => {
  it("only checks once an option is picked", async () => {
    const root = await render(<Quiz lessonId="quiz-a" questions={rcQuiz} />);
    expect(button(root, fr.check)?.disabled).toBe(true);
    await press(option(root, fr.q1a));
    expect(button(root, fr.check)?.disabled).toBe(false);
  });

  it("a wrong answer shows the explanation and saves nothing", async () => {
    const root = await render(<Quiz lessonId="quiz-b" questions={rcQuiz} />);
    await press(option(root, fr.q1a));
    await press(button(root, fr.check));
    expect(byText(root, fr.wrong)).not.toEqual([]);
    expect(byText(root, fr.correct)).not.toEqual([]); // the right option is revealed
    expect(root.querySelector('[role="status"]')?.textContent).toBe(fr.q1x);
    expect(saved()["quiz-b"]).toBeUndefined();
  });

  it("a right answer is saved, then the quiz moves on and restarts after the last question", async () => {
    const root = await render(<Quiz lessonId="quiz-c" questions={rcQuiz} />);
    await press(option(root, fr.q1b));
    await press(button(root, fr.check));
    expect(byText(root, fr.wrong)).toEqual([]);
    expect(saved()["quiz-c"]).toEqual([0]);

    await press(button(root, fr.next));
    expect(root.textContent).toContain("2/3");
    expect(button(root, fr.check)?.disabled).toBe(true); // choice was cleared
    await press(option(root, fr.q2b));
    await press(button(root, fr.check));
    await press(button(root, fr.next));
    await press(option(root, fr.q3c));
    await press(button(root, fr.check));
    expect(saved()["quiz-c"]).toEqual([0, 1, 2]);

    expect(button(root, fr.next)).toBeUndefined();
    await press(button(root, fr.reset));
    expect(root.textContent).toContain("1/3");
  });

  it("renders nothing without questions", async () => {
    const root = await render(<Quiz lessonId="quiz-d" questions={[]} />);
    expect(root.innerHTML).toBe("");
  });
});
