import { debug, getBooleanInput, getInput } from "@actions/core";
import { context } from "@actions/github";
import { exit } from "node:process";
import { type Config, config as baseConfig } from "../lib/config";
import { addChangelogDependabot } from "./utils/addChangelogDependabot";
import { compareChangelogs } from "./utils/compareChangelogs";

/**
 * @todo Replace with new getKeyValuePairInput inside of github-action-helpers
 *
 * Format a key value pair to an object.
 *
 * @param pair the key value pair to turn into an object.
 */
function formatKeyValuePairToObject(pair: string) {
  if (!pair) {
    return undefined;
  }

  return pair.split(",").reduce((acc, value) => {
    acc[value.split("=")[0]] = value.split("=")[1];
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Run the generate command and check the git diff to see if there are changes
 * in the CHANGELOG.
 */
async function enforceChangelogAction() {
  const enableDependabot = getBooleanInput("enable_dependabot", { required: false });
  const dependabotLabels = getInput("dependabot_labels").split(",") || [];
  const skipLabels = getInput("skip_labels").split(",");
  const nameOverrideInput = getInput("name_override", { required: false });
  const pullRequest = context.payload.pull_request;
  const pullRequestLabels = pullRequest?.labels?.map((label: { name: string }) => label.name) || [];
  const set = new Set(pullRequestLabels);
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  const show_author_full_name = getBooleanInput("show_author_full_name", { required: false });
  const token = getInput("token");
  const customBotName = getInput("custom_bot_name", { required: false });
  const nameOverrides = formatKeyValuePairToObject(nameOverrideInput);
  const commentOnPr = getBooleanInput("comment_on_pr", { required: false });

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
  const config: Omit<Config, "repo_url" | "release_url" | "changelog_archive" | "prefers"> = {
    ...baseConfig,
    show_author_full_name,
  };

  await compareChangelogs(commentOnPr, token, config, nameOverrides, customBotName);
}

export { enforceChangelogAction };
