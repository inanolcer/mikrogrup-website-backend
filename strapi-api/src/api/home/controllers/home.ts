/**
 * home controller
 */

import { factories } from '@strapi/strapi';
import { homePopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::home.home', ({ strapi }) => ({
  async find(ctx) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: homePopulate,
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
