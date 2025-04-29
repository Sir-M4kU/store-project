import { computed, signal, effect } from "@preact/signals";
import type { ProductData } from "@/types/strapi";

interface Product extends Pick<ProductData, "id" | "documentId" | "name" | "price"> { }
interface Item extends Product {
  quantity: number
}

const LOCAL_STORAGE_CART_KEY = "store_cart"
const cart = signal<Item[]>(loadFromLocalStorage([]))

function addToCart({ product, quantity }: { product: Product; quantity: number }) {
  const productIndex = cart.value.findIndex(p => p.id == product.id)

  if (productIndex == -1) {
    cart.value = cart.value.concat({ ...product, quantity })
    return
  }

  const productData = cart.value[productIndex]

  productData.quantity += 1
  cart.value = cart.value.toSpliced(productIndex, 1, productData)
}
function removeFromCart(productIndex: number) {
  cart.value = cart.value.toSpliced(productIndex, 1)
}

const totalItems = computed(
  () => cart.value.reduce((acc, item) => acc + item.quantity, 0)
)
const totalAmount = computed(
  () => cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
)

function loadFromLocalStorage(initialState: Array<Item>) {
  const data = window.localStorage.getItem(LOCAL_STORAGE_CART_KEY)

  if (data) {
    const parsedJSON: Array<Item> = JSON.parse(data)

    return parsedJSON
  }

  window.localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(initialState))

  return initialState
}
function clearCart() {
  cart.value = []
}

effect(() => {
  window.localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart.value))
})

export { cart, totalItems, totalAmount, addToCart, removeFromCart, clearCart }

