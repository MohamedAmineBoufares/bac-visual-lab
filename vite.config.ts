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
});
