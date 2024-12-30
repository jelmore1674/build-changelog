import * as Mustache from "mustache";
import { readFileSync } from "node:fs";
import https from "node:https";
import path from "node:path";
import { config } from "./config";

const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const heading = readFileSync(path.join(dir, "templates/heading.md"), "utf8");
const version = readFileSync(path.join(dir, "templates/version.md"), "utf8");
const change = readFileSync(path.join(dir, "templates/change.md"), "utf8");
const links = readFileSync(path.join(dir, "templates/links.md"), "utf8");
const releaseNotes = readFileSync(path.join(dir, "templates/release-notes.md"), "utf8");
const notice = readFileSync(path.join(dir, "templates/notice.md"), "utf8");

/** Initial list of supported keywords */
const KEYWORDS = {
  added: "added",
  changed: "changed",
  deprecated: "deprecated",
  removed: "removed",
  fixed: "fixed",
  security: "security",
} as const;

interface Release {
  version: string;
  release_date?: string;
  notice?: string;
}

/**
 * The keywords used to make up the sections of the changelog.
 */
type Keywords = keyof typeof KEYWORDS;

/**
 * The changes from the `yaml` or `toml` file.
 */
type Changes = Release & Partial<Record<Keywords, Partial<Record<string, string[]>>>>;

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
async function generateChangelog(versions: Version[]) {
  let genLinks: ({ version: string; url: string } | null)[] = [];
  if (config.release_url) {
    genLinks = versions.map(i => {
      return ({
        version: i.version,
        url: `${config.release_url}/${config.git_tag_prefix}${i.version}`,
      });
    });
  }
  return Mustache.render(heading, { versions, links: genLinks.filter(i => i) }, {
    versions: version,
    change,
    links,
    notice,
  })
    ?.trim();
}

function generateReleaseNotes(version: Version) {
  return Mustache.render(releaseNotes, version, { change })?.trim();
}
/* v8 ignore end */

export { generateChangelog, generateReleaseNotes, KEYWORDS };

export type { Changes, Keywords, Version };
