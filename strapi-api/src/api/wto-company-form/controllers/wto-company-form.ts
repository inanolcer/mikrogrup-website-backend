/**
 * wto-company-form controller
 */

import { factories } from '@strapi/strapi';
import * as yup from 'yup';
import { getClientIp } from '../../../utils';

// Validation schema for wto company form
const wtoCompanyFormSchema = yup.object().shape({
  company_name: yup.string().required('Company name is required'),
  description: yup.string().optional(),
  services: yup.string().optional(),
  founded_in: yup.string().optional(),
  website_url: yup.string().url('Invalid website URL').optional(),
  logo_url: yup.string().url('Invalid logo URL').optional(),
  contact_person: yup.string().optional(),
  email: yup.string().email('Invalid email').optional(),
  phone: yup.string().optional(),
  mobile: yup.string().optional(),
  region: yup.string().optional(),
  country: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  address: yup.string().optional(),
  zipcode: yup.string().optional(),
  destinations: yup.string().optional(),
  departures: yup.string().optional(),
  facebook_url: yup.string().url('Invalid Facebook URL').optional(),
  twitter_url: yup.string().url('Invalid Twitter URL').optional(),
  instagram_url: yup.string().url('Invalid Instagram URL').optional(),
  youtube_url: yup.string().url('Invalid YouTube URL').optional(),
  linkedin_url: yup.string().url('Invalid LinkedIn URL').optional(),
  backlink_urls: yup.string().optional(),
  notes: yup.string().optional(),
  ip_address: yup.string().optional(),
  syncStatus: yup.string().optional(),
  syncResponse: yup.string().optional(),
  privacy_check: yup.boolean().oneOf([true], 'You must accept the privacy policy').required('Privacy consent is required'),
  campaign_check: yup.boolean().required('Campaign consent is required'),
  // Allow timestamp fields for data import
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
}).noUnknown(false); // Allow extra fields not defined in schema

// Define which fields are allowed in the database
const allowedFields = [
  'company_name',
  'description',
  'services',
  'founded_in',
  'website_url',
  'logo_url',
  'contact_person',
  'email',
  'phone',
  'mobile',
  'region',
  'country',
  'city',
  'state',
  'address',
  'zipcode',
  'destinations',
  'departures',
  'facebook_url',
  'twitter_url',
  'instagram_url',
  'youtube_url',
  'linkedin_url',
  'backlink_urls',
  'notes',
  'ip_address',
  'syncStatus',
  'syncResponse',
  'privacy_check',
  'campaign_check',
];

export default factories.createCoreController('api::wto-company-form.wto-company-form', ({ strapi }) => ({
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
      data.ip_address = ip_address;
      
      // Validate the data using yup schema
      await wtoCompanyFormSchema.validate(data, { abortEarly: false, stripUnknown: false });
      
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
        strapi.log.debug(`[WTO Company Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
      }
      
      let result;
      
      // If createdAt is provided (data import scenario), use Document Service directly
      if (data.createdAt) {
        strapi.log.debug(`[WTO Company Form] Creating entry with custom createdAt: ${data.createdAt}`);
        
        // Use Document Service API directly to preserve createdAt
        result = await strapi.documents('api::wto-company-form.wto-company-form').create({
          data: filteredData,
          // Note: createdAt might need to be handled at database level
        });
        
        // If the above doesn't work, we might need to update the record after creation
        if (result && data.createdAt) {
          try {
            // Update the record to set the custom createdAt value
            await strapi.db.query('api::wto-company-form.wto-company-form').update({
              where: { id: result.id },
              data: { 
                createdAt: new Date(data.createdAt),
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
              }
            });
            strapi.log.debug(`[WTO Company Form] Updated timestamps for entry ${result.id}`);
          } catch (updateError) {
            strapi.log.warn(`[WTO Company Form] Could not update custom timestamps: ${updateError.message}`);
          }
        }
      } else {
        // Normal creation - override the request body with filtered data
        ctx.request.body = { data: filteredData };
        
        // Proceed with creating the entity, validation handled by Strapi
        result = await super.create(ctx);
      }
      
      // Crafting a custom success response
      const response = {
        status: "success",
        message: "Thank you for your submission, we will get back to you soon!",
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
  },
}));
