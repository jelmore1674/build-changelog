import { JsonMap } from "@iarna/toml";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getParser } from "../utils/getParser";
import { isTomlFile } from "../utils/isTomlFile";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { changelogArchive, changelogDir, changelogPath, config } from "./config";
import { Changes, generateChangelog, Keywords, Version } from "./mustache";
import { parseChangelog } from "./parseChangelog";
import { rl } from "./readline";

/** Properties we will not use when adding changes to the changelog */
const YAML_KEY_FILTER = ["release_date", "version"];

/** The valid keywords that are used for the sections in the changelog */
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

/** The archive files. `.toml` or '.yml'. */
const ARCHIVE_FILES = ["archive.toml", "archive.yml"];

/**
 * Utility function that determines if the file is a `TOML` or `YAML` file.
 *
 * @param file - the file name you are checking.
 */
function isTomlOrYamlFile(file: string) {
  return isTomlFile(file) || isYamlFile(file);
}

/**
 * Parse the changes from a `yaml` or `toml` file.
 *
 * @param file - the file you are getting the changes from.
 */
function parseChanges<T = Changes>(file: string): T {
  if (existsSync(file)) {
    const parser = getParser(file);
    return parser.parse(readFileSync(file, { encoding: "utf8" })) as unknown as T;
  }

  throw new Error(`The file does not exist\n\n${file}`);
}

/**
 * Get the data from the changelog archive.
 */
function getChangelogArchive(): Version[] {
  if (existsSync(changelogArchive)) {
    return parseChanges<{ changelog: Version[] }>(changelogArchive)?.changelog ?? [];
  }

  return [];
}

/**
 * Write the changelog to the archive.
 */
function writeChangelogToArchive(changelog: Version[], archiveFile = changelogArchive) {
  const parser = getParser(config.prefers);
  const archive = parser.stringify({ changelog } as unknown as JsonMap);
  writeFileSync(archiveFile, archive, { encoding: "utf8" });
}

/**
 * Remove all `yaml` or `toml` files from the changelog directory.
 */
function cleanUpChangelog() {
  log("Cleaning up files.");
  // Clean up the changelog directory after we have finished updating the CHANGELOG.
  readdirSync(changelogDir, { recursive: true, encoding: "utf8" }).forEach(file => {
    if (isTomlOrYamlFile(file) && !ARCHIVE_FILES.includes(file)) {
      rmSync(path.join(changelogDir, file as string), { recursive: true, force: true });
    }
  });
  log("Finished cleaing. ");
}

/**
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 */
function generateCommand() {
  log("Generating changelog.");
  let changelogArchive: Version[] = config.changelog_archive ? getChangelogArchive() : parseChangelog(changelogPath);

  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  const changelog = files.reduce((acc: Version[], file) => {
    if (isTomlOrYamlFile(file) && !ARCHIVE_FILES.includes(file)) {
      const parsedChanges = parseChanges(path.join(changelogDir, file));

      // Set fallback values for release_date and Version
      let version = parsedChanges.version || "Unreleased";
      let release_date = parsedChanges.release_date || "TBD";

      // Find a matching release.
      const foundRelease = acc.find((release) => release.version === version);

      // The currentVersion to add changes to.
      const currentVersion: Version = foundRelease ?? { version, release_date };

      if (parsedChanges) {
        for (const changes in parsedChanges) {
          // Filter out the non keyword properties.
          if (YAML_KEY_FILTER.includes(changes)) {
            continue;
          }
          const keyword = changes as Keywords;

          if (!VALID_KEYWORDS.includes(keyword)) {
            console.error(`\nINVALID_KEYWORD: The keyword "${keyword}" is invalid.\n`);
            console.error(`VALID_KEYWORDS: ${VALID_KEYWORDS.join(", ")}\n`);
            console.error(path.join(changelogDir, file), "\n");
            process.exit(1);
          }

          // if the currentVersion doesn't have this change keyword, we will
          // initialize an empty array.
          if (!currentVersion[keyword]) {
            currentVersion[keyword] = [];
          }

          if (parsedChanges[keyword]) {
            for (const flag in parsedChanges[keyword]) {
              // Add the change to the current version. If the change flag has
              // a prefix we will add the prefix. Else we will return the string.
              currentVersion[keyword]?.push(
                ...parsedChanges[keyword]?.[flag]?.map((change: string) => {
                  if (config.flags?.[flag]) {
                    return `${config.flags?.[flag]} - ${change}`;
                  }

                  return change;
                })!,
              );
            }
          }
        }

        if (!foundRelease) {
          acc.push(currentVersion);
        }
      }
    }

    // Sort the changelog by the version.
    return acc.sort((a, b) => b.version.localeCompare(a.version));
  }, changelogArchive);

  if (config.changelog_archive) {
    writeChangelogToArchive(changelog);
  }

  generateChangelog(changelog).then(changelog => writeFileSync(changelogPath, changelog, { encoding: "utf8" }));

  log("CHANGELOG.md finsihed writing.");

  cleanUpChangelog();

  rl.close();
}

export {
  cleanUpChangelog,
  generateCommand,
  getChangelogArchive,
  isTomlOrYamlFile,
  parseChanges,
  writeChangelogToArchive,
};
