import { KEY_FILTER } from "@consts";
import type { KeepAChangelogKeywords } from "@jelmore1674/changelog";
import type { Version } from "@types";

/**
 * Get the total number of changes in your changelog.
 *
 * @param changelog - the version array from your changelog.
 */
function getChangeCount(changelog: Version[]) {
  return changelog.reduce((totalChanges, version) => {
    const changes = Object.keys(version).filter(k => !KEY_FILTER.includes(k)).reduce((acc, k) => {
      const keyword = k as KeepAChangelogKeywords;

      if (version[keyword] && version[keyword]?.length > 0) {
        return acc + version[keyword].length;
      }

      return acc;
    }, 0);

    return totalChanges + changes;
  }, 0);
}

export { getChangeCount };
