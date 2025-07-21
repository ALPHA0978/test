// Token expiration times
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Create a JWT-like token
 * @param {Object} payload - Data to include in the token
 * @param {number} expiresIn - Expiration time in milliseconds
 * @returns {string} - Base64 encoded token
 */
export const createToken = (payload, expiresIn) => {
  const now = Date.now();
  const exp = now + expiresIn;
  
  const tokenData = {
    ...payload,
    exp,
    iat: now
  };
  
  return btoa(JSON.stringify(tokenData));
};

/**
 * Create an access token
 * @param {Object} user - User data
 * @returns {string} - Access token
 */
export const createAccessToken = (user) => {
  return createToken({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null
  }, ACCESS_TOKEN_EXPIRY);
};

/**
 * Create a refresh token
 * @param {Object} user - User data
 * @returns {string} - Refresh token
 */
export const createRefreshToken = (user) => {
  return createToken({ uid: user.uid }, REFRESH_TOKEN_EXPIRY);
};

/**
 * Decode a token
 * @param {string} token - Base64 encoded token
 * @returns {Object} - Decoded token data
 */
export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

/**
 * Verify if a token is valid and not expired
 * @param {string} token - Base64 encoded token
 * @returns {Object} - Decoded token data if valid
 */
export const verifyToken = (token) => {
  const decoded = decodeToken(token);
  
  if (decoded.exp < Date.now()) {
    throw new Error('Token expired');
  }
  
  return decoded;
};