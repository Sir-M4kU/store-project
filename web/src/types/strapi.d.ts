interface BasicData {
  id: number
  documentId: string
}

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

export type { ProductData, CategoryData, ImageData }
