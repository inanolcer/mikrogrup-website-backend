const tokens = new Map();

export default {
  storeToken(userId, token, expiry) {
    tokens.set(token, { userId, expiry });
    
    // Clean up expired tokens periodically
    setTimeout(() => {
      if (tokens.has(token)) {
        tokens.delete(token);
      }
    }, expiry - Date.now());
  },
  
  validateToken(token, userId) {
    const tokenData = tokens.get(token);
    if (!tokenData) return false;
    
    // Check if token belongs to this user and is not expired
    return tokenData.userId === userId && tokenData.expiry > Date.now();
  }
}; 