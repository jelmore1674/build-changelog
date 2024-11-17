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

/** Initial list of supported flags */
enum FLAGS {
  BREAKING = "breaking",
}

type Keywords = `${KEYWORDS}`;
type Flags = `${FLAGS}`;

type Changes = Partial<Record<Keywords, string[]>>;
type YamlChanges = Partial<Record<Keywords, string[] | Partial<Record<Flags, string[]>>>>;

interface Version extends Changes {
  version: string;
  releaseDate?: string;
}

interface ChangesSection {
  /** Valid keyword for a section in the changelog */
  keyword: Keywords;
  /** the changes of a section */
  changes: string;
}

/**
 * Generate the changelog.
 * @param versions - the versions to be rendered.
 * @returns A string that can be written to a file.
 */
function generateChangelog(versions: Version[]) {
  return Mustache.render(heading, { versions }, { versions: version, change });
}

export { change, generateChangelog, heading, version };

export type { Changes, ChangesSection, FLAGS, Flags, KEYWORDS, Keywords, Version, YamlChanges };
