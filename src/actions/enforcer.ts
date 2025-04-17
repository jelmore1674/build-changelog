import { debug, getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { writeFileSync } from "node:fs";
import { exit } from "node:process";
import YAML from "yaml";
import { generateCommand } from "../lib/generate";

const depbendabotRegex = /^(?!<li\>).*(?:(?:U|u)pdate|(?:B|b)ump)s? (\S+?) (?:requirement )?from (\S*) to (\S*)/gm;

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const skipLabels = getInput("skip_labels").split(",");
  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const set = new Set(pullRequestLabels);

  if (pullRequest?.body) {
    const matches = pullRequest.body.match(depbendabotRegex);

    const depbendabotUpdates = {
      author: "depbendabot",
      security: matches,
    };

    const ymlFile = YAML.stringify(depbendabotUpdates);

    console.log({ ymlFile });

    writeFileSync(`./changelog/${context.sha}-${context.runId}.yml`, ymlFile, { encoding: "utf8" });
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
