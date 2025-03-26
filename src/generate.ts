import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { generateCommand } from "./lib/generate";
import { log } from "./utils/log";

const GITHUB_TOKEN = core.getInput("token");

/**
 * Get the name of the author from github.
 */
async function getAuthorName() {
  const user = await getOctokit(GITHUB_TOKEN).rest.users.getByUsername({
    username: context.actor,
  });

  const commit = await getOctokit(GITHUB_TOKEN).rest.repos.getCommit({
    ...context.repo,
    ref: context.sha,
  });

  core.debug(JSON.stringify(context, null, 2));

  console.info(JSON.stringify(commit.data, null, 2));

  const commitMessage = commit.data.commit.message;
  const coAuthors = commitMessage.match(/Co-authored-by:\s*(.*)/g);

  coAuthors?.map(coAuthor => log(`CoAuthor: ${coAuthor}`));

  if (user?.data?.name) {
    return user.data.name;
  }

  // Fallback to GITHUB_ACTOR
  return context.actor as string;
}

/**
 * Get the pr number for this commit hash
 */
async function getPrNumber() {
  if (context.payload.pull_request) {
    return context.payload.pull_request.number;
  }

  const pulls = await getOctokit(GITHUB_TOKEN).rest.search.issuesAndPullRequests({
    q: encodeURIComponent(`${context.sha} type:pr is:merged`),
  });

  log(`Detected a pr: ${pulls.data.items[0]?.number}`);

  return pulls.data.items[0]?.number;
}

async function generate() {
  const author = await getAuthorName();
  const prNumber = await getPrNumber();
  generateCommand(author, prNumber);
}

generate();

export { generate };
