import { jwtDecode } from 'jwt-decode';

// Mock JWT functions
const createToken = (payload, expiresIn) => {
  const now = Date.now();
  const exp = now + (expiresIn === '15m' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000);
  
  const token = btoa(JSON.stringify({
    ...payload,
    exp,
    iat: now
  }));
  
  return token;
};

// Mock token store
const tokenStore = {};

// Login user - browser-only implementation
export const loginUser = async (email, password) => {
  try {
    // Create a user object
    const uid = 'user-' + Math.random().toString(36).substring(2, 15);
    const user = { uid, email };
    
    // Generate tokens
    const accessToken = createToken({ uid, email }, '15m');
    const refreshToken = createToken({ uid }, '7d');
    
    // Store refresh token
    tokenStore[uid] = refreshToken;
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed. Please try again.');
  }
};

// Register user - browser-only implementation
export const registerUser = async (email, password) => {
  return loginUser(email, password);
};

// Logout user - browser-only implementation
export const logoutUser = async (userId) => {
  try {
    // Remove refresh token
    delete tokenStore[userId];
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};

// Refresh access token - browser-only implementation
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Decode refresh token
    const decoded = JSON.parse(atob(refreshToken));
    const userId = decoded.uid;
    
    // Check if refresh token exists and is valid
    if (!tokenStore[userId] || tokenStore[userId] !== refreshToken || decoded.exp < Date.now()) {
      throw new Error('Invalid refresh token');
    }
    
    // Generate new access token
    const accessToken = createToken({ uid: userId }, '15m');
    
    return { accessToken };
  } catch (error) {
    console.error('Refresh token error:', error);
    throw new Error('Token refresh failed');
  }
};

// Verify access token (client-side)
export const verifyAccessToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};