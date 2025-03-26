import { context, getOctokit } from "@actions/github";
import { generateCommand } from "./lib/generate";

const GITHUB_ACTOR = process.env.GITHUB_ACTOR;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Get the name of the author from github.
 */
async function getAuthorName() {
  // Log this to see what we get on a merge.
  console.log({ context });
  const user = await getOctokit(GITHUB_TOKEN as string).rest.users.getByUsername({
    username: GITHUB_ACTOR as string,
  });

  if (user?.data?.name) {
    return user.data.name;
  }

  // Fallback to GITHUB_ACTOR
  return GITHUB_ACTOR as string;
}

async function generate() {
  const authorName = await getAuthorName();
  generateCommand(authorName);
}

generate();
