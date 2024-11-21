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
};

/**
 * The configuration of our changelog application.
 */
let config = initialConfig;
let configFile = "bcl.yml";
let changelogFileName = "CHANGELOG.md";

if (process.env.NODE_ENV === "test") {
  configFile = "test.yml";
  changelogFileName = "TEST.md";
  config = { ...config, dir: "test" };
}

/**
 * The path to our config. `bcl.yml`.
 */
const configPath = path.join(process.cwd(), configFile);

// Use the initial config if we do not have a config file.
if (existsSync(configPath)) {
  const rawConfig = readFileSync(configPath, { encoding: "utf8" });
  config = { ...initialConfig, ...YAML.parse(rawConfig) };
}

/**
 * The directory where we will put our changelog `yaml` files.
 */
const changelogDir = path.join(process.cwd(), config.dir);

/**
 * The path to the CHANGELOG.md file
 */
const changelogPath = path.join(process.cwd(), changelogFileName);

/**
 * The path to the archive file of the changelog.
 */
const changelogArchive = path.join(changelogDir, "archive.yml");

export { changelogArchive, changelogDir, changelogPath, config, configPath, initialConfig };

export type { Config };
