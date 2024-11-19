import * as Mustache from "mustache";
import { readFileSync } from "node:fs";
import path from "node:path";

const heading = readFileSync(path.join(__dirname, "./templates/heading.md"), "utf8");
const version = readFileSync(path.join(__dirname, "./templates/version.md"), "utf8");
const change = readFileSync(path.join(__dirname, "./templates/change.md"), "utf8");

/** Initial list of supported keywords */
enum KEYWORDS {
  ADDED = "added",
  CHANGED = "changed",
  DEPRECATED = "deprecated",
  REMOVED = "removed",
  FIXED = "fixed",
  SECURITY = "security",
}

interface Release {
  version: string;
  releaseDate?: string;
}

/**
 * The keywords used to make up the sections of the changelog.
 */
type Keywords = `${KEYWORDS}`;

/**
 * The Section that is used to make the Version.
 */
type Version = Release & Partial<Record<Keywords, string[]>>;

/**
 * Parsed yaml output.
 */
type YamlChanges = Partial<Record<Keywords, string[] | Partial<Record<"breaking", string[]>>>> & Release;

/**
 * Generate the changelog.
 * @param versions - the versions to be rendered.
 * @returns A string that can be written to a file.
 */
function generateChangelog(versions: Version[]) {
  return Mustache.render(heading, { versions }, { versions: version, change });
}

export { generateChangelog };

export type { Keywords, Version, YamlChanges };
