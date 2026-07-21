// Seeds main-navigation + footer-navigation single types (tr, en) from the
// tree that used to live in nuxt-app/data/navigation.js.
// Insert-only: a locale that already has items is skipped unless --force.
//
//   node Docs/seed-navigation.mjs --dry-run
//   node Docs/seed-navigation.mjs
//   node Docs/seed-navigation.mjs --force
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:1339';
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

/** Read a key from the submodule .env — never hardcode credentials here. */
const fromEnvFile = (key) => {
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env');
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.trim().startsWith(`${key}=`));
  return line ? line.slice(line.indexOf('=') + 1).trim() : null;
};

const EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'inan@kozmoz.io';
const PASS = process.env.STTAPI_ADMIN_PASS || fromEnvFile('STTAPI_ADMIN_PASS');
if (!PASS) throw new Error('STTAPI_ADMIN_PASS not set and not found in .env');

const ext = (label, url) => ({ label, url, target: '_blank' });
const int = (label, url) => ({ label, url, target: '_self' });

const GROUP_SITES = [
  ['TeamSystem Group', 'https://www.teamsystem.com/'],
  ['Mikro Yazılım', 'https://www.mikro.com.tr/'],
  ['Zirve Yazılım', 'https://www.zirve.com.tr/'],
  ['Paraşüt', 'https://www.parasut.com/'],
  ['Bizim Hesap', 'https://www.bizimhesap.com/'],
  ['Nef Solutions', 'https://www.nefsolutions.com/'],
  ['DIA Yazılım', 'https://www.dia.com.tr/'],
].map(([l, u]) => ext(l, u));

const CAREERS = 'https://www.kariyer.net/'; // TODO: replace with the real careers URL

const MAIN = {
  tr: {
    items: [
      { ...int('Hakkımızda', '/hakkimizda'), submenu: [
        int('Biz Kimiz', '/hakkimizda'),
        int('Vizyonumuz', '/misyon'),
        int('Yönetim', '/yonetim'),
        int('Uyumluluk', '/uyumluluk'),
        int('Ofisler', '/ofisler'),
        { label: 'Grup Web Siteleri', url: '', target: '_self', links: GROUP_SITES },
      ] },
      { ...int('Çözümler', '/cozumler'), submenu: [
        int('İhtiyaca Göre', '/cozumler#ihtiyaca-gore'),
        int('Markaya Göre', '/cozumler#markaya-gore'),
      ] },
      int('Elektronik Fatura', '/elektronik-fatura'),
      { ...int('İnsan Kaynakları', '/insanlar'), submenu: [
        int('Değerlerimiz', '/degerlerimiz'),
        int('Kurumsal Sosyal Sorumluluk', '/kurumsal-sosyal-sorumluluk'),
        int("TeamSystem'da Çalışmak", '/teamsystemda-calismak'),
        ext('Kariyer', CAREERS),
      ] },
      { ...int('Medya', '/medya'), submenu: [
        int('Basın Bültenleri', '/medya/basin-bultenleri'),
        int('Basın Yansımaları', '/medya/basin-yansimalari'),
        int('Basın Kiti', '/medya/basin-kiti'),
      ] },
    ],
    cta: int('İletişim', '/iletisim'),
  },
  en: {
    items: [
      { ...int('About Us', '/hakkimizda'), submenu: [
        int('Who We Are', '/hakkimizda'),
        int('Our Vision', '/misyon'),
        int('Management', '/yonetim'),
        int('Compliance', '/uyumluluk'),
        int('Offices', '/ofisler'),
        { label: 'Group Websites', url: '', target: '_self', links: GROUP_SITES },
      ] },
      { ...int('Solutions', '/cozumler'), submenu: [
        int('By Need', '/cozumler#ihtiyaca-gore'),
        int('By Brand', '/cozumler#markaya-gore'),
      ] },
      int('E-Invoice', '/elektronik-fatura'),
      { ...int('People', '/insanlar'), submenu: [
        int('Our Values', '/degerlerimiz'),
        int('Corporate Social Responsibility', '/kurumsal-sosyal-sorumluluk'),
        int('Working at TeamSystem', '/teamsystemda-calismak'),
        ext('Careers', CAREERS),
      ] },
      { ...int('Media', '/medya'), submenu: [
        int('Press Releases', '/medya/basin-bultenleri'),
        int('Press Review', '/medya/basin-yansimalari'),
        int('Press Kit', '/medya/basin-kiti'),
      ] },
    ],
    cta: int('Contact', '/iletisim'),
  },
};

