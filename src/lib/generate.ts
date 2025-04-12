import { parseChangelog } from "@jelmore1674/changelog";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cleanUpChangelog } from "../utils/cleanUpChangelog";
import { getParser } from "../utils/getParser";
import { isTomlOrYamlFile } from "../utils/isTomlOrYamlFile";
import { log } from "../utils/log";
import { changelogDir, changelogPath, Config, config } from "./config";
import { Changes, generateChangelog, Keywords, Reference, Version } from "./mustache";
import { rl } from "./readline";

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL ?? "https://api.github.com";
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY ?? "jelmore1674/build-changelog";
const GITHUB_ACTOR = process.env.GITHUB_ACTOR ?? "bcl-bot";

/**
 * Complex changelog entry
 */
type ComplexChange = {
  /**
   * Any custom flags with prefixes.
   */
  flag?: string;
  /**
   * The changelog message.
   */
  message: string;
  /**
   * References
   */
  references?: Reference[];
};

/**
 * The parsed changed from the changelog file.
 */
interface ParsedChanges extends Partial<Record<Keywords, string[] | Record<string, string[]> | ComplexChange[]>> {
  /**
   * The version of the change
   */
  version: string;
  /**
   * The release date of the version
   */
  release_date?: string;
  /**
   * A notice for the version entry.
   */
  notice?: string;
  /**
   * References to a issue or pull request.
   */
  references?: Reference[];
}

interface LinkReference extends Omit<Reference, "type"> {
  type: "pull_request" | "issue";
}

/** Properties we will not use when adding changes to the changelog */
const KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

/** The valid keywords that are used for the sections in the changelog */
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

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

const LINK_TYPE = {
  pull_request: "pull",
  issue: "issues",
};

/**
 * Generate the link of the change.
 *
 * @param reference - the reference we are creating a link for.
 */
function generateLink(reference: LinkReference) {
  if (config.repo_url) {
    return `[#${reference.number}](${config.repo_url}/${LINK_TYPE[reference.type]}/${reference.number})`;
  }

  return `[#${reference.number}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/${
    LINK_TYPE[reference.type]
  }/${reference.number})`;
}

/**
 * Generate References of the change.
 *
 * @param references - the references we are adding to the change.
 */
function generateReferences(references: Reference[]): string {
  log(`References Found: ${references.length}`);
  if (references.length) {
    return references.map((reference) => {
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
 * Generate the change entry in the changelog.
 *
 * @param change - the change message
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
  flag?: string,
  prNumber?: number,
) {
  let renderedChange = change;

  // Generate the links for the change.
  if (GITHUB_REPOSITORY) {
    renderedChange = `${change} (${
      generateReferences([
        ...((config?.reference_pull_requests && prNumber)
          ? [{ type: "pull_request", number: prNumber.toString() }] as Reference[]
          : []),
        ...references,
      ])
    })`;
  }

  // Add author to the change.
  if (config.show_author) {
    if (GITHUB_ACTOR) {
      renderedChange = `${renderedChange} (${
        generateAuthorLink(config.show_author_full_name ? author : GITHUB_ACTOR)
      })`;
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
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 *
 *  @param author - the name of the author.
 */
function generateCommand(
  author = "bcl-bot",
  prNumber = 10,
  releaseVersion?: string,
  actionConfig = config as Omit<Config, "repo_url" | "release_url" | "prefers">,
) {
  log("generate command parameters", { author, prNumber, releaseVersion });

  log("actionConfig", JSON.stringify(actionConfig, null, 2));

  log("Generating changelog.");

  let changelog: Version[] = [];

  if (existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
    changelog = parseChangelog(changelogFile, releaseVersion);
  }

  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  const parsedChangelog = files.reduce((acc: Version[], file) => {
    if (isTomlOrYamlFile(file)) {
      log(`Parsing ${file} file now.`);
      const parsedChanges = parseChanges<ParsedChanges>(path.join(changelogDir, file));

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
          if (KEY_FILTER.includes(changes)) {
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
            if (Array.isArray(parsedChanges[keyword]) && parsedChanges[keyword].length) {
              parsedChanges[keyword]?.map(item => {
                if (typeof item === "string") {
                  currentVersion[keyword]?.push(
                    generateChange(item, references, actionConfig, author, undefined, prNumber),
                  );
                }

                if (
                  typeof item === "object" && !Array.isArray(item)
                  && item !== null
                ) {
                  currentVersion[keyword]?.push(
                    generateChange(item.message, item?.references || [], actionConfig, author, item.flag, prNumber),
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
                    return generateChange(change, references, actionConfig, author, flag, prNumber);
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
  }, changelog);

  const renderedChangelog = generateChangelog(parsedChangelog, actionConfig);
  writeFileSync(changelogPath, renderedChangelog, { encoding: "utf8" });

  log("CHANGELOG.md finished writing.");

  cleanUpChangelog(actionConfig.dir);

  rl.close();
}

export { generateCommand, parseChanges };
