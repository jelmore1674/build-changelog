import { debug, getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const skipLabels = getInput("skip_labels").split(",");
  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const set = new Set(pullRequestLabels);

  if (skipLabels.some(label => set.has(label))) {
    debug("Skip Enforcing Changelog.");
    exit(0);
  }

  await generateCommand("BCL_Bot");
  const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

  if (!stdout.match(/CHANGELOG\.md/gi)) {
    setFailed("Changelog changes not found.");
  }
}

export { enforceChangelogAction };
