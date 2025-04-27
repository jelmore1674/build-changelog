import { fs, vol } from "memfs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { changelogDir } from "../../lib/config";
import { cleanUpChangelog } from "./";

vi.mock("node:fs", async () => {
  const memfs: { fs: typeof fs } = await vi.importActual("memfs");

  return memfs.fs;
});

describe("cleanUpChanglogDir", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vol.reset();
  });

  test("Can clean the directory", () => {
    vol.fromJSON({
      "./changelog/test.yml": "fixed:\n  - this change.",
      "./changelog/tes.toml": "fixed:\n  - this change.",
    }, process.cwd());

    const files = fs.readdirSync(changelogDir).length;
    expect(files).toBe(2);

    cleanUpChangelog(changelogDir);
    const after = fs.readdirSync(changelogDir).length;
    expect(after).toBe(0);
  });

  test("Will only remove yaml or toml files.", () => {
    vol.fromJSON({
      "./changelog/test.yml": "fixed:\n  - this change.",
      "./changelog/tes.toml": "fixed:\n  - this change.",
      "./changelog/README.md": "# hi",
    }, process.cwd());

    const files = fs.readdirSync(changelogDir).length;
    expect(files).toBe(3);

    cleanUpChangelog(changelogDir);
    const after = fs.readdirSync(changelogDir).length;
    expect(after).toBe(1);
  });
});
