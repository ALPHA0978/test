import React, { useState } from 'react';
import LoginForm from './components/loginForm';
import './index.css';

// Simple Dashboard component
function Dashboard({ user, onLogout }) {
  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Call logout callback
    onLogout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          {user?.photoURL ? (
            <img src={user.photoURL} className="user-avatar" alt="User avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="user-details">
            <h2>{user?.displayName || 'Welcome!'}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <main className="dashboard-content">
        <div className="card">
          <h2>JWT Authentication Successful!</h2>
          <p>You are now logged in with a JWT token that expires in 15 minutes.</p>
          <p>Your token will be automatically refreshed when needed.</p>
        </div>
        
        <div className="card">
          <h2>User Information</h2>
          <div className="info-row">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user?.uid}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          {user?.displayName && (
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.displayName}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Main App component
function App() {
  const [user, setUser] = useState(null);
  
  // Check for existing token on mount
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Decode token (simple implementation)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(window.atob(base64));
          
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              uid: decoded.uid,
              email: decoded.email,
              displayName: decoded.displayName
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  return (
    <div>
      {!user ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;