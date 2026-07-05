/**
 * redirect router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/redirects',
      handler: 'redirect.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/redirects/match',
      handler: 'redirect.findMatch',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/redirects/:id',
      handler: 'redirect.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/redirects',
      handler: 'redirect.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/redirects/:id',
      handler: 'redirect.update',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/redirects/:id',
      handler: 'redirect.delete',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

