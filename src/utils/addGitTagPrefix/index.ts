import type { GenerateConfig, Version } from "@types";

/**
 * Helper function to add the git tag prefix to a release version.
 */
function addGitTagPrefix(
  version: Version,
  config: GenerateConfig,
) {
  version.version = `${config.git_tag_prefix}${version.version}`;
  return version;
}

export { addGitTagPrefix };
