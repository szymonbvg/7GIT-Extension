import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/background/background.ts"),
      output: {
        entryFileNames: "background.js",
        format: "iife",
      },
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});
