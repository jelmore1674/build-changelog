import { execSync } from "node:child_process";
import { getChangelogArchive } from "./generate";
import { generateReleaseNotes } from "./mustache";
import { rl } from "./readline";

function getLatestTag(): string {
  return execSync("git describe --tags", { encoding: "utf8" }).trim();
}

function notesCommand(version: string = getLatestTag()) {
  const archive = getChangelogArchive();
  const release = archive.find(i => version?.includes(i.version));

  if (release) {
    const releaseNotes = generateReleaseNotes(release);
    console.info(releaseNotes);
  }

  rl.close();
}

export { notesCommand };
