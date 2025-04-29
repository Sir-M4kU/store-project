import { cart, totalAmount } from "@/stores/cart"

export default function CartDetails() {
  return (
    <section class="w-sm">
      <h2 class="text-lg font-medium text-center mb-4">Details</h2>

      <ul>
        {cart.value.map((product) => (
          <li key={product.documentId} class="py-2 border-b border-zinc-200">
            <p class="font-medium">{product.name}</p>
            <div class="w-full inline-flex justify-between">
              <span class="font-medium">{product.quantity}x</span>
              <span class="font-light">${product.price.toFixed(2)}</span>
              <span class="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div class="mt-4 inline-flex justify-between w-full">
        <p>Total</p>
        <p class="font-medium">${totalAmount.value.toFixed(2)}</p>
      </div>
    </section>
  )
}
