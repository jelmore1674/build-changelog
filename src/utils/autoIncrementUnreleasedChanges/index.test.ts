import { describe, expect, test } from "vitest";
import { autoIncrementUnreleasedChanges } from "./";

const existingChanges = [
  { version: "0.1.2", release_date: "2025-01-01" },
  { version: "0.1.1", release_date: "2025-1-1" },
  { version: "0.1.0", release_date: "2025-1-1" },
];

describe("autoIncrementUnreleasedChanges", () => {
  test("Can return the expected version", () => {
    const current = {
      version: "Unreleased",
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("minor", current, existingChanges);

    expect(result).toBe("0.2.0");
  });

  test("Can return the expected version", () => {
    const current = {
      version: "0.2.0",
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("patch", current, existingChanges);

    expect(result).toBe("0.2.0");
  });

  test("Can return the expected version", () => {
    const current = {
      version: "1.0.0",
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("patch", current, existingChanges);

    expect(result).toBe("1.0.0");
  });

  test("Can return the expected version", () => {
    const current = {
      version: "0.2.0",
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("minor", current, existingChanges);

    expect(result).toBe("0.2.0");
  });

  test("Can return the expected version", () => {
    const current = {
      version: "1.0.0",
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("minor", current, existingChanges);

    expect(result).toBe("1.0.0");
  });
});
