import TOML from "@iarna/toml";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { getParser } from "../utils/getParser";
import { log } from "../utils/log";
import { changelogDir, Config, config, configPath, initialConfig } from "./config";
import { writeChangelogToArchive } from "./generate";
import { parseChangelog } from "./parseChangelog";
import { prompt, rl } from "./readline";

const SAMPLE_FILE_NAME = {
  yaml: "init.yml",
  toml: "init.toml",
};

const ARCHVIE_FILE = {
  toml: "archive.toml",
  yaml: "archive.yml",
};

/* v8 ignore next-line */
const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const readme = readFileSync(path.join(dir, "templates/guide.md"), "utf8");

const exampleChangelogEntry = { version: "Unreleased", added: { change: ["`build-changelog` to the project."] } };

/**
 * Create and stub out the changelog directory
 *
 * @param prefers - "yaml" or "toml"
 * @param parser - the parser used to make the files.
 * @param changelog_archive - does the user use the changelog archive?
 */
function createChangelogDirectory(
  prefers: "yaml" | "toml",
  parser: typeof TOML | typeof YAML,
  changelog_archive: boolean,
) {
  // Create the changelog directory
  mkdirSync(changelogDir, { recursive: true });

  // Create sample files.
  writeFileSync(path.join(changelogDir, SAMPLE_FILE_NAME[prefers]), parser.stringify(exampleChangelogEntry), {
    encoding: "utf8",
  });

  if (changelog_archive) {
    // Create archive files.
    writeFileSync(
      path.join(changelogDir, ARCHVIE_FILE[prefers]),
      "# This is a generated archive of the changelog.\n### Do not delete this file!",
      {
        encoding: "utf8",
      },
    );
  }

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
  /* v8 ignore start */
  const dir = await prompt("What directory do you want to store your changelog?(Default: changelog) ")
    || initialConfig.dir;
  const prefers = await prompt("Do you prefer toml or yaml?(Default: yaml) ", ["yaml", "toml"]) as "toml" | "yaml"
    || initialConfig.prefers;
  /* v8 ignore end */

  // Assign to response to the dir.
  config.dir = dir;
  config.prefers = prefers;
  const parser = getParser(config.prefers);

  const archive = await prompt("Do you want to store changelog in an archive? (Default: no) ", ["no", "yes"]) || "no";

  // Configure our changelog directory.
  log(`Setting up the ${dir} directory`);

  createChangelogDirectory(config.prefers, parser, archive === "yes");
  // Write new config file.
  writeChangelogConfig(config, parser);

  log(`Finished setting up the ${dir} directory.`);

  if (archive === "yes") {
    const existing = await prompt("Do you have an existing changelog you want to migrate? (Default: no) ", [
      "no",
      "yes",
    ]) || "no";
    if (existing === "yes") {
      writeChangelogToArchive(
        parseChangelog("CHANGELOG.md"),
        path.join(config.dir, ARCHVIE_FILE[config.prefers]),
        config.prefers,
      );
    }
  }

  rl.close();
}

export { createChangelogDirectory, initCommand, writeChangelogConfig };
