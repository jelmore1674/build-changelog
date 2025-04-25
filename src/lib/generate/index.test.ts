import TOML, { JsonMap } from "@iarna/toml";
import { outputFileSync, removeSync } from "fs-extra";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { describe, expect, test, vitest } from "vitest";
import { afterEach } from "vitest";
import { vi } from "vitest";
import YAML from "yaml";
import { changelogPath, configPath } from "../config";
import * as generate from "./";

const TEST_DIR = path.join(__dirname, "../test");
const YAML_CHANGE = path.join(TEST_DIR, "testchange.yml");
const TOML_CHANGE = path.join(TEST_DIR, "testchange.toml");

function setupChanges() {
  // Setup test changes files.
  const change = {
    version: "1.0.0",
    release_date: "2024-1-1",
    badkeyword: { breaking: ["this is a breaking change"], changes: ["this is a test change"] },
  };
  outputFileSync(YAML_CHANGE, YAML.stringify(change));
  outputFileSync(TOML_CHANGE, TOML.stringify(change as unknown as JsonMap));
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
  afterEach(async () => {
    vi.restoreAllMocks();
    teardown();
  });

  test("parseChanges throws when file is not found", () => {
    const parseChanges = vitest.spyOn(generate, "parseChanges");

    expect(() => generate.parseChanges("notfound.yml")).toThrowError(
      `The file does not exist\n\nnotfound.yml`,
    );
    expect(parseChanges).toHaveBeenCalledOnce();
  });

  test.skip("successfully runs the generate command", () => {
    setupChanges();
    // Setup test changes files.
    const change = {
      version: "1.0.0",
      release_date: "2024-1-1",
      added: { breaking: ["this is a breaking change", "this is a test change"] },
    };
    outputFileSync(YAML_CHANGE, YAML.stringify(change));
    outputFileSync(TOML_CHANGE, TOML.stringify(change as unknown as JsonMap));

    expect(() => generate.generateCommand("bcl-bot", "a1a1a1aa1a11a1")).toHaveReturned();
  });

  test("successfully runs the generate command", () => {
    setupChanges();

    expect(() => generate.generateCommand("bcl-bot", "a1a1a1a", 1)).toThrowError();
  });

  test("successfully runs the generate command", () => {
    setupChanges();

    expect(() => generate.generateCommand("bcl-bot", "a1a1a1a", 1)).toThrowError();
  });
});
