import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import type { Reference } from "@types";
import { log } from "@utils/log";
import { tryCatch } from "@utils/tryCatch";
import { getReferencesFromBody } from "../getReferencesFromBody";

const NO_PR_FOUND = { number: undefined, references: [] as Reference[] };

/**
 * Get the pr number and references from the body.
 */
async function getPullRequestInfo() {
  if (context.payload.pull_request?.number) {
    log(`Detected a pr: ${context.payload.pull_request.number}`);

    const references = await getReferencesFromBody(context.payload.pull_request?.body ?? "");

    return { number: context.payload.pull_request.number, references };
  }

  const token = getInput("token");

  const { error, data: pulls } = await tryCatch(
    getOctokit(token).rest.search.issuesAndPullRequests({
      q: encodeURIComponent(`${context.sha} type:pr is:merged`),
    }),
  );

  if (error) {
    return NO_PR_FOUND;
  }

  log(`Detected a pr: ${pulls.data.items[0]?.number}`);

  if (pulls.data.items?.[0]?.number) {
    const references = await getReferencesFromBody(pulls.data.items[0]?.body ?? "");
    return { number: pulls.data.items[0].number, references };
  }

  return NO_PR_FOUND;
}

export { getPullRequestInfo };