// Footer: each top-level item is a column heading; submenu holds its links.
const FOOTER = {
  tr: {
    items: [
      { label: 'Çözümlerimiz', url: '', target: '_self', submenu: [
        int('TeamSystem Fatura', '/cozumler'),
        int('TeamSystem Satış', '/cozumler'),
        int('TeamSystem Analitik', '/cozumler'),
        int('TeamSystem Pazarlama', '/cozumler'),
      ] },
      { label: 'Şirket', url: '', target: '_self', submenu: [
        int('Hakkımızda', '/hakkimizda'),
        ext('Kariyer', CAREERS),
        int('Medya', '/medya'),
      ] },
      { label: 'Hukuki', url: '', target: '_self', submenu: [
        int('Gizlilik Politikası', '/gizlilik-politikasi'),
        int('Kullanım Koşulları', '/kullanim-kosullari'),
        int('Çerezler', '/cerezler'),
      ] },
    ],
  },
  en: {
    items: [
      { label: 'Our Solutions', url: '', target: '_self', submenu: [
        int('TeamSystem Invoicing', '/cozumler'),
        int('TeamSystem Sales', '/cozumler'),
        int('TeamSystem Analytics', '/cozumler'),
        int('TeamSystem Marketing', '/cozumler'),
      ] },
      { label: 'Company', url: '', target: '_self', submenu: [
        int('About Us', '/hakkimizda'),
        ext('Careers', CAREERS),
        int('Media', '/medya'),
      ] },
      { label: 'Legal', url: '', target: '_self', submenu: [
        int('Privacy Policy', '/gizlilik-politikasi'),
        int('Terms of Use', '/kullanim-kosullari'),
        int('Cookies', '/cerezler'),
      ] },
    ],
  },
};

const login = await (await fetch(`${TARGET}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASS }),
})).json();
const jwt = login?.data?.token;
if (!jwt) throw new Error('admin login failed: ' + JSON.stringify(login).slice(0, 200));
console.log('admin login ok');

const csrf = await (await fetch(`${TARGET}/api/csrf-token`)).json();
const csrfToken = csrf.csrfToken || csrf.data?.csrfToken;
if (!csrfToken) throw new Error('no csrfToken');

// The admin JWT is only valid for /admin and /content-manager routes — content
// API writes need an API token. Create a temporary full-access one and delete
// it in the finally block (same pattern as Docs/import-mikrogrup.mjs).
let apiKey = null;
let apiTokenId = null;
if (!DRY) {
  const tok = await (await fetch(`${TARGET}/admin/api-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      name: `nav-seed-${Date.now()}`,
      description: 'navigation seed (temporary)',
      type: 'full-access',
      lifespan: null,
    }),
  })).json();
  apiKey = tok?.data?.accessKey;
  apiTokenId = tok?.data?.id;
  if (!apiKey) throw new Error('could not create API token: ' + JSON.stringify(tok).slice(0, 200));
  console.log('created temp API token', apiTokenId);
}

const H = {
  'Content-Type': 'application/json',
  ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  'X-CSRF-Token': csrfToken,
  Cookie: `csrf_token=${csrfToken}`,
};

try {
  for (const [singular, byLocale] of [['main-navigation', MAIN], ['footer-navigation', FOOTER]]) {
    for (const locale of ['tr', 'en']) {
      const current = await (await fetch(`${TARGET}/api/${singular}?locale=${locale}`, { headers: H })).json();
      const existing = current?.data?.items;
      if (Array.isArray(existing) && existing.length > 0 && !FORCE) {
        console.log(`${singular} [${locale}] exists (${existing.length} items), skip`);
        continue;
      }
      const payload = byLocale[locale];
      if (DRY) {
        console.log(`[dry] PUT ${singular} [${locale}]:`, JSON.stringify(payload).slice(0, 160) + '…');
        continue;
      }
      const res = await fetch(`${TARGET}/api/${singular}?locale=${locale}&status=published`, {
        method: 'PUT',
        headers: H,
        body: JSON.stringify({ data: payload }),
      });
      const body = await res.text();
      console.log(`${singular} [${locale}] -> HTTP ${res.status}${res.ok ? '' : ' ' + body.slice(0, 300)}`);
    }
  }
} finally {
  if (apiTokenId != null) {
    await fetch(`${TARGET}/admin/api-tokens/${apiTokenId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    }).catch((e) => console.warn('token cleanup failed:', e.message));
    console.log('temp API token deleted');
  }
}
