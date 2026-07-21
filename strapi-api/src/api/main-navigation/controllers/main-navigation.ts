/**
 * main-navigation controller
 */

import { factories } from '@strapi/strapi';
import { mainNavigationPopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::main-navigation.main-navigation', ({ strapi }) => ({
  async find(ctx) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: mainNavigationPopulate,
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
