import type { ParsedChanges, Version } from "@types";
import latestSemver from "latest-semver";
import { inc } from "semver";

/**
 * Check if the date is an unreleased date.
 *
 * @param [releaseDate] - the release date of the version.
 */
function isUnreleasedDate(releaseDate?: string) {
  return releaseDate?.toLowerCase() === "unreleased" || releaseDate === "TBD";
}

/**
 * Increment the version based on the changeType provided.
 *
 * @param changeType - "major" | "minor" | "patch"
 * @param currentVersion - The current version we are setting the version for.
 * @param allVersions - array of all of the versions.
 */
function autoIncrementUnreleasedChanges(
  changeType: ParsedChanges["change"],
  currentVersion: Version,
  allVersions: Version[],
) {
  if (isUnreleasedDate(currentVersion.release_date)) {
    const versions = allVersions.map(v =>
      isUnreleasedDate(v.release_date)
        ? undefined
        : v.version
    ).filter(v => v !== undefined);

    const latest = latestSemver(versions);

    if (latest) {
      const newVersion = inc(latest, changeType);

      if (newVersion) {
        const latestVersion = latestSemver([newVersion, currentVersion.version]);
        return latestVersion;
      }

      return newVersion ?? currentVersion.version;
    }
  }

  return currentVersion.version;
}

export { autoIncrementUnreleasedChanges };
