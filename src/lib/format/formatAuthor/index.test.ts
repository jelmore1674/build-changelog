import { describe, expect, test } from "vitest";
import { formatAuthor } from "./";

describe("formatAuthor", () => {
  test("Will return the author link", () => {
    const expectedResult = "[justin](https://github.com/jelmore1674)";
    expect(formatAuthor({ name: "justin", url: "https://github.com/jelmore1674" })).toBe(
      expectedResult,
    );
  });

  test("Will return dependabot", () => {
    const expectedResult = "[dependabot](https://github.com/apps/dependabot)";
    expect(formatAuthor({ name: "dependabot", url: "https://github.com/apps/dependabot" })).toBe(
      expectedResult,
    );
  });
});
