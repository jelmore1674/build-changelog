import TOML from "@iarna/toml";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { log } from "../utils/log";
import { changelogDir, config, configPath, initialConfig } from "./config";
import { rl } from "./readline";

const SAMPLE_FILE_NAME = {
  yaml: "init.yml",
  toml: "init.toml",
};

const CONFIG_FILE = {
  yaml: "bcl.yml",
  toml: "bcl.toml",
};

const readme = readFileSync(
  path.join(process.env.NODE_ENV === "test" ? process.cwd() : __dirname, "./templates/guide.md"),
  "utf8",
);

const exampleChangelogEntry = { version: "Unreleased", added: ["`build-changelog` to the project."] };

/**
 * Intialize the application.
 *
 * This will create the changelog directory. And stub out files.
 */
async function initCommand() {
  const dir = await rl.question("What directory do you want to store your changelog?(Default: changelog) ");

  const prefers = await rl.question("Do you prefer toml or yaml?(Default: yaml) ") as "toml" | "yaml";
  rl.close();

  // Assign to response to the dir.
  config.dir = dir || initialConfig.dir;
  config.prefers = prefers || initialConfig.prefers;
  const parser = prefers === "yaml" ? YAML : TOML;

  // Configure our changelog directory.
  log(`Setting up the ${dir} directory`);

  mkdirSync(changelogDir, { recursive: true });

  writeFileSync(path.join(changelogDir, SAMPLE_FILE_NAME[prefers]), parser.stringify(exampleChangelogEntry), {
    encoding: "utf8",
  });
  writeFileSync(path.join(changelogDir, "README.md"), readme, { encoding: "utf8" });

  // Write new config file.
  const newConfig = parser.stringify(config);
  if (process.env.NODE_ENV !== "test") {
    writeFileSync(CONFIG_FILE[prefers], newConfig);
  } else {
    writeFileSync(configPath, newConfig);
  }

  log(`Finished setting up the ${dir} directory.`);
}

export { initCommand };
