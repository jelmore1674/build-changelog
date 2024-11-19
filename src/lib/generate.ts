import { existsSync, readdirSync, readFileSync, rmdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { isYamlFile } from "../utils/isYamlFile";
import { changelogArchive, changelogDir, changelogPath } from "./config";
import { generateChangelog, Keywords, Version, YamlChanges } from "./mustache";
import { rl } from "./readline";

function createChangelog() {
  console.log("Generating changelog.");
  const files = readdirSync(changelogDir, { recursive: true });

  let initialVersions = [];

  if (existsSync(changelogArchive)) {
    initialVersions = YAML.parse(readFileSync(changelogArchive, { encoding: "utf8" }));
  }

  const versions = files.reduce((acc: Version[], file) => {
    if (typeof file === "string") {
      if (isYamlFile(file) && !file.includes("archive.yml")) {
        const filePath = path.join(changelogDir, file);

        // Read the changes then delete the file.
        const changes = readFileSync(filePath, { encoding: "utf8" });
        rmSync(filePath);

        const yaml: YamlChanges = YAML.parse(changes);

        let version = yaml.version || path.basename(path.dirname(filePath))?.split("_")[0] || "Unreleased";
        let releaseDate = yaml.releaseDate || path.basename(path.dirname(filePath))?.split("_")[1] || "TBD";

        const foundRelease = acc.find((release) => release.version === version);
        const currentVersion: Version = foundRelease ?? { version, releaseDate };

        if (yaml) {
          const yamlKeys = Object.keys(yaml) as Keywords[];

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
      }
    }

    return acc.sort((a, b) => b.version.localeCompare(a.version));
  }, initialVersions);

  readdirSync(changelogDir, { recursive: true }).forEach(dir => {
    !dir.includes("archive.yml") && rmdirSync(path.join(changelogDir, dir as string));
  });

  const archive = YAML.stringify(versions);
  writeFileSync(changelogArchive, archive, { encoding: "utf8" });
  writeFileSync(changelogPath, generateChangelog(versions), { encoding: "utf8" });

  console.log("CHANGELOG.md finsihed writing.");
  rl.close();
}

export { createChangelog };
