import { isTomlFile } from "./isTomlFile";
import { isYamlFile } from "./isYamlFile";

/**
 * Utility function that determines if the file is a `TOML` or `YAML` file.
 *
 * @param file - the file name you are checking.
 */
function isTomlOrYamlFile(file: string) {
  return isTomlFile(file) || isYamlFile(file);
}

export { isTomlOrYamlFile };
