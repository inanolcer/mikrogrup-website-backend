/**
 * CSRF token controller
 */

// Add type declaration for strapi global
declare const strapi: any;

declare const require: any;

const isLocalHost = (origin: string, referer: string, host: string): boolean =>
  [origin, referer, host].some((value) =>
    /localhost|127\.0\.0\.1|leads\.mikro\.local|lead\.samplr\.local/.test(value)
  );

/** Detect HTTPS using proxy headers only (Traefik terminates TLS upstream). */
const isSecureRequest = (ctx: any): boolean => {
  const forwardedProto = ctx.request.header['x-forwarded-proto'];
  const proto =
    typeof forwardedProto === 'string'
      ? forwardedProto.split(',')[0].trim()
      : forwardedProto;

  return (
    ctx.request.secure === true ||
    ctx.request.protocol === 'https' ||
    proto === 'https'
  );
};

export default {
  /**
   * Generate a CSRF token and store it in a cookie
   * @param {object} ctx - Koa context
   * @returns {object} - The CSRF token
   */
  async getCsrfToken(ctx) {
    try {
      // Generate CSRF token using simple approach that works in all environments
      let csrfToken: string;
      
      try {
        // Try to use Node.js crypto module
        const crypto = require('crypto');
        csrfToken = crypto.randomBytes(32).toString('hex');
      } catch (cryptoError) {
        // Fallback to Math.random-based token generation
        strapi.log.warn('Crypto module not available, using fallback token generation');
        csrfToken = Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
      }
      
      const userId = ctx.state.user?.id || 'anonymous';
      
      try {
        // Store token with expiry in server memory
        // Check if the service exists before calling it
        const csrfService = strapi.service('plugin::users-permissions.csrf');
        if (csrfService && typeof csrfService.storeToken === 'function') {
          await csrfService.storeToken(
            userId, 
            csrfToken,
            Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiry
          );
        } else {
          strapi.log.debug('CSRF service not found or storeToken method not available');
        }
      } catch (error: any) {
        // Log the error but continue - the double submit cookie pattern still works
        // even without server-side validation
        strapi.log.error('Failed to store CSRF token:', error);
      }
      
      // Detect request origin to determine cookie settings
      const origin = ctx.request.header.origin || '';
      const referer = ctx.request.header.referer || '';
      const host = ctx.request.header.host || '';
      const isHttps = isSecureRequest(ctx);
      const isLocalhost = isLocalHost(origin, referer, host);

      strapi.log.debug(`[CSRF] Generate token request headers: ${JSON.stringify(ctx.request.header)}`);
      strapi.log.debug(
        `[CSRF] Generate token for origin: ${origin}, referer: ${referer}, protocol: ${ctx.request.protocol}, secure: ${ctx.request.secure}, isHttps: ${isHttps}, isLocalhost: ${isLocalhost}`
      );

      const cookieSettings = {
        httpOnly: true,
        secure: isHttps && !isLocalhost,
        sameSite: isLocalhost ? 'lax' : isHttps ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      } as const;
      
      // Set the token in an HTTP-only cookie with appropriate settings
      try {
        ctx.cookies.set('csrf_token', csrfToken, cookieSettings);
        
        strapi.log.debug(`[CSRF] Token generated and cookie set: ${csrfToken.substring(0, 10)}...`);
        strapi.log.debug(`[CSRF] Cookie settings:`, cookieSettings);
      } catch (cookieError: any) {
        strapi.log.error(`[CSRF] Failed to set cookie:`, cookieError);
        // Try with less restrictive settings if the initial attempt fails
        const fallbackSettings = {
          httpOnly: true,
          secure: false, // Don't require secure for fallback
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
          path: '/',
        };
        
        try {
          ctx.cookies.set('csrf_token', csrfToken, fallbackSettings);
          strapi.log.debug(`[CSRF] Cookie set with fallback settings:`, fallbackSettings);
        } catch (fallbackError: any) {
          strapi.log.error(`[CSRF] Failed to set cookie even with fallback settings:`, fallbackError);
          throw new Error(`Cookie setting failed: ${fallbackError.message}`);
        }
      }
      
      // Return the token in the response body for the frontend to use
      return { 
        csrfToken,
        cookieSettings: {
          secure: cookieSettings.secure,
          sameSite: cookieSettings.sameSite
        }
      };
    } catch (error: any) {
      strapi.log.error('Error generating CSRF token:', error);
      return ctx.badRequest('Failed to generate CSRF token: ' + (error?.message || 'Unknown error'));
    }
  },
}; 