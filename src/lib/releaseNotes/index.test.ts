import TOML, { JsonMap } from "@iarna/toml";
import { removeSync } from "fs-extra";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { expect, test, vitest } from "vitest";
import { changelogDir, configPath } from "../config";
import * as releaseNotes from "./";

const TEST_DIR = "/src/test";

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

test("should read match version from archive.", async () => {
  const notesCommand = vitest.spyOn(releaseNotes, "notesCommand");
  releaseNotes.notesCommand("1.0.0");

  expect(notesCommand).toHaveBeenCalledOnce();
  expect(notesCommand).toReturn();

  teardown();
});
