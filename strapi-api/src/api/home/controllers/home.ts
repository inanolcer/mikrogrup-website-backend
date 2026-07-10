/**
 * home controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home.home', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        sections: { populate: '*' },
        seo: { populate: '*' },
      },
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
