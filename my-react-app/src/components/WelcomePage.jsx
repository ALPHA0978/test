import React from 'react';
import { useAuthContext } from '../context/AuthProvider';
import './WelcomePage.css';

const WelcomePage = () => {
  const { currentUser, logout } = useAuthContext();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto pt-10 px-4">
        {/* Header with user info and logout */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {currentUser?.displayName || 'User'}!
              </h1>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* User profile details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{currentUser?.uid}</p>
            </div>
            
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Display Name</p>
              <p className="font-medium">{currentUser?.displayName || 'Not set'}</p>
            </div>
            
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-medium">
                {currentUser?.emailVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-red-600">Not verified</span>
                )}
              </p>
            </div>
            
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium">{formatDate(currentUser?.createdAt)}</p>
            </div>
            
            <div className="border-b pb-2">
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{formatDate(currentUser?.lastLoginAt)}</p>
            </div>
          </div>
        </div>
        
        {/* Authentication info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication Information</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Authentication Provider</p>
            <p className="font-medium">Firebase Authentication</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Session Status</p>
            <p className="font-medium">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Active
            </p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">
              Your session is secured with Firebase Authentication. For security reasons, 
              your session will expire after a period of inactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;