import { describe, expect, test } from "vitest";
import { formatAuthor } from "./";

describe("formatAuthor", () => {
  test("Will return the author link", () => {
    const expectedResult = "[justin](https://github.com/jelmore1674)";
    expect(formatAuthor("justin")).toBe(expectedResult);
  });

  test("Will return dependabot", () => {
    const expectedResult = "[dependabot](https://github.com/apps/dependabot)";
    expect(formatAuthor("dependabot")).toBe(expectedResult);
  });
});
