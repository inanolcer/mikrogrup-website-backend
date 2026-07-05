/**
 * kozmoz-contact-form controller
 */

import { factories } from '@strapi/strapi';
import * as yup from 'yup';

// Validation schema for contact form
const contactFormSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  fullname: yup.string().required('Full name is required'),
  phone: yup.string().optional(),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
  privacy_consent: yup.boolean().oneOf([true], 'You must accept the privacy policy').required('Privacy consent is required'),
  campaign_consent: yup.boolean().required('Campaign consent is required'),
  // Allow timestamp fields for data import
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
}).noUnknown(false); // Allow extra fields not defined in schema

// Define which fields are allowed in the database
const allowedFields = [
  'email',
  'fullname',
  'phone',
  'subject',
  'message',
  'privacy_consent',
  'campaign_consent',
  'createdAt',
  'updatedAt',
];

export default factories.createCoreController('api::kozmoz-contact-form.kozmoz-contact-form', ({ strapi }) => ({
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
            
            // Validate the data using yup schema
            await contactFormSchema.validate(data, { abortEarly: false, stripUnknown: false });
            
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
                strapi.log.debug(`[Contact Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
            }
            
            let result;
            
            // If createdAt is provided (data import scenario), use Document Service directly
            if (data.createdAt) {
                strapi.log.debug(`[Contact Form] Creating entry with custom createdAt: ${data.createdAt}`);
                
                // Use Document Service API directly to preserve createdAt
                result = await strapi.documents('api::kozmoz-contact-form.kozmoz-contact-form').create({
                    data: filteredData,
                    // Note: createdAt might need to be handled at database level
                });
                
                // If the above doesn't work, we might need to update the record after creation
                if (result && data.createdAt) {
                    try {
                        // Update the record to set the custom createdAt value
                        await strapi.db.query('api::kozmoz-contact-form.kozmoz-contact-form').update({
                            where: { id: result.id },
                            data: { 
                                createdAt: new Date(data.createdAt),
                                updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
                            }
                        });
                        strapi.log.debug(`[Contact Form] Updated timestamps for entry ${result.id}`);
                    } catch (updateError) {
                        strapi.log.warn(`[Contact Form] Could not update custom timestamps: ${updateError.message}`);
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

            // use strapi email plugin to send email
            const emailService = strapi.plugins.email.services.email;
            const mailObj = {
                email: result.data.email,
                fullname: result.data.fullname,
                phone: result.data.phone,
                subject: result.data.subject,
                message: result.data.message,
                privacy_consent: result.data.privacy_consent,
                campaign_consent: result.data.campaign_consent,
                mailTo: process.env.SYS_MAIL_TO,
                mailFrom: process.env.SYS_MAIL_FROM
            };
            
            // Send email to end user
            try {
                // Send email to sys admin
                const mailResponse = await emailService.send({
                    to: mailObj.mailTo,
                    from: mailObj.mailFrom,
                    replyTo: mailObj.email,
                    subject: 'New contact submission received!',
                    text: `Dear Admin,\n\nA new submission has been received!\n\nName: ${mailObj.fullname}\n\nEmail: ${mailObj.email}\n\nPhone: ${mailObj.phone || 'Not provided'}\n\nSubject: ${mailObj.subject}\nMessage: ${mailObj.message}\n\nPrivacy Consent: ${mailObj.privacy_consent}\nCampaign Consent: ${mailObj.campaign_consent}\n\nBest Regards,\nYour Company`
                });

                console.log("Email Response : ", mailResponse);
            } catch (emailError) {
                console.error("Failed to send email to sys admin: ", emailError);
            }
            
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