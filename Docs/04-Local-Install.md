# Local Install — Strapi Development Environment

> Project-specific guide for running the TeamSystem Strapi API on a local machine.
> For Strapi CLI command reference, see [03-Install-Strapi-CLI.md](./03-Install-Strapi-CLI.md).

## Overview

This project runs Strapi **inside Docker**, not as a global install. The `strapi-api/` folder is bind-mounted into the container; `node_modules` lives in an anonymous Docker volume.

Strapi CLI commands should be run **locally via yarn** (project-scoped), never via a global `strapi` binary:

```bash
yarn strapi help        # correct
npx strapi help         # also correct
strapi help             # wrong — do not install globally
```

## Prerequisites

| Requirement | Version / notes |
|---|---|
| [Docker Desktop](https://docs.docker.com/get-docker/) | Must be running before any compose command |
| Docker network `kubuntu-net` | External network shared with Traefik; create once if missing |
| Node.js (optional, for host CLI) | 18–24 (project uses 20; container uses 24) |
| Yarn (optional, for host CLI) | 1.x |

### Create the Docker network (first time only)

```bash
docker network create kubuntu-net
```

## Services

| Container | Image | Host port | Purpose |
|---|---|---|---|
| `teamsystem-strapi-db` | `postgres:16.3-alpine3.20` | `5430` → `5432` | PostgreSQL database |
| `teamsystem-strapi-api` | `teamsystem-strapi:dev` | `127.0.0.1:1339` | Strapi API + admin panel |

Compose file: `docker-compose-dev.yml`

## Environment variables

Copy and configure the root `.env` file (not `strapi-api/.env` — that file is empty; the root `.env` is mounted into the container at `/srv/app/.env`).

Key variables:

```dotenv
# Server
PORT=1339
ADMIN_PATH=/kozmoz-panel
STRAPI_ADMIN_BACKEND_URL=https://website-api.teamsystem.local

# Database (container-to-container)
DATABASE_CLIENT=postgres
DATABASE_HOST=teamsystem-strapi-db
DATABASE_PORT=5432
DATABASE_NAME=teamsystem_strapi
DATABASE_USERNAME=teamsystem_strapi
DATABASE_PASSWORD=<your-password>
DATABASE_SSL=false

# Secrets (generate unique values for new environments)
APP_KEYS=<comma-separated-keys>
API_TOKEN_SALT=<salt>
JWT_SECRET=<secret>
ADMIN_JWT_SECRET=<secret>
TRANSFER_TOKEN_SALT=<salt>
```

> **Important:** `DATABASE_SSL=false` for the local Postgres container. Use `true` only for managed databases (e.g. AWS RDS).

## First-time install

From the project root (`mikrogrup-website-backend/`):

```bash
# 1. Ensure Docker is running
docker info

# 2. Configure environment
cp .env-sample .env   # if .env does not exist yet
# Edit .env with your values

# 3. Build images and start services
bash build-dev.sh fresh
```

The `fresh` flag rebuilds images with `--no-cache` and recreates containers. For subsequent starts, omit `fresh`:

```bash
bash build-dev.sh
```

### Verify the installation

```bash
# Health check (expect 204)
curl -sf -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1339/_health

# Admin panel (expect 200)
curl -sf -o /dev/null -w '%{http_code}\n' http://127.0.0.1:1339/kozmoz-panel

# Strapi version inside container
docker exec teamsystem-strapi-api sh -c "cd /srv/app && yarn strapi version"
```

## Access URLs

| Resource | URL |
|---|---|
| API | `http://127.0.0.1:1339/api` |
| Admin panel | `http://127.0.0.1:1339/kozmoz-panel` |
| Health endpoint | `http://127.0.0.1:1339/_health` |
| Traefik (if configured) | `https://website-api.teamsystem.local` |
| Postgres (from host) | `localhost:5430` |

Admin credentials are stored in the root `.env` file (`STTAPI_ADMIN_PASS` and comments at the bottom).

## Strapi CLI usage

All CLI commands are prefixed with the package manager. See [03-Install-Strapi-CLI.md](./03-Install-Strapi-CLI.md) for the full command reference.

### On the host (from `strapi-api/`)

```bash
cd strapi-api
yarn install
yarn strapi version
yarn strapi content-types:list
yarn strapi ts:generate-types
```

### Inside the container (preferred for builds and installs)

`node_modules` is an anonymous volume — run dependency installs and builds **inside** the container:

```bash
docker exec -it teamsystem-strapi-api sh -c "cd /srv/app && yarn install && yarn build"
docker restart teamsystem-strapi-api
```

Common commands:

```bash
# Generate TypeScript types after schema changes
docker exec teamsystem-strapi-api sh -c "cd /srv/app && yarn strapi ts:generate-types"

# Create a new admin user
docker exec -it teamsystem-strapi-api sh -c "cd /srv/app && yarn strapi admin:create-user"

# Open Strapi REPL console
docker exec -it teamsystem-strapi-api sh -c "cd /srv/app && yarn strapi console"
```

## Daily workflow

```bash
# Start / restart all services
bash build-dev.sh

# View API logs
docker logs -f teamsystem-strapi-api

# Restart API only (after code changes)
docker restart teamsystem-strapi-api

# Stop all services
docker compose -f docker-compose-dev.yml down

# Full clean rebuild
bash build-dev.sh fresh
```

### After editing `package.json`

```bash
docker exec -it teamsystem-strapi-api sh -c "cd /srv/app && yarn install && yarn build"
docker restart teamsystem-strapi-api
```

Keep all `@strapi/*` packages pinned to the **same exact version** (currently `5.46.1`).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Docker is not running` | Start Docker Desktop, then re-run `bash build-dev.sh` |
| `network kubuntu-net not found` | `docker network create kubuntu-net` |
| `The server does not support SSL connections` | Set `DATABASE_SSL=false` in root `.env`, rebuild and restart |
| Container `(unhealthy)` but logs say "started successfully" | Strapi 5 returns `204` on `GET /_health`; healthcheck accepts any 2xx |
| `EADDRINUSE` on `/tmp/nitro/worker-*.sock` | `docker exec teamsystem-strapi-api rm /tmp/nitro/worker-*.sock` then restart |
| Service not visible in Traefik | Ensure both Traefik and `teamsystem-strapi-api` share `kubuntu-net`; check `APP_HOST` in `.env` |
| Email test fails with `wrong version number` | SendPulse port `2525` uses STARTTLS — set `SMTP_SECURE=false` |
| Admin panel blank or CORS errors | Verify `STRAPI_ADMIN_BACKEND_URL` matches how you access the API |

## Optional: native host install (without Docker API)

For faster hot-reload during active development, you can run Strapi directly on the host while keeping Postgres in Docker.

1. Start only the database:

   ```bash
   docker compose -f docker-compose-dev.yml up -d teamsystem-strapi-db
   ```

2. Create `strapi-api/.env` pointing to the exposed Postgres port:

   ```dotenv
   HOST=0.0.0.0
   PORT=1339
   DATABASE_CLIENT=postgres
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5430
   DATABASE_NAME=teamsystem_strapi
   DATABASE_USERNAME=teamsystem_strapi
   DATABASE_PASSWORD=<same-as-root-.env>
   DATABASE_SSL=false
   # Copy remaining secrets from root .env
   ```

3. Install and run:

   ```bash
   cd strapi-api
   yarn install
   yarn develop
   ```

> This mode is useful for rapid iteration but is not the default workflow. Production and team conventions use the full Docker setup described above.

## Related docs

- [03-Install-Strapi-CLI.md](./03-Install-Strapi-CLI.md) — Strapi CLI command reference
- [01 CSRF-Protection.md](./01%20CSRF-Protection.md) — CSRF middleware and frontend integration
- [02 Form Validation .md](./02%20Form%20Validation%20.md) — YUP validation for form submissions
- [../CLAUDE.md](../CLAUDE.md) — project conventions and gotchas
- [../README.md](../README.md) — full error reference and deployment notes
