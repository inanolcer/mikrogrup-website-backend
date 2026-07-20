/**
 * article controller
 */

import { factories } from '@strapi/strapi';
import { articlePopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx: any) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: articlePopulate,
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx: any) {
    ctx.query = {
      ...ctx.query,
      populate: articlePopulate,
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },
}));
