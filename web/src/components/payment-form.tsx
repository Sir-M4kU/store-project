import { useId, useEffect, useRef } from "preact/hooks"
import { loadStripe, type StripeCheckout } from "@stripe/stripe-js"
import { STRIPE_TOKEN } from "astro:env/client"
import { strapiClient } from "@/libs/strapi"
import { totalAmount } from "@/stores/cart"

const InputField = ({ label, type }: { label: string, type: preact.JSX.HTMLInputTypeAttribute }) => {
  const id = useId()
  return (
    <div class="space-y-2">
      <label class="block" for={id}>{label}</label>
      <input class="block w-full p-2 border rounded-md border-zinc-200" type={type} required />
    </div>
  )
}

export default function PaymentForm() {
  const paymentRef = useRef<HTMLDivElement | null>(null)
  const checkout = useRef<StripeCheckout | null>(null)
  const onSubmit = async (e: preact.JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  useEffect(() => {
  }, [])

  return (
    <form onSubmit={onSubmit} class="w-sm space-y-4">
      <InputField label="Name" type="text" />
      <InputField label="Email" type="email" />
      <InputField label="Address" type="text" />
      <div class="inline-flex gap-4">
        <InputField label="Postal code" type="number" />
        <InputField label="City" type="text" />
      </div>

      <div ref={paymentRef}></div>
      <button class="w-full bg-zinc-900 p-3 cursor-pointer rounded-md text-zinc-50">Pay <span class="font-medium">${totalAmount.value.toFixed(2)}</span> now</button>
    </form>
  )
}
