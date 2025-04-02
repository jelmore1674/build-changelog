import { endGroup, getInput, setFailed, startGroup } from "@actions/core";
import { exec, getExecOutput } from "@actions/exec";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";
import { log } from "../utils/log";
import { commitAndPush } from "./utils/commitAndPush";
import { commitWithApi } from "./utils/commitWithApi";
import { getAuthorName } from "./utils/getAuthorName";
import { getPrNumber } from "./utils/getPrNumber";

const isApiCommit = Boolean(getInput("commit_with_api"));
const commitMessage = getInput("commit_message");
const version = getInput("version");

const V_PREFIX_REGEX = /^v/;

async function generateChangelogAction() {
  // Check to make sure git exists.
  try {
    await exec("git", ["--version"]);
  } catch (_error) {
    setFailed("Git binary not found.");
    exit(1);
  }

  const cleanedVersion = version?.replace(V_PREFIX_REGEX, "");

  const author = await getAuthorName();
  const prNumber = await getPrNumber();

  startGroup("Generate Changelog");
  generateCommand(author, prNumber, cleanedVersion);
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
}

export { generateChangelogAction };
