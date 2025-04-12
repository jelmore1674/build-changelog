import { readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { isTomlOrYamlFile } from "./isTomlOrYamlFile";
import { log } from "./log";

/**
 * Remove all `yaml` or `toml` files from the changelog directory.
 *
 * @param changelogDir - the directory where changelog files are stored
 */
function cleanUpChangelog(changelogDir: string) {
  log("Cleaning up files.");

  // Clean up the changelog directory after we have finished updating the CHANGELOG.
  const changelogFiles = readdirSync(changelogDir, { recursive: true, encoding: "utf8" });

  for (const file of changelogFiles) {
    if (isTomlOrYamlFile(file)) {
      rmSync(path.join(changelogDir, file as string), { recursive: true, force: true });
    }
  }

  log("Finished cleaing. ");
}

export { cleanUpChangelog };
