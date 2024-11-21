import TOML from "@iarna/toml";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import YAML from "yaml";
import { changelogDir, Config, configPath } from "./config";
import { initCommand } from "./init";
import { Changes } from "./mustache";
import { rl } from "./readline";

const TEST_DIR = path.join(__dirname, "../../test");

const mockPrefersYaml = vi.fn(async (question) => {
  if (question.includes("changelog")) {
    return "test";
  }
  // Return a hardcoded response or simulate user input
  return "yaml";
});

const mockPrefersToml = vi.fn(async (question) => {
  if (question.includes("changelog")) {
    return "test";
  }

  // Return a hardcoded response or simulate user input
  return "toml";
});

describe("init command", () => {
  afterEach(() => {
    // Remove test dir that is generated.
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { force: true, recursive: true });
    }

    // Remove test config that is generated
    if (existsSync(configPath)) {
      rmSync(configPath);
    }

    vi.restoreAllMocks();
  });

  it("creates the test dir with README", async () => {
    vi.spyOn(rl, "question").mockImplementation(mockPrefersYaml);

    await initCommand();

    expect(existsSync(TEST_DIR)).toBeTruthy();
    expect(readdirSync(TEST_DIR).includes("README.md")).toBeTruthy();
    expect(readFileSync(path.join(TEST_DIR, "README.md"), { encoding: "utf8" })).toContain("Build Changelog");
    expect(readFileSync(path.join(TEST_DIR, "README.md"), { encoding: "utf8" })).toContain("Examples");
    expect(readFileSync(path.join(TEST_DIR, "README.md"), { encoding: "utf8" })).toContain("added");
    expect(readFileSync(path.join(TEST_DIR, "README.md"), { encoding: "utf8" })).toContain("fixed");
  });

  it("generates the config file", async () => {
    vi.spyOn(rl, "question").mockImplementation(mockPrefersYaml);

    await initCommand();

    expect(existsSync(configPath)).toBeTruthy();

    const yaml: Config = YAML.parse(readFileSync(configPath, { encoding: "utf8" }));

    expect(yaml.dir).toEqual("test");
  });

  it("generates a sample changelog entry", async () => {
    vi.spyOn(rl, "question").mockImplementation(mockPrefersYaml);

    const sampleChangelogFile = path.join(changelogDir, "init.yml");

    await initCommand();

    expect(existsSync(sampleChangelogFile)).toBeTruthy();

    const yaml: Changes = YAML.parse(readFileSync(sampleChangelogFile, { encoding: "utf8" }));

    expect(yaml.added?.[0]).toContain("`build-changelog` to the project");
    expect(yaml.version).toEqual("Unreleased");
  });

  it("generates a sample changelog entry", async () => {
    vi.spyOn(rl, "question").mockImplementation(mockPrefersToml);

    const sampleChangelogFile = path.join(changelogDir, "init.toml");

    await initCommand();

    expect(existsSync(sampleChangelogFile)).toBeTruthy();

    const toml = TOML.parse(readFileSync(sampleChangelogFile, { encoding: "utf8" })) as unknown as Changes;

    expect(toml.added?.[0]).toContain("`build-changelog` to the project");
    expect(toml.version).toEqual("Unreleased");
  });
});
