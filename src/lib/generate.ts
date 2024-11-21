import TOML, { JsonMap } from "@iarna/toml";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { isTomlFile } from "../utils/isTomlFile";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { changelogArchive, changelogDir, changelogPath, config } from "./config";
import { Changes, generateChangelog, Keywords, Version } from "./mustache";
import { rl } from "./readline";

const YAML_KEY_FILTER = ["releaseDate", "version"];
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

const ARCHIVE_FILES = ["archive.toml", "archive.yml"];

/**
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 */
function generateCommand() {
  log("Generating changelog.");
  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  let initialVersions: Version[] = [];

  if (existsSync(changelogArchive)) {
    const parser = !isYamlFile(changelogArchive) ? YAML : TOML;
    initialVersions = parser.parse(readFileSync(changelogArchive, { encoding: "utf8" }));
  }

  const versions = files.reduce((acc: Version[], file) => {
    if ((isTomlFile(file) || isYamlFile(file)) && !ARCHIVE_FILES.includes(file)) {
      const parser = isYamlFile(file) ? YAML : TOML;
      const filePath = path.join(changelogDir, file);
      const changes = readFileSync(filePath, { encoding: "utf8" });

      const parsedChanges: Changes = parser.parse(changes);

      // Set fallback values for releaseData and Version
      let version = parsedChanges.version || "Unreleased";
      let releaseDate = parsedChanges.releaseDate || "TBD";

      // Find a matching release.
      const foundRelease = acc.find((release) => release.version === version);

      // The currentVersion to add changes to.
      const currentVersion: Version = foundRelease ?? { version, releaseDate };

      if (parsedChanges) {
        const yamlProperties = Object.keys(parsedChanges);

        // Get the Keywords from the parsed changes. Filtering out the
        // `version` and `releaseDate`.
        const keywords = yamlProperties.filter(key => !YAML_KEY_FILTER.includes(key)) as Keywords[];

        for (const keyword of keywords) {
          if (!VALID_KEYWORDS.includes(keyword)) {
            console.error(`INVALID_KEYWORD: The keyword "${keyword}" is invalid.\n`);
            console.error(`VALID_KEYWORDS: ${VALID_KEYWORDS.join(", ")}\n`);
            console.error(filePath, "\n");
            process.exit(1);
          }
          // if the currentVersion doesn't have this change keyword, we will
          // initialize an empty array.
          if (!currentVersion[keyword]) {
            currentVersion[keyword] = [];
          }

          if (parsedChanges[keyword]) {
            const flags = Object.keys(parsedChanges[keyword]);

            for (const flag of flags) {
              // Add the change to the current version. If the change flag has
              // a prefix we will add the prefix. Else we will return the string.
              currentVersion[keyword]?.push(
                ...parsedChanges[keyword]?.[flag]?.map((change: string) => {
                  if (config.flags?.[flag]?.prefix) {
                    return `${config.flags?.[flag]?.prefix} - ${change}`;
                  }

                  return change;
                }) as string[],
              );
            }
          }
        }

        if (!foundRelease) {
          acc.push(currentVersion);
        }
      }
    }

    return acc.sort((a, b) => b.version.localeCompare(a.version));
  }, initialVersions);

  const parser = config.prefers === "yaml" ? YAML : TOML;
  const releases = config.prefers === "yaml" ? versions : { versions };

  const archive = parser.stringify(releases as unknown as JsonMap);
  writeFileSync(changelogArchive, archive, { encoding: "utf8" });
  writeFileSync(changelogPath, generateChangelog(versions), { encoding: "utf8" });

  log("CHANGELOG.md finsihed writing.");

  log("Cleaning up files.");

  // Clean up the changelog directory after we have finished updating the CHANGELOG.
  readdirSync(changelogDir, { recursive: true, encoding: "utf8" }).forEach(dir => {
    if ((isYamlFile(dir) || isTomlFile(dir)) && !ARCHIVE_FILES.includes(dir)) {
      rmSync(path.join(changelogDir, dir as string), { recursive: true, force: true });
    }
  });
  log("Finished cleaing. ");

  rl.close();
}

export { generateCommand };
