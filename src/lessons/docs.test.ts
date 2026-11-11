import { describe, expect, it } from "vitest";
import { sections } from "@/screens/sections";
import { parseDoc } from "./docs";
import { isReady, lessons } from "./lessons";

const files = import.meta.glob<string>("/content/lessons/*.md", { query: "?raw", import: "default", eager: true });
const docs = Object.entries(files).map(([path, raw]) => ({
  id: path.slice("/content/lessons/".length, -3),
  doc: parseDoc(raw),
}));

describe("parseDoc", () => {
  it("reads the front matter and the first History row", () => {
    const md = [
      "---",
      "id: x",
      "version: 1.1.0",
      "---",
      "| Version | Date | Auteur | Version cible | Modifications |",
      "| --- | --- | --- | --- | --- |",
      "| 1.1.0 | 2026-02-01 | B | 0.3.0 | Ajout du quiz |",
      "| 1.0.0 | 2026-01-01 | A | 0.2.0 | Première version |",
    ].join("\r\n");
    expect(parseDoc(md)).toEqual({
      meta: { id: "x", version: "1.1.0" },
      latest: { version: "1.1.0", date: "2026-02-01", author: "B", target: "0.3.0", changes: "Ajout du quiz" },
    });
  });
  it("rejects a doc without a History row", () => expect(parseDoc("---\nid: x\n---\n")).toBeUndefined());
});

describe.each(docs)("content/lessons/$id.md", ({ id, doc }) => {
  const lesson = lessons.find((l) => l.id === id);
  it("parses and names a chapter from lessons.ts", () => {
    expect(doc?.meta.id).toBe(id);
    expect(lesson).toBeDefined();
  });
  it("lists the same sections as lessons.ts", () => {
    const listed = doc?.meta.sections?.split(",").map((s) => s.trim());
    expect(listed?.every((s) => sections.some((x) => x.slug === s))).toBe(true);
    expect(listed?.toSorted()).toEqual(lesson?.sections.toSorted());
  });
  it("front matter matches the newest History row", () => {
    expect(doc?.meta).toMatchObject({
      version: doc?.latest.version,
      updated: doc?.latest.date,
      author: doc?.latest.author,
      "target-version": doc?.latest.target,
    });
  });
});

it("every built lesson has a doc", () => {
  const ids = docs.map((d) => d.id);
  expect(lessons.filter(isReady).filter((l) => !ids.includes(l.id))).toEqual([]);
});
