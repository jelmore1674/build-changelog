import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { generateChangelog, Keywords, Version, YamlChanges } from "../templates";
import { isYamlFile } from "../utils/isYamlFile";
import { changelogDir, config } from "./config";
import { rl } from "./readline";

function createChangelog() {
  console.log("Generating changelog.");
  const files = readdirSync(changelogDir, { recursive: true });

  const versions = files.reduce((acc: Version[], dir) => {
    if (typeof dir === "string") {
      if (isYamlFile(dir)) {
        const d = path.join(changelogDir, dir);

        const [release, releaseDate] = path.basename(path.dirname(d)).split(config.version_date_separator);

        const exists = acc.find(({ version }) => version === release);

        const currentVersion: Version = exists ?? { version: release, releaseDate: releaseDate ?? "TBD" };

        const changes = readFileSync(d, { encoding: "utf8" });
        const yaml: YamlChanges = YAML.parse(changes);

        if (yaml) {
          const yamlKeys = Object.keys(yaml) as Keywords[];

          for (const key of yamlKeys) {
            if (!currentVersion[key]) {
              currentVersion[key] = [];
            }

            if (yaml[key]) {
              // @ts-ignore - breaking could exist.
              if (yaml[key]?.breaking) {
                // @ts-ignore - breaking exists.
                currentVersion[key].push(...yaml[key].breaking.map((str: string) => `[Breaking 🧨] - ${str}`));
              } else {
                currentVersion[key].push(...yaml[key] as string[]);
              }
            }
          }

          if (!exists) {
            acc.push(currentVersion);
          }
        }
      }
    }

    return acc.sort((a, b) => b.version.localeCompare(a.version));
  }, []);

  writeFileSync(path.join(process.cwd(), "CHANGELOG.md"), generateChangelog(versions), { encoding: "utf8" });

  console.log("CHANGELOG.md finsihed writing.");
  rl.close();
}

export { createChangelog };
