import { describe, expect, test } from "vitest";
import { formatChangeMessage } from "./";

const author = {
  name: "justin",
  url: "https://github.com/jelmore1674",
};
const message = "This is a change.";
const sha = "3c20f6dc679fbece838d9828bd8391d5d371ac63";

describe("formatChangeMessage", () => {
  test("Can render without options", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
    }, {});

    expect(result).toBe("This is a change.");
  });

  test("Can render with sha.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
    }, {
      reference_sha: true,
    });

    expect(result).toBe(
      "This is a change. [`3c20f6d`](https://github.com/jelmore1674/build-changelog/commit/3c20f6dc679fbece838d9828bd8391d5d371ac63)",
    );
  });

  test("Can render just references.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [{ type: "issue", number: 1 }],
    }, {});

    expect(result).toBe(
      "This is a change. | [#1](https://github.com/jelmore1674/build-changelog/issues/1)",
    );
  });

  test("Can render reference from pr without other references.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
      prNumber: 2,
    }, { reference_pull_requests: true });

    expect(result).toBe(
      "This is a change. | [#2](https://github.com/jelmore1674/build-changelog/pull/2)",
    );
  });

  test("Can render reference from pr.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [{ type: "issue", number: 1 }],
      prNumber: 2,
    }, { reference_pull_requests: true });

    expect(result).toBe(
      "This is a change. | [#1](https://github.com/jelmore1674/build-changelog/issues/1), [#2](https://github.com/jelmore1674/build-changelog/pull/2)",
    );
  });

  test("Can render message with just author.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
    }, { show_author: true });

    expect(result).toBe(
      "This is a change. | [justin](https://github.com/jelmore1674)",
    );
  });

  test("Can render hash and author", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
    }, { show_author: true, reference_sha: true });

    expect(result).toBe(
      "This is a change. [`3c20f6d`](https://github.com/jelmore1674/build-changelog/commit/3c20f6dc679fbece838d9828bd8391d5d371ac63) | [justin](https://github.com/jelmore1674)",
    );
  });

  test("Can render hash and author with flag", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
      flag: "breaking",
    }, { show_author: true, reference_sha: true, flags: { breaking: "[Breaking]" } });

    expect(result).toBe(
      "[Breaking] - This is a change. [`3c20f6d`](https://github.com/jelmore1674/build-changelog/commit/3c20f6dc679fbece838d9828bd8391d5d371ac63) | [justin](https://github.com/jelmore1674)",
    );
  });

  test("Can render message with just flag.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
      flag: "breaking",
    }, { flags: { breaking: "[Breaking 🧨]" } });

    expect(result).toBe(
      "[Breaking 🧨] - This is a change.",
    );
  });

  test("Can render message with custom flag.", () => {
    const result = formatChangeMessage({
      message,
      author,
      sha,
      references: [],
      flag: "custom",
    }, { flags: { custom: "[Custom 🎉]" } });

    expect(result).toBe(
      "[Custom 🎉] - This is a change.",
    );
  });
});
