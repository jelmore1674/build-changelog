import { endGroup, getBooleanInput, getInput, setFailed, startGroup } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { parseChangelog } from "@jelmore1674/changelog";
import { getKeyValuePairInput } from "@jelmore1674/github-action-helpers";
import { changelogPath, config as baseConfig } from "@lib/config";
import { generateCommand } from "@lib/generate";
import type { GenerateConfig } from "@types";
import { getChangeCount } from "@utils/getChangeCount";
import { log } from "@utils/log";
import { tryCatch } from "@utils/tryCatch";
import chalk from "chalk";
import { existsSync, readFileSync } from "node:fs";
import { exit } from "node:process";
import { botCommentOnPr } from "../botCommentOnPr";
import { getAuthorName } from "../getAuthorName";
import { getPullRequestInfo } from "../getPullRequestInfo";

async function compareChangelogs() {
  const customBotName = getInput("custom_bot_name", { required: false });
  const nameOverrides = getKeyValuePairInput("name_override");
  const commentOnPr = getBooleanInput("comment_on_pr", { required: false });
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  const show_author_full_name = getBooleanInput("show_author_full_name", { required: false });

  const { number, references } = await getPullRequestInfo();
  const author = await getAuthorName(nameOverrides, number);

  chalk.level = 3;

  let existingChangelog = 0;

  if (existsSync(changelogPath)) {
    const changelog = readFileSync("CHANGELOG.md", "utf8");
    existingChangelog = getChangeCount(parseChangelog(changelog).versions);
  }
  const config: GenerateConfig = {
    ...baseConfig,
    show_author_full_name,
  };

  startGroup("🎯 Get Current Changelog changes. 🎯");
  const currentChanges = generateCommand(
    {
      author,
      sha: context.sha,
      prNumber: number,
      prReferences: references,
    },
    config,
    true,
  );
  endGroup();

  startGroup("🎯 Get Latest Changes. 🎯");
  const newChangelog = generateCommand({
    author,
    sha: context.sha,
    prNumber: number,
    prReferences: [],
  });
  endGroup();

  const noChanges = existingChangelog === newChangelog.count;

  const status = noChanges ? "🔴" : "🟢";

  const logColor = status ? chalk.bgRed.black.bold : chalk.bgGreen.white.bold;

  log(
    logColor(
      `\n${status} Previous Changes: ${existingChangelog} ${status}\n${status} Current Changes: ${newChangelog.count} ${status}`,
    ),
  );

  if (number && commentOnPr) {
    const token = getInput("token", { required: true });

    const botNames = ["github-actions[bot]", "build-changelog[bot]"];

    if (customBotName) {
      botNames.push(customBotName);
    }

    let exitsingCommentId: number | undefined;

    const [error, response] = await tryCatch(
      getOctokit(token).rest.issues.listComments({
        // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
        issue_number: number,
        owner: context.repo.owner,
        repo: context.repo.repo,
      }),
    );

    if (error) {
      setFailed(`🚨 compareChangelogs.listComments\n\n${error.message} 🚨`);
      exit(1);
    }

    const foundComment = response.data.find(i =>
      i?.user?.type === "Bot" && botNames.includes(i.user.login)
    );
    if (foundComment) {
      exitsingCommentId = foundComment.id;
    }

    if (noChanges) {
      const failedCommentMessage = `🚨 @${context.actor} Don't forget to update your changelog. 🚨`;
      await botCommentOnPr(failedCommentMessage, number, exitsingCommentId);
      setFailed("🚨 Changelog changes not found. 🚨");
      exit(1);
    }

    await botCommentOnPr(currentChanges.latestChanges, number, exitsingCommentId);

    exit(0);
  }

  if (noChanges) {
    setFailed("🚨 Changelog changes not found. 🚨");
  }
}

export { compareChangelogs };
