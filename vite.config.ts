import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Router plugin must run before React: it generates src/routeTree.gen.ts and code-splits each route.
  // React Compiler memoises components and hooks at build time, so we skip hand-written useMemo/useCallback.
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tailwindcss(),
  ],
  // Starts at 3000; if it is busy Vite tries 3001, 3002… Opens the browser on start.
  server: { port: 3000, open: true },
  preview: { port: 3000, open: true },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
