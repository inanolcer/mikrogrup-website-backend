# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Leads Management System built on **Strapi 5** for Mikrogrup/Zirve Yazılım. It
receives form submissions from several websites, validates them (YUP), and
integrates with Salesforce CRM. Deployed with Docker Compose behind Traefik.

## Layout

- `strapi-api/` — the Strapi 5 application (TypeScript, yarn). All app code lives here.
  - `src/api/*` — one folder per content type / form (controllers, routes, services, content-types).
  - `src/middlewares/csrf.ts` — CSRF handling.
  - `src/extensions/` — `documentation` and `users-permissions` overrides.
  - `src/index.ts` — `register`/`bootstrap`; defines the `GET /_health` endpoint.
  - `config/` — `server.ts`, `database.ts`, `middlewares.ts`, `plugins.ts`,
    `cron-tasks.ts`, `csrf-trusted-origins.ts`, `admin.ts`, `api.ts`.
- `docker-compose-dev.yml` / `docker-compose-prod.yml` — services: `db` (Postgres 16),
  `nginx`/Traefik, and the Strapi API.
- `Docs/`, `devops/`, `backup/` — deployment notes, scripts, DB dumps.

## Tech stack

- Strapi **5.46.1** (keep all `@strapi/*` packages pinned to the **same** exact version).
- Node 20 (engines allow 18–24), TypeScript, **yarn** (`yarn.lock` is committed).
- PostgreSQL 16.3-alpine. Validation via YUP. Salesforce REST API (OAuth).

## Working in the container

`docker-compose` bind-mounts `./strapi-api` and uses an **anonymous volume** for
`node_modules`. Run installs/builds **inside** the container, not on the host:

```bash
docker exec -it lead-samplr-api sh -c "cd /srv/app && yarn install && yarn build"
docker restart lead-samplr-api
```

- Prod container name: `lead-samplr-api`; app path: `/srv/app`.
- Dev build helper: `bash build-dev.sh` (add `fresh` to rebuild from scratch).

## Conventions

- Adding a form/content type: mirror an existing `src/api/<name>/` folder
  (controller + route + service + `content-types/<name>/schema.json`).
- New frontend origins that POST forms must be added to
  `config/csrf-trusted-origins.ts`. Cross-origin forms send `X-CSRF-Token`.
- Behind Traefik, Strapi trusts the proxy (`IS_PROXIED=true`); Traefik must send
  `X-Forwarded-Proto: https`.
- `GET /_health` returns 200/204 — Docker healthcheck must accept any 2xx.
- Scheduled jobs go in `config/cron-tasks.ts` (Strapi 5 cron format).

## Gotchas (see README.md "Errors" for full list)

- `DATABASE_SSL=false` for the local Postgres container; `true` only for managed DBs (RDS).
- SMTP: `SMTP_SECURE=false` for STARTTLS port 2525; `true` only for port 465.
- `EADDRINUSE` on `/tmp/nitro/worker-*.sock` → remove the stale socket in the container.

## Slash commands

- `/update-strapi` — bump Strapi and all `@strapi/*` packages to one target version.
  See `.claude/commands/update-strapi.md` and `.claude/commands/strapi-version-upgrade.md`.
