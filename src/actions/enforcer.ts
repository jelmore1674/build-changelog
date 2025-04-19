import { debug, getInput, setFailed } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { exit } from "node:process";
import YAML from "yaml";
import { generateCommand, parseChanges } from "../lib/generate";
import { isYamlFile } from "../utils/isYamlFile";
import { log } from "../utils/log";
import { commitWithApi } from "./utils/commitWithApi";
import { stringToBoolean } from "./utils/stringToBoolean";

/**
 * Regex used to get the changes from the pr body.
 */
const dependabotRegex = /^(?:(?:U|u)pdate|(?:B|b)ump)s? (.*?) (?:requirement )?from (.*) to (.*)/gm;

interface DependabotChangeFile {
  author: string;
  security?: string[];
}

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const enableDependabot = stringToBoolean(getInput("enable_dependabot", { required: false }));
  const dependabotLabels = getInput("dependabot_labels").split(",") || [];
  const skipLabels = getInput("skip_labels").split(",");
  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const set = new Set(pullRequestLabels);

  if (
    enableDependabot && dependabotLabels.some(label => set.has(label))
    && pullRequest?.body && pullRequest?.user.login === "dependabot[bot]"
  ) {
    const matches = pullRequest.body.match(dependabotRegex);

    if (matches && matches.length > 0) {
      const dependabotUpdates = {
        author: "dependabot",
        security: matches,
      };

      const changelogFiles = readdirSync("./changelog", { recursive: true, encoding: "utf8" });

      for (const file of changelogFiles) {
        if (isYamlFile(file)) {
          const filePath = `./changelog/${file}`;
          const parsedFile = parseChanges<DependabotChangeFile>(filePath);

          if (parsedFile.author === "dependabot") {
            if (parsedFile.security) {
              const allChangesMatch = parsedFile.security.every(change => matches.includes(change));

              if (allChangesMatch) {
                log("No new changes. Closing action.");
                exit(0);
              }

              // Remove the file and continue.
              log("Removing the previous change file.");
              rmSync(filePath, { force: true });
            }
          }
        }
      }

      const ymlFile = YAML.stringify(dependabotUpdates);
      writeFileSync(`./changelog/${context.sha}-${context.runId}.yml`, ymlFile, {
        encoding: "utf8",
      });

      await exec("git", ["add", "."]);
      await commitWithApi("Add changelog file for dependabot.");
    }
  }

  if (skipLabels.some(label => set.has(label))) {
    debug("Skip Enforcing Changelog.");
    exit(0);
  }

  generateCommand("BCL_Bot", context.sha, context.payload.pull_request?.number);
  const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

  if (!stdout.match(/CHANGELOG\.md/gi)) {
    setFailed("Changelog changes not found.");
  }
}

export { enforceChangelogAction };
