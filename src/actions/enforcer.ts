import { debug, getBooleanInput, getInput, setFailed } from "@actions/core";
import { getExecOutput } from "@actions/exec";
import { context, getOctokit } from "@actions/github";
import { parseChangelog } from "@jelmore1674/changelog";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";
import { getChangeCount } from "../utils/getChangeCount";
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
  const existingChangelog = getChangeCount(parseChangelog(changelog).versions);
  const newChangelog = generateCommand(context.actor, context.sha, prNumber);
  const currentChanges = generateCommand(
    context.actor,
    context.sha,
    prNumber,
    undefined,
    undefined,
    undefined,
    true,
  );
  const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

  console.info(stdout);

  const botNames = ["github-actions[bot]", "build-changelog[bot]"];

  let exitsingCommentId: number | undefined;

  try {
    const { data } = await getOctokit(token).rest.issues.listComments({
      issue_number: prNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    const foundComment = data.find(i => i?.user?.type === "Bot" && botNames.includes(i.user.login));
    console.info(foundComment);
    if (foundComment) {
      exitsingCommentId = foundComment.id;
    }
  } catch (_e) {
  }

  if (existingChangelog === newChangelog.count) {
    try {
      if (exitsingCommentId) {
        await getOctokit(token).rest.issues.updateComment({
          ...context.repo,
          comment_id: exitsingCommentId,
          body: `@${context.actor} Don't forget to update your changelog.`,
        });
      } else {
        await getOctokit(token).rest.issues.createComment({
          issue_number: prNumber,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: `@${context.actor} Don't forget to update your changelog.`,
        });
      }
    } catch (e) {
      console.info({ e });
    }
    setFailed("Changelog changes not found.");
  } else {
    try {
      if (exitsingCommentId) {
        await getOctokit(token).rest.issues.updateComment({
          ...context.repo,
          comment_id: exitsingCommentId,
          body: currentChanges.latestChanges,
        });
      } else {
        await getOctokit(token).rest.issues.createComment({
          issue_number: prNumber,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: `\`\`\`md\n${currentChanges.latestChanges}\n\`\`\``,
        });
      }
    } catch (e) {
      console.info({ e });
    }
  }
}

export { enforceChangelogAction };
