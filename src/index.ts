#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { type Changes, generateChangelog, type Keywords, type Version } from "./templates";
import { isYamlFile } from "./utils/isYamlFile";

const changelogDir = process.argv[2];

const dir = path.join(__dirname, changelogDir);
const files = readdirSync(dir, { recursive: true });

const versions = files.reduce((acc: Version[], dir) => {
  if (typeof dir === "string") {
    if (isYamlFile(dir)) {
      const d = path.join(__dirname, `${changelogDir}/${dir}`);
      const [release, releaseDate] = path.basename(path.dirname(d)).split("_");

      const exists = acc.find(({ version }) => version === release);

      const currentVersion: Version = exists ?? { version: release, releaseDate: releaseDate ?? "TBD" };

      const changes = readFileSync(d, { encoding: "utf8" });
      const yaml: Changes = YAML.parse(changes);

      const yamlKeys = Object.keys(yaml) as Keywords[];

      for (const key of yamlKeys) {
        if (!currentVersion[key]) {
          currentVersion[key] = [];
        }

        if (yaml[key]) {
          currentVersion[key].push(...yaml[key]);
        }
      }

      if (!exists) {
        acc.push(currentVersion);
      }
    }
  }

  return acc.sort((a, b) => b.version.localeCompare(a.version));
}, []);

writeFileSync("CHANGELOG.md", generateChangelog(versions), { encoding: "utf8" });
