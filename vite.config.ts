import react from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

function lmsApiDevPlugin(): Plugin {
  return {
    name: "lms-api-dev",
    async configureServer(server) {
      const { createLmsApp } = await import("./backend/src/createLmsApp.js");
      const api = createLmsApp();
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api")) {
          return next();
        }
        api(req, res, next);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "development" ? [lmsApiDevPlugin()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
