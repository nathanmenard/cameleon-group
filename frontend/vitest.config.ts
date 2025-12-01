import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: {
    jsx: "automatic",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./__tests__/setup.tsx",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "__tests__/**/*.{test,spec}.{ts,tsx}",
    ],
    open: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/next.config.ts",
        "**/postcss.config.mjs",
        "**/vitest.config.ts",
        "**/.next/**",
        ".storybook/**",
        "**/storybook-static/**",
      ],
    },
  },
});
