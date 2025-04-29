import { STRIPE_SECRET } from "astro:env/server"
import { Stripe } from "stripe"

const stripe = new Stripe(STRIPE_SECRET)

export { stripe }
