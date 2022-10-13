import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  integrations: [svelte()],
  vite: {
    build: {
      rollupOptions: {
        // Index is be built and assets are made available only *after* site is built
        external: ["/_pagefind/pagefind.js"],
      },
    },
  },
});
