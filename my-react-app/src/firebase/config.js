import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Hard-coded Firebase configuration for production
const firebaseConfig = {
  apiKey: "AIzaSyDrV8cXb-jM6WAigwUjoEXc2eH8kK19jaE",
  authDomain: "testchek-34555.firebaseapp.com",
  projectId: "testchek-34555",
  storageBucket: "testchek-34555.firebasestorage.app",
  messagingSenderId: "1032059400263",
  appId: "1:1032059400263:web:5b22891d086c3445104162",
  measurementId: "G-XEFM2C3S1D"
};

// Initialize Firebase with error handling
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a mock auth object as fallback
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    signInWithPopup: () => Promise.reject(new Error('Firebase not initialized')),
    signOut: () => Promise.resolve()
  };
}

export { auth };