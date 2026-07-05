/**
 * global controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // Populate all fields based on schema
    ctx.query = {
      ...ctx.query,
      populate: {
        logo: {
          fields: [
            'name',
            'alternativeText',
            'caption',
            'width',
            'height',
            'ext',
            'mime',
            'size',
            'url',
          ]
        },
        navbar: {
          populate: {
            'menu': {
              populate: '*'
            }
          }
        },

      //   // Localization handling
      //   localizations: {
      //     populate: '*'
      //   }
      }
    };

    // Call the default core action
    const result = await super.find(ctx);
    
    // Handle case where no global data exists
    if (!result) {
      return { data: null };
    }
    
    const { data } = result;
    
    // Remove id and documentId from response
    if (data) {
      const { id, documentId, ...cleanData } = data;
      return { data: cleanData };
    }
    
    return { data };
  },

  async findOne(ctx) {
    // Use same population for single global
    ctx.query = {
      ...ctx.query,
      populate: {
        navbar: {
          populate: {
            '*': {
              populate: '*'
            }
          }
        },
        logo: {
          fields: [
            'name',
            'alternativeText',
            'caption',
            'width',
            'height',
            'ext',
            'mime',
            'size',
            'url',
          ]
        },
        address: {
          populate: '*'
        },
        // Basic fields are automatically included
        title: true,
        description: true,
        keywords: true,
        email: true,
        phone: true,
        twitter: true,
        mapEmbed: true,
        mapLink: true,
        // Localization handling
        // localizations: {
        //   populate: '*'
        // }
      }
    };

    const result = await super.findOne(ctx);
    
    // Handle case where no global data exists
    if (!result) {
      return { data: null };
    }
    
    const { data } = result;
    
    // Remove id and documentId from response
    if (data) {
      const { id, documentId, ...cleanData } = data;
      return { data: cleanData };
    }
    
    return { data };
  }
}));
