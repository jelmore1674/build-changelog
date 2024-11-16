import * as Mustache from "mustache";
import { readFileSync } from "node:fs";
import path from "node:path";

const heading = readFileSync(path.join(__dirname, "./templates/heading.md"), "utf8");
const version = readFileSync(path.join(__dirname, "./templates/version.md"), "utf8");
const change = readFileSync(path.join(__dirname, "./templates/change.md"), "utf8");

enum KEYWORDS {
  ADDED = "added",
  CHANGED = "changed",
  DEPRECATED = "deprecated",
  REMOVED = "removed",
  FIXED = "fixed",
  SECURITY = "security",
}

type Keywords = `${KEYWORDS}`;

type Changes = Partial<Record<Keywords, string[]>>;

interface Version extends Changes {
  version: string;
  releaseDate?: string;
}

interface ChangesSection {
  keyword: Keywords;
  changes: string;
}

function generateChangelog(versions: Version[]) {
  return Mustache.render(heading, { versions }, { versions: version, change });
}

export { change, generateChangelog, heading, version };

export type { Changes, ChangesSection, KEYWORDS, Keywords, Version };
