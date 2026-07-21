# Main Navigation (Strapi side) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Strapi `main-navigation` and `footer-navigation` single types the source of truth for the TeamSystem site menus, with the current `nuxt-app/data/navigation.js` tree seeded into them for `tr` and `en`.

**Architecture:** Extend the existing `navigation.*` components to three levels (item → submenu → link), add a header CTA field to `main-navigation`, force a canonical populate map in both controllers (per the repo convention that controllers own populate), open public `find` permission for both single types, then seed the content with an idempotent Node script that mirrors `Docs/import-mikrogrup.mjs` (admin login → CSRF token → write).

**Tech Stack:** Strapi 5.46.1 (TypeScript), PostgreSQL 16, Docker Compose (`teamsystem-strapi-api`), Node 20+ for the seed script.

**Companion plan:** `kozmoz-website-nuxt/Docs/10-Main-Navigation-Plan-Nuxt.md` — the Nuxt consumer. Implement this plan first; the Nuxt plan depends on the JSON shape produced here.

## Global Constraints

- Strapi version stays **5.46.1**; do not bump `@strapi/*` packages in this work.
- All schema edits are **file edits under `strapi-api/src/`**, never admin-panel Content-Type Builder edits (the builder writes the same files but bypasses review and can reorder keys).
- The dev container runs `yarn develop` with `./strapi-api` bind-mounted; schema file changes trigger an automatic restart. After **component** changes always confirm with `docker logs teamsystem-strapi-api --since 2m | grep -E "error|started successfully"`.
- Attribute **renames drop data** in Strapi (delete + recreate). Never rename an attribute that already holds seeded content without re-seeding it afterwards.
- Locales in play: **`tr` (default)** and **`en`**. Every single-type write must specify the locale explicitly.
- Content-API mutations are guarded by `src/middlewares/csrf.ts`: every non-GET request outside `/admin`, `/content-manager`, `/api/upload`, `/api/users-permissions` needs a `GET /api/csrf-token` token sent as **both** the `X-CSRF-Token` header and a `csrf_token=` cookie.
- Local API base for scripts: `http://127.0.0.1:1339` (the container's published port). Admin credentials come from `.env` (`inan@kozmoz.io` / `STTAPI_ADMIN_PASS`).
- **No automated test framework exists in this repo.** Each task's "test" cycle is an explicit verification command (curl / node assertion) whose expected output is written out. A task is not done until its verification command prints the expected result.

---

## Decisions locked in (read before Task 1)

These resolve ambiguities in the source data. Do not re-litigate them mid-implementation.

1. **Labels are literal strings per locale, not i18n keys.** `data/navigation.js` uses `labelKey: 'nav.about'` resolved through vue-i18n. Once the menu lives in Strapi, the localized single type *is* the translation mechanism: the `tr` entry holds "Hakkımızda", the `en` entry holds "About Us". The `nav.*` keys in `i18n/locales/*.json` remain only as the offline fallback tree (see the Nuxt plan).
2. **`url` carries either an internal path or an absolute URL.** Internal: `/hakkimizda`, `/cozumler#ihtiyaca-gore`. External: `https://www.mikro.com.tr/`. The Nuxt side decides how to render by testing for a leading `/` — the `external: true` flag from `navigation.js` is not migrated as a separate field.
3. **`target` replaces `external`.** `_self` (default) or `_blank`. Absolute URLs get `_blank`.
4. **Three levels, via a new leaf component.** Strapi components cannot nest into themselves, so the chain is `navigation.nav-item` → `submenu[]` (`navigation.submenu`) → `links[]` (`navigation.nav-link`). Level 3 exists only for the "Grup Web Siteleri" group.
5. **Footer groups reuse the existing shape.** `footer-navigation.items[]` — each top-level `nav-item` is a *column heading* (`label` = "Çözümlerimiz", `url` empty) and its `submenu[]` holds that column's links. This needs no footer schema change and drops the hardcoded `footer.solutions` / `footer.company` / `footer.legal` i18n headings.
6. **The header CTA moves into `main-navigation`** as a single (non-repeatable) `navigation.nav-link` field named `cta`.
7. **No `key` field in the CMS.** The Vue `:key` and dropdown-state identity are derived in the Nuxt normalizer from `url || label`. One less field for editors to get wrong.

---

## File Structure

| File | Responsibility |
|---|---|
| `strapi-api/src/components/navigation/nav-link.json` | **Create.** Leaf link: `label`, `url`, `target`. Used for level-3 links and the header CTA. |
| `strapi-api/src/components/navigation/submenu.json` | **Modify.** Add optional repeatable `links` (`navigation.nav-link`) to give the third level. |
| `strapi-api/src/api/main-navigation/content-types/main-navigation/schema.json` | **Modify.** Add the `cta` component field. |
| `strapi-api/src/utils/website-populate.ts` | **Modify.** Add `mainNavigationPopulate` / `footerNavigationPopulate` exports. |
| `strapi-api/src/api/main-navigation/controllers/main-navigation.ts` | **Modify.** Force the populate map on `find`. |
| `strapi-api/src/api/footer-navigation/controllers/footer-navigation.ts` | **Modify.** Force the populate map on `find`. |
| `Docs/seed-navigation.mjs` | **Create.** Idempotent seed of both single types, both locales, from the `navigation.js` tree. |

Unchanged on purpose: `navigation.nav-item` keeps `label`/`url`/`target`/`submenu`; `footer-navigation/content-types/.../schema.json` already has the right shape.

---

## Task 1: Three-level component chain

**Files:**
- Create: `strapi-api/src/components/navigation/nav-link.json`
- Modify: `strapi-api/src/components/navigation/submenu.json`
- Verify: running container logs + `/content-manager/init`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: component UIDs `navigation.nav-link` (attributes `label`, `url`, `target`) and `navigation.submenu` (attributes `label`, `url`, `target`, `links`). Tasks 2–5 depend on both names exactly as written.

- [ ] **Step 1: Write the verification script (it must fail first)**

Create `Docs/verify-navigation-schema.mjs`:

```js
// Asserts the navigation component chain + main-navigation cta field exist.
const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:1339';
const PASS = process.env.STTAPI_ADMIN_PASS || 'VyEVLfUDVDJsNtGrxGcH5LqT';

const login = await (await fetch(`${TARGET}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'inan@kozmoz.io', password: PASS }),
})).json();
const jwt = login?.data?.token;
if (!jwt) throw new Error('admin login failed');

