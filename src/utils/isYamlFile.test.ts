import { expect, test } from "vitest";
import { isYamlFile } from "./isYamlFile";

const testStrings = [["test.yml", "true"], ["test.toml", "false"], ["hi.md", "false"], [
  "index.js",
  "false",
], [
  "index.ts",
  "false",
]];

test.each(testStrings)(
  ".isYamlFile(%s) -> %s",
  (a: string, expected) => {
    expect(isYamlFile(a)).toBe(expected === "true");
  },
);
