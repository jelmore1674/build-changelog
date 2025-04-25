import { expect, test } from "vitest";
import { capitalizeFirstLetter } from "./";

const testStrings = [["test", "Test"], ["Test", "Test"], ["hI", "HI"]];

test.each(testStrings)(
  ".capitalizeFirstLetter(%s) -> %s",
  (a: string, expected) => {
    expect(capitalizeFirstLetter(a)).toBe(expected);
  },
);