const init = await (await fetch(`${TARGET}/content-manager/init`, {
  headers: { Authorization: `Bearer ${jwt}` },
})).json();

const attrsOf = (uid) => {
  const c = init.data.components.find((x) => x.uid === uid);
  return c ? Object.keys(c.attributes) : null;
};

const checks = [
  ['navigation.nav-link exists', () => attrsOf('navigation.nav-link') !== null],
  ['nav-link has label,url,target', () => ['label', 'url', 'target'].every((k) => (attrsOf('navigation.nav-link') || []).includes(k))],
  ['submenu has links', () => (attrsOf('navigation.submenu') || []).includes('links')],
  ['nav-item has submenu', () => (attrsOf('navigation.nav-item') || []).includes('submenu')],
  ['main-navigation has cta', () => {
    const ct = init.data.contentTypes.find((x) => x.uid === 'api::main-navigation.main-navigation');
    return Boolean(ct && ct.attributes.cta);
  }],
];

let failed = 0;
for (const [name, fn] of checks) {
  let ok = false;
  try { ok = fn(); } catch { ok = false; }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed++;
}
console.log(failed === 0 ? '\nALL CHECKS PASSED' : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node Docs/verify-navigation-schema.mjs`
Expected: `FAIL  navigation.nav-link exists`, `FAIL  nav-link has label,url,target`, `FAIL  submenu has links`, `FAIL  main-navigation has cta`, then `4 CHECK(S) FAILED` and exit code 1. (`nav-item has submenu` already passes.)

- [ ] **Step 3: Create the leaf component**

`strapi-api/src/components/navigation/nav-link.json`:

```json
{
  "collectionName": "components_navigation_nav_links",
  "info": {
    "displayName": "Nav Link",
    "icon": "link",
    "description": "Leaf link: third-level menu entries and the header CTA"
  },
  "options": {},
  "attributes": {
    "label": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string"
    },
    "target": {
      "type": "string",
      "default": "_self"
    }
  }
}
```

- [ ] **Step 4: Add the third level to submenu**

Replace the whole of `strapi-api/src/components/navigation/submenu.json` with:

```json
{
  "collectionName": "components_navigation_submenus",
  "info": {
    "displayName": "submenu",
    "icon": "filter",
    "description": ""
  },
  "options": {},
  "attributes": {
    "label": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "target": {
      "type": "string",
      "default": "_self"
    },
    "links": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.nav-link"
    }
  }
}
```

- [ ] **Step 5: Confirm the container reloaded without error**

Run: `docker logs teamsystem-strapi-api --since 2m 2>&1 | grep -E "error|Error|started successfully" | tail -5`
Expected: a line containing `Strapi started successfully` and **no** `error` lines. If nothing appears, force it: `docker restart teamsystem-strapi-api && sleep 30` and re-run.

- [ ] **Step 6: Commit**

```bash
git add strapi-api/src/components/navigation/nav-link.json strapi-api/src/components/navigation/submenu.json Docs/verify-navigation-schema.mjs
git commit -m "feat(nav): add navigation.nav-link and third-level submenu links"
```

---

## Task 2: Header CTA field on main-navigation

**Files:**
- Modify: `strapi-api/src/api/main-navigation/content-types/main-navigation/schema.json`
- Verify: `Docs/verify-navigation-schema.mjs` (from Task 1)

**Interfaces:**
- Consumes: `navigation.nav-link` from Task 1.
- Produces: `api::main-navigation.main-navigation` gains attribute `cta` (single `navigation.nav-link`, localized). Task 6's seed payload and the Nuxt plan's `useNavigation()` both read `data.cta`.

- [ ] **Step 1: Add the field**

Replace the `attributes` block of `strapi-api/src/api/main-navigation/content-types/main-navigation/schema.json` so the file reads:

```json
{
  "kind": "singleType",
  "collectionName": "main_navigations",
  "info": {
    "singularName": "main-navigation",
    "pluralName": "main-navigations",
    "displayName": "Main Navigation",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.nav-item",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "cta": {
      "type": "component",
      "repeatable": false,
      "component": "navigation.nav-link",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
  }
}
```

- [ ] **Step 2: Run the schema verification**

Run: `node Docs/verify-navigation-schema.mjs`
Expected: all five lines `PASS`, then `ALL CHECKS PASSED`, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add strapi-api/src/api/main-navigation/content-types/main-navigation/schema.json
git commit -m "feat(nav): add header cta link to main-navigation single type"
```

