import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx: any) {
    // Populate all fields with proper dynamic zone handling
    ctx.query = {
      ...ctx.query,
      populate: {
        cover: true,
        category: {
          populate: '*'
        },
        sections: {
          populate: '*'  // For dynamic zones, we must use '*' instead of specific fields
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

  async findOne(ctx: any) {
    // Use same population for single article
    ctx.query = {
      ...ctx.query,
      populate: {
        cover: true,
        category: {
          populate: '*'
        },
        sections: {
          populate: '*'  // For dynamic zones, we must use '*' instead of specific fields
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