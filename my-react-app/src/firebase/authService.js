import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Login user - completely simplified
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with:', email);
    
    // Direct API call to our server
    const response = await axios.post('/api/auth/login', { 
      email,
      password // Not used on server but included for completeness
    });
    
    console.log('Login response:', response.data);
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid server response');
    }
    
    // Create a user object from the token data
    const decoded = jwtDecode(response.data.accessToken);
    const user = { 
      uid: decoded.uid, 
      email: decoded.email || email 
    };
    
    return { 
      user, 
      accessToken: response.data.accessToken, 
      refreshToken: response.data.refreshToken 
    };
  } catch (error) {
    console.error('Login error details:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw new Error(error.response?.data?.error || 'Login failed. Please try again.');
  }
};

// Register user - completely simplified
export const registerUser = async (email, password) => {
  try {
    // Generate a test user ID
    const uid = 'user-' + Math.random().toString(36).substring(2, 15);
    
    // Direct API call to our server
    const response = await axios.post('/api/auth/register', { 
      uid, 
      email,
      password // Not used on server but included for completeness
    });
    
    if (!response.data || !response.data.accessToken) {
      throw new Error('Invalid server response');
    }
    
    // Create a user object
    const user = { uid, email };
    
    return { 
      user, 
      accessToken: response.data.accessToken, 
      refreshToken: response.data.refreshToken 
    };
  } catch (error) {
    console.error('Register error details:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Logout user - completely simplified
export const logoutUser = async (userId) => {
  try {
    await axios.post('/api/auth/logout', { userId });
    return true;
  } catch (error) {
    console.error('Logout error details:', error);
    throw new Error(error.response?.data?.error || 'Logout failed');
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return { accessToken: response.data.accessToken };
  } catch (error) {
    console.error('Refresh token error details:', error);
    throw new Error(error.response?.data?.error || 'Token refresh failed');
  }
};

// Verify access token (client-side)
export const verifyAccessToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};