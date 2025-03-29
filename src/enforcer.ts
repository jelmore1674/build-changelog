import { getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { generate } from "./generate";

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelog() {
  await generate();

  const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

  const skipLabels = getInput("skip_labels").split(",");

  if (!stdout.match(/CHANGELOG\.md/gi)) {
    const pullRequest = context.payload.pull_request;

    const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
    const set = new Set(pullRequestLabels);

    if (!skipLabels.some(label => set.has(label))) {
      setFailed("Changelog changes not found.");
    }
  }
}

enforceChangelog();
