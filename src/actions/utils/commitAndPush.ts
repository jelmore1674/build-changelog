import { getInput } from "@actions/core";
import { exec } from "@actions/exec";

async function commitAndPush(commitMessage: string) {
  const COMMIT_AUTHOR = getInput("commit_author");
  const COMMIT_EMAIL = getInput("commit_email");
  const COMMIT_USER_NAME = getInput("commit_user_name");
  const COMMIT_OPTIONS = getInput("commit_options");
  const PUSH_OPTIONS = getInput("push_options");

  await exec("git", [
    `-c user.name="${COMMIT_USER_NAME}"`,
    `-c user.email="${COMMIT_EMAIL}"`,
    "commit",
    `-m "${commitMessage}"`,
    `--author="${COMMIT_AUTHOR}"`,
    COMMIT_OPTIONS,
  ]);

  await exec("git", ["push", "origin", PUSH_OPTIONS]);
}

export { commitAndPush };
