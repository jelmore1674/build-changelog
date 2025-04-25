import { afterEach, expect, test, vi } from "vitest";
import { prompt, rl } from "./";

afterEach(() => {
  vi.resetAllMocks();
});

test("Prompt returns response.", async () => {
  vi.spyOn(rl, "question").mockResolvedValue("yes");
  const response = await prompt("This is a test prompt");
  expect(response).toBe("yes");
});

test("Prompt returns value in required response.", async () => {
  vi.spyOn(rl, "question").mockResolvedValue("yes");
  const response = await prompt("This is a test prompt", ["yes"]);
  expect(response).toBe("yes");
});

test("Prompt returns default response on enter.", async () => {
  vi.spyOn(rl, "question").mockResolvedValue("");
  const response = await prompt("This is a test prompt", ["yes"]);
  expect(response).toBe("yes");
});

test("Prompt returns with valid response", async () => {
  vi.spyOn(rl, "question").mockResolvedValueOnce("no").mockResolvedValueOnce("no")
    .mockResolvedValue("yes");
  const errors = vi.spyOn(console, "error");
  const response = await prompt("This is a test prompt", ["yes"]);

  expect(errors).toHaveBeenCalledTimes(2);
  expect(response).toBe("yes");
});
