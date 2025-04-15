import TOML, { JsonMap } from "@iarna/toml";
import { removeSync } from "fs-extra";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, vitest } from "vitest";
import { changelogArchive, changelogDir, configPath } from "./config";
import * as releaseNotes from "./releaseNotes";

const TEST_DIR = path.join(__dirname, "../../test");

function teardown() {
  // Remove test dir that is generated.
  if (existsSync(TEST_DIR)) {
    removeSync(TEST_DIR);
  }

  // Remove test config that is generated
  if (existsSync(configPath)) {
    removeSync(configPath);
  }
}

test("should run successful", async () => {
  const notesCommand = vitest.spyOn(releaseNotes, "notesCommand");
  releaseNotes.notesCommand();

  expect(notesCommand).toHaveBeenCalledOnce();
  expect(notesCommand).toReturn();
});

const archive = {
  changelog: [
    {
      version: "1.0.0",
      release_date: "2024-11-29",
      fixed: [
        "this is a test fix",
      ],
    },
    {
      version: "0.9.9",
      release_date: "2024-11-29",
      fixed: [
        "this is a test fix",
      ],
    },
  ],
} as unknown as JsonMap;

test("should read match version from archive.", async () => {
  if (!existsSync(changelogDir)) {
    mkdirSync(changelogDir);
    writeFileSync(changelogArchive, TOML.stringify(archive), { encoding: "utf8" });
  }

  const notesCommand = vitest.spyOn(releaseNotes, "notesCommand");
  releaseNotes.notesCommand("1.0.0");

  expect(notesCommand).toHaveBeenCalledOnce();
  expect(notesCommand).toReturn();

  teardown();
});
