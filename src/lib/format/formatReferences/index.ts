import { context } from "@actions/github";
import { Reference } from "@types";

const LINK_TYPE = Object.freeze({
  pull_request: "pull",
  issue: "issues",
});

/**
 * Format the references of the change.
 *
 * @param references - the references we are adding to the change.
 */
function formatReferences(references: Reference[]): string {
  process.env.GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL ?? "https://github.com";
  process.env.GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY ?? "jelmore1674/build-changelog";
  process.env.GITHUB_ACTOR = process.env.GITHUB_ACTOR ?? "bcl-bot";

  if (references.length) {
    const cleanedReferences = [
      ...references.reduce((map, reference) => map.set(reference.number, reference), new Map())
        .values(),
    ] as Reference[];
    return cleanedReferences.sort((a, b) => a.number - b.number).map((reference) => {
      return `[#${reference.number}](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/${
        LINK_TYPE[reference.type]
      }/${reference.number})`;
    }).join(", ");
  }

  return "";
}

export { formatReferences };
