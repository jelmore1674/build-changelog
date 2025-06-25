import { fs, vol } from "memfs";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { config } from "../config";
import * as generate from "./";
import {
  autoVersioningExistingUnreleasedChanges,
  autoVersioningExistingUnreleasedChangesMajor,
  autoVersioningExistingUnreleasedChangesMinor,
  autoVersioningMajor,
  autoVersioningMajorBreaking,
  autoVersioningMinor,
  autoVersioningPatch,
  fileSystem,
  fileSystemBumpVersion,
  fileSystemChange,
  fileSystemChangelogWithTagPrefix,
} from "./test";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");

  return memfs.fs;
});

const today = new Date().toISOString().split("T")[0];

describe("generateCommand", () => {
  beforeEach(() => {
    vol.fromJSON(fileSystem, process.cwd());
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

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(1);
    expect(response.latestChanges).toBe(
      "## Fixed\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n`);
  });

  test("Can add changes to existing version.", () => {
    vol.fromJSON(fileSystemChange, process.cwd());
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      undefined,
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n## Fixed\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - TBD

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n`);
  });

  test("Can add changes to existing version.", () => {
    vol.fromJSON(fileSystemBumpVersion, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [], releaseVersion: "0.1.1" },
      undefined,
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - ${today}

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[0.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.1
[0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle versions with git_tag_prefix.", () => {
    vol.fromJSON(fileSystemChangelogWithTagPrefix, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [], releaseVersion: "0.1.1" },
      {
        ...config,
        show_git_tag_prefix: true,
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.1] - ${today}

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v0.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.1
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning patch", () => {
    vol.fromJSON(autoVersioningPatch, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.1] - TBD

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v0.1.1]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.1
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning minor", () => {
    vol.fromJSON(autoVersioningMinor, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0] - TBD

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v0.2.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.2.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning major", () => {
    vol.fromJSON(autoVersioningMajor, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
        dir: "changelog",
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - TBD

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning major autodetech breaking change", () => {
    vol.fromJSON(autoVersioningMajorBreaking, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
        dir: "changelog",
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(2);
    expect(response.latestChanges).toBe(
      "## Added\n\n- [Breaking 🧨] - This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - TBD

### Added

- [Breaking 🧨] - This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning minor", () => {
    vol.fromJSON(autoVersioningExistingUnreleasedChanges, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(3);
    expect(response.latestChanges).toBe(
      "## Changed\n\n- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0] - TBD

### Changed

- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v0.2.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.2.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning minor, but current change is a patch.", () => {
    vol.fromJSON(autoVersioningExistingUnreleasedChangesMinor, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(3);
    expect(response.latestChanges).toBe(
      "## Changed\n\n- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.0] - TBD

### Changed

- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v0.2.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.2.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });

  test("Can handle auto versioning major, but current change is a patch.", () => {
    vol.fromJSON(autoVersioningExistingUnreleasedChangesMajor, process.cwd());
    vol.rm("/src/test/change.yml", () => {});
    const response = generate.generateCommand(
      { sha: "abcdef3149d", prReferences: [] },
      {
        ...config,
        show_git_tag_prefix: true,
        auto_versioning: true,
        dir: "changelog",
      },
    );

    const changelog = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" });

    expect(response.count).toBe(3);
    expect(response.latestChanges).toBe(
      "## Changed\n\n- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)\n\n## Added\n\n- This test issue [`abcdef3`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)\n\n",
    );

    expect(changelog).toBe(`# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - TBD

### Changed

- This is an existing change. [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

### Added

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/bcl-bot)

## [v0.1.0] - 2025-01-01

### Fixed

- This test issue [\`abcdef3\`](https://github.com/jelmore1674/build-changelog/commit/abcdef3149d) | [bcl-bot](https://github.com/jelmore1674)

[v1.0.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v1.0.0
[v0.1.0]: https://github.com/jelmore1674/build-changelog/releases/tag/v0.1.0\n`);
  });
});
