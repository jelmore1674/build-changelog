import TOML from "@iarna/toml";
import { removeSync } from "fs-extra";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import YAML from "yaml";
import { changelogDir, Config, configPath } from "./config";
import * as init from "./init";
import { rl } from "./readline";

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

describe("createChangelogDirectory", () => {
  afterEach(async () => {
    teardown();
  });

  test("can write the changelog dir preferring yaml", () => {
    init.createChangelogDirectory("yaml", YAML);

    const initFile = readFileSync(path.join(changelogDir, "init.yml"), { encoding: "utf8" });
    expect(initFile).toBeTruthy();
    expect(initFile).toContain("added");
  });

  test("can write the changelog dir preferring toml", () => {
    init.createChangelogDirectory("toml", TOML);

    const initFile = readFileSync(path.join(changelogDir, "init.toml"), { encoding: "utf8" });
    expect(initFile).toBeTruthy();
    expect(initFile).toContain("added");
  });

  test("can write the changelog dir preferring toml", () => {
    init.createChangelogDirectory("toml", TOML);

    const readme = readFileSync(path.join(changelogDir, "README.md"), { encoding: "utf8" });
    expect(readme).toBeTruthy();
    expect(readme).toContain("added");
  });
});

describe("writeChangelogConfig", () => {
  afterEach(async () => {
    teardown();
  });

  test("write the changelog config in yaml", () => {
    const config: Config = {
      dir: "test",
      flags: {
        breaking: {
          prefix: "[Breaking 🧨]",
        },
      },
      prefers: "yaml",
    };

    init.writeChangelogConfig(config, YAML);
    const configFile = readFileSync(configPath, { encoding: "utf8" });

    expect(configFile).toBeTruthy();
    expect(configFile).toBe("dir: test\nflags:\n  breaking:\n    prefix: \"[Breaking 🧨]\"\nprefers: yaml\n");
  });

  test("write the changelog config in toml", () => {
    const config: Config = {
      dir: "test",
      flags: {
        breaking: {
          prefix: "[Breaking 🧨]",
        },
      },
      prefers: "toml",
    };

    init.writeChangelogConfig(config, TOML);

    const configFile = readFileSync(configPath, { encoding: "utf8" });

    expect(configFile).toBeTruthy();
    expect(configFile).toContain(
      "dir = \"test\"\nprefers = \"toml\"\n\n[flags.breaking]\nprefix = \"[Breaking 🧨]\"\n",
    );
  });
});

describe("init command", () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    teardown();
  });

  test("the initCommand resolves successfully with yaml", async () => {
    vi.spyOn(rl, "question").mockResolvedValueOnce("test").mockResolvedValueOnce("yaml");
    const initCommand = vi.spyOn(init, "initCommand");
    await init.initCommand();
    expect(initCommand).toHaveResolved();
  });

  test("the initCommand resolves successfully with toml", async () => {
    vi.spyOn(rl, "question").mockResolvedValueOnce("test").mockResolvedValueOnce("toml");
    const initCommand = vi.spyOn(init, "initCommand");
    await init.initCommand();
    expect(initCommand).toHaveResolved();
  });
});
