import TOML from "@iarna/toml";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";

type Config = {
  /**
   * The directory our changelog files will be in.
   *
   * @default changelog
   */
  dir: string;

  /**
   * Any custom flags with prefixes.
   *
   * @default { breaking: "[Breaking 🧨]" }
   */
  flags?: Record<string, string>;

  /**
   * Prefer toml or yaml
   *
   * @default yaml
   */
  prefers: "toml" | "yaml";

  /**
   * Show Author
   *
   * @default true
   */
  show_author: boolean;

  /**
   * Show Author Full Name
   *
   * @default false
   */
  show_author_full_name: boolean;

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
   *
   * @default v
   */
  git_tag_prefix: string;

  /**
   * Show the git_tag_prefix in your version.
   *
   * @default false
   */
  show_git_tag_prefix: boolean;

  /**
   * Reference Pull Requests by default
   *
   * @default true
   */
  reference_pull_requests: boolean;

  /**
   * Reference commit shas by default
   *
   * @default true
   */
  reference_sha: boolean;

  /**
   * Automatically handle the version based on the semantic values passed into the file.
   *
   * @default false
   */
  auto_versioning?: boolean;
};

/**
 * The initial configuration of the application.
 *
 * ```toml
 * dir = "changelog"
 * show_author = true
 * reference_pull_requests = true
 *
 * [flags]
 * breaking = "[Breaking 🧨]"
 * ```
 */
const initialConfig: Config = {
  dir: "changelog",
  prefers: "yaml",
  flags: {
    breaking: "[Breaking 🧨]",
  },
  show_author: true,
  show_author_full_name: false,
  reference_pull_requests: true,
  reference_sha: true,
  git_tag_prefix: "v",
  show_git_tag_prefix: false,
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

/**
 * The path to our config. `bcl.yml`.
 */
let configPath = path.join(process.cwd(), yamlConfigFile);

if (config.prefers === "toml" || existsSync(path.join(process.cwd(), tomlConfigFile))) {
  configPath = path.join(process.cwd(), tomlConfigFile);
  configFile = tomlConfigFile;
  parser = TOML;
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
let changelogPath = path.join(process.cwd(), changelogFileName);

export { changelogDir, changelogPath, config, configPath, initialConfig };

export type { Config };
