import { endGroup, getBooleanInput, startGroup } from "@actions/core";
import { context } from "@actions/github";
import { getArrayInput } from "@jelmore1674/github-action-helpers";
import { log } from "@utils/log";
import { exit } from "node:process";
import { addChangelogDependabot } from "./utils/addChangelogDependabot";
import { compareChangelogs } from "./utils/compareChangelogs";

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const enableDependabot = getBooleanInput("enable_dependabot", { required: false });
  const dependabotLabels = getArrayInput("dependabot_labels");
  const skipLabels = getArrayInput("skip_labels");

  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const set = new Set(pullRequestLabels);

  if (
    enableDependabot && dependabotLabels.some(label => set.has(label))
    && pullRequest?.body && pullRequest?.user.login === "dependabot[bot]"
  ) {
    startGroup("🤖 Dependabot Changelog Update. 🤖");
    await addChangelogDependabot();
    endGroup();
  }

  if (skipLabels.some(label => set.has(label))) {
    log("⏩ Skip Enforcing Changelog. ⏩");
    exit(0);
  }

  await compareChangelogs();
}

export { enforceChangelogAction };
