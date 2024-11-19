import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { log } from "../utils/log";
import { changelogDir, config, configPath, initialConfig } from "./config";
import { rl } from "./readline";

const readme = readFileSync(
  path.join(process.env.NODE_ENV === "test" ? process.cwd() : __dirname, "./templates/guide.md"),
  "utf8",
);

const exampleChangelogEntry = YAML.stringify({ version: "Unreleased", added: ["`build-changelog` to the project."] });

/**
 * Intialize the application.
 *
 * This will create the changelog directory. And stub out files.
 */
async function initCommand() {
  const dir = await rl.question("What directory do you want to store your changelog?(Default: changelog) ");
  rl.close();

  // Assign to response to the dir.
  config.dir = dir || initialConfig.dir;

  // Configure our changelog directory.
  log(`Setting up the ${dir} directory`);

  mkdirSync(changelogDir, { recursive: true });

  writeFileSync(path.join(changelogDir, "init.yml"), exampleChangelogEntry, { encoding: "utf8" });
  writeFileSync(path.join(changelogDir, "README.md"), readme, { encoding: "utf8" });

  // Write new config file.
  const newConfig = YAML.stringify(config);
  writeFileSync(configPath, newConfig);

  log(`Finished setting up the ${dir} directory.`);
}

export { initCommand };
