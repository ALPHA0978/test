import React from 'react';
import LoginForm from './components/loginForm';
import WelcomePage from './components/WelcomePage';
import { AuthProvider, useAuthContext } from './context/AuthProvider';
import './index.css';

// App content component that uses auth context
function AppContent() {
  const { currentUser, isAuthenticated } = useAuthContext();
  
  return (
    <div>
      {!isAuthenticated ? (
        <LoginForm onLoginSuccess={() => {}} />
      ) : (
        <WelcomePage />
      )}
    </div>
  );
}

// Main App component with AuthProvider
function App() {  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;