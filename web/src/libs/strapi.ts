import { STRAPI_URL, STRAPI_TOKEN } from "astro:env/client"
import type { ImageData, ProductData, CategoryData } from "@/types/strapi"
import qs from "qs"

interface Product extends ProductData {
  image: ImageData
}
interface ProductWithType extends Product {
  type: CategoryData[]
}
interface QueryParams {
  filters: object
  locale: string
  status: "published" | "draft"
  populate: string | object
  fields: Array<string>
  sort: string | Array<string>
  pagination: Partial<{
    page: number
    pageSize: number
    withCount: boolean
  }>
}

const BASE_HEADERS = new Headers({ Authorization: `Bearer ${STRAPI_TOKEN}` })
const BASE_URL = `${STRAPI_URL}/api`

async function fetchStrapi<T>(collection: string, query: Partial<QueryParams>) {
  const q = qs.stringify(query, { addQueryPrefix: true })
  const url = `${BASE_URL}/${collection}${q}`
  const req = await fetch(url, { headers: BASE_HEADERS })

  if (!req.ok) {
    console.log({ req })
    console.error(`[${req.status}] ${req.statusText}`)

    return null
  }

  return req.json().then(({ data }) => data as Array<T>)
}

async function createDocument<T>(collection: string, data: T) {
  const url = `${BASE_URL}/${collection}`
  const headers = new Headers({ Authorization: `Bearer ${STRAPI_TOKEN}`, "Content-Type": "application/json" })
  const req = await fetch(url, { headers, method: "POST", body: JSON.stringify({ data }) })

  if (!req.ok) {
    console.error(`[${req.status}] ${req.statusText}`)

    return null
  }

  return req.json().then(({ data }) => data)
}

async function getProductsByCategories(categories: Array<string>) {
  return fetchStrapi<Product>("products", {
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
      pageSize: 4,
    }
  })
}

async function getProductsByCategory(category: string) {
  return fetchStrapi<Product>("products", {
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
      pageSize: 4
    }
  })
}

async function getRecentProducts() {
  return fetchStrapi<Product>("products", {
    sort: "createdAt:desc",
    fields: ["name", "price", "slug"],
    populate: {
      image: {
        fields: ["caption", "width", "height", "url"],
      },
    },
    pagination: {
      pageSize: 16,
    }
  })
}

async function getProductBySlug(slug: string) {
  return fetchStrapi<ProductWithType>("products", {
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
  }).then((data) => data && data[0])
}

export {
  BASE_HEADERS,
  BASE_URL,
  fetchStrapi,
  createDocument,
  getRecentProducts,
  getProductsByCategory,
  getProductBySlug,
  getProductsByCategories
}
