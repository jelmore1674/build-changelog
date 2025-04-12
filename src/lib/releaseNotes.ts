import { setOutput } from "@actions/core";
import { parseChangelog } from "@jelmore1674/changelog";
import { existsSync, readFileSync } from "node:fs";
import { changelogPath, config } from "./config";
import { generateReleaseNotes } from "./mustache";
import { rl } from "./readline";

function notesCommand(version: string = "Unreleased") {
  if (existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });

    const changelog = parseChangelog(changelogFile);
    const release = changelog.find(i => version?.includes(i.version)) || changelog[0];

    if (release) {
      const releaseNotes = generateReleaseNotes(release);
      if (process.env.GITHUB_ACTIONS) {
        setOutput("notes", releaseNotes);
      }
      console.info(releaseNotes);
    }

    rl.close();
  }
}

export { notesCommand };
