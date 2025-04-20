import { setOutput } from "@actions/core";
import { getReleaseNotes, parseChangelog } from "@jelmore1674/changelog";
import { existsSync, readFileSync } from "node:fs";
import { changelogPath } from "./config";
import { rl } from "./readline";

function notesCommand(version: string = "Unreleased") {
  if (existsSync(changelogPath)) {
    const changelogFile = readFileSync(changelogPath, { encoding: "utf8" });

    const changelog = parseChangelog(changelogFile);
    const release = changelog.versions.find(i => version?.includes(i.version))
      || changelog.versions[0];

    if (release) {
      const releaseNotes = getReleaseNotes(changelogFile, version);
      if (process.env.GITHUB_ACTIONS) {
        setOutput("notes", releaseNotes);
      }
      console.info(releaseNotes);
    }

    rl.close();
  }
}

export { notesCommand };
