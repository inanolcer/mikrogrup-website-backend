export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    cookie: {
      // IMPORTANT: match your custom admin path, not the default '/admin'
      path: '/kozmoz-panel',
      sameSite: 'lax',
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  url: '/kozmoz-panel',
  port: 80,
  host: env('STRAPI_ADMIN_BACKEND_URL', '0.0.0.0'),


});
