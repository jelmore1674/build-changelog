import path from "node:path";

/**
 * @param file - the file to check if it is a TOML file.
 */
export function isTomlFile(file: string) {
  return path.extname(file).includes(".toml");
}
