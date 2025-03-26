import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { generateCommand } from "./lib/generate";

const GITHUB_TOKEN = getInput("token");

/**
 * Get the name of the author from github.
 */
async function getAuthorName() {
  const user = await getOctokit(GITHUB_TOKEN).rest.users.getByUsername({
    username: context.actor,
  });

  if (user?.data?.name) {
    return user.data.name;
  }

  // Fallback to GITHUB_ACTOR
  return context.actor as string;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the pr number for this commit hash
 */
async function recursiveGetPrNumber(count = 0): Promise<number> {
  if (context.payload.pull_request?.number) {
    return context.payload.pull_request.number;
  }

  if (count >= 10) {
    process.exit(100);
  }

  await sleep(10_000);

  const pulls = await getOctokit(GITHUB_TOKEN).rest.search.issuesAndPullRequests({
    q: `${context.sha} type:pr is:merged`,
  });

  console.info(`Detected a pr: ${pulls.data.items[0]?.number}`);

  if (!pulls.data.items[0]?.number) {
    return recursiveGetPrNumber(count + 1);
  }

  return pulls.data.items[0]?.number;
}

async function generate() {
  const author = await getAuthorName();
  const prNumber = await recursiveGetPrNumber();
  generateCommand(author, prNumber);
}

generate();

export { generate };
