import { useRef } from "preact/hooks"
import { ShoppingCart, XIcon } from "lucide-preact"
import { cart, totalAmount, totalItems, removeFromCart } from "@/stores/cart"

export default function Cart() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const onClick = (i: number) => () => {
    removeFromCart(i)
  }
  const toggleModal = () => {
    if (dialogRef.current?.open)
      dialogRef.current?.close()
    else
      dialogRef.current?.showModal()
  }
  const onSubmit = async (e: preact.JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(
      "/api/payments/create-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart.value.map(({ documentId, quantity }) => ({
            documentId,
            quantity
          }))
        })
      })

    if (res.ok) {
      const data = await res.json()

      window.location.replace(data.session_url)
    }
  }

  return (
    <>
      <dialog ref={dialogRef} class="w-full open:flex justify-center items-center h-full bg-transparent">
        <section class="w-lg h-fit p-8 md:space-y-8 bg-white dark:bg-zinc-800 dark:text-zinc-50 rounded-md">
          <div class="inline-flex justify-between w-full items-center">
            <h1 class="text-3xl font-semibold">Cart info</h1>
            <button onClick={toggleModal} class="w-8 h-8 rounded-full bg-zinc-900 cursor-pointer transition-colors hover:bg-zinc-900/40">
              <XIcon class="w-4 h-4 text-zinc-50 mx-auto" />
            </button>
          </div>

          <ul>
            {cart.value.length > 0
              ? cart.value.map((product, i) => (
                <li class="p-2 inline-flex w-full items-center gap-4 border-b border-slate-300" key={product.documentId}>
                  <button onClick={onClick(i)} class="cursor-pointer w-6 bg-slate-200 hover:bg-slate-200/70 dark:hover:bg-zinc-900/40 h-6 text-sm flex justify-center items-center dark:bg-zinc-900 rounded-full">
                    <XIcon class="w-4 h-4 dark:text-zinc-50" />
                  </button>

                  <div class="w-full">
                    <h2 class="text-lg font-medium">{product.name}</h2>
                    <div class="text-sm w-full inline-flex justify-between">
                      <span class="font-medium">
                        Qty: {product.quantity}
                      </span>
                      <span class="font-light">
                        ${product.price.toFixed(2)}
                      </span>
                      <span class="font-medium">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              )) : (
                <p class="text-center my-8">No items in the cart, try adding some products...</p>
              )}
          </ul>
          {totalItems.value > 0 && (
            <>
              <div class="inline-flex w-full justify-between">
                <h2 class="text-xl font-medium">Total</h2>
                <span class="font-medium">${totalAmount.value.toFixed(2)}</span>
              </div>
              <div>
                <form onSubmit={onSubmit}>
                  <button class="block p-3 cursor-pointer text-center text-zinc-50 bg-zinc-900 hover:bg-zinc-900/70 w-full rounded-md">Proceed to checkout</button>
                </form>
              </div>
            </>
          )}
        </section>
      </dialog>
      <button onClick={toggleModal} class="relative flex bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-700 cursor-pointer hover:bg-slate-200 p-2.5 rounded-full">
        <ShoppingCart />
        <span class="absolute -right-2 -top-2 h-4 w-4 flex justify-center items-center bg-zinc-700 text-white rounded-full text-sm p-3">{totalItems}</span>
      </button>
    </>
  )
}
