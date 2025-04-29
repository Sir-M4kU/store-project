import { ShoppingCart } from "lucide-preact"
import type { ProductData } from "@/types/strapi"
import { addToCart } from "@/stores/cart"

interface Props {
  product: ProductData
}

export default function AddToCart({ product }: Props) {
  const { id, documentId, name, price } = product
  const onClick = () => {
    addToCart({
      product: {
        id,
        documentId,
        name,
        price
      },
      quantity: 1
    })
  }

  return (
    <button onClick={onClick} class="flex gap-4 w-full p-3 bg-slate-100 dark:bg-zinc-600 transition-colors
      dark:hover:bg-zinc-900 hover:bg-slate-200 cursor-pointer rounded-md
      justify-center">
      <ShoppingCart width={24} height={24} />
      Add to cart
    </button>
  )
}
