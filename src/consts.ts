/** Properties we will not use when adding changes to the changelog */
const KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

/** The valid keywords that are used for the sections in the changelog */
const VALID_KEYWORDS = ["added", "changed", "deprecated", "fixed", "removed", "security"];

export { KEY_FILTER, VALID_KEYWORDS };
