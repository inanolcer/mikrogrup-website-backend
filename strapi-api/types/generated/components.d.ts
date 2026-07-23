import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksButton extends Struct.ComponentSchema {
  collectionName: 'components_blocks_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String;
    target: Schema.Attribute.Enumeration<['_self', '_blank']>;
    url: Schema.Attribute.String;
  };
}

export interface BlocksCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards';
  info: {
    description: '';
    displayName: 'Card';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_images';
  info: {
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
  };
}

export interface BlocksLogos extends Struct.ComponentSchema {
  collectionName: 'components_blocks_logos';
  info: {
    description: '';
    displayName: 'Logo';
    icon: 'apple-alt';
    name: 'logos';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksQuote extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quotes';
  info: {
    description: '';
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    author: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface BlocksSpacing extends Struct.ComponentSchema {
  collectionName: 'components_blocks_spacings';
  info: {
    description: 'Vertical space between blocks';
    displayName: 'Spacing';
    icon: 'arrows-alt-v';
  };
  attributes: {
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'xlarge']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface BlocksWaveImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_wave_images';
  info: {
    description: 'Decorative corner wave images (up to 2) with alignment';
    displayName: 'Wave Image';
    icon: 'picture';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    > &
      Schema.Attribute.DefaultTo<'bottom-left'>;
    alignment2: Schema.Attribute.Enumeration<
      ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    > &
      Schema.Attribute.DefaultTo<'top-right'>;
    image: Schema.Attribute.Media<'images'>;
    image2: Schema.Attribute.Media<'images'>;
  };
}

export interface ElementsDownload extends Struct.ComponentSchema {
  collectionName: 'components_elements_downloads';
  info: {
    description: '';
    displayName: 'Download';
    icon: 'download';
  };
  attributes: {
    body: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLeader extends Struct.ComponentSchema {
  collectionName: 'components_elements_leaders';
  info: {
    description: '';
    displayName: 'Leader';
    icon: 'user';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['magenta', 'orange', 'cyan', 'coral']
    >;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface ElementsMediaCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_media_cards';
  info: {
    description: '';
    displayName: 'Media Card';
    icon: 'file';
  };
  attributes: {
    date: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    link: Schema.Attribute.Component<'elements.link', false>;
    pdf: Schema.Attribute.Media<'files'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsMediaItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_media_items';
  info: {
    description: '';
    displayName: 'Media Item';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String;
    src: Schema.Attribute.Media<'images'>;
  };
}

export interface ElementsNewsItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_news_items';
  info: {
    description: '';
    displayName: 'News Item';
    icon: 'calendar';
  };
  attributes: {
    date: Schema.Attribute.String;
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsOffice extends Struct.ComponentSchema {
  collectionName: 'components_elements_offices';
  info: {
    description: '';
    displayName: 'Office';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.Text;
    city: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    label: Schema.Attribute.String;
    mapLabel: Schema.Attribute.String;
    mapUrl: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface ElementsPhase extends Struct.ComponentSchema {
  collectionName: 'components_elements_phases';
  info: {
    description: '';
    displayName: 'Phase';
    icon: 'arrowRight';
  };
  attributes: {
    body: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface ElementsPillar extends Struct.ComponentSchema {
  collectionName: 'components_elements_pillars';
  info: {
    description: '';
    displayName: 'Pillar';
    icon: 'layer';
  };
  attributes: {
    body: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsSolutionCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_solution_cards';
  info: {
    description: '';
    displayName: 'Solution Card';
    icon: 'dashboard';
  };
  attributes: {
    body: Schema.Attribute.Text;
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_elements_stats';
  info: {
    description: '';
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ElementsValueCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_value_cards';
  info: {
    description: '';
    displayName: 'Value Card';
    icon: 'dashboard';
  };
  attributes: {
    body: Schema.Attribute.Text;
    color: Schema.Attribute.Enumeration<
      [
        'deep-blue',
        'primary',
        'cyan',
        'light-blue',
        'yellow',
        'orange',
        'coral',
        'magenta',
        'deep-magenta',
      ]
    >;
    title: Schema.Attribute.String;
  };
}

export interface FormsMukellef extends Struct.ComponentSchema {
  collectionName: 'components_forms_mukellefs';
  info: {
    displayName: 'Mukellef';
    icon: 'walk';
  };
  attributes: {
    cari_unvan: Schema.Attribute.String;
    fullname: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface FormsTitleUrlLink extends Struct.ComponentSchema {
  collectionName: 'components_forms_title_url_links';
  info: {
    displayName: 'Title URL Link';
    icon: 'link';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface LegalSection extends Struct.ComponentSchema {
  collectionName: 'components_legal_sections';
  info: {
    description: '';
    displayName: 'Section';
    icon: 'file';
  };
  attributes: {
    blocks: Schema.Attribute.JSON;
    sectionId: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    description: '';
    displayName: 'Nav Item';
    icon: 'oneWay';
  };
  attributes: {
    label: Schema.Attribute.String;
    submenu: Schema.Attribute.Component<'navigation.submenu', true>;
    target: Schema.Attribute.String & Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String;
  };
}

export interface NavigationNavLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_links';
  info: {
    description: 'Leaf link: third-level menu entries and the header CTA';
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.String & Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String;
  };
}

export interface NavigationNavbar extends Struct.ComponentSchema {
  collectionName: 'components_layout_navbars';
  info: {
    description: '';
    displayName: 'Navbar';
    icon: 'map-signs';
    name: 'Navbar';
  };
  attributes: {
    menu: Schema.Attribute.Component<'navigation.nav-item', true>;
  };
}

export interface NavigationSubmenu extends Struct.ComponentSchema {
  collectionName: 'components_navigation_submenus';
  info: {
    description: '';
    displayName: 'submenu';
    icon: 'filter';
  };
  attributes: {
    label: Schema.Attribute.String;
    links: Schema.Attribute.Component<'navigation.nav-link', true>;
    target: Schema.Attribute.String & Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String;
  };
}

export interface SectionsCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_sections_call_to_actions';
  info: {
    description: '';
    displayName: 'CallToAction';
    icon: 'bullhorn';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonLink: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsCompaniesGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_companies_grids';
  info: {
    description: '';
    displayName: 'Companies Grid';
    icon: 'apps';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    companies: Schema.Attribute.Relation<'oneToMany', 'api::company.company'>;
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
  };
}

export interface SectionsFeatureSplit extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_splits';
  info: {
    description: '';
    displayName: 'Feature Split';
    icon: 'layer';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'elements.link', false>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_sections_features';
  info: {
    description: '';
    displayName: 'Features';
  };
  attributes: {
    cards: Schema.Attribute.Component<'blocks.card', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsGlassCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_glass_ctas';
  info: {
    description: '';
    displayName: 'Glass CTA';
    icon: 'bullhorn';
  };
  attributes: {
    body: Schema.Attribute.Text;
    cta: Schema.Attribute.Component<'elements.link', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.Text;
    ctaPrimary: Schema.Attribute.Component<'elements.link', false>;
    ctaSecondary: Schema.Attribute.Component<'elements.link', false>;
    eyebrow: Schema.Attribute.String;
    media: Schema.Attribute.Component<'elements.media-item', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeroSimple extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_simples';
  info: {
    description: '';
    displayName: 'Hero Simple';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images' | 'files'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsLeadForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_lead_forms';
  info: {
    description: '';
    displayName: 'Lead Form';
    icon: 'envelope';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    fields: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    lede: Schema.Attribute.Text;
    submitLabel: Schema.Attribute.String;
    withMarketingConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface SectionsLeadershipSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_leadership_sections';
  info: {
    description: '';
    displayName: 'Leadership Section';
    icon: 'user';
  };
  attributes: {
    heading: Schema.Attribute.String;
    members: Schema.Attribute.Component<'elements.leader', true>;
  };
}

export interface SectionsMediaCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_card_grids';
  info: {
    description: '';
    displayName: 'Media Card Grid';
    icon: 'picture';
  };
  attributes: {
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    items: Schema.Attribute.Component<'elements.media-card', true>;
  };
}

export interface SectionsNewsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_grids';
  info: {
    description: '';
    displayName: 'News Grid';
    icon: 'layer';
  };
  attributes: {
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    items: Schema.Attribute.Component<'elements.news-item', true>;
    viewAll: Schema.Attribute.Component<'elements.link', false>;
  };
}

export interface SectionsOfficeGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_office_grids';
  info: {
    description: '';
    displayName: 'Office Grid';
    icon: 'pinMap';
  };
  attributes: {
    offices: Schema.Attribute.Component<'elements.office', true>;
  };
}

export interface SectionsPageHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_page_heroes';
  info: {
    description: '';
    displayName: 'Page Hero';
    icon: 'layout';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['center', 'split']>;
    cta: Schema.Attribute.Component<'elements.link', false>;
    dark: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lede: Schema.Attribute.Text;
    media: Schema.Attribute.Component<'elements.media-item', false>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPhaseTimeline extends Struct.ComponentSchema {
  collectionName: 'components_sections_phase_timelines';
  info: {
    description: '';
    displayName: 'Phase Timeline';
    icon: 'arrowRight';
  };
  attributes: {
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    phases: Schema.Attribute.Component<'elements.phase', true>;
  };
}

export interface SectionsPillarGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_pillar_grids';
  info: {
    description: '';
    displayName: 'Pillar Grid';
    icon: 'layer';
  };
  attributes: {
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    items: Schema.Attribute.Component<'elements.pillar', true>;
    variant: Schema.Attribute.Enumeration<['centered', 'card']>;
  };
}

export interface SectionsProductsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_products_grids';
  info: {
    description: '';
    displayName: 'Products Grid';
    icon: 'grid';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    companies: Schema.Attribute.Relation<'oneToMany', 'api::company.company'>;
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
  };
}

export interface SectionsPromoBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_promo_banners';
  info: {
    description: '';
    displayName: 'Promo Banner';
    icon: 'bullhorn';
  };
  attributes: {
    body: Schema.Attribute.Text;
    cta: Schema.Attribute.Component<'elements.link', false>;
    media: Schema.Attribute.Component<'elements.media-item', false>;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['default', 'soft']>;
  };
}

export interface SectionsSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_headings';
  info: {
    description: '';
    displayName: 'Section Heading';
    icon: 'heading';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['center', 'left']>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSectionTitle extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_titles';
  info: {
    displayName: 'Section Title';
    icon: 'bold';
  };
  attributes: {
    anchorID: Schema.Attribute.String;
    headingTag: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    textAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSolutionsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_solutions_grids';
  info: {
    description: '';
    displayName: 'Solutions Grid';
    icon: 'dashboard';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    heading: Schema.Attribute.Component<'sections.section-heading', false>;
    solutions: Schema.Attribute.Relation<'oneToMany', 'api::solution.solution'>;
  };
}

export interface SectionsStatsBar extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_bars';
  info: {
    description: '';
    displayName: 'Stats Bar';
    icon: 'chartBubble';
  };
  attributes: {
    body: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'elements.stat', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsValueGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_value_grids';
  info: {
    description: '';
    displayName: 'Value Grid';
    icon: 'dashboard';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.value-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_blocks_seos';
  info: {
    description: '';
    displayName: 'meta';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    keywords: Schema.Attribute.String;
    robots: Schema.Attribute.Enumeration<
      ['all', 'noindex', 'nofollow', 'noarchive', 'noimageindex', 'nosnippet']
    >;
    shareImage: Schema.Attribute.Media<'images'>;
    sitemap: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.button': BlocksButton;
      'blocks.card': BlocksCard;
      'blocks.image': BlocksImage;
      'blocks.logos': BlocksLogos;
      'blocks.quote': BlocksQuote;
      'blocks.rich-text': BlocksRichText;
      'blocks.spacing': BlocksSpacing;
      'blocks.wave-image': BlocksWaveImage;
      'elements.download': ElementsDownload;
      'elements.leader': ElementsLeader;
      'elements.link': ElementsLink;
      'elements.media-card': ElementsMediaCard;
      'elements.media-item': ElementsMediaItem;
      'elements.news-item': ElementsNewsItem;
      'elements.office': ElementsOffice;
      'elements.phase': ElementsPhase;
      'elements.pillar': ElementsPillar;
      'elements.solution-card': ElementsSolutionCard;
      'elements.stat': ElementsStat;
      'elements.value-card': ElementsValueCard;
      'forms.mukellef': FormsMukellef;
      'forms.title-url-link': FormsTitleUrlLink;
      'legal.section': LegalSection;
      'navigation.nav-item': NavigationNavItem;
      'navigation.nav-link': NavigationNavLink;
      'navigation.navbar': NavigationNavbar;
      'navigation.submenu': NavigationSubmenu;
      'sections.call-to-action': SectionsCallToAction;
      'sections.companies-grid': SectionsCompaniesGrid;
      'sections.feature-split': SectionsFeatureSplit;
      'sections.features': SectionsFeatures;
      'sections.glass-cta': SectionsGlassCta;
      'sections.hero': SectionsHero;
      'sections.hero-simple': SectionsHeroSimple;
      'sections.lead-form': SectionsLeadForm;
      'sections.leadership-section': SectionsLeadershipSection;
      'sections.media-card-grid': SectionsMediaCardGrid;
      'sections.news-grid': SectionsNewsGrid;
      'sections.office-grid': SectionsOfficeGrid;
      'sections.page-hero': SectionsPageHero;
      'sections.phase-timeline': SectionsPhaseTimeline;
      'sections.pillar-grid': SectionsPillarGrid;
      'sections.products-grid': SectionsProductsGrid;
      'sections.promo-banner': SectionsPromoBanner;
      'sections.section-heading': SectionsSectionHeading;
      'sections.section-title': SectionsSectionTitle;
      'sections.solutions-grid': SectionsSolutionsGrid;
      'sections.stats-bar': SectionsStatsBar;
      'sections.value-grid': SectionsValueGrid;
      'seo.seo': SeoSeo;
    }
  }
}
