import { describe, expect, test } from "vitest";
import { formatReferences } from "./";

describe("formatReferences", () => {
  test("Can format issue references", () => {
    const refs = [
      { type: "issue", number: 1 },
      { type: "issue", number: 2 },
    ];

    const expectedResult =
      "[#1](https://github.com/jelmore1674/build-changelog/issues/1), [#2](https://github.com/jelmore1674/build-changelog/issues/2)";

    const result = formatReferences(refs);

    expect(result.split(", ")).toHaveLength(2);
    expect(result).toBe(expectedResult);
  });

  test("Can format pull_request references", () => {
    const refs = [
      { type: "pull_request", number: 1 },
      { type: "pull_request", number: 2 },
    ];

    const expectedResult =
      "[#1](https://github.com/jelmore1674/build-changelog/pull/1), [#2](https://github.com/jelmore1674/build-changelog/pull/2)";

    const result = formatReferences(refs);

    expect(result.split(", ")).toHaveLength(2);
    expect(result).toBe(expectedResult);
  });

  test("Can format pull_request and issue references in same array", () => {
    const refs = [
      { type: "issue", number: 1 },
      { type: "pull_request", number: 2 },
    ];

    const expectedResult =
      "[#1](https://github.com/jelmore1674/build-changelog/issues/1), [#2](https://github.com/jelmore1674/build-changelog/pull/2)";

    const result = formatReferences(refs);

    expect(result.split(", ")).toHaveLength(2);
    expect(result).toBe(expectedResult);
  });

  test("Will return empty string with no references", () => {
    expect(formatReferences([])).toBe("");
  });
});
