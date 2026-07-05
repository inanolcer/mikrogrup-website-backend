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
    bgImage: Schema.Attribute.Media<'images'>;
    buttonLabel: Schema.Attribute.String;
    buttonLink: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
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

export interface SectionsHeroSimple extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_simples';
  info: {
    description: '';
    displayName: 'Hero Simple';
    icon: 'layout';
  };
  attributes: {
    button: Schema.Attribute.Component<'blocks.button', false>;
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images' | 'files'>;
    subtitle: Schema.Attribute.String;
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
      'forms.mukellef': FormsMukellef;
      'forms.title-url-link': FormsTitleUrlLink;
      'navigation.nav-item': NavigationNavItem;
      'navigation.navbar': NavigationNavbar;
      'navigation.submenu': NavigationSubmenu;
      'sections.call-to-action': SectionsCallToAction;
      'sections.features': SectionsFeatures;
      'sections.hero-simple': SectionsHeroSimple;
      'sections.section-title': SectionsSectionTitle;
      'seo.seo': SeoSeo;
    }
  }
}
