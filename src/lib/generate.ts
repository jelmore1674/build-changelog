import {
  type KeepAChangelogKeywords,
  parseChangelog,
  type Reference as ReferenceLink,
  Version,
  writeChangelog,
} from "@jelmore1674/changelog";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ParsedChanges, Reference } from "../types";
import { cleanUpChangelog } from "../utils/cleanUpChangelog";
import { getParser } from "../utils/getParser";
import { isTomlOrYamlFile } from "../utils/isTomlOrYamlFile";
import { log } from "../utils/log";
import { changelogDir, changelogPath, Config, config } from "./config";
import { rl } from "./readline";

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL ?? "https://github.com";
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY ?? "jelmore1674/build-changelog";
const GITHUB_ACTOR = process.env.GITHUB_ACTOR ?? "bcl-bot";

/** Properties we will not use when adding changes to the changelog */
const KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

/** The valid keywords that are used for the sections in the changelog */
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

/**
 * Parse the changes from a `yaml` or `toml` file.
 *
 * @param file - the file you are getting the changes from.
 */
function parseChanges<T = Record<KeepAChangelogKeywords, Partial<Record<string, string[]>>>>(file: string): T {
  if (existsSync(file)) {
    const parser = getParser(file);
    return parser.parse(readFileSync(file, { encoding: "utf8" })) as unknown as T;
  }

  throw new Error(`The file does not exist\n\n${file}`);
}

const LINK_TYPE = {
  pull_request: "pull",
  issue: "issues",
};

/**
 * Generate References of the change.
 *
 * @param references - the references we are adding to the change.
 */
