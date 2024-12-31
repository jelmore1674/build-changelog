import { setOutput } from "@actions/core";
import { changelogPath, config } from "./config";
import { getChangelogArchive } from "./generate";
import { generateReleaseNotes } from "./mustache";
import { parseChangelog } from "./parseChangelog";
import { rl } from "./readline";

function notesCommand(version: string = "Unreleased") {
  const archive = config.changelog_archive ? getChangelogArchive() : parseChangelog(changelogPath);
  const release = archive.find(i => version?.includes(i.version)) || archive[0];

  if (release) {
    const releaseNotes = generateReleaseNotes(release);
    if (process.env.GITHUB_ACTIONS) {
      setOutput("notes", releaseNotes);
    }
    console.info(releaseNotes);
  }

  rl.close();
}

export { notesCommand };
