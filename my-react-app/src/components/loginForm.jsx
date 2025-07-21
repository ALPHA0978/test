import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle email/password login
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get the Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Store token in localStorage
      localStorage.setItem('accessToken', idToken);
      
      // Create a user object
      const user = { 
        uid: firebaseUser.uid, 
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        photoURL: firebaseUser.photoURL
      };
      
      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Create Google auth provider
      const provider = new GoogleAuthProvider();
      
      // Sign in with popup
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Get the Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Store token in localStorage
      localStorage.setItem('accessToken', idToken);
      
      // Create a user object
      const user = { 
        uid: firebaseUser.uid, 
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      };
      
      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background abstract shapes (subtle spheres) */}
      <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float animation-delay-0"></div>
      <div className="absolute bottom-1/3 right-[10%] w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-[5%] w-48 h-48 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-float animation-delay-4000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-float animation-delay-6000"></div>

      {/* Main container for the two-column layout - Reduced max-width */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white border-opacity-20">

        {/* Left section: Welcome message and abstract shapes */}
        <div className="relative bg-gradient-to-br from-blue-700 to-indigo-700 p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center text-white text-center md:rounded-l-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-wide drop-shadow-md">WELCOME</h2>
          <h3 className="text-xl md:text-2xl font-bold mb-5 drop-shadow-sm">Ashutosh</h3>
          <p className="text-xs md:text-sm opacity-90 leading-relaxed max-w-xs sm:max-w-sm">
            Self-implemented JWT with 15-minute expiry and secure refresh token endpoint for Firebase authentication.
          </p>
          {/* Smaller, more contained spheres for the left panel */}
          <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen opacity-30 animate-spin-slow"></div>
          <div className="absolute bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen opacity-30 animate-spin-slow animation-delay-3000"></div>
        </div>

        {/* Right section: Login Form */}
        <div className="bg-white bg-opacity-95 p-6 md:p-8 lg:p-10 flex flex-col justify-center text-gray-800">
          <h1 className="text-3xl md:text-3xl font-extrabold mb-2 text-center md:text-left">Sign In</h1>
          <p className="text-gray-600 mb-6 text-center md:text-left text-sm">Enter your credentials to access your account</p>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>

          {/* Password input with SHOW button */}
          <div className="mb-5">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5-9H8.5V6c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5v2z"/>
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot Password? */}
          <div className="flex justify-between items-center mb-6 text-xs">
            <label className="flex items-center text-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="form-checkbox h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out" 
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Forgot Password?</a>
          </div>

          {/* Sign in button */}
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white text-base"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Or separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Sign in with Google button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg flex items-center justify-center space-x-3 transition duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white text-base"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.29c-.35-.79-1.29-1.42-2.31-1.42-1.63 0-2.95 1.32-2.95 2.95s1.32 2.95 2.95 2.95c1.46 0 2.53-.98 2.88-2.32h-2.88v-2.16h5.83c.06.32.09.67.09 1.05 0 3.58-2.45 6.13-6.02 6.13-3.32 0-6.02-2.7-6.02-6.02s2.7-6.02 6.02-6.02c1.78 0 3.31.74 4.41 1.94l1.64-1.64c-1.39-1.39-3.2-2.26-5.05-2.26-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5c4.07 0 7.35-3.08 7.35-7.35 0-.47-.05-.92-.14-1.35h-7.21z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Don't have an account? Sign Up link */}
          <p className="text-gray-700 text-center text-sm mt-7">
            Don't have an account? <a href="#" className="font-bold text-blue-600 hover:underline hover:text-blue-700">Sign Up</a>
          </p>
        </div>
      </div>


      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          /* Add any custom styles here */
          .animate-float {
            animation: float 12s infinite ease-in-out;
          }
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, 10px); }
          }
        `}
      </style>
    </div>
  );
}

export default LoginForm;