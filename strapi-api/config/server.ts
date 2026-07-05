import cronTasks from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_ADMIN_BACKEND_URL', 'https://leads.mikro.local'),
  proxy: env.bool('IS_PROXIED', true),
  admin: {
    url: env('STRAPI_ADMIN_BACKEND_URL', 'https://leads.mikro.local'),
    host: env('ADMIN_HOST', 'leads.mikro.local'),
    port: env.int('ADMIN_PORT', 1337),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
    tasks: cronTasks,
  },
});