---

## Task 3: Canonical populate for both navigation single types

**Files:**
- Modify: `strapi-api/src/utils/website-populate.ts`
- Modify: `strapi-api/src/api/main-navigation/controllers/main-navigation.ts`
- Modify: `strapi-api/src/api/footer-navigation/controllers/footer-navigation.ts`

**Interfaces:**
- Consumes: the component chain from Task 1.
- Produces: exports `mainNavigationPopulate` and `footerNavigationPopulate` from `src/utils/website-populate.ts`; `GET /api/main-navigation` and `GET /api/footer-navigation` return fully nested `items[].submenu[].links[]` regardless of client query string.

Why this is needed: Strapi's default single-type `find` returns components **unpopulated**, so without this the Nuxt app gets `items: undefined`. Repo convention (backend `CLAUDE.md`) is that controllers force populate and the frontend sends none.

- [ ] **Step 1: Add the populate maps**

Append to `strapi-api/src/utils/website-populate.ts` (after the existing `articlePopulate` export):

```ts
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
```

- [ ] **Step 2: Force it in the main-navigation controller**

Replace the whole of `strapi-api/src/api/main-navigation/controllers/main-navigation.ts` with:

```ts
/**
 * main-navigation controller
 */

import { factories } from '@strapi/strapi';
import { mainNavigationPopulate } from '../../../utils/website-populate';

export default factories.createCoreController('api::main-navigation.main-navigation', ({ strapi }) => ({
  async find(ctx) {
    // Website populate wins over any client query-string populate.
    ctx.query = {
      ...ctx.query,
      populate: mainNavigationPopulate,
    };

    // Single types return null (not { data, meta }) when no entry exists for
    // the requested locale — never destructure the result.
    const response = await super.find(ctx);
    return response ?? { data: null, meta: {} };
  },
}));
```

