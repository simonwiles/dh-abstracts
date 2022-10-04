import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        // Index is be built and assets are made available only *after* site is built
        external: ["/_pagefind/pagefind.js"],
      },
    },
  },
});
