# Docker Environment for Strapi v5.0.1 with Postgres DB

This is a Leads Management System built on Strapi 5.0.1 for Mikrogrup/Zirve Yazılım, designed to handle form submissions from various websites and integrate them with Salesforce CRM.

## Tech Stack

- Backend: Strapi 5.0.1 (Node.js 20, TypeScript)
- Database: PostgreSQL 16.3-alpine3.20
- Proxy: NGINX
- Deployment: Docker with Docker Compose
- Validation: YUP schema validation
- Integration: Salesforce API with OAuth authentication
- Postgres:16.3-alpine3.20

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Services

- `db`: Postgres database service.
- `nginx`: NGINX Proxy Server
- `strapi-api`: Strapi API 

## Getting Started

1. Clone this repository:

    ~~~bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ~~~

2. Create a `.env` file with the required environment variables:

    ~~~dotenv
    DATABASE_NAME=your_db_name
    NAMESPACE=your_project_name
    ~~~

3. Run the `build-dev.sh` script to build the Docker images:

~~~bash
bash build-dev.sh
~~~
Use the `fresh` parameter to build from scratch:

~~~bash
bash build-dev.sh
bash build-dev.sh fresh
~~~

4. Use `docker-compose` to build and start the Docker containers:

    ~~~bash
    docker-compose -f docker-compose.yml build
    docker-compose -f docker-compose.yml up -d
    ~~~

## Configuration

- **.env-sample**: Rename this file to `.env` and save it in the project root.
- **Nginx Configuration**: Customize the Nginx configuration by modifying `./docker/nginx-dev.conf`.
- **Dockerfile**: Customize your hosting environment config and defaults.
- **docker-compose.yml**: Define, configure, and run multi-container Docker applications. The `volumes` section maps directories on your host to directories in your Docker containers:

    ~~~yaml
    volumes:
      - 
      
    ~~~

## Networks

- `kozmoz-net`: This is a custom network created for the services in this Docker Compose configuration. It uses the `bridge` driver, which is the default network driver for Docker. If you connect any services to this network, they will be able to communicate with each other.

## Errors

 - listen EADDRINUSE: address already in use /tmp/nitro/worker-39-1.sock
  - Login to container and :  
      rm /tmp/nitro/worker-39-1.sock

 - `The server does not support SSL connections` (Strapi fails on startup)
  - Docker Compose uses a local Postgres container without SSL. Set `DATABASE_SSL=false` in the root `.env` file, rebuild the image, and restart: `docker compose -f docker-compose-prod.yml up -d --build`
  - Use `DATABASE_SSL=true` only when connecting to a managed database that requires SSL (e.g. AWS RDS), as in `Docs/values-prod.yaml`

 - Container shows `(unhealthy)` but Strapi logs say "started successfully"
  - Strapi 5 returns `204` on `GET /_health`; the Docker healthcheck must accept any 2xx response, not only `200`
  - Pull latest changes and recreate: `docker compose -f docker-compose-prod.yml up -d --force-recreate lead-samplr-api`
  - Verify from the host: `curl -sf -o /dev/null -w '%{http_code}\n' http://127.0.0.1:${PORT}/_health` (expect `204`)

 - Service not visible in Traefik
  - Both Traefik and `lead-samplr-api` must share the external network `kubuntu-net`
  - Ensure `.env` has `APP_HOST=lead.samplr.io` and `APP_DOMAIN=lead.samplr.io` (or your real domain)
  - Recreate after label fixes: `docker compose -f docker-compose-prod.yml up -d --force-recreate lead-samplr-api`
  - If TLS cert resolver name differs on your Traefik stack, adjust `traefik.http.routers.leadsamplr.tls.certresolver` in `docker-compose-prod.yml`

 - Email test fails with `SSL routines:tls_validate_record_header:wrong version number`
  - SendPulse port `2525` uses STARTTLS, not implicit SSL. Set `SMTP_SECURE=false` in `.env`
  - Use `SMTP_SECURE=true` only for port `465`. Then rebuild and restart the API container

 - CSRF fails behind Traefik with `Cannot send secure cookie over unencrypted connection`
  - Strapi must trust the proxy: `IS_PROXIED=true` in production `.env` / docker-compose
  - Traefik must send `X-Forwarded-Proto: https` to the container
  - Cross-origin forms (e.g. worldtouroperators.com → lead.samplr.io) use `X-CSRF-Token` header; add new frontend domains to `strapi-api/config/csrf-trusted-origins.ts`


## API Endpoints
 ### Forms 
  - http://leads.mikro.local/api/contact-forms
  - http://leads.mikro.local/api/subsribe-forms

## DEPLOYMENT

### Create Deploy Keys on Ubuntu server and use Bitbucket workflows for automatic deploys

 - Create ssh key on your server 
    ssh-keygen -t ed25519 -C "hello@mikro.local" 
 
 -  Create a deploy key with your public keys
    https://github.com/inanolcer/leads-mikro/settings/keys

 - Add secrets to Actions 
    SSH_USER
    SSH_PRIVATE_KEY
    https://github.com/inanolcer/leads-mikro/settings/secrets/actions

 - From your local machine, try using the same SSH key to connect to your server to verify it works. For example:
   ssh -i /path/to/private/key hello@111.222.333.444


 ####  Server SSH Config 
~~~bash
    Host bitbucket.org
    AddKeysToAgent yes
    IdentityFile ~/.ssh/kozmoz_ubuntu_bitbucket

    Host github.com
    AddKeysToAgent yes
    IdentityFile ~/.ssh/kozmoz_ubuntu_github

    Host github.com-kozmoz-strapi-api
    AddKeysToAgent yes
    Hostname github.com
    IdentityFile ~/.ssh/kozmoz_github_deploy

~~~


### strapi.samplr.io API Token
 - Generate from Strapi Settings > API Tokens
strapi.samplr.io: xxxxxxxxx

### leads.mikro.local :
 - Generate from Strapi Settings > API Tokens xxxxxxxxxx


### Pull DB from Production

~~~bash
    rsync -avzhp  --log-file=./devops/progress.txt kozmoz@178.210.181.105:~/web/strapi.samplr.io/kozmoz-strapi-api/backup/db ./backup/db/
~~~

~~~bash
docker context create kozmoz-ubuntu \
  --description "Kozmoz Ubuntu Server" \
  --docker "host=ssh://kozmoz@178.210.181.105:22?identityfile=~/.ssh/kozmoz_ubuntu_loop"
    
docker context use kubuntu
docker context rm kozmoz-ubuntu

~~~

inan@kozmoz.io
koz4LeadsPower+