import { STRAPI_URL, STRAPI_TOKEN } from "astro:env/client"
import { strapi } from "@strapi/client"

const strapiClient = strapi({
  baseURL: `${STRAPI_URL}/api`,
  auth: STRAPI_TOKEN
})

const OrderCollection = strapiClient.collection("orders")
const ProductCollection = strapiClient.collection("products")

export {
  strapiClient,
  OrderCollection,
  ProductCollection
}
