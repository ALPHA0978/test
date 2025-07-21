# JWT Authentication with Firebase

This project implements JWT authentication with Firebase and Vue.js.

## Setup

1. Update Firebase configuration in `src/firebase/config.js` with your Firebase project details:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

2. Enable Email/Password authentication in your Firebase project:
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password provider
   - Create a test user in the "Users" tab

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## How It Works

1. User logs in with Firebase authentication
2. After successful authentication, JWT tokens are generated:
   - Access token (15-minute expiry)
   - Refresh token (7-day expiry)
3. Tokens are stored in localStorage
4. Access token is automatically refreshed when expired

## Implementation Details

- Firebase handles user authentication
- JWT tokens are generated client-side
- Token verification is done client-side
- Authentication state is managed using Pinia