function generateReferences(references: Reference[]): string {
  if (references.length) {
    return references.sort((a, b) => a.number - b.number).map((reference) => {
      return `[#${reference.number}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/${
        LINK_TYPE[reference.type]
      }/${reference.number})`;
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
  if (author === "depbendabot" || author === "renovate") {
    return `[${author}](${GITHUB_SERVER_URL}/app/${author})`;
  }
  return `[${author}](${GITHUB_SERVER_URL}/${GITHUB_ACTOR})`;
}

/**
 * Generate the link for commit shas
 *
 * @param sha - the commit sha
 * @param showReferenceSha - Whether or not we will show this link.
 */
function generateCommitShaLink(sha: string, showReferenceSha: boolean) {
  if (showReferenceSha) {
    return `([\`${sha?.substring(0, 7)}\`](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${sha})) `;
  }

  return "";
}

/**
 * Generate the change entry in the changelog.
 *
 * @param change - the change message
 * @param changelogLinks - the links from the changelog
 * @param references - any references to create link.
 * @param config - the configuration
 * @param author - the author
 * @param [flag] - optional flag that can be used.
 * @param [prNumber] - pr number to auto reference.
 */
function generateChange(
  change: string,
  references: Reference[],
  config: Omit<Config, "repo_url" | "release_url" | "prefers">,
  author: string,
  sha: string,
  flag?: string,
  prNumber?: number,
) {
  let renderedChange = change;

  // Generate the links for the change.
  if ((references.length || prNumber) && GITHUB_REPOSITORY) {
    renderedChange = `${change} ${generateCommitShaLink(sha, config.reference_sha)}(${
      generateReferences([
        ...((config?.reference_pull_requests && prNumber)
          ? [{ type: "pull_request", number: prNumber }] as Reference[]
          : []),
        ...references,
      ])
    })`;
  }

  // Add author to the change.
  if (config.show_author) {
    if (GITHUB_ACTOR) {
      renderedChange = `${renderedChange} (${generateAuthorLink(author || GITHUB_ACTOR)})`;
    } else {
      renderedChange = `${renderedChange} (${author})`;
    }
  }

  if (flag && config.flags?.[flag]) {
    return `${config.flags?.[flag]} - ${renderedChange}`;
  }

  log(`Change: ${renderedChange}`);

  return renderedChange;
}

/**
 * Sort the breaking changes and put them at the top of the change section.
 *
 * @param version - the version with the changes to sort.
 */
function sortBreakingChanges(version: Version<Partial<Record<KeepAChangelogKeywords, string[]>>>) {
  for (const changes in version) {
    if (KEY_FILTER.includes(changes)) {
      continue;
    }
    const keyword = changes as KeepAChangelogKeywords;

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

function addVersionReferenceLinks(
  version: Version<Partial<Record<KeepAChangelogKeywords, string[]>>>,
  changelogLinks: ReferenceLink[],
  config: Omit<Config, "repo_url" | "release_url" | "prefers">,
) {
  if (changelogLinks.find(v => v.reference === version.version) || version.version.toLowerCase() === "unreleased") {
    return;
  }

  changelogLinks.unshift({
    reference: version.version,
    url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${config.git_tag_prefix || "v"}${version.version}`,
  });
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
  sha: string,
  prNumber?: number,
  releaseVersion?: string,
  actionConfig = config as Omit<Config, "repo_url" | "release_url" | "prefers">,
) {
  log("generate command parameters", { author, prNumber, releaseVersion });

  log("actionConfig", JSON.stringify(actionConfig, null, 2));

  log("Generating changelog.");

  let changelogVersions: Version<Partial<Record<KeepAChangelogKeywords, string[]>>>[] = [];
  let changelogLinks: ReferenceLink[] = [];

  if (existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
    const changelog = parseChangelog(changelogFile, releaseVersion);
    changelogVersions = changelog.versions;
    changelogLinks = changelog.links;
  }

  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  const parsedChangelog = files.reduce((acc: Version<Partial<Record<KeepAChangelogKeywords, string[]>>>[], file) => {
    if (isTomlOrYamlFile(file)) {
      log(`Parsing ${file} file now.`);
      const parsedChanges = parseChanges<ParsedChanges>(path.join(changelogDir, file));

      // Set fallback values for release_date and Version
      let version = parsedChanges.version || "Unreleased";
      let release_date = parsedChanges.release_date || "TBD";
      let notice = parsedChanges.notice;
      const references = parsedChanges.references || [];
      const botAuthor = parsedChanges.author;

      // Find a matching release.
      const foundRelease = acc.find((release) => release.version === version);

      //
      // The currentVersion to add changes to.
      const currentVersion: Version<Partial<Record<KeepAChangelogKeywords, string[]>>> = foundRelease
        ?? { version, release_date };

      if (
        releaseVersion && releaseVersion.toLowerCase() !== "unreleased"
        && currentVersion.version.toLowerCase() === "unreleased"
      ) {
        const today = new Date().toISOString().split("T")[0];
        currentVersion.version = releaseVersion;
        currentVersion.release_date = today;

        changelogLinks.unshift({
          reference: releaseVersion,
          url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${
            actionConfig.git_tag_prefix || "v"
          }${releaseVersion}`,
        });
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
          if (KEY_FILTER.includes(changes)) {
            continue;
          }
          const keyword = changes as KeepAChangelogKeywords;

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
            if (Array.isArray(parsedChanges[keyword]) && parsedChanges[keyword].length) {
              parsedChanges[keyword]?.map(item => {
                if (typeof item === "string") {
                  currentVersion[keyword]?.push(
                    generateChange(item, references, actionConfig, botAuthor || author, sha, undefined, prNumber),
                  );
                }

                if (
                  typeof item === "object" && !Array.isArray(item)
                  && item !== null
                ) {
                  currentVersion[keyword]?.push(
                    generateChange(
                      item.message,
                      item?.references || [],
                      actionConfig,
                      botAuthor || author,
                      sha,
                      item.flag,
                      prNumber,
                    ),
                  );
                }
              });
            }

            if (
              typeof parsedChanges[keyword] === "object" && !Array.isArray(parsedChanges[keyword])
              && parsedChanges[keyword] !== null
            ) {
              for (const flag in parsedChanges[keyword]) {
                // Add the change to the current version. If the change flag has
                // a prefix we will add the prefix. Else we will return the string.
                currentVersion[keyword]?.push(
                  ...parsedChanges[keyword]?.[flag]?.map((change: string) => {
                    return generateChange(
                      change,
                      references,
                      actionConfig,
                      botAuthor || author,
                      sha,
                      flag,
                      prNumber,
                    );
                  }),
                );
              }
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
  }, changelogVersions);

  const sortedVersions = parsedChangelog.map((version) => {
    addVersionReferenceLinks(version, changelogLinks, actionConfig);

    return sortBreakingChanges(version);
  });

  const renderedChangelog = writeChangelog({ versions: sortedVersions, links: changelogLinks });

  console.log(renderedChangelog);

  writeFileSync(changelogPath, renderedChangelog, { encoding: "utf8" });

  log("\nCHANGELOG.md finished writing.");

  cleanUpChangelog(actionConfig.dir);

  rl.close();
}

export { generateCommand, parseChanges };
