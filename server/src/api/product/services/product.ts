/**
 * product service
 */

import { factories } from '@strapi/strapi';
import { stripe } from '../../../stripe';

export default factories.createCoreService('api::product.product', ({ strapi: _strapi }) => ({
  async createStripeProduct({ id, name, amount }: { id: string; name: string; amount: number }) {
    const product = await stripe.products.create({
      name,
      id,
      default_price_data: {
        currency: "usd",
        unit_amount: amount * 100
      }
    })

    console.log("stripe product created")

    return product
  }
}));
