// import type { Core } from '@strapi/strapi';

const NOTIFICATION_UID = 'api::notification.notification'
const PUBLIC_FIND = 'api::notification.notification.find'

const ensurePublicNotificationFind = async (strapi) => {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  })
  if (!publicRole) return

  const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
    where: { action: PUBLIC_FIND, role: publicRole.id },
  })
  if (existing) return

  await strapi.db.query('plugin::users-permissions.permission').create({
    data: {
      action: PUBLIC_FIND,
      role: publicRole.id,
    },
  })
  strapi.log.info(`Granted Public role permission: ${PUBLIC_FIND}`)
}

const seedNotificationIfEmpty = async (strapi) => {
  const docs = strapi.documents(NOTIFICATION_UID)

  const tr = await docs.findFirst({ locale: 'tr', status: 'published' })
  if (!tr) {
    await docs.create({
      data: {
        text: "TeamSystem, Türkiye'deki konumunu güçlendiriyor",
        buttonTarget: '_self',
      },
      locale: 'tr',
      status: 'published',
    })
    strapi.log.info('Seeded Notification (tr)')
  }

  const en = await docs.findFirst({ locale: 'en', status: 'published' })
  if (!en) {
    await docs.create({
      data: {
        text: 'TeamSystem is strengthening its position in Türkiye',
        buttonTarget: '_self',
      },
      locale: 'en',
      status: 'published',
    })
    strapi.log.info('Seeded Notification (en)')
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }) {
    strapi.server.routes([
      {
        method: 'GET',
        path: '/_health',
        handler: (ctx) => {
          try {
            const dbConnection = strapi.db?.connection
            const dbIsConnected = !!dbConnection

            if (dbIsConnected) {
              ctx.status = 200
              ctx.body = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                services: {
                  database: 'up',
                  server: 'up',
                },
              }
            } else {
              console.error('Health check failed: Database connection is not established')
              ctx.status = 503
              ctx.body = {
                status: 'error',
                timestamp: new Date().toISOString(),
                services: {
                  database: 'down',
                  server: 'up',
                },
                message: 'Database connection not established',
              }
            }
          } catch (error) {
            console.error('Health check error:', error)
            ctx.status = 500
            ctx.body = {
              status: 'error',
              timestamp: new Date().toISOString(),
              message: 'Internal server error during health check',
            }
          }
        },
        config: {
          auth: false,
        },
      },
    ])

    try {
      await ensurePublicNotificationFind(strapi)
      await seedNotificationIfEmpty(strapi)
    } catch (error) {
      strapi.log.warn(`Notification bootstrap skipped: ${error?.message || error}`)
    }
  },
}
