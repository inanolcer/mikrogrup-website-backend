import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::press-coverage.press-coverage', ({ strapi }) => ({
  async find(ctx: any) {
    ctx.query = {
      ...ctx.query,
      populate: {
        seo: {
          populate: '*'
        }
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx: any) {
    ctx.query = {
      ...ctx.query,
      populate: {
        seo: {
          populate: '*'
        }
      }
    };

    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  }
}));
