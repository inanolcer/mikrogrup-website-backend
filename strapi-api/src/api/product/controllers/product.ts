/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    // Populate the 'sections' dynamic zone by default. The product content
    // type has no `seo` component — listing it here made every request fail
    // with 400 ValidationError: Invalid key seo.
    ctx.query = {
      ...ctx.query,
      populate: ['sections']
    };

    // Call the default core action
    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },
})); 