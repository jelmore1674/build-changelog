import TOML from "@iarna/toml";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";

type Config = {
  /** the directory our changlog files will be in */
  dir: string;

  /**
   * any custom flags with prefixes.
   */
  flags?: Record<string, { prefix?: string }>;

  /**
   * Prefer toml or yaml
   */
  prefers: "toml" | "yaml";
};

/**
 * The initial configuration of the application.
 *
 * ```json
 * {
 *   "dir": "changelog",
 *   "flags": {
 *     "breaking": "[Breaking 🧨]"
 *   }
 * }
 */
const initialConfig: Config = {
  dir: "changelog",
  prefers: "yaml",
  flags: {
    breaking: {
      prefix: "[Breaking 🧨]",
    },
  },
};

/**
 * The configuration of our changelog application.
 */
let config = initialConfig;
let yamlConfigFile = "bcl.yml";
let tomlConfigFile = "bcl.toml";
let configFile = yamlConfigFile;
let changelogFileName = "CHANGELOG.md";
let parser: typeof YAML | typeof TOML = YAML;
let archiveFile = "archive.yml";

/**
 * The path to our config. `bcl.yml`.
 */
let configPath = path.join(process.cwd(), yamlConfigFile);

if (config.prefers === "toml" || existsSync(path.join(process.cwd(), tomlConfigFile))) {
  configPath = path.join(process.cwd(), tomlConfigFile);
  configFile = tomlConfigFile;
  parser = TOML;
  archiveFile = "archive.toml";
}

// Use the initial config if we do not have a config file.
if (existsSync(configPath)) {
  const rawConfig = readFileSync(configPath, { encoding: "utf8" });

  config = { ...initialConfig, ...parser.parse(rawConfig) };
}

/**
 * The directory where we will put our changelog `yaml` files.
 */
let changelogDir = path.join(process.cwd(), config.dir);

/**
 * The path to the CHANGELOG.md file
 */
const changelogPath = path.join(process.cwd(), changelogFileName);

/**
 * The path to the archive file of the changelog.
 */
const changelogArchive = path.join(changelogDir, archiveFile);

/**
 * The config used for testing.
 */
if (process.env.NODE_ENV) {
  configFile = config.prefers === "yaml" ? "test.yml" : "test.toml";
  configPath = path.join(process.cwd(), config.prefers === "yaml" ? "test.yml" : "test.toml");
  changelogFileName = "TEST.md";
  config = { ...config, dir: "test" };
  changelogDir = path.join(__dirname, "test");
}

export { changelogArchive, changelogDir, changelogPath, config, configPath, initialConfig };

export type { Config };
