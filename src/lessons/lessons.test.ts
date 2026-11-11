import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";

describe("lesson catalogue", () => {
  it("has unique ids and at least one section per chapter", () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of lessons) expect(l.sections).not.toHaveLength(0);
  });

  it("only asks quiz questions whose answer is one of the options", () => {
    for (const l of lessons) for (const q of l.ready?.quiz ?? []) expect(q.options).toContain(q.answer);
  });
});
