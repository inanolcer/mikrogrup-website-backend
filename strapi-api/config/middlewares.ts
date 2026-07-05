export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:', 'http:'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'font-src': ["'self'", 'data:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'frame-src': ["'self'"],
        },
      },
      xssFilter: true,
      noSniff: true,
      frameguard: {
        action: 'sameorigin',
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // Allow both your production domain and localhost for testing
      origin: [
        // Kozmoz Sites
        'https://kozmoz.io',
         'https://samplr.io',
         'https://lead.samplr.io',
         'https://yonga.io',
         'https://printsgram.com',
         'https://betik.ai',
         'https://worldtouroperators.com',
         // Local Sites
         'http://dev.betik.local',
         'http://web.kozmoz.local',
         'http://preview.kozmoz.local',
         'http://kirbycms.kozmoz.local',
         'https://dev.wto.local',
         'https://dev.printsgram.local'
        ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-CSRF-Token'],
      keepHeaderOnError: true,
      credentials: true,  // Critical for cross-origin cookies
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::csrf',
    config: {},
    resolve: './src/middlewares/csrf'
  },
];
