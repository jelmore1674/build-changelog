/**
 * Generate the link for the author.
 *
 * @param author - author name.
 */
function formatAuthor(author: string) {
  if (author === "dependabot") {
    return `[${author}](${process.env.GITHUB_SERVER_URL}/apps/${author})`;
  }
  return `[${author}](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_ACTOR})`;
}

export { formatAuthor };
