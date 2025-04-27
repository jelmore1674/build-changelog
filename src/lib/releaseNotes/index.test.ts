import { fs, vol } from "memfs";
import { afterEach, describe, expect, test, vi, vitest } from "vitest";
import * as releaseNotes from "./";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");

  return memfs.fs;
});

describe("releaseNotes", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  test("should run successful", async () => {
    vol.fromJSON({
      "./CHANGELOG.md": `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`,
    });

    const notesCommand = vitest.spyOn(releaseNotes, "notesCommand");
    const result = releaseNotes.notesCommand();

    expect(notesCommand).toHaveBeenCalledOnce();
    expect(notesCommand).toReturn();
    expect(result).toBe(`# What's Changed\n\n## Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`);
  });
});
