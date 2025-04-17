import { debug, getInput, setFailed } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { execSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { exit } from "node:process";
import YAML from "yaml";
import { generateCommand } from "../lib/generate";
import { commitWithApi } from "./utils/commitWithApi";
import { stringToBoolean } from "./utils/stringToBoolean";

/**
 * Regex used to get the changes from the pr body.
 */
const dependabotRegex = /^(?:(?:U|u)pdate|(?:B|b)ump)s? (.*?) (?:requirement )?from (.*) to (.*)/gm;

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

      const existing = readdirSync("./changelog", { encoding: "utf8" });

      console.log({ existing });

      const ymlFile = YAML.stringify(dependabotUpdates);

      writeFileSync(`./changelog/${context.sha}-${context.runId}.yml`, ymlFile, { encoding: "utf8" });

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
