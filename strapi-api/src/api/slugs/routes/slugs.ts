export default {
  routes: [
    {
      method: 'GET',
      path: '/slugs',
      handler: 'slugs.find',
      config: {
        policies: [],
        middlewares: [],
        description: 'Route registry: enumerate CMS-routed content for build-time route discovery',
        tag: {
          plugin: 'slugs',
          name: 'Slugs',
          actionType: 'find'
        }
      },
    },
  ],
};
