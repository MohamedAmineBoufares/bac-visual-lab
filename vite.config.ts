/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Router plugin must run before React: it generates src/routeTree.gen.ts and code-splits each route.
  // React Compiler memoises components and hooks at build time, so we skip hand-written useMemo/useCallback.
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    // Offline: precaches the app shell and every lesson chunk; updates install silently on next visit.
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Bac Visual Lab",
        short_name: "Bac Lab",
        description: "Interactive maths, physics and chemistry simulations for Tunisian Bac students.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
      // woff2 only: every current browser picks it, so the KaTeX .woff/.ttf fallbacks are not precached.
      workbox: { globPatterns: ["**/*.{js,css,html,svg,woff2}"] },
    }),
  ],
  // Starts at 3000; if it is busy Vite tries 3001, 3002… Opens the browser on start.
  server: { port: 3000, open: true },
  preview: { port: 3000, open: true },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**"],
      // Generated, boot-only, dev-only, or shadcn primitives restyled from upstream.
      exclude: [
        "src/routeTree.gen.ts",
        "src/main.tsx",
        "src/routes/design.tsx",
        "src/components/ui/**",
        "src/**/*.test.*",
        "src/test/**",
        // WebGL: jsdom cannot draw the canvas. Their text alternative is tested in scene-3d.test.tsx.
        "src/**/scene-3d.tsx",
      ],
      reporter: ["text-summary", "html"],
      // Floors, not goals: a PR may not lower them. Raise them when coverage grows.
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 70,
        // Simulation models are pure physics/maths: every line is tested against a known solution.
        "src/sims/**/model.ts": { lines: 100, statements: 100, functions: 100, branches: 90 },
        "src/lessons/*.ts": { lines: 75, statements: 75, functions: 75, branches: 70 },
      },
    },
  },
});
