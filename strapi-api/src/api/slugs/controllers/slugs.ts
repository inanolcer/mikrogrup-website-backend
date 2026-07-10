/**
 * slugs controller
 *
 * Route registry endpoint: GET /api/slugs?locale=tr
 * Enumerates CMS-routed content (currently `page`) so the Nuxt build can
 * discover prerender routes without hardcoding them. Fixed file-based
 * routes are NOT part of this registry (the sitemap module covers those).
 */

// Add type declaration for strapi global
declare const strapi: any;

export default {
  async find(ctx) {
    const locale = typeof ctx.query.locale === 'string' ? ctx.query.locale : 'tr';

    const data = await strapi.service('api::slugs.slugs').find(locale);

    ctx.body = data;
  },
};
