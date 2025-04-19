import { debug, getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";
import { addChangelogDependabot } from "./utils/addChangelogDependabot";
import { stringToBoolean } from "./utils/stringToBoolean";

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
    await addChangelogDependabot(pullRequest.body);
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
