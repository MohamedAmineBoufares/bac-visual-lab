import { site } from "@/site";

/** One row of a lesson doc's History table. */
export type DocRevision = { version: string; date: string; author: string; target: string; changes: string };

export type LessonDoc = {
  /** Front matter as plain strings (`sections` stays comma-separated). */
  meta: Record<string, string>;
  /** The first History row, which the template keeps newest. */
  latest: DocRevision;
  url?: string;
};

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

/** Parses the front matter and the newest History row of `content/lessons/<id>.md`. */
export const parseDoc = (md: string): Omit<LessonDoc, "url"> | undefined => {
  const text = md.replace(/\r\n/g, "\n");
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1];
  if (!front) return undefined;
  const meta = Object.fromEntries(
    front.split("\n").flatMap((line) => {
      const i = line.indexOf(":");
      return i > 0 ? [[line.slice(0, i).trim(), line.slice(i + 1).trim()]] : [];
    }),
  );
  // The History table is the first one whose header starts with "Version"; row 0 is the |---| line.
  const lines = text.split("\n");
  const head = lines.findIndex((l) => /^\|\s*Version\s*\|/.test(l));
  const row = head < 0 ? undefined : lines[head + 2];
  if (!row?.startsWith("|")) return undefined;
  const [version, date, author, target, changes] = cells(row);
  if (!version || !date || !author || !target || !changes) return undefined;
  return { meta, latest: { version, date, author, target, changes } };
};

const files = import.meta.glob<string>("/content/lessons/*.md", { query: "?raw", import: "default" });

export const docPath = (id: string) => `content/lessons/${id}.md`;

/** The lesson's doc, loaded as its own chunk; undefined when the lesson has none yet. */
export const loadDoc = async (id: string): Promise<LessonDoc | undefined> => {
  const raw = await files[`/${docPath(id)}`]?.();
  const doc = raw === undefined ? undefined : parseDoc(raw);
  if (!doc) return undefined;
  return site.repoUrl ? { ...doc, url: `${site.repoUrl}/blob/main/${docPath(id)}` } : doc;
};
