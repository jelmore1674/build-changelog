import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { log } from "../../utils/log";

const GITHUB_TOKEN = getInput("token");

/**
 * Get the pr number for this commit hash
 */
async function getPrNumber() {
  if (context.payload.pull_request) {
    console.info({ prBody: context.payload.pull_request.body });
    return context.payload.pull_request.number;
  }

  const pulls = await getOctokit(GITHUB_TOKEN).rest.search.issuesAndPullRequests({
    q: encodeURIComponent(`${context.sha} type:pr is:merged`),
  });

  log(`Detected a pr: ${pulls.data.items[0]?.number}`);

  return pulls.data.items[0]?.number;
}

export { getPrNumber };
