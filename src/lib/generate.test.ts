import TOML, { JsonMap } from "@iarna/toml";
import { outputFileSync, removeSync } from "fs-extra";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";
import { vi } from "vitest";
import YAML from "yaml";
import { changelogArchive, changelogDir, configPath } from "./config.ts";
import { cleanUpChangelog, getChangelogArchive, isTomlOrYamlFile, writeChangelogToArchive } from "./generate.ts";
import { Changes, Version } from "./mustache.ts";

const TEST_DIR = path.join(__dirname, "../../test");
const YAML_CHANGE = path.join(TEST_DIR, "testchange.yml");
const TOML_CHANGE = path.join(TEST_DIR, "testchange.toml");
const TOML_ARCHIVE = path.join(TEST_DIR, "archive.toml");
const YAML_ARCHIVE = path.join(TEST_DIR, "archive.yml");

test.each([["test.toml", "true"], ["test.yaml", "true"], ["test.yml", "true"], ["test.md", "false"], [
  "test.ts",
  "flase",
]])(
  "isTomlOrYaml(%s) -> %s",
  (file, expected) => {
    expect(isTomlOrYamlFile(file)).toBe(expected === "true");
  },
);

function setupChanges() {
  // Setup test changes files.
  const change: Changes = {
    version: "1.0.0",
    releaseDate: "2024-1-1",
    added: { breaking: ["this is a breaking change"], changes: ["this is a test change"] },
  };
  outputFileSync(YAML_CHANGE, YAML.stringify(change));
  outputFileSync(TOML_CHANGE, TOML.stringify(change as unknown as JsonMap));
}

function setupArchive() {
  // Setup the test archives.
  const changelog: Version[] = [
    {
      version: "1.0.0",
      releaseDate: "2024-1-2",
      added: ["This cool feature"],
    },
    {
      version: "0.9.0",
      releaseDate: "2024-1-1",
      removed: ["Remove test feature"],
    },
  ];

  outputFileSync(YAML_ARCHIVE, YAML.stringify({ changelog }));
  outputFileSync(TOML_ARCHIVE, TOML.stringify({ changelog } as unknown as JsonMap));
}

function teardown() {
  if (existsSync(TEST_DIR)) {
    removeSync(TEST_DIR);
  }

  if (existsSync(configPath)) {
    rmSync(configPath);
  }
}

describe("generateCommand", () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    teardown();
  });

  test("getChangelogArchive can get the archive", () => {
    setupArchive();
    const archive = getChangelogArchive();

    expect(archive.length).toBe(2);
    expect(archive[0].version > archive[1].version).toBeTruthy();
    expect(archive[0].version).toBe("1.0.0");
    expect(archive[0].releaseDate).toBe("2024-1-2");
  });

  test("write changes to changelog archive", () => {
    // Setup the test archives.
    const changelog: Version[] = [
      {
        version: "1.0.0",
        releaseDate: "2024-1-2",
        added: ["This cool feature"],
      },
      {
        version: "0.9.0",
        releaseDate: "2024-1-1",
        removed: ["Remove test feature"],
      },
    ];

    mkdirSync(changelogDir);
    writeChangelogToArchive(changelog);

    const archive = readFileSync(changelogArchive, { encoding: "utf8" });

    expect(archive).toBeTruthy();
  });

  test("can clean up changelog", () => {
    setupChanges();
    expect(readdirSync(changelogDir).length).toBe(2);
    cleanUpChangelog();
    expect(readdirSync(changelogDir).length).toBe(0);
  });
});
