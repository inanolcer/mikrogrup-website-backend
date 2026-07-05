/**
 * Origins allowed to submit CSRF-protected API requests with header-only tokens
 * (cross-origin forms where the csrf_token cookie may not be sent).
 * Keep in sync with allowed CORS origins in config/middlewares.ts.
 */
export default [
  'https://kozmoz.io',
  'https://samplr.io',
  'https://yonga.io',
  'https://printsgram.com',
  'https://betik.ai',
  'https://worldtouroperators.com',
  'https://lead.samplr.io',
  'http://leads.mikro.local',
  'http://web.zirveyazilim.local',
  'http://dev.betik.local',
  'http://web.kozmoz.local',
  'http://preview.kozmoz.local',
  'http://kirbycms.kozmoz.local',
  'https://dev.wto.local',
  'https://dev.printsgram.local',
];
