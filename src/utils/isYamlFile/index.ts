import path from "node:path";

/**
 * @param file - the file to check if it is a yaml file.
 */
export function isYamlFile(file: string) {
  return path.extname(file).includes(".yml") || path.extname(file).includes(".yaml");
}
