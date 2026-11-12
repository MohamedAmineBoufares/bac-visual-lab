import { useSyncExternalStore } from "react";

/** Per lesson: indices of the quiz questions answered correctly at least once. */
export type Progress = Record<string, number[]>;

const storageKey = "bvl.progress";

/** Storage is user-editable, so anything that is not a list of question indices is dropped. */
export const parseProgress = (raw: string | null): Progress => {
  let data: unknown;
  try {
    data = JSON.parse(raw ?? "{}");
  } catch {
    return {};
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  const progress: Progress = {};
  for (const [id, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.every((i) => Number.isInteger(i) && i >= 0)) progress[id] = value;
  }
  return progress;
};

export const withCorrect = (progress: Progress, lessonId: string, index: number): Progress => {
  const done = progress[lessonId] ?? [];
  return done.includes(index) ? progress : { ...progress, [lessonId]: [...done, index].toSorted((a, b) => a - b) };
};

const readStorage = () => {
  if (typeof window === "undefined") return null; // prerendering in Node, see settings.tsx
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null; // storage blocked (private mode): progress lives in memory for this visit
  }
};

// Memory is the source of truth while the page is open; storage only persists it and syncs other tabs.
let state = parseProgress(readStorage());
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== storageKey) return;
    state = parseProgress(e.newValue);
    onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const recordCorrect = (lessonId: string, index: number) => {
  const next = withCorrect(state, lessonId, index);
  if (next === state) return;
  state = next;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // storage blocked or full: keep the in-memory progress
  }
  listeners.forEach((l) => l());
};

// The prerendered page (and the hydration pass over it) shows no progress; the stored one follows at once.
const none: Progress = {};
export const useProgress = (): Progress =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => none,
  );
