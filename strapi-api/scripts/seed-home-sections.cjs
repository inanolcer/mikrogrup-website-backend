/**
 * Seeds the Home single type (tr locale) with every allowed dynamic-zone
 * component, labelled by its __component UID for visual QA.
 *
 * Run inside the container (stop develop first, or run in a one-off container):
 *   docker exec teamsystem-strapi-api sh -c "cd /srv/app && node scripts/seed-home-sections.cjs"
 */
const { createStrapi } = require('@strapi/strapi');

const LOCALE = 'tr';
const HOME_DOCUMENT_ID = 'os3g8auuwzgn3ta0y3j8oce3';
const SEED_IMAGE_ID = 2;

const link = (label, href, external = false) => ({ label, href, external });
const heading = (title, description = '', align = 'center') => ({ title, description, align });
const mediaItem = (alt = 'Seed görsel') => ({ src: SEED_IMAGE_ID, alt });

const buildSections = ({ solutionIds, companyIds, productIds }) => [
  {
    __component: 'sections.hero-simple',
    title: 'sections.hero-simple',
    subtitle: 'Hero Simple bileşeni — seed verisi',
    description: '<p>Bu bölüm <strong>sections.hero-simple</strong> bileşenini gösterir.</p>',
    image: SEED_IMAGE_ID,
    button: { label: 'sections.hero-simple CTA', url: '/cozumler', target: '_self' },
  },
  {
    __component: 'sections.hero',
    eyebrow: 'sections.hero',
    title: 'sections.hero',
    body: 'Bu bölüm sections.hero bileşenini gösterir. Ana sayfa kahraman alanı.',
    ctaPrimary: link('sections.hero — Birincil', '/cozumler'),
    ctaSecondary: link('sections.hero — İkincil', '/hakkimizda'),
    media: mediaItem('sections.hero görseli'),
  },
  {
    __component: 'sections.page-hero',
    title: 'sections.page-hero',
    lede: 'Bu bölüm sections.page-hero bileşenini gösterir.',
    align: 'center',
    dark: false,
    media: mediaItem('sections.page-hero görseli'),
    cta: link('sections.page-hero CTA', '/iletisim'),
  },
  {
    __component: 'sections.section-title',
    title: 'sections.section-title',
    subtitle: 'Section Title bileşeni — seed verisi',
    headingTag: 'h2',
    anchorID: 'section-title',
    textAlign: 'center',
  },
  {
    __component: 'sections.section-heading',
    title: 'sections.section-heading',
    description: 'Section Heading bileşeni — bağımsız kullanım örneği.',
    align: 'center',
  },
  {
    __component: 'sections.stats-bar',
    title: 'sections.stats-bar',
    body: 'Stats Bar bileşeni — sayısal göstergeler.',
    items: [
      { value: '35+', label: 'Yıl' },
      { value: '1M+', label: 'Kullanıcı' },
      { value: '9', label: 'Çözüm Alanı' },
    ],
  },
  {
    __component: 'sections.feature-split',
    title: 'sections.feature-split',
    body: '<p>Feature Split bileşeni — metin ve görsel yan yana.</p>',
    image: SEED_IMAGE_ID,
    imageAlt: 'sections.feature-split görseli',
    reverse: false,
    cta: link('sections.feature-split CTA', '/cozumler'),
  },
  {
    __component: 'sections.features',
    title: 'sections.features',
    subtitle: 'Features bileşeni — kart listesi',
    cards: [
      { title: 'blocks.card — Kart 1', description: 'Features içinde blocks.card örneği.', link: '/cozumler' },
      { title: 'blocks.card — Kart 2', description: 'İkinci özellik kartı.', link: '/urunler' },
      { title: 'blocks.card — Kart 3', description: 'Üçüncü özellik kartı.', link: '/sirketler' },
    ],
  },
  {
    __component: 'sections.pillar-grid',
    variant: 'centered',
    heading: heading('sections.pillar-grid', 'Pillar Grid bileşeni — sütun kartları.'),
    items: [
      { icon: '📊', title: 'Muhasebe', body: 'Ön muhasebe ve finans yönetimi.' },
      { icon: '☁️', title: 'Bulut', body: 'Bulut tabanlı iş uygulamaları.' },
      { icon: '🛒', title: 'e-Ticaret', body: 'Online satış çözümleri.' },
    ],
  },
  {
    __component: 'sections.solutions-grid',
    anchorId: 'solutions-grid',
    heading: heading('sections.solutions-grid', 'Solutions Grid — çözüm ilişkileri.'),
    solutions: { set: solutionIds.map((documentId) => ({ documentId })) },
  },
  {
    __component: 'sections.companies-grid',
    anchorId: 'companies-grid',
    heading: heading('sections.companies-grid', 'Companies Grid — şirket ilişkileri.'),
    companies: { set: companyIds.map((documentId) => ({ documentId })) },
  },
  {
    __component: 'sections.products-grid',
    anchorId: 'products-grid',
    heading: heading('sections.products-grid', 'Products Grid — ürün ilişkileri.'),
    products: { set: productIds.map((documentId) => ({ documentId })) },
  },
  {
    __component: 'sections.promo-banner',
    title: 'sections.promo-banner',
    body: 'Promo Banner bileşeni — tanıtım bandı.',
    variant: 'default',
    cta: link('sections.promo-banner CTA', '/demo'),
    media: mediaItem('sections.promo-banner görseli'),
  },
  {
    __component: 'sections.news-grid',
    heading: heading('sections.news-grid', 'News Grid — haber kartları.'),
    viewAll: link('Tümünü Gör', '/medya'),
    items: [
      { title: 'Haber 1 — sections.news-grid', date: '2026-01-15', href: '/medya/haber-1', external: false },
      { title: 'Haber 2 — sections.news-grid', date: '2026-02-20', href: '/medya/haber-2', external: false },
      { title: 'Haber 3 — sections.news-grid', date: '2026-03-10', href: 'https://example.com', external: true },
    ],
  },
  {
    __component: 'sections.media-card-grid',
    heading: heading('sections.media-card-grid', 'Media Card Grid — medya kartları.'),
    items: [
      { title: 'Medya Kart 1', image: mediaItem(), link: link('Detay', '/cozumler') },
      { title: 'Medya Kart 2', image: mediaItem(), link: link('Detay', '/urunler') },
    ],
  },
  {
    __component: 'sections.phase-timeline',
    heading: heading('sections.phase-timeline', 'Phase Timeline — aşama zaman çizelgesi.'),
    phases: [
      { icon: '1', label: 'Keşif', body: 'İhtiyaç analizi ve planlama.' },
      { icon: '2', label: 'Uygulama', body: 'Kurulum ve entegrasyon.' },
      { icon: '3', label: 'Destek', body: 'Sürekli destek ve güncelleme.' },
    ],
  },
  {
    __component: 'sections.leadership-section',
    heading: 'sections.leadership-section',
    members: [
      { name: 'Lider 1', title: 'Genel Müdür', highlighted: true, accent: 'magenta' },
      { name: 'Lider 2', title: 'CTO', highlighted: false, accent: 'cyan' },
      { name: 'Lider 3', title: 'COO', highlighted: false, accent: 'orange' },
    ],
  },
  {
    __component: 'sections.value-grid',
    title: 'sections.value-grid',
    items: [
      { color: 'primary', title: 'Güvenilirlik', body: '30 yılı aşkın sektör deneyimi.' },
      { color: 'cyan', title: 'İnovasyon', body: 'Sürekli gelişen ürün portföyü.' },
      { color: 'orange', title: 'Destek', body: 'Türkiye genelinde yaygın destek ağı.' },
    ],
  },
  {
    __component: 'sections.office-grid',
    offices: [
      {
        city: 'İstanbul',
        label: 'Merkez Ofis',
        address: 'Maslak, İstanbul',
        phone: '+90 212 000 00 00',
        email: 'info@example.com',
        mapUrl: 'https://maps.google.com',
        mapLabel: 'Haritada Gör',
      },
      {
        city: 'Ankara',
        label: 'Bölge Ofisi',
        address: 'Çankaya, Ankara',
        phone: '+90 312 000 00 00',
        email: 'ankara@example.com',
        mapUrl: 'https://maps.google.com',
        mapLabel: 'Haritada Gör',
      },
    ],
  },
  {
    __component: 'sections.glass-cta',
    title: 'sections.glass-cta',
    body: 'Glass CTA bileşeni — cam efektli çağrı alanı.',
    cta: link('sections.glass-cta — Başlayın', '/iletisim'),
  },
  {
    __component: 'sections.call-to-action',
    title: 'sections.call-to-action',
    description: '<p>Call to Action bileşeni — dönüşüm odaklı bölüm.</p>',
    buttonLabel: 'sections.call-to-action CTA',
    buttonLink: '/demo',
    bgImage: SEED_IMAGE_ID,
    image: SEED_IMAGE_ID,
  },
  {
    __component: 'sections.lead-form',
    heading: 'sections.lead-form',
    lede: 'Lead Form bileşeni — iletişim formu.',
    submitLabel: 'Gönder',
    withMarketingConsent: true,
    anchorId: 'lead-form',
    fields: [
      { name: 'name', label: 'Ad Soyad', type: 'text', required: true },
      { name: 'email', label: 'E-posta', type: 'email', required: true },
      { name: 'phone', label: 'Telefon', type: 'tel', required: false },
    ],
  },
  {
    __component: 'blocks.rich-text',
    body: '<h2>blocks.rich-text</h2><p>Rich Text bloğu — serbest biçimlendirilmiş içerik alanı.</p>',
  },
  {
    __component: 'blocks.quote',
    quote: 'blocks.quote — Alıntı bloğu seed verisi.',
    author: 'TeamSystem',
  },
  {
    __component: 'blocks.image',
    file: SEED_IMAGE_ID,
    caption: 'blocks.image — Görsel bloğu',
  },
  {
    __component: 'blocks.logos',
    title: 'blocks.logos',
    logo: SEED_IMAGE_ID,
  },
  {
    __component: 'blocks.card',
    title: 'blocks.card',
    description: 'Card bloğu — bağımsız kart bileşeni.',
    link: '/cozumler',
  },
  {
    __component: 'blocks.button',
    label: 'blocks.button',
    url: '/iletisim',
    target: '_self',
  },
];