- [ ] **Step 3: Force it in the footer-navigation controller**

Replace the whole of `strapi-api/src/api/footer-navigation/controllers/footer-navigation.ts` with:

```ts
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

    // Single types return null (not { data, meta }) when no entry exists for
    // the requested locale — never destructure the result.
    const response = await super.find(ctx);
    return response ?? { data: null, meta: {} };
  },
}));
```

- [ ] **Step 4: Confirm the container reloaded without a TypeScript error**

Run: `docker logs teamsystem-strapi-api --since 2m 2>&1 | grep -E "error|Error|started successfully" | tail -5`
Expected: `Strapi started successfully`, no `error` lines. A typo in the import path shows up here as a compile error — fix before continuing.

- [ ] **Step 5: Commit**

```bash
git add strapi-api/src/utils/website-populate.ts strapi-api/src/api/main-navigation/controllers/main-navigation.ts strapi-api/src/api/footer-navigation/controllers/footer-navigation.ts
git commit -m "feat(nav): force nested populate for navigation single types"
```

---

## Task 4: Public read permission for both single types

**Files:**
- Create: `Docs/enable-navigation-permissions.mjs`

**Interfaces:**
- Consumes: nothing from earlier tasks (schema-independent).
- Produces: anonymous `GET /api/main-navigation` and `GET /api/footer-navigation` return **200** instead of 403.

Why a script and not the admin panel: the same fix was needed for `api::slugs` and `api::home` and is easy to lose on a database restore. A checked-in script makes it repeatable. Note the CSRF handshake — `PUT /users-permissions/roles/:id` is **not** in the middleware's skip list.

- [ ] **Step 1: Confirm the endpoints are currently forbidden**

Run:
```bash
curl -s -o /dev/null -w "main:%{http_code} " "http://127.0.0.1:1339/api/main-navigation?locale=tr"; \
curl -s -o /dev/null -w "footer:%{http_code}\n" "http://127.0.0.1:1339/api/footer-navigation?locale=tr"
```
Expected: `main:403 footer:403`. (If they already print 200, skip to Step 4 and commit the script anyway for reproducibility.)

- [ ] **Step 2: Write the permission script**

Create `Docs/enable-navigation-permissions.mjs`:

```js
// Grants public `find` on the navigation single types.
// PUT /users-permissions/roles/:id is CSRF-guarded (src/middlewares/csrf.ts),
// so the token must be sent as both header and cookie.
const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:1339';
const PASS = process.env.STTAPI_ADMIN_PASS || 'VyEVLfUDVDJsNtGrxGcH5LqT';

const login = await (await fetch(`${TARGET}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'inan@kozmoz.io', password: PASS }),
})).json();
const jwt = login?.data?.token;
if (!jwt) throw new Error('admin login failed: ' + JSON.stringify(login).slice(0, 200));

