import * as Mustache from "mustache";
import { readFileSync } from "node:fs";
import path from "node:path";

const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const heading = readFileSync(path.join(dir, "./templates/heading.md"), "utf8");
const version = readFileSync(path.join(dir, "./templates/version.md"), "utf8");
const change = readFileSync(path.join(dir, "./templates/change.md"), "utf8");
const releaseNotes = readFileSync(path.join(dir, "./templates/release-notes.md"), "utf8");

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
 * The changes from the `yaml` or `toml` file.
 */
type Changes = Release & Partial<Record<Keywords, Partial<Record<"change" | string, string[]>>>>;

/**
 * The Section that is used to make the Version.
 */
type Version = Release & Partial<Record<Keywords, string[]>>;

/* v8 ignore start */
/**
 * Generate the changelog.
 * @param versions - the versions to be rendered.
 * @returns A string that can be written to a file.
 */
function generateChangelog(versions: Version[]) {
  return Mustache.render(heading, { versions }, { versions: version, change }).trim();
}

function generateReleaseNotes(version: Version) {
  return Mustache.render(releaseNotes, version, { change }).trim();
}
/* v8 ignore end */

export { generateChangelog, generateReleaseNotes };

export type { Changes, Keywords, Version };
