import { endGroup, getInput, setFailed, startGroup } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { exit } from "node:process";
import type { Config } from "../lib/config";
import { generateCommand } from "../lib/generate";
import { notesCommand } from "../lib/releaseNotes";
import { log } from "../utils/log";
import { commitAndPush } from "./utils/commitAndPush";
import { commitWithApi } from "./utils/commitWithApi";
import { getAuthorName } from "./utils/getAuthorName";
import { getPrNumber } from "./utils/getPrNumber";

/**
 * Format the flags from a key value pair to an array object.
 */
function formatFlags(flags: string) {
  return flags.split(",").reduce((acc, flag) => {
    acc[flag.split("=")[0]] = flag.split("=")[1];
    return acc;
  }, {} as Record<string, string>);
}

const commitMessage = getInput("commit_message");
const dir = getInput("dir", { required: true });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const git_tag_prefix = getInput("git_tag_prefix", { required: false });
const isApiCommit = Boolean(getInput("commit_with_api"));
const rawFlags = getInput("flags", { required: false });
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const reference_pull_requests = Boolean(getInput("reference_pull_requests", { required: false }));
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author = Boolean(getInput("show_author", { required: false }));
// biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
const show_author_full_name = Boolean(getInput("show_author_full_name", { required: false }));
const version = getInput("version");

const flags = formatFlags(rawFlags);

const V_PREFIX_REGEX = /^v/;

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

  const cleanedVersion = version?.replace(V_PREFIX_REGEX, "");

  const author = await getAuthorName();
  const prNumber = await getPrNumber();

  startGroup("Generate Changelog");
  generateCommand(author, prNumber, cleanedVersion, config);
  endGroup();

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

  notesCommand(version);
}

export { generateChangelogAction };
