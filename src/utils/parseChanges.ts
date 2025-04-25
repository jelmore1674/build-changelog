import type { KeepAChangelogKeywords } from "@jelmore1674/changelog";
import { existsSync, readFileSync } from "node:fs";
import type { Changes } from "../types";
import { getParser } from "./getParser";

/**
 * Parse the changes from a `yaml` or `toml` file.
 *
 * @param file - the file you are getting the changes from.
 */
function parseChanges<
  T = Record<KeepAChangelogKeywords, Changes | string[]>,
>(file: string): T {
  if (existsSync(file)) {
    const parser = getParser(file);
    return parser.parse(readFileSync(file, { encoding: "utf8" })) as unknown as T;
  }

  throw new Error(`The file does not exist\n\n${file}`);
}

export { parseChanges };
