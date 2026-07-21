// Asserts the navigation component chain + main-navigation cta field exist.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const TARGET = process.env.TARGET_URL || 'http://127.0.0.1:1339';

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

const login = await (await fetch(`${TARGET}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASS }),
})).json();
const jwt = login?.data?.token;
if (!jwt) throw new Error('admin login failed: ' + JSON.stringify(login).slice(0, 200));

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