const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` };
const roles = await (await fetch(`${TARGET}/users-permissions/roles`, { headers: H })).json();
const pub = (roles.roles || []).find((r) => r.type === 'public');
if (!pub) throw new Error('public role not found');

const { role } = await (await fetch(`${TARGET}/users-permissions/roles/${pub.id}`, { headers: H })).json();
const perms = role.permissions;

for (const [apiKey, controller] of [
  ['api::main-navigation', 'main-navigation'],
  ['api::footer-navigation', 'footer-navigation'],
]) {
  const c = perms?.[apiKey]?.controllers?.[controller];
  if (!c?.find) { console.warn(`  ! ${apiKey}.${controller}.find not found`); continue; }
  c.find.enabled = true;
  console.log(`  + ${apiKey}.${controller}.find -> true`);
}

const csrf = await (await fetch(`${TARGET}/api/csrf-token`)).json();
const csrfToken = csrf.csrfToken || csrf.data?.csrfToken;
if (!csrfToken) throw new Error('no csrfToken from /api/csrf-token');

const res = await fetch(`${TARGET}/users-permissions/roles/${pub.id}`, {
  method: 'PUT',
  headers: { ...H, 'X-CSRF-Token': csrfToken, Cookie: `csrf_token=${csrfToken}` },
  body: JSON.stringify({ name: role.name, description: role.description, permissions: perms, users: [] }),
});
console.log('PUT role ->', res.status);

for (const p of ['/api/main-navigation?locale=tr', '/api/footer-navigation?locale=tr']) {
  console.log(`GET ${p} -> ${(await fetch(TARGET + p)).status}`);
}
```

- [ ] **Step 3: Run it**

Run: `node Docs/enable-navigation-permissions.mjs`
Expected:
```
  + api::main-navigation.main-navigation.find -> true
  + api::footer-navigation.footer-navigation.find -> true
PUT role -> 200
GET /api/main-navigation?locale=tr -> 200
GET /api/footer-navigation?locale=tr -> 200
```
A `PUT role -> 403` with `CSRF validation failed` means the token pair was not sent — re-check the header **and** cookie are both present.

- [ ] **Step 4: Commit**

```bash
git add Docs/enable-navigation-permissions.mjs
git commit -m "chore(nav): script to grant public find on navigation single types"
```

---

## Task 5: Seed the navigation content (tr + en)

**Files:**
- Create: `Docs/seed-navigation.mjs`

**Interfaces:**
- Consumes: schema from Tasks 1–2, populate from Task 3, public read from Task 4.
- Produces: populated `main-navigation` and `footer-navigation` single types in both locales. The Nuxt plan's `useNavigation()` consumes exactly this JSON.

Behaviour: **insert-only by default.** If a locale's single type already has `items`, the script leaves it alone and prints `exists, skip` — matching the "do not update or insert if it exists" rule used for the products/companies import. Pass `--force` to overwrite deliberately.

- [ ] **Step 1: Write the seed script**

Create `Docs/seed-navigation.mjs`:

