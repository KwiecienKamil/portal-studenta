/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
          dest: "",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.entry": "pdfjs-dist/build/pdf.worker.js",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/testSetup.ts",
    include: ["src/tests/**/*.test.{ts,tsx,js,jsx}"],
    exclude: ["**/node_modules/**", "**/.storybook/**", "**/*.stories.*", "**/*.mdx"],
  },
});
