const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Secret keys (in production, store these securely)
const JWT_SECRET = 'your-jwt-secret-key';
const REFRESH_SECRET = 'your-refresh-token-secret-key';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// In-memory token store (use a database in production)
const refreshTokens = {};

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Login endpoint - super simplified
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('Login attempt with:', req.body);
    
    // Accept any email/password
    const { email } = req.body;
    
    if (!email) {
      console.log('Login failed: Email is required');
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Generate a test user ID
    const uid = 'user-' + Math.random().toString(36).substring(2, 15);
    
    const accessToken = jwt.sign(
      { uid, email }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      { uid }, 
      REFRESH_SECRET, 
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    // Store refresh token
    refreshTokens[uid] = refreshToken;
    
    console.log('Login successful for:', email);
    console.log('Generated tokens for user:', uid);
    
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('Register attempt with:', req.body);
    
    const { uid, email } = req.body;
    
    if (!uid || !email) {
      console.log('Registration failed: User ID and email are required');
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const accessToken = jwt.sign(
      { uid, email }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      { uid }, 
      REFRESH_SECRET, 
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    // Store refresh token
    refreshTokens[uid] = refreshToken;
    
    console.log('Registration successful for:', email);
    
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  try {
    console.log('Logout attempt with:', req.body);
    
    const { userId } = req.body;
    
    if (!userId) {
      console.log('Logout failed: User ID is required');
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Remove refresh token
    delete refreshTokens[userId];
    
    console.log('Logout successful for user:', userId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  try {
    console.log('Token refresh attempt with:', req.body);
    
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      console.log('Token refresh failed: Refresh token required');
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const userId = decoded.uid;
    
    console.log('Refresh token verified for user:', userId);
    
    // Check if refresh token exists in store
    if (refreshTokens[userId] !== refreshToken) {
      console.log('Token refresh failed: Invalid refresh token');
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { uid: userId }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    console.log('New access token generated for user:', userId);
    
    return res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error during token refresh' });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  console.log('Protected route accessed by:', req.user);
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JWT auth server is ready at http://localhost:${PORT}`);
});