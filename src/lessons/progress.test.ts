import { describe, expect, it } from "vitest";
import { parseProgress, withCorrect } from "./progress";

describe("parseProgress", () => {
  it("reads valid progress", () => {
    expect(parseProgress('{"rc-charging":[0,2]}')).toEqual({ "rc-charging": [0, 2] });
  });

  it("returns empty progress for missing or broken storage", () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress("not json")).toEqual({});
    expect(parseProgress("[1,2]")).toEqual({});
    expect(parseProgress("null")).toEqual({});
  });

  it("drops entries that are not lists of question indices", () => {
    expect(parseProgress('{"a":[0],"b":"x","c":[-1],"d":[1.5],"e":["0"]}')).toEqual({ a: [0] });
  });
});

describe("withCorrect", () => {
  it("adds a question once, sorted", () => {
    const p = withCorrect(withCorrect({}, "rc", 2), "rc", 0);
    expect(p).toEqual({ rc: [0, 2] });
    expect(withCorrect(p, "rc", 2)).toBe(p);
  });
});
