import { getInput } from "@actions/core";
import { exec } from "@actions/exec";

async function commitAndPush(commitMessage: string) {
  const commitAuthor = getInput("commit_author");
  const commitEmail = getInput("commit_email");
  const commitUserName = getInput("commit_user_name");
  const commitOptions = getInput("commit_options");
  const pushOptions = getInput("push_options");

  await exec("git", [
    `-c user.name="${commitUserName}"`,
    `-c user.email="${commitEmail}"`,
    "commit",
    `-m "${commitMessage}"`,
    `--author="${commitAuthor}"`,
    commitOptions,
  ]);

  await exec("git", ["push", "origin", pushOptions]);
}

export { commitAndPush };
