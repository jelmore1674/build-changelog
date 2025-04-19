import { debug } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { exit } from "node:process";
import YAML from "yaml";
import { parseChanges } from "../../lib/generate";
import { isYamlFile } from "../../utils/isYamlFile";
import { log } from "../../utils/log";
import { commitWithApi } from "./commitWithApi";

/**
 * Regex used to get the changes from the pr body.
 */
const dependabotRegex = /^(?:(?:U|u)pdate|(?:B|b)ump)s? (.*?) (?:requirement )?from (.*) to (.*)/gm;

interface DependabotChangeFile {
  author: string;
  security: string[];
}

async function addChangelogDependabot(pullRequestBody: string) {
  const matches = pullRequestBody.match(dependabotRegex);

  if (!matches) {
    debug("No changes found.");
    exit(1);
  }

  debug(`matches found\n${matches}`);

  const dependabotUpdates = {
    author: "dependabot",
    security: matches,
  };

  const changelogFiles = readdirSync("./changelog", { recursive: true, encoding: "utf8" });

  debug(`Files found:\n${changelogFiles}`);

  for (const file of changelogFiles) {
    if (isYamlFile(file)) {
      const filePath = `./changelog/${file}`;
      const parsedFile = parseChanges<DependabotChangeFile>(filePath);

      debug(`File: ${file}\n\n${JSON.stringify(parsedFile, null, 2)}`);

      if (parsedFile.author !== "dependabot") {
        return;
      }

      if (matches.every(change => parsedFile.security.includes(change))) {
        log("No new changes. Stopping action.");
        exit(0);
      }

      // Remove the file and continue.
      log("Removing the previous change file.");
      rmSync(filePath, { force: true });
    }
  }

  const ymlFile = YAML.stringify(dependabotUpdates);
  writeFileSync(`./changelog/${context.sha}-${context.runId}.yml`, ymlFile, {
    encoding: "utf8",
  });

  await exec("git", ["add", "."]);
  await commitWithApi("Add changelog file for dependabot.");
}

export { addChangelogDependabot };
