import { debug, getBooleanInput, getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context, getOctokit } from "@actions/github";
import { parseChangelog } from "@jelmore1674/changelog";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";
import { addChangelogDependabot } from "./utils/addChangelogDependabot";
import { getPrNumber } from "./utils/getPrNumber";

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const enableDependabot = getBooleanInput("enable_dependabot", { required: false });
  const dependabotLabels = getInput("dependabot_labels").split(",") || [];
  const skipLabels = getInput("skip_labels").split(",");
  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const changelogStyle = getInput("changelogStyle", { required: false });
  const set = new Set(pullRequestLabels);
  const token = getInput("token");

  console.info(token);

  if (
    enableDependabot && dependabotLabels.some(label => set.has(label))
    && pullRequest?.body && pullRequest?.user.login === "dependabot[bot]"
  ) {
    await addChangelogDependabot();
  }

  if (skipLabels.some(label => set.has(label))) {
    debug("Skip Enforcing Changelog.");
    exit(0);
  }

  const prNumber = await getPrNumber();

  const changelog = readFileSync("CHANGELOG.md", "utf8");
  const existingChangelog = parseChangelog(changelog).versions.length;
  const newChangelog = generateCommand("BCL_Bot", context.sha, prNumber);
  const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

  console.info(stdout);

  try {
    const comments = await getOctokit(token).rest.issues.listComments({
      issue_number: prNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    console.info(comments.data);
  } catch (_e) {
  }

  if (existingChangelog <= newChangelog) {
    // try {
    //  const response = await getOctokit(token).rest.issues.createComment({
    //    issue_number: prNumber,
    //    owner: context.repo.owner,
    //    repo: context.repo.repo,
    //    body: "This is a comment",
    //  });
    //
    //  console.info({ response });
    // } catch (e) {
    //  console.info({ e });
    // }
    setFailed("Changelog changes not found.");
  }
}

export { enforceChangelogAction };
