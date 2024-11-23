import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["./src/**/*.test.ts"],
    exclude: ["dist", "lib"],
    retry: 1,
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src"],
      exclude: ["dist", "lib", "src/**/*.test.ts", "src/index.ts"],
    },
  },
});
