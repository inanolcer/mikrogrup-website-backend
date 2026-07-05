/**
 * redirect controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import * as yup from 'yup';

// Validation schema for redirect
const redirectSchema = yup.object().shape({
  source: yup.string().required('Source URL is required'),
  target: yup.string().required('Target URL is required'),
  type: yup.string().oneOf(['301', '302'], 'Redirect type must be 301 or 302').required(),
  isActive: yup.boolean().default(true)
});

export default factories.createCoreController('api::redirect.redirect', ({ strapi }) => ({
  async find(ctx: Context) {
    try {
      // Sanitize query parameters
      const sanitizedQuery = await this.sanitizeQuery(ctx);
      
      const { domain } = ctx.query;
      
      // If domain filter is provided, add it to the sanitized query
      if (domain) {
        const existingFilters = sanitizedQuery.filters && typeof sanitizedQuery.filters === 'object' 
          ? sanitizedQuery.filters 
          : {};
        
        sanitizedQuery.filters = {
          ...existingFilters,
          domain: {
            $eq: domain
          }
        };
      }
      
      // Fetch entities with sanitized query
      const { results, pagination } = await strapi.service('api::redirect.redirect').find(sanitizedQuery);
      
      // Sanitize output
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      
      return this.transformResponse(sanitizedResults, { pagination });
    } catch (error) {
      ctx.response.status = 500;
      return {
        success: false,
        message: "Error fetching redirects",
        timestamp: new Date().toISOString(),
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Internal server error',
          details: error.message
        }
      };
    }
  },

  async create(ctx: Context) {
    try {
      const { data } = ctx.request.body || {};
      
      // Validate the data
      await redirectSchema.validate(data, { abortEarly: false });
      
      // Create the redirect entry
      await super.create(ctx);
      
      return {
        success: true,
        message: "Redirect rule created successfully",
        timestamp: new Date().toISOString(),
        type: "redirect-rule"
      };
    } catch (error) {
      ctx.response.status = 400;
      return {
        success: false,
        message: "Failed to create redirect rule",
        timestamp: new Date().toISOString(),
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Validation failed',
          details: error.errors || [error.message]
        }
      };
    }
  },

  // Custom method to handle redirect lookup
  async findMatch(ctx: Context) {
    try {
      const { url } = ctx.query;

      if (!url) {
        ctx.response.status = 400;
        return {
          success: false,
          message: "URL parameter is required",
          timestamp: new Date().toISOString()
        };
      }

      // Find matching redirect rule
      const redirect = await strapi.db.query('api::redirect.redirect').findOne({
        where: {
          source: url,
          isActive: true
        }
      });

      if (!redirect) {
        ctx.response.status = 404;
        return {
          success: false,
          message: "No redirect rule found",
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        message: "Redirect rule found",
        timestamp: new Date().toISOString(),
        data: {
          target: redirect.target,
          type: redirect.type
        }
      };
    } catch (error) {
      ctx.response.status = 500;
      return {
        success: false,
        message: "Error processing redirect",
        timestamp: new Date().toISOString(),
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Internal server error',
          details: error.message
        }
      };
    }
  },

  // Method to update redirect rule
  async update(ctx: Context) {
    try {
      const { data } = ctx.request.body || {};
      
      // Validate the update data
      await redirectSchema.validate(data, { abortEarly: false });
      
      // Update the redirect entry
      await super.update(ctx);
      
      return {
        success: true,
        message: "Redirect rule updated successfully",
        timestamp: new Date().toISOString(),
        type: "redirect-rule"
      };
    } catch (error) {
      ctx.response.status = 400;
      return {
        success: false,
        message: "Failed to update redirect rule",
        timestamp: new Date().toISOString(),
        error: {
          status: 400,
          name: 'ValidationError',
          message: 'Validation failed',
          details: error.errors || [error.message]
        }
      };
    }
  },

  // Method to delete redirect rule
  async delete(ctx: Context) {
    try {
      // Delete the redirect entry
      await super.delete(ctx);
      
      return {
        success: true,
        message: "Redirect rule deleted successfully",
        timestamp: new Date().toISOString(),
        type: "redirect-rule"
      };
    } catch (error) {
      ctx.response.status = 400;
      return {
        success: false,
        message: "Failed to delete redirect rule",
        timestamp: new Date().toISOString(),
        error: {
          status: 400,
          name: 'DeletionError',
          message: 'Failed to delete redirect rule',
          details: error.message
        }
      };
    }
  }
})); 