import type { APIContext } from "astro"
import { stripe } from "@/libs/stripe"
import type { ProductData, ImageData, OrderData } from "@/types/strapi"
import { createDocument, fetchStrapi } from "@/libs/strapi"
import { z } from "astro:content"

interface Product extends ProductData {
  image: ImageData
}

const bodySchema = z.object({
  items: z.array(z.object({
    documentId: z.string(),
    quantity: z.number()
  }))
})

export async function POST({ request, url }: APIContext) {
  const body = await request.json()
  const referer = request.headers.get("referer")
  const result = await bodySchema.safeParseAsync(body)

  if (!result.success) {
    return Response.json({
      errors: result.error.formErrors
    }, { status: 400 })
  }

  const { items } = result.data
  const idItems = items.map((item) => item.documentId)

  try {
    const documents = await fetchStrapi<Product>("products", {
      filters: {
        documentId: {
          $in: idItems
        }
      },
      fields: ["name", "price"],
      populate: {
        image: {
          fields: ["url"]
        }
      }
    }).then((data) => data?.map((item) => {
      const index = items.findIndex((i) => i.documentId === item.documentId)

      return {
        ...item,
        quantity: items[index].quantity
      }
    }))
    const line_items = documents?.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }))

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      ui_mode: "hosted",
      cancel_url: referer || url.origin,
      success_url: `${url.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`
    })
    await createDocument<{ items?: typeof line_items; stripe_session: string }>("orders", { items: line_items, stripe_session: session.id })

    return Response.json({ session_id: session.id, session_url: session.url }, { status: 201 })
  } catch (error) {
    console.error(error);

    // if (error instanceof HTTPBadRequestError) {
    //   return Response.json({ error: "Failed to create the document" }, { status: 401 })
    // }

    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
