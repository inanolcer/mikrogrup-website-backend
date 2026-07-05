/**
 * yonga-subscribe-form controller
 */

import { factories } from '@strapi/strapi';
import * as yup from 'yup';
import { getClientIp } from '../../../utils';

// Validation schema - only validate required/important fields, allow extra fields
const subscribeFormSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  name: yup.string().optional(),
  gsm: yup.string().optional(),
  privacy_check: yup.boolean().required('Privacy check is required'),
  campaign_check: yup.boolean().optional(),
  ip_address: yup.string().optional(),
  // Allow timestamp fields for data import
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
}).noUnknown(false); // Allow extra fields not defined in schema

// Define which fields are allowed in the database
const allowedFields = [
  'email',
  'name',
  'gsm',
  'privacy_check',
  'campaign_check',
  'ip_address',
  'createdAt',
  'updatedAt',
];

export default factories.createCoreController('api::yonga-subscribe-form.yonga-subscribe-form', ({ strapi }) => ({

  async create(ctx: any) {
    console.log("Incoming request body:", ctx.request.body);

    // Preliminary check for the presence of the "data" payload
    if (!ctx.request.body || !ctx.request.body.data) {
      const response = {
        status: "failed",
        message: "Request body is missing the 'data' payload.",
      };
      return ctx.send(response, 400); // Return a 400 Bad Request status
    }

    try {
      // Get request body data
      const { data } = ctx.request.body;
      
      // Get IP address from request context (handles reverse proxies)
      const ip_address = getClientIp(ctx) ?? 'unknown';

      // Add ip_address to the data
      data.ip_address = data.ip_address || ip_address;

      // Validate the data (allows extra fields)
      await subscribeFormSchema.validate(data, { abortEarly: false, stripUnknown: false });
      
      // Filter data to only include fields that exist in the database schema
      const filteredData: any = Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {} as any);
      
      // Log extra fields for debugging (optional)
      const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        strapi.log.debug(`[Subscribe Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
      }
      
      let result;
      
      // If createdAt is provided (data import scenario), use Document Service directly
      if (data.createdAt) {
        strapi.log.debug(`[Subscribe Form] Creating entry with custom createdAt: ${data.createdAt}`);
        
        // Use Document Service API directly to preserve createdAt
        result = await strapi.documents('api::yonga-subscribe-form.yonga-subscribe-form').create({
          data: filteredData,
          // Note: createdAt might need to be handled at database level
        });
        
        // If the above doesn't work, we might need to update the record after creation
        if (result && data.createdAt) {
          try {
            // Update the record to set the custom createdAt value
            await strapi.db.query('api::yonga-subscribe-form.yonga-subscribe-form').update({
              where: { id: result.id },
              data: { 
                createdAt: new Date(data.createdAt),
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
              }
            });
            strapi.log.debug(`[Subscribe Form] Updated timestamps for entry ${result.id}`);
          } catch (updateError) {
            strapi.log.warn(`[Subscribe Form] Could not update custom timestamps: ${updateError.message}`);
          }
        }
      } else {
        // Normal creation - override the request body with filtered data
        ctx.request.body = { data: filteredData };
        
        // Create the entry using the parent controller
        result = await super.create(ctx);
      }
      
      // Crafting a custom success response
      const response = {
        status: "success",
        message: "Thank you for subscribing, we will keep you updated!",
      };
      
      // Returning the custom success response
      ctx.send(response);

    } catch (err: any) {
      console.log("   Error : ", err);
      
      // Check if it's a yup validation error
      if (err.name === 'ValidationError') {
        // Returning yup validation error response
        const response = {
          status: "failed",
          message: "Validation failed!",
          data: err.errors.map((errorMessage: string) => ({
            message: errorMessage
          }))
        };
        return ctx.send(response, 400);
      }
      
      // Logging the error details for debugging
      console.error('Error details:', err);

      // Returning a generic error response
      const response = {
        status: "failed",
        message: "Form submission failed!",
        data: []
      };
      ctx.send(response, 400);
    }
  }
}));
