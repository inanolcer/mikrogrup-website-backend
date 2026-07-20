/**
 * page controller
 */

import { factories } from '@strapi/strapi';
import { pagePopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async find(ctx) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: pagePopulate,
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: pagePopulate,
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },
}));
