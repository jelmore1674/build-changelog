import { describe, expect, test } from "vitest";
import { getChangeCount } from "./";

describe("getChangeCount", () => {
  test("Can return correct number of changes", () => {
    const changes = [{
      version: "1.0.0",
      added: ["This is a change", "This is a change"],
      fixed: ["This is a change", "This is a change"],
    }];

    const result = getChangeCount(changes);
    expect(result).toBe(4);
  });

  test("Can handle multiple versions, and all valid keywords.", () => {
    const changes = [
      {
        version: "1.1.0",
        added: ["This is a change", "This is a change"],
        fixed: ["This is a change", "This is a change"],
      },
      {
        version: "1.0.1",
        changed: ["This is a change", "This is a change"],
        removed: ["This is a change", "This is a change"],
      },
      {
        version: "1.0.0",
        security: ["This is a change", "This is a change"],
        deprecated: ["This is a change", "This is a change"],
      },
    ];

    const result = getChangeCount(changes);
    expect(result).toBe(12);
  });

  test("Will still count invalid keywords", () => {
    const changes = [{
      version: "1.0.0",
      added: ["This is a change", "This is a change"],
      fix: ["This is a change", "This is a change"],
    }];

    const result = getChangeCount(changes);
    expect(result).toBe(4);
  });
});
