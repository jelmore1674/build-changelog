import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { log } from "../../utils/log";

const GITHUB_TOKEN = getInput("token");

const issueRegex = /(?:fixe?|close|resolve)(?:s?d?) (?<issue>\#[0-9]+)/gi;

/**
 * Get the pr number for this commit hash
 */
async function getPrNumber() {
  if (context.payload.pull_request) {
    if (context.payload.pull_request.body) {
      const match = issueRegex.exec(context.payload.pull_request.body);
      console.info({ match, groups: match?.groups });
    }

    return context.payload.pull_request.number;
  }

  const pulls = await getOctokit(GITHUB_TOKEN).rest.search.issuesAndPullRequests({
    q: encodeURIComponent(`${context.sha} type:pr is:merged`),
  });

  log(`Detected a pr: ${pulls.data.items[0]?.number}`);

  return pulls.data.items[0]?.number;
}

export { getPrNumber };
