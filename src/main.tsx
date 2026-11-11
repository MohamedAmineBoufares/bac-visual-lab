import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { SettingsProvider } from "./settings/settings";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  // Only page changes animate: in-page jumps (#subject-*) would lift the named titles above the sticky bar.
  defaultViewTransition: { types: ({ pathChanged }) => (pathChanged ? [] : false) },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error("#root missing in index.html");

createRoot(root).render(
  <StrictMode>
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  </StrictMode>,
);
