/**
 * slugs service
 *
 * Enumerates CMS-routed content types into a flat route registry, per locale.
 * Page entries expose both leaf `slug` and derived nested `path` (ancestor
 * chain joined with `/`). Add future collections needing build-time routes by
 * appending to REGISTRY_ENTRIES — each entry is queried independently so a
 * failure in one content type does not prevent the others from resolving.
 */

// Add type declaration for strapi global
declare const strapi: any;

interface RegistryEntry {
  uid: string;
  contentType: string;
}

type PageNode = {
  slug: string;
  parentId: string | null;
};

const MAX_PATH_DEPTH = 10;

// Content types enumerated into the registry, in resolution order.
const REGISTRY_ENTRIES: RegistryEntry[] = [
  { uid: 'api::page.page', contentType: 'page' },
];

const parentDocumentId = (parent: unknown): string | null => {
  if (!parent || typeof parent !== 'object') return null;
  const id = (parent as { documentId?: string }).documentId;
  return typeof id === 'string' && id ? id : null;
};

/** Walk ancestors → join leaf segments. Cycle / depth guard returns partial path. */
const buildPath = (documentId: string, nodes: Map<string, PageNode>): string => {
  const segments: string[] = [];
  const visited = new Set<string>();
  let currentId: string | null = documentId;

  while (currentId) {
    if (visited.has(currentId) || segments.length >= MAX_PATH_DEPTH) break;
    visited.add(currentId);

    const node = nodes.get(currentId);
    if (!node?.slug) break;

    segments.unshift(node.slug);
    currentId = node.parentId;
  }

  return segments.join('/');
};

export default {
  async find(locale: string) {
    const results: Array<{
      title: string;
      slug: string;
      path: string;
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
          populate: { seo: true, parent: true },
        });

        const nodes = new Map<string, PageNode>();
        for (const entry of entries) {
          if (!entry.documentId || !entry.slug) continue;
          nodes.set(entry.documentId, {
            slug: entry.slug,
            parentId: parentDocumentId(entry.parent),
          });
        }

        for (const entry of entries) {
          if (!entry.slug || !entry.documentId) continue;

          const path = buildPath(entry.documentId, nodes) || entry.slug;

          results.push({
            title: entry.title,
            slug: entry.slug,
            path,
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
