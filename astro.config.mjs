// @ts-check

import { defineConfig } from "astro/config"
import { resolve } from "node:path"
import svelte from "@astrojs/svelte"
const __dirname = new URL(".", import.meta.url).pathname

export default defineConfig(
  /** @type {import('astro').AstroUserConfig} */
  {
    vite: {
      resolve: {
        alias: {
          "@": resolve(__dirname, "src"),
        },
      },
    },
    integrations: [svelte()],
  },
)
