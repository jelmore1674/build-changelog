import { endGroup, getInput, setFailed, setOutput, startGroup } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { getLatestRelease } from "@jelmore1674/changelog";
import { readFileSync } from "node:fs";
import { exit } from "node:process";
import { clean, inc, type ReleaseType } from "semver";
import { changelogPath, type Config } from "../lib/config";
import { generateCommand } from "../lib/generate";
import { notesCommand } from "../lib/releaseNotes";
import { log } from "../utils/log";
import { commitAndPush } from "./utils/commitAndPush";
import { commitWithApi } from "./utils/commitWithApi";
import { getAuthorName } from "./utils/getAuthorName";
import { getPrNumber } from "./utils/getPrNumber";
import { stringToBoolean } from "./utils/stringToBoolean";

/**
 * Format the flags from a key value pair to an array object.
 */
function formatFlags(flags: string) {
  return flags.split(",").reduce((acc, flag) => {
    acc[flag.split("=")[0]] = flag.split("=")[1];
    return acc;
  }, {} as Record<string, string>);
}

const releaseType = getInput("release_type", { required: false }) as ReleaseType;
const commitMessage = getInput("commit_message");
const dir = getInput("dir", { required: true });
const isApiCommit = stringToBoolean(getInput("commit_with_api"));
const skipCommit = stringToBoolean(getInput("skip_commit"));
const rawFlags = getInput("flags", { required: false });
const version = getInput("version", { required: false });

// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const git_tag_prefix = getInput("git_tag_prefix", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const reference_pull_requests = stringToBoolean(getInput("reference_pull_requests", { required: false }));
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author = stringToBoolean(getInput("show_author", { required: false }));
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author_full_name = stringToBoolean(getInput("show_author_full_name", { required: false }));

const flags = formatFlags(rawFlags);

async function generateChangelogAction() {
  // Check to make sure git exists.
  try {
    await exec("git", ["--version"]);
  } catch (_error) {
    setFailed("Git binary not found.");
    exit(1);
  }

  const config: Omit<Config, "repo_url" | "release_url" | "changelog_archive" | "prefers"> = {
    dir,
    flags,
    git_tag_prefix,
    reference_pull_requests,
    show_author,
    show_author_full_name,
  };

  let releaseVersion: string | null = "Unreleased";

  if (releaseType) {
    let cleanedVersion = clean(version);

    if (!cleanedVersion) {
      const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });
      const latestVersion = getLatestRelease(changelogFile);

      if (!latestVersion) {
        setFailed("Unable to find the version.");
        exit(1);
      }

      cleanedVersion = latestVersion;
    }

    releaseVersion = inc(cleanedVersion, releaseType);

    if (!releaseVersion) {
      setFailed("Unable to increment the version");
      exit(1);
    }
  }

  const author = await getAuthorName();
  const prNumber = await getPrNumber();

  startGroup("Generate Changelog");
  generateCommand(author, prNumber, releaseVersion, config);
  endGroup();

  if (!skipCommit) {
    const { stdout } = await getExecOutput("git", ["status", "--porcelain"]);

    if (!stdout.match(/CHANGELOG\.md/gi)) {
      log("No changes to the changelog");
      exit(0);
    }

    await exec("git", ["add", "."]);

    startGroup("Commit changes.");
    if (isApiCommit) {
      await commitWithApi(commitMessage);
    } else {
      await commitAndPush(commitMessage);
    }
    endGroup();
  }

  notesCommand(version);
  setOutput("release_version", `${git_tag_prefix}${releaseVersion}`);
}

export { generateChangelogAction };
