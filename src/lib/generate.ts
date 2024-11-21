import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { changelogArchive, changelogDir, changelogPath, config } from "./config";
import { Changes, generateChangelog, Keywords, Version } from "./mustache";
import { rl } from "./readline";

const YAML_KEY_FILTER = ["releaseDate", "version"];
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

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
    initialVersions = YAML.parse(readFileSync(changelogArchive, { encoding: "utf8" }));
  }

  const versions = files.reduce((acc: Version[], file) => {
    if (isYamlFile(file) && !file.includes("archive.yml")) {
      const filePath = path.join(changelogDir, file);
      const changes = readFileSync(filePath, { encoding: "utf8" });

      const yaml: Changes = YAML.parse(changes);

      // Set fallback values for releaseData and Version
      let version = yaml.version || "Unreleased";
      let releaseDate = yaml.releaseDate || "TBD";

      // Find a matching release.
      const foundRelease = acc.find((release) => release.version === version);

      // The currentVersion to add changes to.
      const currentVersion: Version = foundRelease ?? { version, releaseDate };

      if (yaml) {
        const yamlProperties = Object.keys(yaml);

        // Get the Keywords from the parsed changes. Filtering out the
        // `version` and `releaseDate`.
        const keywords = yamlProperties.filter(key => !YAML_KEY_FILTER.includes(key)) as Keywords[];

        for (const keyword of keywords) {
          if (!VALID_KEYWORDS.includes(keyword)) {
            console.error(`INVALID_KEYWORD: The keyword ${keyword} is invalid.`);
            console.error(filePath);
            process.exit(1);
          }
          // if the currentVersion doesn't have this change keyword, we will
          // initialize an empty array.
          if (!currentVersion[keyword]) {
            currentVersion[keyword] = [];
          }

          if (yaml[keyword]) {
            const flags = Object.keys(yaml[keyword]);

            for (const flag of flags) {
              // Add the change to the current version. If the change flag has
              // a prefix we will add the prefix. Else we will return the string.
              currentVersion[keyword]?.push(
                ...yaml[keyword]?.[flag]?.map((change: string) => {
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

  const archive = YAML.stringify(versions);
  writeFileSync(changelogArchive, archive, { encoding: "utf8" });
  writeFileSync(changelogPath, generateChangelog(versions), { encoding: "utf8" });

  log("CHANGELOG.md finsihed writing.");

  log("Cleaning up files.");

  // Clean up the changelog directory after we have finished updating the CHANGELOG.
  readdirSync(changelogDir, { recursive: true, encoding: "utf8" }).forEach(dir => {
    if (isYamlFile(dir) && !dir.includes("archive.yml")) {
      rmSync(path.join(changelogDir, dir as string), { recursive: true, force: true });
    }
  });
  log("Finished cleaing. ");

  rl.close();
}

export { generateCommand };
