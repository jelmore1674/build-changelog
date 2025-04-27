/**
 * Generate the link for commit shas
 *
 * @param sha - the commit sha
 * @param showReferenceSha - Whether or not we will show this link.
 */
function formatCommitSha(sha: string) {
  const hash = sha.substring(0, 7);
  return `[\`${hash}\`](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/commit/${sha})`;
}

export { formatCommitSha };
