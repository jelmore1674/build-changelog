import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { parseChangelog } from "@jelmore1674/changelog";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import type { Config } from "../../lib/config";
import { generateCommand } from "../../lib/generate";
import { getChangeCount } from "../../utils/getChangeCount";
import { getAuthorName } from "./getAuthorName";
import { getPrNumber } from "./getPrNumber";

const token = getInput("token", { required: false });

async function botCommentOnPr(message: string, prNumber: number, commentId?: number) {
  if (commentId) {
    await getOctokit(token).rest.issues.updateComment({
      ...context.repo,
      // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
      comment_id: commentId,
      body: message,
    });

    return;
  }

  await getOctokit(token).rest.issues.createComment({
    // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
    issue_number: prNumber,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: message,
  });
}

async function compareChangelogs(
  commentOnPr: boolean,
  token: string,
  config: Omit<Config, "repo_url" | "release_url" | "changelog_archive" | "prefers">,
  nameOverrides?: Record<string, string>,
  customBotName?: string,
) {
  const author = await getAuthorName(nameOverrides);
  const prNumber = await getPrNumber();

  const changelog = readFileSync("CHANGELOG.md", "utf8");
  const existingChangelog = getChangeCount(parseChangelog(changelog).versions);

  const currentChanges = generateCommand(
    author,
    context.sha,
    prNumber,
    undefined,
    undefined,
    config,
    true,
  );

  const newChangelog = generateCommand(author, context.sha, prNumber);

  if (commentOnPr) {
    const botNames = ["github-actions[bot]", "build-changelog[bot]"];

    if (customBotName) {
      botNames.push(customBotName);
    }

    let exitsingCommentId: number | undefined;

    const { data } = await getOctokit(token).rest.issues.listComments({
      // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
      issue_number: prNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    const foundComment = data.find(i => i?.user?.type === "Bot" && botNames.includes(i.user.login));
    if (foundComment) {
      exitsingCommentId = foundComment.id;
    }

    if (existingChangelog === newChangelog.count) {
      const failedCommentMessage = `@${context.actor} Don't forget to update your changelog.`;
      await botCommentOnPr(failedCommentMessage, prNumber, exitsingCommentId);
      setFailed("Changelog changes not found.");
      exit(1);
    }

    await botCommentOnPr(currentChanges.latestChanges, prNumber, exitsingCommentId);

    exit(0);
  }

  if (existingChangelog === newChangelog.count) {
    setFailed("Changelog changes not found.");
  }
}

export { compareChangelogs };
