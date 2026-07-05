interface EmailConfig {
  provider: string;
  providerOptions: {
    // SendGrid configuration
    apiKey?: string;
    // Nodemailer/SMTP configuration (for backward compatibility)
    host?: string;
    port?: number;
    secure?: boolean;
    requireTLS?: boolean;
    secureConnection?: boolean;
    tls?: {
      ciphers?: string;
      rejectUnauthorized?: boolean;
    };
    auth?: {
      user?: string;
      pass?: string;
    };
    // Amazon SES configuration
    key?: string;
    secret?: string;
    amazon?: string;
    // Additional provider options can be added here
  };
  settings: {
    defaultFrom: string;
    defaultReplyTo: string;
  };
}

interface DocumentationConfig {
  enabled: boolean;
  config: {
    openapi: string;
    info: {
      version: string;
      title: string;
      description: string;
      contact: {
        name: string;
        email: string;
      };
      license: {
        name: string;
        url: string;
      };
    };
    servers: Array<{
      url: string;
      description: string;
    }>;
    tags: Array<{
      name: string;
      description: string;
    }>;
  };
}

interface PluginConfig {
  email: {
    config: EmailConfig;
  };
  documentation: DocumentationConfig;
}

export default ({ env }): PluginConfig => ({
  
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        apiKey: env('SMTP_API_KEY'),
        host: env('SMTP_HOST'),
        port: env.int('SMTP_PORT', 2525),
        // Port 2525/587 use STARTTLS; only port 465 uses implicit SSL (secure: true)
        secure: env.bool('SMTP_SECURE', false),
        requireTLS: env.bool('SMTP_REQUIRE_TLS', true),
        auth: {
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
        tls: {
          rejectUnauthorized: env.bool('SMTP_TLS_REJECT_UNAUTHORIZED', true),
        },
      },
      settings: {
        defaultFrom: env('SYS_MAIL_FROM'),
        defaultReplyTo: env('SYS_MAIL_REPLY_TO'),
      },
    },
  },
  
  /*
  email: {
  config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('SYS_MAIL_FROM'),
        defaultReplyTo: env('SYS_MAIL_REPLY_TO'),
      },
    },  
}*/


  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.68',
        title: 'Leads Management API',
        description: 'API documentation Leads Management System',
        contact: {
          name: 'API Support',
          email: env('SYS_MAIL_FROM', 'hello@kozmoz.io'),
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: env('STRAPI_ADMIN_BACKEND_URL', 'http://localhost:1337'),
          description: 'Development server',
        },
      ],
      tags: [
        
      ],
    },
  },
});
