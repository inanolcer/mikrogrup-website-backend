/**
 * notification controller — public find hides entries outside start/end window.
 */

import { factories } from '@strapi/strapi';

const isActiveNow = (data: { startDate?: string | null; endDate?: string | null }) => {
  if (!data) return false
  const now = Date.now()
  if (data.startDate && new Date(data.startDate).getTime() > now) return false
  if (data.endDate && new Date(data.endDate).getTime() < now) return false
  return true
}

export default factories.createCoreController('api::notification.notification', () => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx)
    if (!data || !isActiveNow(data)) {
      return { data: null, meta }
    }
    return { data, meta }
  },
}));
