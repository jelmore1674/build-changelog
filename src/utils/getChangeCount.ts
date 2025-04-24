import type { KeepAChangelogKeywords, Version } from "@jelmore1674/changelog";

/** Properties we will not use when adding changes to the changelog */
const KEY_FILTER = ["release_date", "version", "notice", "references", "author"];

/**
 * Get the total number of changes in your changelog.
 *
 * @param changelog - the version array from your changelog.
 */
function getChangeCount(changelog: Version<Partial<Record<KeepAChangelogKeywords, string[]>>>[]) {
  return changelog.reduce((totalChanges, version) => {
    const changes = Object.keys(version).filter(k => !KEY_FILTER.includes(k)).reduce((acc, k) => {
      const keyword = k as KeepAChangelogKeywords;

      if (version[keyword]?.length) {
        return acc + version[keyword].length;
      }

      return acc;
    }, 0);

    return totalChanges + changes;
  }, 0);
}

export { getChangeCount };