async function fetchDocumentIds(strapi, uid, limit = 6) {
  const docs = await strapi.documents(uid).findMany({ locale: LOCALE, limit });
  return docs.map((doc) => doc.documentId);
}

async function main() {
  const strapi = createStrapi({ distDir: './dist' });
  await strapi.load();

  try {
    const [solutionIds, companyIds, productIds] = await Promise.all([
      fetchDocumentIds(strapi, 'api::solution.solution'),
      fetchDocumentIds(strapi, 'api::company.company'),
      fetchDocumentIds(strapi, 'api::product.product'),
    ]);

    const sections = buildSections({ solutionIds, companyIds, productIds });

    await strapi.documents('api::home.home').update({
      documentId: HOME_DOCUMENT_ID,
      locale: LOCALE,
      data: {
        title: 'Ana Sayfa — Tüm Bölümler',
        sections,
        seo: {
          title: 'TeamSystem | Ana Sayfa — Bileşen Vitrini',
          description: 'Tüm home page bileşenlerinin seed verisi ile doldurulmuş vitrin sayfası.',
          robots: 'noindex',
          sitemap: false,
        },
      },
    });

    await strapi.documents('api::home.home').publish({
      documentId: HOME_DOCUMENT_ID,
      locale: LOCALE,
    });

    console.log(`✔ Home seeded with ${sections.length} sections (locale: ${LOCALE})`);
    sections.forEach((s, i) => console.log(`  ${i + 1}. ${s.__component}`));
  } finally {
    await strapi.destroy();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
