/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async create(ctx) {
    const productService = strapi.service('api::product.product')
    const response = await super.create(ctx)

    console.log(response)

    const newProduct = await productService.createStripeProduct({ name: response.name, id: response.documentId, amount: response.price })

    console.log(newProduct)

    const sanitizedProduct = await this.sanitizeOutput(response, ctx)

    ctx.body = sanitizedProduct
  }
}));
