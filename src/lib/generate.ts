import { JsonMap } from "@iarna/toml";
import { parseChangelog } from "@jelmore1674/changelog";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getParser } from "../utils/getParser";
import { isTomlFile } from "../utils/isTomlFile";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { changelogArchive, changelogDir, changelogPath, Config, config } from "./config";
import { Changes, generateChangelog, Keywords, Reference, Version } from "./mustache";
import { rl } from "./readline";

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_ACTOR = process.env.GITHUB_ACTOR;

/** Properties we will not use when adding changes to the changelog */
const YAML_KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

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
 *
 * @param changelog - the changelog to write
 * @param archiveFile - where we will write the changelog archive.
 */
function writeChangelogToArchive(changelog: Version[], archiveFile = changelogArchive, prefers: "toml" | "yaml") {
  const parser = getParser(prefers);
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

const LINK_TYPE = {
  pull_request: "pull",
  issue: "issues",
};

interface LinkReference extends Omit<Reference, "type"> {
  type: "pull_request" | "issue";
}

/**
 * Generate the link of the change.
 *
 * @param reference - the reference we are creating a link for.
 */
function generateLink(reference: LinkReference) {
  if (config.repo_url) {
    return `[#${reference.reference}](${config.repo_url}/${LINK_TYPE[reference.type]}/${reference.reference})`;
  }

  return `[#${reference.reference}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/${
    LINK_TYPE[reference.type]
  }/${reference.reference})`;
}

/**
 * Generate References of the change.
 *
 * @param references - the references we are adding to the change.
 */
function generateReferences(references: Reference[]): string {
  if (references.length) {
    return references.map((reference) => {
      if (reference.type === "commit") {
        return `\`${reference.reference}\``;
      }

      return generateLink(reference as LinkReference);
    }).join(", ");
  }

  return "";
}

/**
 * Generate the link for the author.
 *
 * @param author - author name.
 */
function generateAuthorLink(author: string) {
  return `[${author}](${GITHUB_SERVER_URL}/${GITHUB_ACTOR})`;
}

/**
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 *
 *  @param author - the name of the author.
 */
function generateCommand(
  author = "bcl-bot",
  prNumber?: number,
  releaseVersion?: string,
  actionConfig = config as Omit<Config, "repo_url" | "release_url" | "changelog_archive" | "prefers">,
) {
  log("generate command parameters", { author, prNumber, releaseVersion });

  log("Generating changelog.");

  let changelogArchive: Version[] = [];

  if (existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
    changelogArchive = parseChangelog(changelogFile, releaseVersion);
  }

  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  const changelog = files.reduce((acc: Version[], file) => {
    if (isTomlOrYamlFile(file) && !ARCHIVE_FILES.includes(file)) {
      const parsedChanges = parseChanges(path.join(changelogDir, file));

      // Set fallback values for release_date and Version
      let version = parsedChanges.version || "Unreleased";
      let release_date = parsedChanges.release_date || "TBD";
      let notice = parsedChanges.notice;
      const references = parsedChanges.references || [];

      // Find a matching release.
      const foundRelease = acc.find((release) => release.version === version);

      //
      // The currentVersion to add changes to.
      const currentVersion: Version = foundRelease ?? { version, release_date };

      if (
        releaseVersion && releaseVersion.toLowerCase() !== "unreleased"
        && currentVersion.version.toLowerCase() === "unreleased"
      ) {
        const today = new Date().toISOString().split("T")[0];
        currentVersion.version = releaseVersion;
        currentVersion.release_date = today;
      }

      if (notice) {
        if (currentVersion.notice) {
          console.error("A notice already exists. Please look at the existing noice for the current version.\n");
          console.error(`Version: "${currentVersion.version}"\n`);
          console.error(`Notice: "${currentVersion.notice}"`);
          process.exit(1);
        }
        // only define notice if it exists.
        currentVersion.notice = notice;
      }

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
                  let renderedChange = change;

                  // Generate the links for the change.
                  if (references.length && GITHUB_REPOSITORY) {
                    renderedChange = `${change} (${
                      generateReferences([
                        ...((actionConfig?.reference_pull_requests && prNumber)
                          ? [{ type: "pull_request", reference: prNumber.toString() }] as Reference[]
                          : []),
                        ...references,
                      ])
                    })`;
                  }

                  // Add author to the change.
                  if (actionConfig.show_author) {
                    if (GITHUB_ACTOR) {
                      renderedChange = `${renderedChange} (${
                        generateAuthorLink(actionConfig.show_author_full_name ? author : GITHUB_ACTOR)
                      })`;
                    } else {
                      renderedChange = `${renderedChange} (${author})`;
                    }
                  }

                  if (actionConfig.flags?.[flag]) {
                    return `${actionConfig.flags?.[flag]} - ${renderedChange}`;
                  }

                  return renderedChange;
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
    return acc.sort((a, b) => b.version.localeCompare(a.version, "en-US", { ignorePunctuation: true, numeric: true }));
  }, changelogArchive);

  const renderedChangelog = generateChangelog(changelog, actionConfig);
  writeFileSync(changelogPath, renderedChangelog, { encoding: "utf8" });

  log("CHANGELOG.md finished writing.");

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
