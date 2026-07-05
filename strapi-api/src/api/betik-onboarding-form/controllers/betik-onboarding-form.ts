/**
 * betik-onboarding-form controller
 */

import { factories } from '@strapi/strapi';
import * as yup from 'yup';
import { getClientIp } from '../../../utils';

const betikOnboardingLinkSchema = yup
  .object()
  .shape({
    title: yup.string().nullable().optional(),
    url: yup.string().nullable().optional(),
  })
  .noUnknown(false);

const betikOnboardingFormSchema = yup.object().shape({
  contact_name: yup.string().required('Contact name is required'),
  contact_surname: yup.string().required('Contact surname is required'),
  contact_email: yup.string().email('Invalid contact email').required('Contact email is required'),
  contact_gsm: yup.string().required('Contact GSM is required'),
  profile_description: yup.string().optional(),
  footer_description: yup.string().optional(),
  domain: yup.string().optional(),
  logo_url: yup.string().optional(),
  profile_name: yup.string().required('Profile name is required'),
  profile_phone: yup.string().optional(),
  profile_gsm: yup.string().optional(),
  profile_email: yup.string().email('Invalid profile email').optional(),
  profile_whatsapp: yup.string().optional(),
  map_url: yup.string().optional(),
  country: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  address: yup.string().optional(),
  zipcode: yup.string().optional(),
  profile_picture_url: yup.string().optional(),
  profile_subtitle: yup.string().optional(),
  links: yup.array().of(betikOnboardingLinkSchema).optional().nullable(),
  social_links: yup.array().of(betikOnboardingLinkSchema).optional().nullable(),
  notes: yup.string().optional(),
  ip_address: yup.string().optional(),
  syncStatus: yup.string().optional(),
  syncResponse: yup.string().optional(),
  privacy_check: yup.boolean().oneOf([true], 'You must accept the privacy policy').required('Privacy consent is required'),
  campaign_check: yup.boolean().optional(),
  is_domain_owner: yup.boolean().optional(),
  template_id: yup.string().optional(),
  maintenance_check: yup.boolean().optional(),
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
}).noUnknown(false);

const allowedFields = [
  'contact_name',
  'contact_surname',
  'contact_email',
  'contact_gsm',
  'profile_description',
  'footer_description',
  'domain',
  'logo_url',
  'profile_name',
  'profile_phone',
  'profile_gsm',
  'profile_email',
  'profile_whatsapp',
  'map_url',
  'working_hours',
  'country',
  'city',
  'state',
  'address',
  'zipcode',
  'profile_picture_url',
  'profile_subtitle',
  'links',
  'social_links',
  'notes',
  'ip_address',
  'syncStatus',
  'syncResponse',
  'privacy_check',
  'campaign_check',
  'is_domain_owner',
  'template_id',
  'maintenance_check',
];

export default factories.createCoreController('api::betik-onboarding-form.betik-onboarding-form', ({ strapi }) => ({
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

      await betikOnboardingFormSchema.validate(data, { abortEarly: false, stripUnknown: false });

      const filteredData: any = Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {} as any);

      const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        strapi.log.debug(`[Betik Onboarding Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
      }

      let result;

      if (data.createdAt) {
        strapi.log.debug(`[Betik Onboarding Form] Creating entry with custom createdAt: ${data.createdAt}`);

        result = await strapi.documents('api::betik-onboarding-form.betik-onboarding-form').create({
          data: filteredData,
        });

        if (result && data.createdAt) {
          try {
            await strapi.db.query('api::betik-onboarding-form.betik-onboarding-form').update({
              where: { id: result.id },
              data: {
                createdAt: new Date(data.createdAt),
                updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
              }
            });
            strapi.log.debug(`[Betik Onboarding Form] Updated timestamps for entry ${result.id}`);
          } catch (updateError) {
            strapi.log.warn(`[Betik Onboarding Form] Could not update custom timestamps: ${updateError.message}`);
          }
        }
      } else {
        ctx.request.body = { data: filteredData };

        result = await super.create(ctx);
      }

      const response = {
        status: "success",
        message: "Thank you for your submission, we will get back to you soon!",
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
