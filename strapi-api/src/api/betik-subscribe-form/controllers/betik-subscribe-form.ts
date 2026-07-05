/**
 * betik-subscribe-form controller
 */

import { factories } from '@strapi/strapi';
import * as yup from 'yup';
import { getClientIp } from '../../../utils';

const betikSubscribeFormSchema = yup.object().shape({
  fullname: yup.string().optional(),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().optional(),
  ip_address: yup.string().optional(),
  privacy_check: yup.boolean().oneOf([true], 'You must accept the privacy policy').required('Privacy consent is required'),
  campaign_check: yup.boolean().required('Campaign consent is required'),
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
}).noUnknown(false);

const allowedFields = [
  'fullname',
  'email',
  'phone',
  'ip_address',
  'privacy_check',
  'campaign_check',
];

export default factories.createCoreController('api::betik-subscribe-form.betik-subscribe-form', ({ strapi }) => ({
  async create(ctx: any) {
    console.log("Incoming request body:", ctx.request.body);

    if (!ctx.request.body || !ctx.request.body.data) {
      const response = {
        status: "failed",
        message: "Request body is missing the 'data' payload.",
      };
      return ctx.send(response, 400);
    }

    try {
      const { data } = ctx.request.body;

      const ip_address = getClientIp(ctx) ?? 'unknown';
      data.ip_address = ip_address;

      await betikSubscribeFormSchema.validate(data, { abortEarly: false, stripUnknown: false });

      const filteredData: any = Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {} as any);

      const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        strapi.log.debug(`[Betik Subscribe Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
      }

      let result;

      if (data.createdAt) {
        strapi.log.debug(`[Betik Subscribe Form] Creating entry with custom createdAt: ${data.createdAt}`);

        result = await strapi.documents('api::betik-subscribe-form.betik-subscribe-form').create({
          data: filteredData,
        });

        if (result && data.createdAt) {
          try {
            await strapi.db.query('api::betik-subscribe-form.betik-subscribe-form').update({
              where: { id: result.id },
              data: {
                createdAt: new Date(data.createdAt),
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
              }
            });
            strapi.log.debug(`[Betik Subscribe Form] Updated timestamps for entry ${result.id}`);
          } catch (updateError) {
            strapi.log.warn(`[Betik Subscribe Form] Could not update custom timestamps: ${updateError.message}`);
          }
        }
      } else {
        ctx.request.body = { data: filteredData };

        result = await super.create(ctx);
      }

      const response = {
        status: "success",
        message: "Thank you for subscribing, we will keep you updated!",
      };

      ctx.send(response);

    } catch (err: any) {
      console.log("   Error : ", err);

      if (err.name === 'ValidationError') {
        const response = {
          status: "failed",
          message: "Validation failed!",
          data: err.errors.map((errorMessage: string) => ({
            message: errorMessage
          }))
        };
        return ctx.send(response, 400);
      }

      console.error('Error details:', err);

      const response = {
        status: "failed",
        message: "Form submission failed!",
        data: []
      };
      ctx.send(response, 400);
    }
  },
}));
