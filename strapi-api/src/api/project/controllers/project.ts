/**
 * project controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  async find(ctx) {
    // Populate the 'sections' dynamic zone and 'seo' component by default
    ctx.query = {
      ...ctx.query,
      populate: ['sections', 'seo']
    };

    // Call the default core action
    const { data, meta } = await super.find(ctx);

    return { data, meta };
  },
})); 