import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Keywords, Version } from "./mustache";

// semver versioning
const versionRegex = /\d\.\d\.\d/gism;
// release version section.
const versionSectionRegex = /(?=^#{2} .*?$)/gism;
// date: looks for either 2024-12-06 or 12-06-2024
const dateRegex = /\d{1,4}(-|\/)\d{1,2}(-|\/)\d{1,4}/gism;
// the changes section.
const changeSectionRegex = /(?=^#{3} .*?$)/gism;
// keywords
const keywordRegex = /(?:fixed|removed|changed|added|security|deprecated)/gism;
const changesRegex = /^#{3} (?:fixed|removed|changed|added|security|deprecated)/gism;
// notice
const noticeRegex = /(?<=_)((.*)(?=_))/gism;

/**
 * parse an existing changelog file and convert to an object.
 */
function parseChangelog(changelogPath: string) {
  if (existsSync(changelogPath)) {
    const cl = readFileSync(changelogPath, { encoding: "utf8" });

    const changelog = cl.split(versionSectionRegex).map(section => {
      if (section.toLowerCase().includes("# changelog")) {
        return null;
      }

      // Pull the version and release_date from the section.
      const [version] = section.match(versionRegex) || ["Unreleased"];
      const [release_date] = section.match(dateRegex) || ["TBD"];
      // Get the notice if there is a notice.
      const [notice] = section.match(noticeRegex) || [undefined];

      // Intialize the release version..
      const release: Version = {
        version,
        release_date,
      };

      if (notice) {
        // Only define notice if there is one.
        release.notice = notice;
      }

      section.split(changeSectionRegex).map(changeKeyword => {
        if (changeKeyword.match(versionSectionRegex)) {
          return null;
        }

        const [keyword] = changeKeyword.match(keywordRegex) as string[];

        if (keyword) {
          release[keyword.toLowerCase() as Keywords] = changeKeyword.replace(
            changesRegex,
            "",
          ).trim().split("\n- ")
            .map((change: string) =>
              change.replace(/^\[.*/gism, "")
                .replace(/^- /g, "")
                .replace(/\n /g, "")
                .trim()
            )
            .filter(i => i);
        }
      }).filter(changes => {
        return changes;
      });

      return release;
    }).filter(release => release) as Version[];

    return changelog;
  }

  return [];
}

export { parseChangelog };
