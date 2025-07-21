import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

// Create auth context
const AuthContext = createContext(null);

/**
 * Hook to use the auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth provider component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime,
          lastLoginAt: user.metadata.lastSignInTime
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Auth context value
  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};