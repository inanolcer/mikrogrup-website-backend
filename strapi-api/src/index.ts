// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Add a health check endpoint for Kubernetes
    strapi.server.routes([
      {
        method: 'GET',
        path: '/_health',
        handler: (ctx) => {
          try {
            // Check for database connection
            const dbConnection = strapi.db?.connection;
            const dbIsConnected = !!dbConnection;
            
            if (dbIsConnected) {
              ctx.status = 200;
              ctx.body = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                services: {
                  database: 'up',
                  server: 'up'
                }
              };
            } else {
              console.error('Health check failed: Database connection is not established');
              ctx.status = 503;
              ctx.body = {
                status: 'error',
                timestamp: new Date().toISOString(),
                services: {
                  database: 'down',
                  server: 'up'
                },
                message: 'Database connection not established'
              };
            }
          } catch (error) {
            console.error('Health check error:', error);
            ctx.status = 500;
            ctx.body = {
              status: 'error',
              timestamp: new Date().toISOString(),
              message: 'Internal server error during health check'
            };
          }
        },
        config: {
          auth: false,
        },
      },
    ]);
  },
};
