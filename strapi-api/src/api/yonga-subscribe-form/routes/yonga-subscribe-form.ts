/**
 * yonga-subscribe-form router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::yonga-subscribe-form.yonga-subscribe-form', {
  only: ['create'], // Only allow POST requests, disable GET, PUT, DELETE
  config: {
    create: {
      auth: false,
      policies: [],
      middlewares: [],
    }
  }
});
