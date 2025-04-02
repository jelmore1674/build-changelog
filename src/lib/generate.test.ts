import TOML, { JsonMap } from "@iarna/toml";
import { outputFileSync, removeSync } from "fs-extra";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, test, vitest } from "vitest";
import { afterEach } from "vitest";
import { vi } from "vitest";
import YAML from "yaml";
import { changelogArchive, changelogDir, changelogPath, configPath } from "./config.ts";
import * as generate from "./generate.ts";
import * as mustache from "./mustache.ts";
import type { Changes, Version } from "./mustache.ts";

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
    expect(generate.isTomlOrYamlFile(file)).toBe(expected === "true");
  },
);

function setupChanges() {
  // Setup test changes files.
  const change: Changes = {
    version: "1.0.0",
    release_date: "2024-1-1",
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
      release_date: "2024-1-2",
      added: ["This cool feature"],
    },
    {
      version: "0.9.0",
      release_date: "2024-1-1",
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

  if (changelogPath.includes("TEST.md")) {
    if (existsSync(changelogPath)) {
      rmSync(changelogPath);
    }
  }
}

describe("generateCommand", () => {
  vi.mock(import("mustache"), async (importOriginal) => {
    const og = await importOriginal();
    return ({
      render: vi.fn().mockImplementation(og.render),
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    teardown();
  });

  test("getChangelogArchive can get the archive", () => {
    setupArchive();
    const archive = generate.getChangelogArchive();

    expect(archive.length).toBe(2);
    expect(archive[0].version > archive[1].version).toBeTruthy();
    expect(archive[0].version).toBe("1.0.0");
    expect(archive[0].release_date).toBe("2024-1-2");
  });

  test("parseChanges throws when file is not found", () => {
    const parseChanges = vitest.spyOn(generate, "parseChanges");

    expect(() => generate.parseChanges("notfound.yml")).toThrowError(`The file does not exist\n\nnotfound.yml`);
    expect(parseChanges).toHaveBeenCalledOnce();
  });

  test("write changes to changelog archive", () => {
    // Setup the test archives.
    const changelog: Version[] = [
      {
        version: "1.0.0",
        notice: "Initial Release",
        release_date: "2024-1-2",
        added: ["This cool feature"],
      },
      {
        version: "0.9.0",
        release_date: "2024-1-1",
        removed: ["Remove test feature"],
      },
    ];

    mkdirSync(changelogDir);
    generate.writeChangelogToArchive(changelog, undefined, "toml");

    const archive = readFileSync(changelogArchive, { encoding: "utf8" });

    expect(archive).toBeTruthy();
  });

  test("can clean up changelog", () => {
    setupChanges();
    expect(readdirSync(changelogDir).length).toBeGreaterThan(1);
    generate.cleanUpChangelog();
    expect(readdirSync(changelogDir).length).toBe(0);
  });

  test("successfully runs the generate command", () => {
    setupChanges();
    setupArchive();

    vi.spyOn(mustache, "generateChangelog").mockReturnValue("# Changelog");
    const generateCommand = vi.spyOn(generate, "generateCommand");

    generate.generateCommand();

    expect(generateCommand).toReturn();
  });

  test("successfully runs the generate command", () => {
    // Setup test changes files.
    const change = {
      version: "1.0.0",
      release_date: "2024-1-1",
      badkeyword: { breaking: ["this is a breaking change"], changes: ["this is a test change"] },
    };
    outputFileSync(YAML_CHANGE, YAML.stringify(change));
    outputFileSync(TOML_CHANGE, TOML.stringify(change as unknown as JsonMap));

    setupArchive();

    vi.spyOn(mustache, "generateChangelog").mockReturnValue("# Changelog");

    expect(() => generate.generateCommand()).toThrowError();
  });

  test("successfully runs the generate command", () => {
    // Setup test changes files.
    const change = {
      version: "1.0.0",
      release_date: "2024-1-1",
      badkeyword: { breaking: ["this is a breaking change"], changes: ["this is a test change"] },
    };
    outputFileSync(YAML_CHANGE, YAML.stringify(change));
    outputFileSync(TOML_CHANGE, TOML.stringify(change as unknown as JsonMap));

    setupArchive();

    vi.spyOn(mustache, "generateChangelog").mockReturnValue("# Changelog");

    expect(() => generate.generateCommand()).toThrowError();
  });
});
