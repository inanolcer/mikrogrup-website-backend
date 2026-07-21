// Grants public `find` on the navigation single types.
// PUT /users-permissions/roles/:id is CSRF-guarded (src/middlewares/csrf.ts),
// so the token must be sent as both header and cookie.
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
