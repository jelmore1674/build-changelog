import { describe, expect, test } from "vitest";
import { formatCommitSha } from "./";

const sha = "3c20f6dc679fbece838d9828bd8391d5d371ac63";

describe("formatCommitSha", () => {
  test("Will return the commit hash link", () => {
    const expectedResult =
      "[`3c20f6d`](https://github.com/jelmore1674/build-changelog/commit/3c20f6dc679fbece838d9828bd8391d5d371ac63)";
    expect(formatCommitSha(sha)).toBe(expectedResult);
  });
});
