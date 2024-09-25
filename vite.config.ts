import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getManifest } from "./manifest.config";
import fs from "fs-extra";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "compile-manifest",
      enforce: "post",
      apply: "build",
      async writeBundle(this) {
        const man = await getManifest();
        setTimeout(() => {
          fs.writeJSON("./dist/manifest.json", man);
        });
      },
    },
  ],
  root: resolve(__dirname, "src/popup"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
