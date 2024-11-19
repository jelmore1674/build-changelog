import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { changelogArchive, changelogDir, changelogPath } from "./config";
import { generateChangelog, Keywords, Version, YamlChanges } from "./mustache";
import { rl } from "./readline";

const YAML_KEY_FILTER = ["releaseDate", "version"];

/**
 *  The generate command will read the existing `yaml|yml` files in the
 *  `changelogDir`, write them to the `CHANGELOG.md`, and will remove the
 *  files when done.
 */
function generateCommand() {
  log("Generating changelog.");
  const files = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  let initialVersions = [];

  if (existsSync(changelogArchive)) {
    initialVersions = YAML.parse(readFileSync(changelogArchive, { encoding: "utf8" }));
  }

  const versions = files.reduce((acc: Version[], file) => {
    if (isYamlFile(file) && !file.includes("archive.yml")) {
      const filePath = path.join(changelogDir, file);

      // Read the changes then delete the file.
      const changes = readFileSync(filePath, { encoding: "utf8" });

      const yaml: YamlChanges = YAML.parse(changes);

      let version = yaml.version || "Unreleased";
      let releaseDate = yaml.releaseDate || "TBD";

      const foundRelease = acc.find((release) => release.version === version);
      const currentVersion: Version = foundRelease ?? { version, releaseDate };

      if (yaml) {
        const yamlProperties = Object.keys(yaml);

        const yamlKeys = yamlProperties.filter(key => !YAML_KEY_FILTER.includes(key)) as Keywords[];

        for (const key of yamlKeys) {
          if (!currentVersion[key]) {
            currentVersion[key] = [];
          }

          if (yaml[key]) {
            // TODO: Look into possibly removing this funcionality.
            // @ts-ignore - breaking could exists.
            if (yaml[key]?.breaking) {
              // @ts-ignore - breaking exists.
              currentVersion[key].push(...yaml[key].breaking.map((str: string) => `[Breaking 🧨] - ${str}`));
            } else {
              currentVersion[key].push(...yaml[key] as string[]);
            }
          }
        }

        if (!foundRelease) {
          acc.push(currentVersion);
        }
      }

      // Clean up changelog files.
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }

    return acc.sort((a, b) => b.version.localeCompare(a.version));
  }, initialVersions);

  readdirSync(changelogDir, { recursive: true }).forEach(dir => {
    !dir.includes("archive.yml") && rmSync(path.join(changelogDir, dir as string), { recursive: true, force: true });
  });

  const archive = YAML.stringify(versions);
  writeFileSync(changelogArchive, archive, { encoding: "utf8" });
  writeFileSync(changelogPath, generateChangelog(versions), { encoding: "utf8" });

  log("CHANGELOG.md finsihed writing.");
  rl.close();
}

export { generateCommand };
