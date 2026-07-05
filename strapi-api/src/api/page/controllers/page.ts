/**
 * page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async find(ctx) {
    // Populate all fields based on schema
    ctx.query = {
      ...ctx.query,
      populate: {
        cover: true,
        sections: {
          populate: '*'  // For dynamic zones, we must use '*'
        },
        author: {
          populate: '*'
        },
        seo: {
          populate: '*'
        }
      }
    };

    // Call the default core action
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    // Use same population for single page
    ctx.query = {
      ...ctx.query,
      populate: {
        cover: true,
        sections: {
          populate: '*'  // For dynamic zones, we must use '*'
        },
        author: {
          populate: '*'
        },
        seo: {
          populate: '*'
        }
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
})); 