import { getBooleanInput } from "@actions/core";
import { context } from "@actions/github";
import { restClient } from "../github";

async function getPrAuthorName(
  pullRequestNumber: number,
  nameOverrides?: Record<string, string>,
  showAuthorFullName?: boolean,
) {
  const pr = await restClient.pulls.get({
    ...context.repo,
    // biome-ignore lint/style/useNamingConvention: api
    pull_number: pullRequestNumber,
  });

  if (nameOverrides) {
    if (nameOverrides[pr.data.user.login]) {
      return {
        name: nameOverrides[pr.data.user.login],
        url: pr.data.user.html_url,
      };
    }
  }

  if (showAuthorFullName) {
    if (pr.data.user.name) {
      return {
        name: pr.data.user.name,
        url: pr.data.user.html_url,
      };
    }
  }

  return {
    name: pr.data.user.login,
    url: pr.data.user.html_url,
  };
}

/**
 * Get the name of the author from github.
 */
async function getAuthorName(nameOverrides?: Record<string, string>, pullRequestNumber?: number) {
  const showAuthorFullName = getBooleanInput("show_author_full_name", { required: false });

  if (pullRequestNumber) {
    return await getPrAuthorName(pullRequestNumber, nameOverrides, showAuthorFullName);
  }

  const url = `${context.serverUrl}/${context.actor}`;

  if (nameOverrides) {
    if (nameOverrides[context.actor]) {
      return {
        name: nameOverrides[context.actor],
        url,
      };
    }
  }

  if (showAuthorFullName) {
    const user = await restClient.users.getByUsername({
      username: context.actor,
    });

    if (user?.data?.name) {
      return {
        name: user.data.name,
        url: user.data.html_url,
      };
    }
  }

  // Fallback to GITHUB_ACTOR
  return {
    name: context.actor as string,
    url,
  };
}

export { getAuthorName };
