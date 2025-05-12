import {
  endGroup,
  getBooleanInput,
  getInput,
  setFailed,
  setOutput,
  startGroup,
} from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { context } from "@actions/github";
import { getLatestRelease } from "@jelmore1674/changelog";
import {
  checkIfGitExists,
  commit,
  getKeyValuePairInput,
  getValidStringInput,
} from "@jelmore1674/github-action-helpers";
import { changelogPath } from "@lib/config";
import { generateCommand } from "@lib/generate";
import { notesCommand } from "@lib/releaseNotes";
import type { ChangelogStyle, GenerateConfig } from "@types";
import { log } from "@utils/log";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { clean, inc, type ReleaseType } from "semver";
import { commitAndPush } from "./utils/commitAndPush";
import { getAuthorName } from "./utils/getAuthorName";
import { getPullRequestInfo } from "./utils/getPullRequestInfo";

const releaseType = getValidStringInput<ReleaseType>("release_type", {
  validInputs: ["patch", "minor", "major"],
});
const changelogStyle = getValidStringInput<ChangelogStyle>("changelog_style", {
  validInputs: ["keep-a-changelog", "common-changelog", "custom"],
});
const customHeading = getInput("changelog_heading", { required: false });
const commitMessage = getInput("commit_message");
const dir = getInput("dir", { required: true });
const isApiCommit = getBooleanInput("commit_with_api");
const skipCommit = getBooleanInput("skip_commit");
const version = getInput("version", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const reference_sha = getBooleanInput("reference_sha", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const git_tag_prefix = getInput("git_tag_prefix", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const reference_pull_requests = getBooleanInput("reference_pull_requests", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author = getBooleanInput("show_author", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author_full_name = getBooleanInput("show_author_full_name", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_git_tag_prefix = getBooleanInput("show_git_tag_prefix", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const auto_versioning = getBooleanInput("auto_versioning", { required: false });

const flags = getKeyValuePairInput("flags");
const nameOverrides = getKeyValuePairInput("name_override");

async function generateChangelogAction() {
  // Check to make sure git exists.
  const { error } = await checkIfGitExists();
  if (error) {
    setFailed(error);
    exit(1);
  }

  const config: GenerateConfig = {
    dir,
    flags,
    git_tag_prefix,
    reference_pull_requests,
    show_author,
    show_author_full_name,
    reference_sha,
    show_git_tag_prefix,
    auto_versioning,
  };

  let releaseVersion: string | null = "Unreleased";

  if (releaseType) {
    startGroup("🎯 Set Unrleased Changes Version");
    let cleanedVersion = clean(version);

    if (!cleanedVersion) {
      const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
      const latestVersion = getLatestRelease(changelogFile);

      if (!latestVersion) {
        setFailed("🚨 Unable to find the version. 🚨");
        exit(1);
      }

      cleanedVersion = latestVersion;
    }

    releaseVersion = inc(cleanedVersion, releaseType);

    if (!releaseVersion) {
      setFailed("🚨 Unable to increment the version 🚨");
      exit(1);
    }

    endGroup();
  }

  startGroup("🎯 Get actor information.");
  const { number, references } = await getPullRequestInfo();
  const author = await getAuthorName(nameOverrides, number);
  endGroup();

  startGroup("🎯 Generate Changelog");
  generateCommand(
    {
      author,
      sha: context.sha,
      prNumber: number,
      prReferences: references,
      releaseVersion,
      changelogOptions: {
        changelogStyle,
        customHeading,
      },
    },
    config,
  );
  endGroup();

  if (!skipCommit) {
    startGroup("🎯 Commit changes.");
    const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

    if (!stdout.match(/CHANGELOG\.md/gi)) {
      log("⏩ No changes to the changelog");
      exit(0);
    }

    await exec("git", ["add", "."]);

    if (isApiCommit) {
      const token = getInput("token", { required: true });
      await commit(token, commitMessage);
    } else {
      await commitAndPush(commitMessage);
    }
    endGroup();
  }

  notesCommand(version);
  setOutput("release_version", `${git_tag_prefix}${releaseVersion}`);
}

export { generateChangelogAction };
