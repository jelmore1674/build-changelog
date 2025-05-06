/**
 * Generate the link for the author.
 *
 * @param author - author name.
 */
function formatAuthor(author: { name: string; url: string }) {
  return `[${author.name}](${author.url})`;
}

export { formatAuthor };
