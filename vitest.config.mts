import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      GITHUB_SERVER_URL: "https://github.com",
      GITHUB_REPOSITORY: "jelmore1674/build-changelog",
      GITHUB_ACTOR: "jelmore1674",
      INPUT_TOKEN: "token",
      INPUT_GIT_TAG_PREFIX: "v",
    },
    environment: "node",
    include: ["./src/**/*.test.ts"],
    exclude: ["dist", "lib"],
    retry: 1,
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src"],
      exclude: ["dist", "lib", "src/**/*.test.ts", "src/index.ts", "src/utils/log.ts"],
    },
  },
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "src/lib"),
      "@types": path.resolve(__dirname, "src/types.ts"),
      "@consts": path.resolve(__dirname, "src/consts.ts"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
