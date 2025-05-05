// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    imageService: "passthrough"
  }),
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    validateSecrets: false,
    schema: {
      STRAPI_TOKEN: envField.string({ context: "client", access: "public" }),
      STRIPE_TOKEN: envField.string({ context: "client", access: "public" }),
      STRIPE_SECRET: envField.string({ context: "server", access: "secret" }),
      STRAPI_URL: envField.string({ context: "client", access: "public" })
    }
  }

});
