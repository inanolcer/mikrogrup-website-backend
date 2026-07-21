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

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
