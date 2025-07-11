import { debug, getInput } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { commit, getValidStringInput } from "@jelmore1674/github-action-helpers";
import { parseChanges } from "@lib/generate";
import { isYamlFile } from "@utils/isYamlFile";
import { log } from "@utils/log";
import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { exit } from "node:process";
import YAML from "yaml";

/**
 * Regex used to get the changes from the pr body.
 */
const dependabotRegex = /^(?:(?:U|u)pdate|(?:B|b)ump)s? (.*?) (?:requirement )?from (.*) to (.*)/gm;

/**
 * Supported Change Sections for dependabot.
 */
type DependabotChangeSection = "changed" | "security";

interface DependabotChangeFile {
  author: string;
  changed?: string[];
  security?: string[];
}

/**
 * Add a changelog file when dependabot creates an update.
 */
async function addChangelogDependabot() {
  if (!context.payload.pull_request?.body) {
    return;
  }

  const dir = getInput("dir", { required: true });
  const dependabotChangeSection = getValidStringInput<DependabotChangeSection>(
    "dependabot_section",
    {
      required: true,
      validInputs: ["changed", "security"],
    },
  );

  const token = getInput("token", { required: true });

  const matches = context.payload.pull_request.body.match(dependabotRegex);

  if (!matches) {
    debug("No changes found.");
    exit(1);
  }

  debug(`matches found\n${matches}`);

  const dependabotUpdates = {
    author: "dependabot",
    [dependabotChangeSection]: matches,
  };

  const changelogFiles = readdirSync(`./${dir}`, { recursive: true, encoding: "utf8" });

  debug(`Files found:\n${changelogFiles}`);

  for (const file of changelogFiles) {
    if (isYamlFile(file)) {
      const filePath = `./${dir}/${file}`;
      const parsedFile = parseChanges<DependabotChangeFile>(filePath);
      debug(`File: ${file}\n\n${JSON.stringify(parsedFile, null, 2)}`);

      if (parsedFile.author !== "dependabot") {
        return;
      }

      const changeSection = parsedFile?.[dependabotChangeSection];

      if (
        changeSection && matches.every(change => changeSection.includes(change))
      ) {
        log("No new changes. Stopping action.");
        exit(0);
      }

      // Remove the file and continue.
      log("Removing the previous change file.");
      rmSync(filePath, { force: true });
    }
  }

  const ymlFile = YAML.stringify(dependabotUpdates);
  writeFileSync(`./${dir}/${context.sha}-${context.runId}.yml`, ymlFile, {
    encoding: "utf8",
  });

  await exec("git", ["add", "."]);
  await commit(token, "Add changelog file for dependabot.");
}

export { addChangelogDependabot };
