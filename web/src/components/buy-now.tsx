import { ShoppingBasket } from "lucide-preact"
import type { ProductData } from "@/types/strapi"

interface Props {
  product: ProductData
}

export default function BuyNow({ product }: Props) {
  const onClick = async () => {
    const res = await fetch(
      "/api/payments/create-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [{
            documentId: product.documentId,
            quantity: 1
          }]
        })
      }
    )

    if (res.ok) {
      const data = await res.json()

      window.location.replace(data.session_url)
    }

  }

  return (
    <button onClick={onClick} class="flex gap-4 text-white w-full p-3 bg-zinc-800 dark:bg-zinc-900 transition-colors hover:bg-zinc-600 cursor-pointer rounded-md justify-center">
      <ShoppingBasket />
      Buy
    </button>
  )
}
