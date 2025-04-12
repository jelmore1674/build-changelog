import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const GITHUB_TOKEN = getInput("token");

/**
 * Get the name of the author from github.
 */
async function getAuthorName(nameOverrides?: Record<string, string>) {
  if (nameOverrides) {
    if (nameOverrides[context.actor]) {
      return nameOverrides[context.actor];
    }
  }

  const user = await getOctokit(GITHUB_TOKEN).rest.users.getByUsername({
    username: context.actor,
  });

  if (user?.data?.name) {
    return user.data.name;
  }

  // Fallback to GITHUB_ACTOR
  return context.actor as string;
}

export { getAuthorName };
