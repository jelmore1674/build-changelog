import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { changelogDir, config, configPath, initialConfig } from "./config";
import { rl } from "./readline";

const readme = readFileSync(
  path.join(process.env.NODE_ENV === "test" ? process.cwd() : __dirname, "./templates/guide.md"),
  "utf8",
);

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
  console.log(`Setting up the ${dir} directory`);

  // Stub out Unreleased directory.
  mkdirSync(path.join(changelogDir, "Unreleased"), { recursive: true });

  writeFileSync(path.join(changelogDir, "README.md"), readme);

  console.log(process.env.NODE_ENV);

  // Write new config file.
  const newConfig = YAML.stringify(config);
  writeFileSync(configPath, newConfig);

  console.log(`Finished setting up the ${dir} directory.`);
}

export { initCommand };
