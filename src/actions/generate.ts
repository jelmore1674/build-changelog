import { getInput, setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { exit } from "node:process";
import { generateCommand } from "../lib/generate";
import { commitAndPush } from "./utils/commitAndPush";
import { commitWithApi } from "./utils/commitWithApi";
import { getAuthorName } from "./utils/getAuthorName";
import { getPrNumber } from "./utils/getPrNumber";

const COMMIT_WITH_API = Boolean(getInput("commit_with_api"));
const COMMIT_MESSAGE = getInput("commit_message");

async function generateChangelogAction() {
  // Check to make sure git exists.
  try {
    await exec("git", ["--version"]);
  } catch (e) {
    setFailed("Git binary not found.");
    exit(1);
  }

  const author = await getAuthorName();
  const prNumber = await getPrNumber();
  generateCommand(author, prNumber);

  await exec("git", ["add", "."]);

  if (COMMIT_WITH_API) {
    await commitWithApi(COMMIT_MESSAGE);
  } else {
    await commitAndPush(COMMIT_MESSAGE);
  }
}

export { generateChangelogAction };
