interface BasicData {
  id: number
  documentId: string
}

type ContentTypes = "products"

interface ImageData extends BasicData {
  caption: string
  width: number
  height: number
  url: string
}

interface CategoryData extends BasicData {
  name: string
}

interface ProductData extends BasicData {
  name: string
  price: number
  slug: string
  description: string
}

interface OrderData {
  line_items: any[]
  stripe_session: string
}

export type { ProductData, OrderData, CategoryData, ImageData, ContentTypes }
