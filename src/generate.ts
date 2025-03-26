import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { generateCommand } from "./lib/generate";

const GITHUB_TOKEN = getInput("token");

/**
 * Get the name of the author from github.
 */
async function getAuthorName() {
  // Log this to see what we get on a merge.
  console.info({ context });

  const user = await getOctokit(GITHUB_TOKEN as string).rest.users.getByUsername({
    username: context.actor,
  });

  if (user?.data?.name) {
    return user.data.name;
  }

  // Fallback to GITHUB_ACTOR
  return context.actor as string;
}

async function generate() {
  const authorName = await getAuthorName();
  generateCommand(authorName);
}

generate();

export { generate };
