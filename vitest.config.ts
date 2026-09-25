import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@pixeln/core": fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url)),
      "@pixeln/dom": fileURLToPath(new URL("./packages/dom/src/index.ts", import.meta.url)),
      "@pixeln/react": fileURLToPath(new URL("./packages/react/src/index.ts", import.meta.url)),
    },
  },
  test: {
    include: ["packages/*/src/**/*.test.ts"],
  },
});
