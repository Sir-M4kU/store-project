import { STRAPI_URL, STRAPI_TOKEN } from "astro:env/client"
import type { ImageData, ProductData, CategoryData } from "@/types/strapi"
// import { strapi } from "@strapi/client"
import Strapi from "strapi-sdk-js"

// const strapiClient = strapi({
//   baseURL: `${STRAPI_URL}/api`,
//   auth: STRAPI_TOKEN
// })
const strapiClient = new Strapi({
  url: STRAPI_URL
})

interface Product extends ProductData {
  image: ImageData
}
interface ProductWithType extends Product {
  type: CategoryData[]
}

strapiClient.axios.defaults.headers.common["Authorization"] = `Bearer ${STRAPI_TOKEN}`

// const OrderCollection = strapiClient.collection("orders")
// const ProductCollection = strapiClient.collection("products")

async function getProductsByCategories(categories: Array<string>) {
  return strapiClient.find<Product>("products", {
    filters: {
      type: {
        name: {
          $in: categories,
        },
      },
    },
    fields: ["name", "price", "slug"],
    populate: {
      image: {
        fields: ["caption", "width", "height", "url"],
      },
    },
    sort: "createdAt:desc",
    pagination: {
      page: 0,
      pageSize: 4,
    },
  }).then(({ data }) => data).catch((err) => {
    console.error(err)
    return null
  })
}

async function getProductsByCategory(category: string) {
  return strapiClient
    .find<Product>("products", {
      filters: {
        type: {
          name: {
            $eq: category,
          },
        },
      },
      fields: ["name", "price", "slug"],
      populate: {
        image: {
          fields: ["caption", "width", "height", "url"]
        }
      },
      pagination: {
        page: 0,
        pageSize: 4
      },
      state: "published"
    })
    .then(({ data }) => data)
    .catch((err) => {
      console.error(err)
      return null
    })
}

async function getRecentProducts() {
  return strapiClient
    .find<Product>("products", {
      sort: "createdAt:desc",
      fields: ["name", "price", "slug"],
      populate: {
        image: {
          fields: ["caption", "width", "height", "url"],
        },
      },
      pagination: {
        page: 0,
        pageSize: 16,
      },
      state: "published",
    })
    .then(({ data }) => data)
    .catch((err) => {
      console.error(err);
      return null;
    })
}

async function getProductBySlug(slug: string) {
  return strapiClient.find<ProductWithType>("products", {
    filters: {
      slug: {
        $eq: slug
      }
    },
    fields: ["name", "description", "price"],
    populate: {
      image: {
        fields: ["caption", "width", "height", "url"],
      },
      type: {
        fields: ["name"],
      }
    }
  }).then(({ data }) => data[0]).catch((err) => {
    console.error(err)
    return null
  })
}

export {
  strapiClient,
  getRecentProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductsByCategories
  // OrderCollection,
  // ProductCollection
}
