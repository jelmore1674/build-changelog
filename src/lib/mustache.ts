import * as Mustache from "mustache";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Config, config } from "./config";

const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const heading = readFileSync(path.join(dir, "templates/heading.md"), "utf8");
const version = readFileSync(path.join(dir, "templates/version.md"), "utf8");
const change = readFileSync(path.join(dir, "templates/change.md"), "utf8");
const links = readFileSync(path.join(dir, "templates/links.md"), "utf8");
const releaseNotes = readFileSync(path.join(dir, "templates/release-notes.md"), "utf8");
const notice = readFileSync(path.join(dir, "templates/notice.md"), "utf8");

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

/** Properties we will not use when adding changes to the changelog */
const KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

/** Initial list of supported keywords */
const KEYWORDS = {
  added: "added",
  changed: "changed",
  deprecated: "deprecated",
  removed: "removed",
  fixed: "fixed",
  security: "security",
} as const;

interface Reference {
  type: "issue" | "pull_request";
  number: string | number;
}

interface Release {
  version: string;
  release_date?: string;
  notice?: string;
  author?: string;
  references?: Reference[];
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

function sortBreakingChanges(version: Version) {
  for (const changes in version) {
    if (KEY_FILTER.includes(changes)) {
      continue;
    }
    const keyword = changes as Keywords;

    if (version[keyword]) {
      version?.[keyword].sort((a, b) => {
        if (config.flags?.breaking) {
          const isPrefixedA = a.startsWith(config.flags?.breaking);
          const isPrefixedB = b.startsWith(config.flags?.breaking);

          if (isPrefixedA && !isPrefixedB) {
            return -1;
          }

          if (!isPrefixedA && isPrefixedB) {
            return 1;
          }
        }

        return a.localeCompare(b);
      });
    }
  }

  return version;
}

/* v8 ignore start */
/**
 * Generate the changelog.
 * @param versions - the versions to be rendered.
 * @returns A string that can be written to a file.
 */
function generateChangelog(
  versions: Version[],
  actionConfig = config as Omit<Config, "repo_url" | "release_url" | "prefers">,
) {
  let genLinks: ({ version: string; url: string } | null)[] = [];

  if (GITHUB_SERVER_URL) {
    genLinks = versions.map(({ version }) => {
      // Prevent Unreleased from creating link.
      if (version.toLowerCase() === "unreleased") {
        return null;
      }

      return {
        version,
        url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${actionConfig.git_tag_prefix || "v"}${version}`,
      };
    });
  }

  const sortedVersions = versions.map(sortBreakingChanges);

  return Mustache.render(heading, { versions: sortedVersions, links: genLinks.filter(i => i) }, {
    versions: version,
    change,
    links,
    notice,
  })
    ?.trim();
}

function generateReleaseNotes(version: Version) {
  return Mustache.render(releaseNotes, sortBreakingChanges(version), { change })?.trim();
}
/* v8 ignore end */

export { generateChangelog, generateReleaseNotes, KEYWORDS };

export type { Changes, Keywords, Reference, Version };
