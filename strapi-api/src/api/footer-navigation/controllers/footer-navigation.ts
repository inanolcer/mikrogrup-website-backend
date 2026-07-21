/**
 * footer-navigation controller
 */

import { factories } from '@strapi/strapi';
import { footerNavigationPopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::footer-navigation.footer-navigation', ({ strapi }) => ({
  async find(ctx) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: footerNavigationPopulate,
    };

    // Single types return null (not { data, meta }) when no entry exists for
    // the requested locale — never destructure the result.
    const response = await super.find(ctx);
    return response ?? { data: null, meta: {} };
  },
}));
