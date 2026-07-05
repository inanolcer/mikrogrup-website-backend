/**
 * slugs service
 *
 * Enumerates CMS-routed content types into a flat route registry, per locale.
 * Add future collections needing build-time routes by appending to
 * REGISTRY_ENTRIES below — each entry is queried independently so a
 * failure in one content type does not prevent the others from resolving.
 */

// Add type declaration for strapi global
declare const strapi: any;

interface RegistryEntry {
  uid: string;
  contentType: string;
}

// Content types enumerated into the registry, in resolution order.
const REGISTRY_ENTRIES: RegistryEntry[] = [
  { uid: 'api::page.page', contentType: 'page' },
];

export default {
  async find(locale: string) {
    const results: Array<{
      title: string;
      slug: string;
      locale: string;
      template: string;
      sitemap: boolean;
      contentType: string;
      documentId: string;
    }> = [];

    for (const { uid, contentType } of REGISTRY_ENTRIES) {
      try {
        const entries = await strapi.documents(uid).findMany({
          locale,
          status: 'published',
          populate: { seo: true },
        });

        for (const entry of entries) {
          if (!entry.slug) continue;

          results.push({
            title: entry.title,
            slug: entry.slug,
            locale,
            template: entry.template ?? 'default',
            sitemap: entry.seo?.sitemap !== false,
            contentType,
            documentId: entry.documentId,
          });
        }
      } catch (err) {
        strapi.log.warn(`slugs: failed to enumerate ${uid}`, err);
      }
    }

    return results;
  },
};
