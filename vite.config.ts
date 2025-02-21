import { globSync } from "node:fs";
import { fileURLToPath, URL } from "url";
import path from "path";

import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: globSync("./client/**/*.{tsx,ts,css}"),
          output: {
            dir: "static",
            entryFileNames: "[name].js",
            chunkFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name].[ext]",
          },
        },
        emptyOutDir: false,
        copyPublicDir: false,
      },
    };
  }
  return {
    server: {
      port: 3001,
    },
    plugins: [
      devServer({
        adapter: bunAdapter,
        entry: "./server/app.tsx",
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./", import.meta.url)),
        "@/components": path.resolve(__dirname, "./client/components"),
        "@/lib": path.resolve(__dirname, "./lib"),
      },
    },
  };
});
