import TOML from "@iarna/toml";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { getParser } from "../utils/getParser";
import { log } from "../utils/log";
import { changelogDir, Config, config, configPath, initialConfig } from "./config";
import { prompt, rl } from "./readline";

const SAMPLE_FILE_NAME = {
  yaml: "init.yml",
  toml: "init.toml",
};

const ARCHVIE_FILE = {
  toml: "archive.toml",
  yaml: "archive.yml",
};

const readme = readFileSync(
  path.join(process.env.NODE_ENV === "test" ? process.cwd() : __dirname, "./templates/guide.md"),
  "utf8",
);

const exampleChangelogEntry = { version: "Unreleased", added: { change: ["`build-changelog` to the project."] } };

/**
 * Create and stub out the changelog directory
 *
 * @param prefers - "yaml" or "toml"
 * @param parser - the parser used to make the files.
 */
function createChangelogDirectory(prefers: "yaml" | "toml", parser: typeof TOML | typeof YAML) {
  // Create the changelog directory
  mkdirSync(changelogDir, { recursive: true });

  // Create sample files.
  writeFileSync(path.join(changelogDir, SAMPLE_FILE_NAME[prefers]), parser.stringify(exampleChangelogEntry), {
    encoding: "utf8",
  });

  // Create archive files.
  writeFileSync(
    path.join(changelogDir, ARCHVIE_FILE[prefers]),
    "# This is a generated archive of the changelog.\n### Do not delete this file!",
    {
      encoding: "utf8",
    },
  );

  // Create the readme.
  writeFileSync(path.join(changelogDir, "README.md"), readme, { encoding: "utf8" });
}

/**
 * Create the config file in the current working directory.
 *
 * @param prefers - "yaml" or "toml"
 * @param parser - the parser used make the config file.
 */
function writeChangelogConfig(config: Config, parser: typeof TOML | typeof YAML) {
  const newConfig = parser.stringify(config);
  let configFile = path.join(config.prefers === "toml" ? "bcl.toml" : "bcl.yml");
  if (process.env.NODE_ENV === "test") {
    configFile = configPath;
  }
  writeFileSync(configFile, newConfig);
}

/**
 * Intialize the application.
 *
 * This will create the changelog directory. And stub out files.
 */
async function initCommand() {
  const dir = await prompt("What directory do you want to store your changelog?(Default: changelog) ");
  const prefers = await prompt("Do you prefer toml or yaml?(Default: yaml) ", ["yaml", "toml"]) as "toml" | "yaml";
  rl.close();

  // Assign to response to the dir.
  config.dir = dir || initialConfig.dir;
  config.prefers = prefers || initialConfig.prefers;
  const parser = getParser(config.prefers);

  // Configure our changelog directory.
  log(`Setting up the ${dir} directory`);
  createChangelogDirectory(config.prefers, parser);

  // Write new config file.
  writeChangelogConfig(config, parser);

  log(`Finished setting up the ${dir} directory.`);
}

export { createChangelogDirectory, initCommand, writeChangelogConfig };
