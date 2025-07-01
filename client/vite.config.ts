import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "pdfjs-dist/build/pdf.worker.entry": "pdfjs-dist/build/pdf.worker.js",
    },
  },
});
