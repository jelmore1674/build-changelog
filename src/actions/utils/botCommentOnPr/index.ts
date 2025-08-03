import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { tryCatch } from "@utils/tryCatch";
import { exit } from "node:process";

/**
 * Leave a comment on the pull request.
 *
 * @param message - the message to leave on the pull request.
 * @param prNumber - the pull request number.
 * @param [commentId] - The comment id used to update a comment.
 */
async function botCommentOnPr(message: string, prNumber: number, commentId?: number) {
  const token = getInput("token", { required: true });

  if (commentId) {
    const [error] = await tryCatch(
      getOctokit(token).rest.issues.updateComment({
        ...context.repo,
        comment_id: commentId,
        body: message,
      }),
    );

    if (error) {
      setFailed(`botCommentOnPr.updateComment\n\n${error.message}`);
      exit(1);
    }

    return;
  }

  const [error] = await tryCatch(
    getOctokit(token).rest.issues.createComment({
      issue_number: prNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: message,
    }),
  );

  if (error) {
    setFailed(`botCommentOnPr.createComment\n\n${error.message}`);
    exit(1);
  }
}

export { botCommentOnPr };
