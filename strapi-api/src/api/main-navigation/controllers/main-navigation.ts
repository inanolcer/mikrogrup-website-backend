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

    // Single types return null (not { data, meta }) when no entry exists for
    // the requested locale — never destructure the result.
    const response = await super.find(ctx);
    return response ?? { data: null, meta: {} };
  },
}));
