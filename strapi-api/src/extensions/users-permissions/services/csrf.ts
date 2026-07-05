/**
 * CSRF service for the users-permissions plugin
 * Stores and validates CSRF tokens
 */

import { setTimeout } from 'timers';

// In-memory token storage
// In a production environment with multiple instances, 
// you might want to use Redis or another shared storage
const tokens = new Map();

export default () => ({
  /**
   * Store a CSRF token with its expiry time
   * @param {string} userId - The user ID or 'anonymous'
   * @param {string} token - The CSRF token
   * @param {number} expiry - The expiry timestamp
   */
  storeToken(userId: string, token: string, expiry: number) {
    try {
      tokens.set(token, { userId, expiry });
      
      // Clean up expired tokens periodically
      setTimeout(() => {
        try {
          if (tokens.has(token)) {
            tokens.delete(token);
          }
        } catch (error) {
          // Silently fail cleanup
        }
      }, expiry - Date.now());
      
      return true;
    } catch (error) {
      // Log error but don't throw - the double submit cookie pattern
      // still works even without server-side validation
      strapi.log.error('Error storing CSRF token:', error);
      return false;
    }
  },
  
  /**
   * Validate a CSRF token
   * @param {string} token - The CSRF token to validate
   * @param {string} userId - The user ID or 'anonymous'
   * @returns {boolean} - Whether the token is valid
   */
  validateToken(token: string, userId: string): boolean {
    try {
      const tokenData = tokens.get(token);
      if (!tokenData) return false;
      
      // Check if token belongs to this user and is not expired
      return tokenData.userId === userId && tokenData.expiry > Date.now();
    } catch (error) {
      // Log error but don't throw - return false to indicate validation failed
      strapi.log.error('Error validating CSRF token:', error);
      return false;
    }
  }
}); 