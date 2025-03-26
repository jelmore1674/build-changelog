import TOML from "@iarna/toml";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";

type Config = {
  /** the directory our changelog files will be in */
  dir: string;

  /**
   * any custom flags with prefixes.
   */
  flags?: Record<string, string>;

  /**
   * Prefer toml or yaml
   */
  prefers: "toml" | "yaml";

  /**
   * Use changelog archive file, or parse changelog
   */
  changelog_archive: boolean;

  /**
   * Show Author
   */
  show_author: boolean;

  /**
   * the release url to prefix with linking changelog and release
   */
  release_url?: string;

  /**
   * the repo url to prefix with linking changelog and release
   */
  repo_url?: string;

  /**
   * The prefix of the git tag
   */
  git_tag_prefix: string;
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
    breaking: "[Breaking 🧨]",
  },
  changelog_archive: false,
  show_author: true,
  git_tag_prefix: "v",
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
 * The path to the archive file of the changelog.
 */
let changelogArchive = path.join(changelogDir, archiveFile);

/**
 * The config used for testing.
 */
if (process.env.NODE_ENV === "test") {
  configFile = config.prefers === "yaml" ? "test.yml" : "test.toml";
  configPath = path.join(process.cwd(), config.prefers === "yaml" ? "test.yml" : "test.toml");
  changelogFileName = "TEST.md";
  config = { ...config, dir: "test" };
  changelogDir = path.join(__dirname, "../../test");
  changelogArchive = path.join(__dirname, "../../test", archiveFile);
}

/**
 * The path to the CHANGELOG.md file
 */
const changelogPath = path.join(process.cwd(), changelogFileName);

export { changelogArchive, changelogDir, changelogPath, config, configPath, initialConfig };

export type { Config };
