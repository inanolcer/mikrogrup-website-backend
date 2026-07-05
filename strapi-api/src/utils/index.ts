/**
 * Utility functions for data formatting and transformations
 * These are generic, reusable functions used across the application
 */

/**
 * Format phone number for Turkish numbers
 * Removes non-numeric characters, leading zeros, and adds Turkish country code if needed
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '900000000000';
  
  // Remove all non-numeric characters
  let formatted = phone.replace(/\D/g, '');
  
  // Remove leading zeros
  formatted = formatted.replace(/^0+/, '');
  
  if (formatted.length === 0) {
    return '900000000000';
  }
  
  // Add Turkish country code if needed
  if (formatted.length === 10 && !formatted.startsWith('90')) {
    formatted = '90' + formatted;
  }
  
  return formatted;
}

/**
 * Format email address by converting to lowercase and replacing Turkish characters
 * with their ASCII equivalents for better compatibility
 */
export function formatEmail(email: string): string {
  if (!email) return '';
  
  const turkishCharMappings = [
    { from: /I/g, to: 'i' },
    { from: /İ/g, to: 'i' },
    { from: /Ğ/g, to: 'g' },
    { from: /Ş/g, to: 's' },
    { from: /Ç/g, to: 'c' },
    { from: /Ü/g, to: 'u' },
    { from: /Ö/g, to: 'o' },
    { from: /ğ/g, to: 'g' },
    { from: /ş/g, to: 's' },
    { from: /ç/g, to: 'c' },
    { from: /ü/g, to: 'u' },
    { from: /ö/g, to: 'o' },
    { from: /ı/g, to: 'i' }
  ];

  let formatted = email.toLowerCase().trim();
  
  turkishCharMappings.forEach(mapping => {
    formatted = formatted.replace(mapping.from, mapping.to);
  });
  
  return formatted;
}

/**
 * Get field of activity mapping from Turkish codes to human readable values
 */
export function getFieldOfActivity(activity: string): string {
  const mappings = {
    'sirket': 'Ticari',
    'malimusavir': 'Mali müşavir',
    'bagimsizmm': 'Bağımsız MM',
    'isortaklari': 'İş Ortakları'
  };
  
  return mappings[activity] || activity;
} 



/**
 * Get client IP from request context. When behind a reverse proxy, ctx.request.ip
 * may be null/empty if the proxy does not set X-Forwarded-For or Koa does not
 * apply it. This helper checks request.ip first, then X-Forwarded-For (first
 * entry = client), then X-Real-IP.
 * @param ctx - Koa request context (ctx.request has .ip and .headers)
 * @returns Client IP string or null if none available
 */
export function getClientIp(ctx: { request: { ip?: string; headers?: Record<string, string | string[] | undefined> } }): string | null {
  const ip = ctx.request?.ip?.trim();
  if (ip) return ip;

  const headers = ctx.request?.headers || {};
  const forwarded = headers['x-forwarded-for'];
  if (forwarded) {
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim();
    if (first) return first;
  }

  const realIp = headers['x-real-ip'];
  if (realIp) {
    const value = Array.isArray(realIp) ? realIp[0] : realIp;
    if (value?.trim()) return value.trim();
  }

  return null;
} 