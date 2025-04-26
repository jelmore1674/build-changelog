import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import type { Reference } from "@types";
import { log } from "@utils/log";
import { tryCatch } from "@utils/tryCatch";

/**
 * Regex used to find the linked issue or pull request.
 *
 * @link [regex101](https://regex101.com/r/v5aTcs/2)
 */
const issueRegex = /(?:fixe?|close|resolve)(?:s?d?) (\#[0-9]+)/gi;

/**
 * Find any references from the pull request body.
 *
 * @param [body=""] - The pull request body.
 */
async function getReferencesFromBody(body = "") {
  const token = getInput("token");
  const match = body.match(issueRegex);

  if (token && match && match?.length > 0) {
    const result = await Promise.all(match.map(async (i) => {
      const number = +i.split(" #")[1];
      const { error, data: res } = await tryCatch(
        getOctokit(token).rest.issues.get({
          repo: context.repo.repo,
          owner: context.repo.owner,
          // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
          issue_number: number,
        }),
      );

      if (error) {
        log(`Cannot find reference: ${number}`);
        return;
      }

      if (res.data.pull_request) {
        return {
          number,
          type: "pull_request",
        } as Reference;
      }

      return {
        number,
        type: "issue",
      } as Reference;
    }));

    return result.filter(Boolean) as Reference[];
  }
  return [];
}

export { getReferencesFromBody };
