import nock from "nock";
import { afterEach, describe, expect, test, vi } from "vitest";
import { getAuthorName } from "./";

describe("getAuthorName", () => {
  afterEach(() => {
    vi.resetAllMocks();
    nock.cleanAll();
  });

  test("Can return the expected author name", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "false";

    const result = await getAuthorName();

    expect(result).toStrictEqual({ name: "jelmore1674", url: "https://github.com/jelmore1674" });
  });

  test("Can return the users full name", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    nock("https://api.github.com")
      .persist()
      .get(
        "/users/jelmore1674",
      )
      // biome-ignore lint/style/useNamingConvention: api
      .reply(200, { name: "Justin Elmore", html_url: "https://github.com/jelmore1674" });

    const result = await getAuthorName();

    expect(result).toStrictEqual({ name: "Justin Elmore", url: "https://github.com/jelmore1674" });
  });

  test("Can return the users full name", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    nock("https://api.github.com")
      .persist()
      .get(
        "/users/jelmore1674",
      )
      // biome-ignore lint/style/useNamingConvention: api
      .reply(200, { name: "Justin Elmore", html_url: "https://github.com/jelmore1674" });

    const result = await getAuthorName();

    expect(result).toStrictEqual({ name: "Justin Elmore", url: "https://github.com/jelmore1674" });
  });

  test("Can return the users overridden name", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    const result = await getAuthorName({ jelmore1674: "Bob" });

    expect(result).toStrictEqual({ name: "Bob", url: "https://github.com/jelmore1674" });
  });

  test("Can return the users name from a pr", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "false";

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/build-changelog/pulls/1",
      )
      .reply(200, {
        user: {
          login: "jelmore1674",
          // biome-ignore lint/style/useNamingConvention: api
          html_url: "https://github.com/jelmore1674",
        },
      });

    const result = await getAuthorName(undefined, 1);

    expect(result).toStrictEqual({ name: "jelmore1674", url: "https://github.com/jelmore1674" });
  });

  test("Can return the users full name from a pr", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/build-changelog/pulls/1",
      )
      .reply(200, {
        user: {
          login: "jelmore1674",
          // biome-ignore lint/style/useNamingConvention: api
          html_url: "https://github.com/jelmore1674",
        },
      });

    nock("https://api.github.com")
      .persist()
      .get(
        "/users/jelmore1674",
      )
      // biome-ignore lint/style/useNamingConvention: api
      .reply(200, { name: "Justin Elmore", html_url: "https://github.com/jelmore1674" });

    const result = await getAuthorName(undefined, 1);

    expect(result).toStrictEqual({ name: "Justin Elmore", url: "https://github.com/jelmore1674" });
  });

  test("Will fallback to the login name from a pr", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/build-changelog/pulls/1",
      )
      .reply(200, {
        user: {
          login: "jelmore1674",
          // biome-ignore lint/style/useNamingConvention: api
          html_url: "https://github.com/jelmore1674",
        },
      });

    nock("https://api.github.com")
      .persist()
      .get(
        "/users/jelmore1674",
      )
      // biome-ignore lint/style/useNamingConvention: api
      .reply(200, { name: "", html_url: "https://github.com/jelmore1674" });

    const result = await getAuthorName(undefined, 1);

    expect(result).toStrictEqual({ name: "jelmore1674", url: "https://github.com/jelmore1674" });
  });

  test("Can override the users full name from a pr", async () => {
    process.env.INPUT_SHOW_AUTHOR_FULL_NAME = "true";

    nock("https://api.github.com")
      .persist()
      .get(
        "/repos/jelmore1674/build-changelog/pulls/1",
      )
      .reply(200, {
        user: {
          login: "jelmore1674",
          // biome-ignore lint/style/useNamingConvention: api
          html_url: "https://github.com/jelmore1674",
        },
      });

    nock("https://api.github.com")
      .persist()
      .get(
        "/users/jelmore1674",
      )
      // biome-ignore lint/style/useNamingConvention: api
      .reply(200, { name: "", html_url: "https://github.com/jelmore1674" });

    const result = await getAuthorName({ jelmore1674: "Bob" }, 1);

    expect(result).toStrictEqual({ name: "Bob", url: "https://github.com/jelmore1674" });
  });
});
