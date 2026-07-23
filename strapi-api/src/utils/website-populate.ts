/**
 * Canonical website populate for Nuxt-consumed content types (home, page, article).
 *
 * Controllers force this map (client query-string populate is ignored). Keep all
 * deep DZ / relation / media rules here — do not reintroduce large populate maps
 * in the Nuxt app.
 */

const star = { populate: '*' as const };

/** Union of every dynamic-zone component used on home + CMS pages. */
export const websiteSectionsPopulate = {
  on: {
    'blocks.rich-text': star,
    'blocks.quote': star,
    'blocks.image': star,
    'blocks.logos': star,
    'blocks.card': star,
    'blocks.button': star,
    'blocks.spacing': star,
    'blocks.wave-image': {
      populate: { image: true, image2: true },
    },
    'sections.hero-simple': star,
    'sections.features': star,
    'sections.section-title': star,
    'sections.hero': star,
    'sections.page-hero': star,
    'sections.stats-bar': star,
    'sections.solutions-grid': {
      populate: {
        heading: true,
        solutions: { populate: { products: { populate: { logo: true } } } },
      },
    },
    'sections.products-grid': {
      populate: {
        heading: true,
        products: { populate: { logo: true } },
        companies: {
          populate: {
            products: { populate: { logo: true } },
          },
        },
      },
    },
    'sections.promo-banner': star,
    'sections.pillar-grid': star,
    'sections.news-grid': star,
    'sections.glass-cta': star,
    'sections.phase-timeline': star,
    // Nested link + pdf on items are omitted by shallow `*` (same as companies-grid).
    'sections.media-card-grid': {
      populate: {
        heading: true,
        items: {
          populate: {
            pdf: true,
            link: true,
          },
        },
      },
    },
    'sections.leadership-section': star,
    'sections.section-heading': star,
    'sections.office-grid': star,
    'sections.value-grid': star,
    'sections.lead-form': star,
    'legal.section': star,
    // Direct media fields — explicit keys (DZ → nested morph depth limits).
    'sections.call-to-action': {
      populate: { image: true },
    },
    'sections.feature-split': {
      populate: { image: true, cta: true },
    },
    // Relation media / nested relations must be nested; shallow `*` omits them.
    'sections.companies-grid': {
      populate: {
        heading: true,
        companies: { populate: { logo: true, link: true, solutions: true } },
      },
    },
  },
} as const;

export const homePopulate = {
  sections: websiteSectionsPopulate,
  seo: star,
} as const;

export const pagePopulate = {
  cover: true,
  sections: websiteSectionsPopulate,
  author: star,
  seo: star,
  parent: {
    fields: ['title', 'slug', 'documentId', 'order'],
    populate: {
      children: { fields: ['title', 'slug', 'documentId', 'order'] },
    },
  },
  children: { fields: ['title', 'slug', 'documentId', 'order'] },
} as const;

export const articlePopulate = {
  cover: true,
  category: star,
  sections: websiteSectionsPopulate,
  author: star,
  seo: star,
} as const;

/** Navigation single types: 3 levels of components, forced by their controllers. */
export const mainNavigationPopulate = {
  items: {
    populate: {
      submenu: {
        populate: {
          links: true,
        },
      },
    },
  },
  cta: true,
} as const;

export const footerNavigationPopulate = {
  items: {
    populate: {
      submenu: {
        populate: {
          links: true,
        },
      },
    },
  },
} as const;
