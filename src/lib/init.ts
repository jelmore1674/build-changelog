import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { changelogDir, config, configPath, initialConfig } from "./config";
import { rl } from "./readline";

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

  // Create `yaml` for our unreleased changelog.
  const yaml = YAML.stringify({ added: ["`build-changlelog` to generate changelogs."] });
  // Stub out template for unreleased.
  writeFileSync(path.join(changelogDir, "Unreleased/init.yml"), yaml);

  // TODO: Update this README for the stubbed out documentation.
  writeFileSync(path.join(changelogDir, "README.md"), "# Do this");

  // Write new config file.
  const newConfig = YAML.stringify(config);
  writeFileSync(configPath, newConfig);

  console.log(`Finished setting up the ${dir} directory.`);
}

export { initCommand };
