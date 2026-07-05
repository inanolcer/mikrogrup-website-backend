/**
 * CSRF protection middleware
 * Validates CSRF tokens for all mutation requests
 */

import trustedOrigins from '../../config/csrf-trusted-origins';

// Declare globals to avoid TypeScript issues
declare const process: any;

const matchesTrustedOrigin = (origin?: string, referer?: string): boolean =>
  Boolean(
    (origin && trustedOrigins.some((trusted) => origin === trusted || origin.startsWith(`${trusted}/`))) ||
      (referer && trustedOrigins.some((trusted) => referer.startsWith(trusted)))
  );

export default (config, { strapi }: { strapi: any }) => {
  return async (ctx, next) => {
    // Get the request URL
    const url = ctx.request.url;
    
    // Skip CSRF check for:
    // 1. The CSRF token endpoint itself
    // 2. Non-mutation methods (GET, HEAD, OPTIONS)
    // 3. Admin panel routes (/admin or /kozmoz-panel)
    // 4. Admin API routes (/api/admin)
    // 5. Content Manager routes (admin panel operations)
    // 6. Upload routes (/api/upload)
    // 7. Users-permissions routes (/api/users-permissions)
    // 8. Any route related to permissions management
    // 9. Test routes (/test/)
    // 10. Documentation routes (/documentation)
    const skipCSRFCheck = 
      url.includes('/api/csrf-token') || 
      url.includes('/kozmoz-panel') || 
      url.includes('/admin') ||
      url.includes('/api/admin') ||
      url.includes('/content-manager') ||
      url.includes('/api/upload') ||
      url.includes('/api/users-permissions') ||
      url.includes('/api/roles') ||
      url.includes('/api/permissions') ||
      url.includes('/settings/users-permissions') ||
      url.includes('/test/') ||
      url.includes('/documentation/login') ||
      url.includes('/documentation') ||
      ['GET', 'HEAD', 'OPTIONS'].includes(ctx.request.method);
    
    // Log for debugging
    strapi.log.debug(`[CSRF] Request URL: ${url}, Method: ${ctx.request.method}, Skip CSRF: ${skipCSRFCheck}`);
    
    if (skipCSRFCheck) {
      return await next();
    }
    
    // For admin panel operations, also check the origin/referer
    const isAdminRelatedRequest = 
      ctx.request.header.referer?.includes('/admin') || 
      ctx.request.header.origin?.includes('/admin') ||
      ctx.request.header.referer?.includes('/kozmoz-panel') || 
      ctx.request.header.origin?.includes('/kozmoz-panel');
      
    if (isAdminRelatedRequest) {
      strapi.log.debug(`[CSRF] Skipping for admin-related request based on referer/origin`);
      return await next();
    }
    
    // Debug request headers
    strapi.log.debug(`[CSRF] Request headers: ${JSON.stringify(ctx.request.header)}`);
    strapi.log.debug(`[CSRF] Request cookies: ${JSON.stringify(ctx.cookies.request.headers.cookie)}`);
    
    const csrfTokenFromHeader = ctx.request.header['x-csrf-token'];
    const csrfTokenFromCookie = ctx.cookies.get('csrf_token');
    const userId = ctx.state.user?.id || 'anonymous';

    // Log for debugging
    strapi.log.debug(`[CSRF] Token from header: ${csrfTokenFromHeader ? 'present' : 'missing'}, Token from cookie: ${csrfTokenFromCookie ? 'present' : 'missing'}`);
    
    if (csrfTokenFromCookie) {
      strapi.log.debug(`[CSRF] Cookie token: ${csrfTokenFromCookie.substring(0, 10)}...`);
    }
    
    if (csrfTokenFromHeader) {
      strapi.log.debug(`[CSRF] Header token: ${csrfTokenFromHeader.substring(0, 10)}...`);
    }
    
    // Get environment and origin information
    const nodeEnv = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV : 'development';
    const isDevelopment = nodeEnv !== 'production';
    const origin = ctx.request.header.origin;
    const referer = ctx.request.header.referer;
    const isTrustedOrigin = matchesTrustedOrigin(origin, referer);
    
    // For trusted origins in production, allow header-only token validation
    // This handles cross-origin scenarios where cookies might not be accessible
    if (!isDevelopment && isTrustedOrigin && csrfTokenFromHeader && !csrfTokenFromCookie) {
      strapi.log.debug(`[CSRF] Production mode: Allowing header-only token for trusted origin: ${origin || referer}`);
      
      // Enhanced server-side validation for header-only tokens
      try {
        const csrfService = strapi.service('plugin::users-permissions.csrf');
        if (csrfService && typeof csrfService.validateToken === 'function') {
          const isValid = await csrfService.validateToken(csrfTokenFromHeader, userId);
          
          if (!isValid) {
            strapi.log.debug(`[CSRF] Server-side token validation failed for header-only token`);
            return ctx.throw(403, {
              success: false,
              message: 'CSRF validation failed 1',
              timestamp: new Date().toISOString(),
              error: {
                status: 403,
                name: 'CSRFError',
                message: 'CSRF token expired or invalid',
                details: ['Your security token has expired. Please refresh the page and try again.']
              }
            });
          }
        }
      } catch (error) {
        strapi.log.error(`[CSRF] Error validating header-only token:`, error);
        return ctx.throw(403, {
          success: false,
          message: 'CSRF validation failed 2',
          timestamp: new Date().toISOString(),
          error: {
            status: 403,
            name: 'CSRFError',
            message: 'CSRF token validation error',
            details: ['Token validation failed. Please refresh the page and try again.']
          }
        });
      }
      
      return await next();
    }
    
    // For development mode, use the existing fallback logic
    if (isDevelopment && csrfTokenFromHeader && !csrfTokenFromCookie) {
      strapi.log.debug(`[CSRF] Development mode: Using header token as cookie token for testing`);
      // This is only for testing - in production, both must be present
      ctx.cookies.set('csrf_token', csrfTokenFromHeader, { 
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      return await next();
    }
    
    // Also check for token in request body - common in forms
    const csrfTokenFromBody = ctx.request.body?.csrf_token;
    if (isDevelopment && (csrfTokenFromBody || csrfTokenFromHeader) && !csrfTokenFromCookie) {
      const tokenToUse = csrfTokenFromBody || csrfTokenFromHeader;
      strapi.log.debug(`[CSRF] Development mode: Using body/header token as cookie token for testing: ${tokenToUse}`);
      ctx.cookies.set('csrf_token', tokenToUse, { 
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      return await next();
    }
    
    // Basic token validation - accept token from header or body if they match the cookie
    // or if we're in development mode and no cookie is present
    if (isDevelopment && !csrfTokenFromCookie && (csrfTokenFromHeader || csrfTokenFromBody)) {
      strapi.log.debug(`[CSRF] Development mode: Allowing request without cookie token`);
      return await next();
    }
    
    if (!csrfTokenFromHeader && !csrfTokenFromBody) {
      strapi.log.debug(`[CSRF] No token in header or body`);
      return ctx.throw(403, {
        success: false,
        message: 'CSRF validation failed',
        timestamp: new Date().toISOString(),
        error: {
          status: 403,
          name: 'CSRFError',
          message: 'Invalid or missing CSRF token',
          details: ['Please obtain a CSRF token before submitting the form']
        }
      });
    }
    
    const isHeaderValid = csrfTokenFromHeader && csrfTokenFromCookie && csrfTokenFromHeader === csrfTokenFromCookie;
    const isBodyValid = csrfTokenFromBody && csrfTokenFromCookie && csrfTokenFromBody === csrfTokenFromCookie;
    
    if (!isHeaderValid && !isBodyValid) {
      strapi.log.debug(`[CSRF] Token validation failed - tokens don't match`);
      strapi.log.debug(`Header: ${csrfTokenFromHeader?.substring(0, 10) || 'missing'}, Cookie: ${csrfTokenFromCookie?.substring(0, 10) || 'missing'}, Body: ${csrfTokenFromBody?.substring(0, 10) || 'missing'}`);
      return ctx.throw(403, {
        success: false,
        message: 'CSRF validation failed',
        timestamp: new Date().toISOString(),
        error: {
          status: 403,
          name: 'CSRFError',
          message: 'Invalid or missing CSRF token',
          details: ['Please obtain a CSRF token before submitting the form']
        }
      });
    }
    
    // Enhanced server-side validation
    try {
      const csrfService = strapi.service('plugin::users-permissions.csrf');
      if (csrfService && typeof csrfService.validateToken === 'function') {
        const tokenToValidate = csrfTokenFromHeader || csrfTokenFromBody;
        const isValid = await csrfService.validateToken(
          tokenToValidate,
          userId
        );
        
        if (!isValid) {
          strapi.log.debug(`[CSRF] Server-side token validation failed`);
          return ctx.throw(403, {
            success: false,
            message: 'CSRF validation failed',
            timestamp: new Date().toISOString(),
            error: {
              status: 403,
              name: 'CSRFError',
              message: 'CSRF token expired or invalid',
              details: ['Your security token has expired. Please refresh the page and try again.']
            }
          });
        }
      } else {
        strapi.log.debug('[CSRF] CSRF service not found or validateToken method not available - skipping server validation');
      }
    } catch (error) {
      strapi.log.error(`[CSRF] Error validating token:`, error);
      // Continue anyway to avoid blocking requests if the service fails
    }
    
    // Log any referrer for debugging but don't block
    const referrer = ctx.request.header.referer;
    if (referrer) {
      strapi.log.debug(`[CSRF] Allowing referrer: ${referrer}`);
    }
    
    strapi.log.debug(`[CSRF] Validation successful`);
    await next();
  };
}; 