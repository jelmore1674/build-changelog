#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { generateChangelog, type Keywords, type Version, type YamlChanges } from "./templates";
import { isYamlFile } from "./utils/isYamlFile";

type Config = {
  /** the directory our changlog files will be in */
  dir: string;
  /** Custom list of keywords. */
  keywords: string[];
  /** Custom list of flags. */
  flags: string[];
  /** The separator to change how we do the date of a version */
  version_date_separator: string;
};

const initialKeywords: Keywords[] = ["added", "changed", "fixed", "deprecated", "removed", "security"];
const initialFlags = ["breaking"];

const initialConfig: Config = {
  dir: "changelog",
  keywords: initialKeywords,
  flags: initialFlags,
  version_date_separator: "_",
};

let rawConfig = "";
let config = initialConfig;

// Look for the `bcl.yml` config file.
const configPath = path.join(process.cwd(), "bcl.yml");

// Use the initial config if we do not have a config file.
if (!existsSync(configPath)) {
} else {
  rawConfig = readFileSync(configPath, { encoding: "utf8" });
  config = { ...initialConfig, ...YAML.parse(rawConfig) };
}

const dir = path.join(process.cwd(), config.dir);
const files = readdirSync(dir, { recursive: true });

const versions = files.reduce((acc: Version[], dir) => {
  if (typeof dir === "string") {
    if (isYamlFile(dir)) {
      const d = path.join(process.cwd(), `${config.dir}/${dir}`);

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
