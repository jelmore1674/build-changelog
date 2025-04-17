import type { KeepAChangelogKeywords } from "@jelmore1674/changelog";

interface Reference {
  type: "issue" | "pull_request";
  number: number;
}

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
 * The parsed changed from the changelog file.
 */
interface ParsedChanges
  extends Partial<Record<KeepAChangelogKeywords, string[] | Record<string, string[]> | ComplexChange[]>>
{
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
}

interface LinkReference extends Omit<Reference, "type"> {
  type: "pull_request" | "issue";
}

export type { ComplexChange, LinkReference, ParsedChanges, Reference };
