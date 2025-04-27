import { KEY_FILTER } from "@consts";
import type { KeepAChangelogKeywords } from "@jelmore1674/changelog";
import type { GenerateConfig, Version } from "@types";

/**
 * Sort the breaking changes and put them at the top of the change section.
 *
 * @param version - the version with the changes to sort.
 */
function sortBreakingChanges(version: Version, config: GenerateConfig) {
  for (const changes in version) {
    if (KEY_FILTER.includes(changes)) {
      continue;
    }
    const keyword = changes as KeepAChangelogKeywords;

    if (version[keyword]) {
      version?.[keyword].sort((a, b) => {
        if (config.flags?.breaking) {
          const isPrefixedA = a.startsWith(config.flags?.breaking);
          const isPrefixedB = b.startsWith(config.flags?.breaking);

          if (isPrefixedA && !isPrefixedB) {
            return -1;
          }

          if (!isPrefixedA && isPrefixedB) {
            return 1;
          }
        }

        return 1;
      });
    }
  }

  return version;
}

export { sortBreakingChanges };
