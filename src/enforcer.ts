import { getInput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { execSync } from "node:child_process";

function enforceChangelog() {
  const status = execSync("git status --porcelain", { encoding: "utf8" });

  const skipLabels = getInput("skip_labels").split(",");

  if (!status) {
    const pullRequest = context.payload.pull_request;

    const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
    const set = new Set(pullRequestLabels);

    // const author = pullRequest?.user?.full_name;

    if (!skipLabels.some(label => set.has(label))) {
      setFailed("Changelog changes not found.");
    }
  }
}

enforceChangelog();
