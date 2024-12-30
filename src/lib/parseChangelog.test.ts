import { removeSync } from "fs-extra";
import * as fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { configPath } from "./config";
import { parseChangelog } from "./parseChangelog";

const dir = process.env.NODE_ENV === "test" ? process.cwd() : __dirname;

const TEST_DIR = path.join(dir, "../../test");

function teardown() {
  // Remove test dir that is generated.
  if (fs.existsSync(TEST_DIR)) {
    removeSync(TEST_DIR);
  }

  // Remove test config that is generated
  if (fs.existsSync(configPath)) {
    removeSync(configPath);
  }
}

describe("convertChangelogToObject", () => {
  vi.mock(import("node:fs"), async (importOriginal) => {
    const og = await importOriginal();
    return ({
      readFileSync: vi.fn().mockImplementation(og.readFileSync),
      writeFileSync: vi.fn().mockImplementation(og.writeFileSync),
      existsSync: vi.fn().mockImplementation(og.existsSync),
      mkdirSync: vi.fn().mockImplementation(og.mkdirSync),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    teardown();
  });

  test("reads changelog", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## [1.0.0] - 2024-12-07\n\n### Added\n\n- This cool change`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{ version: "1.0.0", release_date: "2024-12-07", added: ["This cool change"] }]);
  });

  test("can handle multiple changes", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## [1.0.0] - 2024-12-07\n\n### Added\n\n- This cool change\n- Another change\n- And another one`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.0.0",
      release_date: "2024-12-07",
      added: ["This cool change", "Another change", "And another one"],
    }]);
  });

  test("can get the version without brackets.", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## 1.0.0 - 2024-12-07\n\n### Added\n\n- This cool change\n- Another change\n- And another one`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.0.0",
      release_date: "2024-12-07",
      added: ["This cool change", "Another change", "And another one"],
    }]);
  });

  test("if version is not in valid semver it will fallback to unreleased", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n##  upcoming \n\n### Added\n\n- This cool change\n- Another change\n- And another one`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "Unreleased",
      release_date: "TBD",
      added: ["This cool change", "Another change", "And another one"],
    }]);
  });

  test("should omit empty changes.", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# changelog

## [1.2.4] - 2017-03-15

Here we would have the update steps for 1.2.4 for people to follow.

### Added

### Changed

- [PROJECTNAME-ZZZZ](http://tickets.projectname.com/browse/PROJECTNAME-ZZZZ)
  PATCH Drupal.org is now used for composer.

### Fixed

- [PROJECTNAME-TTTT](http://tickets.projectname.com/browse/PROJECTNAME-TTTT)
  PATCH Add logic to runsheet teaser delete to delete corresponding
  schedule cards.`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.2.4",
      release_date: "2017-03-15",
      added: [],
      changed: [
        "[PROJECTNAME-ZZZZ](http://tickets.projectname.com/browse/PROJECTNAME-ZZZZ) PATCH Drupal.org is now used for composer.",
      ],
      fixed: [
        "[PROJECTNAME-TTTT](http://tickets.projectname.com/browse/PROJECTNAME-TTTT) PATCH Add logic to runsheet teaser delete to delete corresponding schedule cards.",
      ],
    }]);
  });

  test("all keywords are valid", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## [1.0.0] - 2024-12-07\n\n### Added\n\n- This cool change\n\n### Fixed\n\n- this is a fix.\n\n### Changed\n\n- this is a change\n\n### Removed\n\n- this remove a feature\n\n### Deprecated\n\n- this will be deprecated\n\n### Security\n\n- security update`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.0.0",
      release_date: "2024-12-07",
      added: ["This cool change"],
      fixed: ["this is a fix."],
      changed: ["this is a change"],
      removed: ["this remove a feature"],
      deprecated: ["this will be deprecated"],
      security: ["security update"],
    }]);
  });

  test("all keywords are valid", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## [1.0.0] - 2024-12-07\n\n### Added\n\n- [Breaking 🧨] - this cool change\n`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.0.0",
      release_date: "2024-12-07",
      added: ["[Breaking 🧨] - this cool change"],
    }]);
  });

  test("can get notice out of changelog", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValueOnce(
      `# Changelog\n\n## [1.0.0] - 2024-12-07\n\n_This is a notice_\n\n### Added\n\n- [Breaking 🧨] - this cool change\n`,
    );
    const cl = parseChangelog("CHANGELOG.md");
    expect(cl).toEqual([{
      version: "1.0.0",
      notice: "This is a notice",
      release_date: "2024-12-07",
      added: ["[Breaking 🧨] - this cool change"],
    }]);
  });
});
