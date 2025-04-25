import TOML from "@iarna/toml";
import YAML from "yaml";
import { isTomlFile } from "../isTomlFile";

/**
 * Get the parser to be used to generate or read the changelogs files.
 *
 * @param file - the file path of the file to determine which parser to use.
 * You can also pass in `yaml` or `toml` to get the parser.
 *
 * If will fallback to returning the `YAML` parser.
 */
function getParser(file: string) {
  if (isTomlFile(file) || file === "toml") {
    return TOML;
  }
  return YAML;
}

export { getParser };
