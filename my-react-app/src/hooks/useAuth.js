import { useState, useEffect, useCallback } from 'react';
import { api, decodeToken, isTokenExpired } from '../utils/authUtils';

/**
 * Custom hook for authentication state management
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken && !isTokenExpired(accessToken)) {
          // Token is valid, set user from token
          const decoded = decodeToken(accessToken);
          setUser({
            uid: decoded.uid,
            email: decoded.email,
            displayName: decoded.displayName,
            photoURL: decoded.photoURL
          });
        } else {
          // Token is missing or expired
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Check auth on mount
    checkAuth();
    
    // Listen for logout events
    const handleLogout = () => {
      setUser(null);
    };
    
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Set user from token
      const decoded = decodeToken(accessToken);
      const userData = {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.displayName,
        photoURL: decoded.photoURL
      };
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // Call logout endpoint if user is logged in
      if (user) {
        await api.post('/auth/logout', { userId: user.uid });
      }
      
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Clear user
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      
      // Still clear tokens and user on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      
      const errorMessage = err.response?.data?.error || err.message || 'Logout failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };
};