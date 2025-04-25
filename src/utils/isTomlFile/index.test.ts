import { expect, test } from "vitest";
import { isTomlFile } from "./";

const testStrings = [
  ["test.toml", "true"],
  ["test.yml", "false"],
  ["hi.md", "false"],
  ["index.js", "false"],
  ["index.ts", "false"],
];

test.each(testStrings)(
  ".isTomlFile(%s) -> %s",
  (a: string, expected) => {
    expect(isTomlFile(a)).toBe(expected === "true");
  },
);
