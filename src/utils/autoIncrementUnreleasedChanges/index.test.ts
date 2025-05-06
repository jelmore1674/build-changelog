import { describe, expect, test } from "vitest";
import { autoIncrementUnreleasedChanges } from "./";

const existingChanges = [
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  { version: "0.1.2", release_date: "2025-1-1" },
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  { version: "0.1.1", release_date: "2025-1-1" },
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  { version: "0.1.0", release_date: "2025-1-1" },
];

describe("autoIncrementUnreleasedChanges", () => {
  test("Can return the expected version", () => {
    const current = {
      version: "Unreleased",
      // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
      release_date: "TBD",
    };

    const result = autoIncrementUnreleasedChanges("minor", current, existingChanges);

    expect(result).toBe("0.2.0");
  });
});
