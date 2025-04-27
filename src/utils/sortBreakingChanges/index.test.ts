import type { Version } from "@jelmore1674/changelog";
import { describe, expect, test } from "vitest";
import { sortBreakingChanges } from "./";

const config = {
  flags: {
    breaking: "breaking",
  },
};

describe("sortBreakingChanges", () => {
  test("Can put breaking changes at the top of the section", () => {
    const version: Version = {
      version: "1.0.0",
      added: [
        "The first change.",
        "That second change.",
        "This third change.",
        "breaking - this is a breaking change",
        "The fourth change.",
      ],
    };

    const expected = [
      "breaking - this is a breaking change",
      "The first change.",
      "That second change.",
      "This third change.",
      "The fourth change.",
    ];

    const result = sortBreakingChanges(version, config);
    expect(result.added).toStrictEqual(expected);
  });

  test("Can put multiple breaking changes at the top of the section", () => {
    const version: Version = {
      version: "1.0.0",
      added: [
        "The first change.",
        "breaking - this is the real first breaking change.",
        "That second change.",
        "This third change.",
        "breaking - first this is a breaking change",
        "The fourth change.",
        "breaking - third breaking change",
      ],
    };

    const expected = [
      "breaking - this is the real first breaking change.",
      "breaking - first this is a breaking change",
      "breaking - third breaking change",
      "The first change.",
      "That second change.",
      "This third change.",
      "The fourth change.",
    ];

    const result = sortBreakingChanges(version, config);
    expect(result.added).toStrictEqual(expected);
  });
});
