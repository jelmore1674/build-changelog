import type { GenerateConfig, Reference } from "@types";
import { log } from "@utils/log";
import { formatAuthor } from "../formatAuthor";
import { formatCommitSha } from "../formatCommitSha";
import { formatReferences } from "../formatReferences";

interface ChangeMessage {
  message: string;
  references: Reference[];
  author: {
    name: string;
    url: string;
  };
  sha: string;
  prNumber?: number;
  flag?: string;
}

/**
 * Generate the change entry in the changelog.
 *
 * @param change - the change message
 * @param changelogLinks - the links from the changelog
 * @param references - any references to create link.
 * @param config - the configuration
 * @param author - the author
 * @param [flag] - optional flag that can be used.
 * @param [prNumber] - pr number to auto reference.
 */
function formatChangeMessage(
  {
    message,
    references,
    author,
    sha,
    prNumber,
    flag,
  }: ChangeMessage,
  config: GenerateConfig,
) {
  let renderedChange = message;

  // Generate the links for the change.
  if (config.reference_sha) {
    renderedChange = `${renderedChange} ${formatCommitSha(sha)}`;
  }

  if (references.length || prNumber) {
    renderedChange = `${renderedChange} | ${
      formatReferences([
        ...((config?.reference_pull_requests && prNumber)
          ? [{ type: "pull_request", number: prNumber }] as Reference[]
          : []),
        ...references,
      ])
    }`;
  }

  // Add author to the change.
  if (config.show_author) {
    renderedChange = `${renderedChange} | ${formatAuthor(author)}`;
  }

  if (flag && config.flags?.[flag]) {
    return `${config.flags?.[flag]} - ${renderedChange}`;
  }

  log(`Change: ${renderedChange}`);

  return renderedChange;
}

export { formatChangeMessage };
