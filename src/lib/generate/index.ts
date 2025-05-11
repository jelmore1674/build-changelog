import { debug } from "@actions/core";
import { KEY_FILTER, VALID_KEYWORDS } from "@consts";
import {
  getReleaseNotes,
  type KeepAChangelogKeywords,
  parseChangelog,
  type Reference as ReferenceLink,
  writeChangelog,
} from "@jelmore1674/changelog";
import { formatChangeMessage } from "@lib/format/formatChangeMessage";
import type { ChangelogOptions, GenerateConfig, ParsedChanges, Reference, Version } from "@types";
import { addGitTagPrefix } from "@utils/addGitTagPrefix";
import { autoIncrementUnreleasedChanges } from "@utils/autoIncrementUnreleasedChanges";
import { cleanUpChangelog } from "@utils/cleanUpChangelog";
import { getChangeCount } from "@utils/getChangeCount";
import { isTomlOrYamlFile } from "@utils/isTomlOrYamlFile";
import { log } from "@utils/log";
import { parseChanges } from "@utils/parseChanges";
import { sortBreakingChanges } from "@utils/sortBreakingChanges";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { changelogDir, changelogPath, config } from "../config";
import { rl } from "../readline";

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

/**
 * Regex used to get the date of the release.
 *
 * This will match the date if it is formatted:
 * yyyy-mm-dd
 *
 * @link [regex101](https://regex101.com/r/IP7HY7/2)
 */
const dateRegex = /\d{4}(-|\/)\d{2}(-|\/)\d{2}/g;

interface ChangeFields {
  /**
   * The author to reference
   *
   * @defaults "bcl-bot"
   */
  author?: {
    name: string;
    url: string;
  };
  /**
   * The commit sha
   */
  sha: string;
  prNumber?: number;
  prReferences?: Reference[];
  releaseVersion?: string;
  changelogOptions?: ChangelogOptions;
}

/**
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 *
 *  @param changeFields - the fields used to add references to change.
 *  @param [actionConfig=config as GenerateConfig] - the configuration to generate the changelog
 *  @param [skip_changelog=false] - Used to disable parsing existing changelog.
 */
function generateCommand(
  {
    author = { name: "bcl-bot", url: "https://github.com/bcl-bot" },
    sha,
    prNumber,
    prReferences = [],
    releaseVersion,
    changelogOptions,
  }: ChangeFields,
  actionConfig = config as GenerateConfig,
  skip_changelog = false,
) {
  log("ℹ️ generate command parameters", {
    author,
    sha,
    prNumber,
    prReferences,
    releaseVersion,
    changelogOptions,
    actionConfig,
  });

  log("🎯 Generating changelog.");

  let changelogVersions: Version[] = [];
  let changelogLinks: ReferenceLink[] = [];

  if (!skip_changelog && existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
    const changelog = parseChangelog(changelogFile, releaseVersion);
    changelogVersions = changelog.versions;
    changelogLinks = changelog.links;
  }

  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  const parsedChangelog = files.reduce(
    (acc: Version[], file) => {
      if (isTomlOrYamlFile(file)) {
        log(`ℹ️ Parsing ${file} file now.`);
        const parsedChanges = parseChanges<ParsedChanges>(path.join(changelogDir, file));

        debug(`parsedChanges:\n${JSON.stringify(parsedChanges, null, 2)}`);

        // Set fallback values for release_date and Version
        let version = parsedChanges.version || "Unreleased";
        let release_date = parsedChanges.release_date || "TBD";
        let notice = parsedChanges.notice;
        const references = parsedChanges.references || [];
        // Dependabot is the only bot that is supported currently.
        const botAuthor = {
          name: parsedChanges.author as string,
          url: "https://github.com/apps/dependabot",
        };
        let changeType = parsedChanges.change ?? "patch";

        // Find a matching release.
        const foundRelease = acc.find((release) =>
          release.version === version || release.release_date === release_date
        );

        //
        // The currentVersion to add changes to.
        const currentVersion: Version = foundRelease
          ?? { version, release_date };

        if (!dateRegex.test(release_date)) {
          currentVersion.release_date = release_date;
        }

        if (
          releaseVersion && releaseVersion.toLowerCase() !== "unreleased"
          && (currentVersion.version.toLowerCase() === "unreleased"
            || !dateRegex.test(currentVersion.release_date || ""))
        ) {
          const today = new Date().toISOString().split("T")[0];
          currentVersion.version = releaseVersion;
          currentVersion.release_date = today;
        }

        if (notice) {
          if (currentVersion.notice) {
            console.error(
              "🚨 A notice already exists. Please look at the existing noice for the current version. 🚨\n",
            );
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
                      formatChangeMessage(
                        {
                          message: item,
                          author: parsedChanges.author ? botAuthor : author,
                          sha,
                          references: [...references, ...prReferences],
                          prNumber,
                        },
                        actionConfig,
                      ),
                    );
                  }

                  if (
                    typeof item === "object" && !Array.isArray(item)
                    && item !== null
                  ) {
                    changeType = item.flag === "breaking" ? "major" : changeType;
                    currentVersion[keyword]?.push(
                      formatChangeMessage(
                        {
                          message: item.message,
                          author: parsedChanges.author ? botAuthor : author,
                          sha,
                          references: [...(item?.references || []), ...prReferences],
                          prNumber,
                          flag: item.flag,
                        },
                        actionConfig,
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
                      changeType = flag === "breaking" ? "major" : changeType;
                      return formatChangeMessage(
                        {
                          message: change,
                          author: parsedChanges.author ? botAuthor : author,
                          sha,
                          references: [...references, ...prReferences],
                          prNumber,
                          flag,
                        },
                        actionConfig,
                      );
                    }),
                  );
                }
              }
            }
          }

          if (actionConfig.auto_versioning) {
            currentVersion.version = autoIncrementUnreleasedChanges(
              changeType,
              currentVersion,
              acc,
            );
          }

          if (!foundRelease) {
            acc.push(currentVersion);
          }
        }
      }

      // Sort the changelog by the version.
      return acc.sort((a, b) =>
        b.version.localeCompare(a.version, "en-US", { ignorePunctuation: true, numeric: true })
      );
    },
    changelogVersions,
  );

  const sortedVersions = parsedChangelog.map((version) => {
    if (actionConfig.show_git_tag_prefix && version.version.toLowerCase() !== "unreleased") {
      return sortBreakingChanges(addGitTagPrefix(version, actionConfig), actionConfig);
    }

    return sortBreakingChanges(version, actionConfig);
  });

  const referenceLinks = sortedVersions.map((v): ReferenceLink => {
    if (actionConfig.show_git_tag_prefix) {
      return {
        reference: v.version,
        url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${v.version}`,
      };
    }

    return {
      reference: v.version,
      url:
        `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/releases/tag/${actionConfig.git_tag_prefix}${v.version}`,
    };
  }).filter(ref => ref.reference.toLowerCase() !== "unreleased");

  const renderedChangelog = writeChangelog(
    { heading: "", versions: sortedVersions, links: referenceLinks },
    changelogOptions,
  );

  const latestChanges = getReleaseNotes(renderedChangelog).replace("# What's Changed\n\n", "");

  debug(renderedChangelog);

  if (!skip_changelog) {
    writeFileSync(changelogPath, renderedChangelog, { encoding: "utf8" });

    cleanUpChangelog(actionConfig.dir);
  }

  log("✅ CHANGELOG.md finished writing.");

  const count = getChangeCount(sortedVersions);

  rl.close();
  return {
    count,
    latestChanges,
  };
}

export { generateCommand, parseChanges };
