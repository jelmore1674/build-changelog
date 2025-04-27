import { fs, vol } from "memfs";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as generate from "./";
import { fileSystem, fileSystemBumpVersion, fileSystemChange } from "./test";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");

  return memfs.fs;
});

const today = new Date().toISOString().split("T")[0];

describe("generateCommand", () => {
  beforeEach(() => {
    vol.fromJSON(fileSystem, "/tmp");
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    vol.reset();
  });

  test("Can create changelog when no changelog exists.", () => {
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      undefined,
    );

    const changelog = fs.readFileSync("/src/CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(1);
    expect(response.latestChanges).toBe(
      "## Fixed\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`);
  });

  test("Can add changes to existing version.", () => {
    vol.fromJSON(fileSystemChange);
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      undefined,
    );

    const changelog = fs.readFileSync("/src/CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n## Fixed\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`);
  });

  test("Can add changes to existing version.", () => {
    vol.fromJSON(fileSystemBumpVersion);
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [], releaseVersion: "0.1.1" },
      undefined,
    );

    const changelog = fs.readFileSync("/src/CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - ${today}

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

## [0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[0.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.1
[0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });
});
