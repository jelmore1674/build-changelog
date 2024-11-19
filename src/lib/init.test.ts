import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import YAML from "yaml";
import { Config, configPath } from "./config";
import { initCommand } from "./init";
import { rl } from "./readline";

const TEST_DIR = path.join(__dirname, "../../test");

const mockQuestion = vi.fn(async (_question) => {
  // Return a hardcoded response or simulate user input
  return "test";
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
    vi.spyOn(rl, "question").mockImplementation(mockQuestion);

    await initCommand();

    expect(readdirSync(TEST_DIR).includes("README.md")).toBeTruthy;
  });

  it("generates the config file", async () => {
    vi.spyOn(rl, "question").mockImplementation(mockQuestion);

    await initCommand();

    expect(existsSync(configPath)).toBeTruthy();

    const yaml: Config = YAML.parse(readFileSync(configPath, { encoding: "utf8" }));

    expect(yaml.dir).toEqual("test");
  });
});
