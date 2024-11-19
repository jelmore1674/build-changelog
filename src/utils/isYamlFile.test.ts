import { expect, test } from "vitest";
import { isYamlFile } from "./isYamlFile";

test("string is yaml file", () => {
  expect(isYamlFile("test.yml")).toBeTruthy();
});
