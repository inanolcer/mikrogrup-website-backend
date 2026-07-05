export default {
  routes: [
    {
      method: 'GET',
      path: '/csrf-token',
      handler: 'csrf-token.getCsrfToken',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
        description: 'Get a CSRF token for form submissions',
        tag: {
          plugin: 'csrf-token',
          name: 'CSRF Token',
          actionType: 'find'
        }
      },
    },
  ],
}; 