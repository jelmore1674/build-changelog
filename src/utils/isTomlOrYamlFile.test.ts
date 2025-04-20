import { expect, test } from "vitest";
import { isTomlOrYamlFile } from "./isTomlOrYamlFile";

test.each([
  ["test.toml", "true"],
  ["test.yaml", "true"],
  ["test.yml", "true"],
  ["test.md", "false"],
  [
    "test.ts",
    "flase",
  ],
])(
  "isTomlOrYaml(%s) -> %s",
  (file, expected) => {
    expect(isTomlOrYamlFile(file)).toBe(expected === "true");
  },
);
