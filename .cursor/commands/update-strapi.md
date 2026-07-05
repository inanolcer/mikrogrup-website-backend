# Update Strapi and related package versions

Use this in the **Lead Samplr** repo (`strapi-api/`).

## Goal

Upgrade Strapi (and all official `@strapi/*` packages) to a **single target version**. If the user did not name a version, ask which semver they want (e.g. `5.40.0`) before editing files.

## Steps

1. Open `strapi-api/package.json` and set **every** `@strapi/*` dependency to that **same** version (exact pin recommended: `5.x.x`, no mixed minors).
2. Include at least: `@strapi/strapi`, `@strapi/plugin-documentation`, `@strapi/plugin-users-permissions`, `@strapi/provider-email-nodemailer`. Align any other `@strapi/*` entries if present.
3. Do **not** bump unrelated packages unless Strapi release notes or peer dependency errors require it.
4. Summarise the diff (what changed and from → to).
5. Give **copy-paste commands** for the user’s setup:
   - Container: `lead-samplr-api`
   - App path: `/srv/app`
   - Package manager: **yarn**
   - Remind them: DB backup first; skim [Strapi GitHub releases](https://github.com/strapi/strapi/releases) for breaking changes.
   - Because `docker-compose` uses a bind mount for `./strapi-api` and an anonymous volume for `node_modules`, they should run install/build **inside** the container after the edit, for example:

```bash
docker exec -it lead-samplr-api sh -c "cd /srv/app && yarn install && yarn build"
docker restart lead-samplr-api
```

   - Optional one-liner to pin via yarn inside the container (replace `X.Y.Z`):

```bash
docker exec -it lead-samplr-api sh -c 'cd /srv/app && yarn add @strapi/strapi@X.Y.Z @strapi/plugin-documentation@X.Y.Z @strapi/plugin-users-permissions@X.Y.Z @strapi/provider-email-nodemailer@X.Y.Z && yarn build'
```

6. If `yarn.lock` exists in the repo after install, mention committing `package.json` and `yarn.lock` together.

## Output

Short checklist: files touched, version target, docker commands, anything to verify manually (admin build, cron, Salesforce, CSRF).
