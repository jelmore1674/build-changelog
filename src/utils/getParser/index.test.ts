import TOML from "@iarna/toml";
import { expect, test } from "vitest";
import YAML from "yaml";
import { getParser } from "./";

test("yaml files gets the yaml parser", () => {
  expect(getParser("test.yml")).toBe(YAML);
});

test("yaml files gets the yaml parser", () => {
  expect(getParser("test.yaml")).toBe(YAML);
});

test("yaml string get yaml parser", () => {
  expect(getParser("yaml")).toBe(YAML);
});

test("toml files gets the toml parser", () => {
  expect(getParser("test.toml")).toBe(TOML);
});

test("toml string gets the toml parser", () => {
  expect(getParser("toml")).toBe(TOML);
});
