import { getChangelogArchive } from "./generate";
import { generateReleaseNotes } from "./mustache";
import { rl } from "./readline";

function notesCommand(version: string = "Unreleased") {
  const archive = getChangelogArchive();
  const release = archive.find(i => version?.includes(i.version)) || archive[0];

  if (release) {
    const releaseNotes = generateReleaseNotes(release);
    console.info(releaseNotes);
  }

  rl.close();
}

export { notesCommand };
