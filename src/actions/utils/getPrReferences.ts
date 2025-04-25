import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import type { Reference } from "../../types";

const GITHUB_TOKEN = getInput("token");

const issueRegex = /(?:fixe?|close|resolve)(?:s?d?) (\#[0-9]+)/gi;

async function getReferncesFromBody(body: string) {
  const match = body.match(issueRegex);
  if (match && match?.length > 0) {
    const result = await Promise.all(match.map(async (i) => {
      const number = +i.split(" ")[1].replace("#", "");
      const res = await getOctokit(GITHUB_TOKEN).rest.issues.get({
        repo: "build-changelog",
        owner: "jelmore1674",
        // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
        issue_number: number,
      });

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

    return result;
  }

  return [];
}

/**
 * Get the pr references from the body.
 */
async function getPrReferences() {
  if (context.payload.pull_request?.body) {
    const references = await getReferncesFromBody(context.payload.pull_request.body);
    return references;
  }

  const pulls = await getOctokit(GITHUB_TOKEN).rest.search.issuesAndPullRequests({
    q: encodeURIComponent(`${context.sha} type:pr is:merged`),
  });

  if (pulls.data.items[0].body) {
    const references = await getReferncesFromBody(pulls.data.items[0]?.body);
    return references;
  }

  return [];
}

export { getPrReferences };
