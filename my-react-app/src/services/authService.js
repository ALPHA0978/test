import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { createAccessToken, createRefreshToken, verifyToken } from '../utils/tokenUtils';

// Login with email and password
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting Firebase login with:', email);
    
    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('Firebase login successful for:', email);
    
    // Create a user object
    const user = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
    
    // Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Firebase login error:', error);
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
};

// Login with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    console.log('Google login successful for:', firebaseUser.email);
    
    // Create a user object
    const user = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
    
    // Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error(error.message || 'Google login failed. Please try again.');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Generate new access token
    const accessToken = createAccessToken({ uid: decoded.uid, email: decoded.email });
    
    return { accessToken };
  } catch (error) {
    console.error('Refresh token error:', error);
    throw new Error('Token refresh failed');
  }
};

// Verify access token (client-side)
export const verifyAccessToken = (token) => {
  try {
    return verifyToken(token);
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};