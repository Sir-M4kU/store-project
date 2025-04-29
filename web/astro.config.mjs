// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: cloudflare(),

  env: {
    schema: {
      STRAPI_TOKEN: envField.string({ context: "client", access: "public" }),
      STRIPE_TOKEN: envField.string({ context: "client", access: "public" }),
      STRIPE_SECRET: envField.string({ context: "server", access: "secret" }),
      STRAPI_URL: envField.string({ context: "client", access: "public" })
    }
  },

});
