import type { KeepAChangelogKeywords, Version as BaseVersion } from "@jelmore1674/changelog";
import type { Config } from "@lib/config";

interface Reference {
  type: "issue" | "pull_request";
  number: number;
}

/**
 * The changelog style.
 */
type ChangelogStyle = "common-changelog" | "keep-a-changelog" | "custom";

/**
 * Complex changelog entry
 */
type ComplexChange = {
  /**
   * Any custom flags with prefixes.
   */
  flag?: string;
  /**
   * The changelog message.
   */
  message: string;
  /**
   * References
   */
  references?: Reference[];
};

/**
 * Changes from a change object
 */
type Changes = Record<string, string[]>;

/**
 * The version type used in generate changelog
 */
type Version = BaseVersion<Partial<Record<KeepAChangelogKeywords, string[]>>>;

/**
 * The type of changes parsed from a changelog
 */
type ChangelogChanges = Partial<
  Record<KeepAChangelogKeywords, string[] | Changes | ComplexChange[]>
>;

/**
 * The parsed changed from the changelog file.
 */
interface ParsedChanges extends ChangelogChanges {
  /**
   * The version of the change
   */
  version: string;
  /**
   * The release date of the version
   */
  // biome-ignore lint/style/useNamingConvention: Following yaml/toml convention.
  release_date?: string;
  /**
   * A notice for the version entry.
   */
  notice?: string;
  /**
   * References to a issue or pull request.
   */
  references?: Reference[];

  /**
   * Author only will be set using the enforcer action, and will be set to
   * `dependabot`.
   */
  author?: "dependabot";
}

interface LinkReference extends Omit<Reference, "type"> {
  type: "pull_request" | "issue";
}

/**
 * The configuration used that is passed into `generateCommand`.
 */
type GenerateConfig = Omit<Config, "repo_url" | "release_url" | "changelog_archive" | "prefers">;

export type {
  ChangelogChanges,
  ChangelogStyle,
  Changes,
  ComplexChange,
  GenerateConfig,
  LinkReference,
  ParsedChanges,
  Reference,
  Version,
};
