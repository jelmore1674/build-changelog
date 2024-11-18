import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { Keywords } from "../templates";

type Config = {
  /** the directory our changlog files will be in */
  dir: string;
  /** Custom list of keywords. */
  keywords: string[];
  /** Custom list of flags. */
  flags: string[];
  /** The separator to change how we do the date of a version */
  version_date_separator: string;
};

const initialKeywords: Keywords[] = ["added", "changed", "fixed", "deprecated", "removed", "security"];
const initialFlags = ["breaking"];

/**
 * The initial configuration of the application.
 *
 * ```json
 * {
 *   "dir": "changelog",
 *   "keywords": ["added", "changed", "fixed", "deprecated", "removed", "security"],
 *   "flags": ["breaking"],
 *   "version_date_separator": "_"
 * }
 */
const initialConfig: Config = {
  dir: "changelog",
  keywords: initialKeywords,
  flags: initialFlags,
  version_date_separator: "_",
};

/**
 * The path to our config. `bcl.yml`.
 */
const configPath = path.join(process.cwd(), "bcl.yml");

/**
 * The configuration of our changelog application.
 */
let config = initialConfig;

// Use the initial config if we do not have a config file.
if (existsSync(configPath)) {
  const rawConfig = readFileSync(configPath, { encoding: "utf8" });
  config = { ...initialConfig, ...YAML.parse(rawConfig) };
}

/**
 * The directory where we will put our changelog `yaml` files.
 */
const changelogDir = path.join(process.cwd(), config.dir);

export { changelogDir, config, configPath, initialConfig };

export type { Config };
