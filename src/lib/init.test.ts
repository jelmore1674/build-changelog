import TOML from "@iarna/toml";
import { removeSync } from "fs-extra";
import * as fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import YAML from "yaml";
import { changelogDir, Config, configPath } from "./config";
import * as init from "./init";
import { rl } from "./readline";

const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const TEST_DIR = path.join(dir, "../../test");

function teardown() {
  // Remove test dir that is generated.
  if (fs.existsSync(TEST_DIR)) {
    removeSync(TEST_DIR);
  }

  // Remove test config that is generated
  if (fs.existsSync(configPath)) {
    removeSync(configPath);
  }
}

describe("createChangelogDirectory", () => {
  afterEach(async () => {
    teardown();
  });

  test("can write the changelog dir preferring yaml", () => {
    init.createChangelogDirectory("yaml", YAML);

    const initFile = fs.readFileSync(path.join(changelogDir, "init.yml"), { encoding: "utf8" });
    expect(initFile).toBeTruthy();
    expect(initFile).toContain("added");
  });

  test("can write the changelog dir preferring toml", () => {
    init.createChangelogDirectory("toml", TOML);

    const initFile = fs.readFileSync(path.join(changelogDir, "init.toml"), { encoding: "utf8" });
    expect(initFile).toBeTruthy();
    expect(initFile).toContain("added");
  });

  test("can write the changelog dir preferring toml", () => {
    init.createChangelogDirectory("toml", TOML);

    const readme = fs.readFileSync(path.join(changelogDir, "README.md"), { encoding: "utf8" });
    expect(readme).toBeTruthy();
    expect(readme).toContain("added");
  });
});

describe("writeChangelogConfig", () => {
  afterEach(() => {
    teardown();
  });

  test("write the changelog config in yaml", () => {
    const config: Config = {
      dir: "test",
      flags: {
        breaking: "[Breaking 🧨]",
      },
      prefers: "yaml",
      changelog_archive: false,
    };

    init.writeChangelogConfig(config, YAML);
    const configFile = fs.readFileSync(configPath, { encoding: "utf8" });

    expect(configFile).toBeTruthy();
    expect(configFile).toBe(
      "dir: test\nflags:\n  breaking: \"[Breaking 🧨]\"\nprefers: yaml\nchangelog_archive: false\n",
    );
  });

  test("write the changelog config in toml", () => {
    const config: Config = {
      dir: "test",
      flags: {
        breaking: "[Breaking 🧨]",
      },
      prefers: "toml",
      changelog_archive: false,
    };

    init.writeChangelogConfig(config, TOML);

    const configFile = fs.readFileSync(configPath, { encoding: "utf8" });

    expect(configFile).toBeTruthy();
    expect(configFile).toContain(
      "dir = \"test\"\nprefers = \"toml\"\nchangelog_archive = false\n\n[flags]\nbreaking = \"[Breaking 🧨]\"\n",
    );
  });
});

describe("init command", () => {
  afterEach(async () => {
    teardown();
  });

  test("the initCommand resolves successfully with yaml", async () => {
    vi.spyOn(rl, "question").mockResolvedValueOnce("test").mockResolvedValueOnce("yaml").mockResolvedValue("no");
    const initCommand = vi.spyOn(init, "initCommand");
    await init.initCommand();
    expect(initCommand).toHaveResolved();
  });

  test("the initCommand resolves successfully with toml", async () => {
    vi.spyOn(rl, "question").mockResolvedValueOnce("test").mockResolvedValueOnce("toml").mockResolvedValue("no");
    const initCommand = vi.spyOn(init, "initCommand");
    await init.initCommand();
    expect(initCommand).toHaveResolved();
  });
});