```js
// Seeds main-navigation + footer-navigation single types (tr, en) from the
// tree that used to live in nuxt-app/data/navigation.js.
// Insert-only: a locale that already has items is skipped unless --force.
//
//   node Docs/seed-navigation.mjs --dry-run
//   node Docs/seed-navigation.mjs
//   node Docs/seed-navigation.mjs --force

const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:1339';
const PASS = process.env.STTAPI_ADMIN_PASS || 'VyEVLfUDVDJsNtGrxGcH5LqT';
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

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
  body: JSON.stringify({ email: 'inan@kozmoz.io', password: PASS }),
})).json();
const jwt = login?.data?.token;
if (!jwt) throw new Error('admin login failed: ' + JSON.stringify(login).slice(0, 200));
console.log('admin login ok');

const csrf = await (await fetch(`${TARGET}/api/csrf-token`)).json();
const csrfToken = csrf.csrfToken || csrf.data?.csrfToken;
if (!csrfToken) throw new Error('no csrfToken');

const H = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${jwt}`,
  'X-CSRF-Token': csrfToken,
  Cookie: `csrf_token=${csrfToken}`,
};

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
```

- [ ] **Step 2: Dry-run it**

Run: `node Docs/seed-navigation.mjs --dry-run`
Expected: `admin login ok`, then four `[dry] PUT …` lines (main-navigation tr/en, footer-navigation tr/en). No HTTP writes.

- [ ] **Step 3: Seed for real**

Run: `node Docs/seed-navigation.mjs`
Expected: four lines ending `-> HTTP 200`. Any `403 CSRF validation failed` means the header/cookie pair was dropped; any `400` prints the validation detail — most likely an attribute name that does not match Task 1/2.

- [ ] **Step 4: Verify the public JSON is complete and nested**

Run:
```bash
curl -s "http://127.0.0.1:1339/api/main-navigation?locale=tr" | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const d=JSON.parse(s).data;
  console.log('items:', d.items.length, '| cta:', d.cta?.label);
  console.log('about submenu:', d.items[0].submenu.length);
  console.log('group links:', d.items[0].submenu.at(-1).links.length);
});"
```
Expected exactly:
```
items: 5 | cta: İletişim
about submenu: 6
group links: 7
```
This is the single most important check in the plan — it proves all three levels survive the populate map.

- [ ] **Step 5: Verify EN and the footer**

Run:
```bash
curl -s "http://127.0.0.1:1339/api/main-navigation?locale=en" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const d=JSON.parse(s).data;console.log('en items:',d.items.length,'| first:',d.items[0].label)})"; \
curl -s "http://127.0.0.1:1339/api/footer-navigation?locale=tr" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const d=JSON.parse(s).data;console.log('footer cols:',d.items.map(i=>i.label+'('+i.submenu.length+')').join(' '))})"
```
Expected:
```
en items: 5 | first: About Us
footer cols: Çözümlerimiz(4) Şirket(3) Hukuki(3)
```

- [ ] **Step 6: Confirm idempotence**

Run: `node Docs/seed-navigation.mjs`
Expected: four `exists (… items), skip` lines and no writes.

- [ ] **Step 7: Commit**

```bash
git add Docs/seed-navigation.mjs
git commit -m "feat(nav): seed main + footer navigation for tr and en"
```

---

## Task 6: Admin-panel review pass

**Files:** none (content review).

**Interfaces:**
- Consumes: everything above.
- Produces: sign-off that editors can maintain the menu without a developer.

- [ ] **Step 1: Open the single type**

Visit `https://website-api.teamsystem.local/kozmoz-panel/content-manager/single-types/api::main-navigation.main-navigation?plugins[i18n][locale]=tr` and hard-reload (Cmd+Shift+R) — the admin caches content-type schemas per session, so a fresh field like `cta` will not appear otherwise.

- [ ] **Step 2: Check the tree renders**

Expected: 5 `Nav Item` entries; opening "Hakkımızda" shows 6 submenu entries; opening "Grup Web Siteleri" shows 7 `Nav Link` entries; the `cta` field shows "İletişim" / `/iletisim`.

- [ ] **Step 3: Check the EN locale**

Switch the locale selector to English. Expected: 5 items starting "About Us", `cta` = "Contact".

- [ ] **Step 4: Edit-and-revert smoke test**

Change one label, Save, re-run the Step 4 curl from Task 5 and confirm the change appears in the API, then revert it in the panel. This proves the editor → API path works end to end without a redeploy.

---

## Rollback

If the navigation work needs to be undone: `git revert` the commits from Tasks 1–3 (schema + controllers), restart the container, and leave the seeded rows in place — they become orphaned columns in `components_navigation_*` tables and are harmless. Do **not** hand-edit the Postgres tables. The Nuxt side keeps its offline fallback tree (see the companion plan), so the site stays up even when `/api/main-navigation` 403s or 500s.

---

## Self-Review Notes

- **Spec coverage:** navigation.js → Strapi (Tasks 1, 2, 5), i18n locales (Tasks 5 Steps 4–5, Task 6 Step 3), footer-navigation content type (Decision 5, Task 5), populate config (Task 3). Public read permission (Task 4) was not in the original ask but is a hard prerequisite — the same 403 that broke `/cozumler` would break the menu.
- **Type consistency:** `navigation.nav-link` attribute names (`label`, `url`, `target`) are identical in Task 1 (schema), Task 3 (populate `links: true`), Task 5 (seed `int()`/`ext()` helpers) and the Nuxt plan's normalizer. `cta` is singular and non-repeatable everywhere.
- **Known gap carried forward:** the careers URL is still the `kariyer.net` placeholder from `navigation.js`, and `/gizlilik-politikasi`, `/kullanim-kosullari`, `/cerezler` are still TODO pages. Seeding them now is deliberate — the links exist in the current site and the CMS is where they will be corrected.
