# Firebase Authentication Setup

This application uses Firebase Authentication for user login. Follow these steps to set up Firebase Authentication for your project:

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name and continue with the setup

## 2. Enable Authentication Methods

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click on "Sign-in method" tab
3. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - (Optional) Other providers like Facebook, Twitter, etc.

## 3. Get Your Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you haven't added an app yet, click on the web icon (</>) to add a web app
5. Register your app with a nickname
6. Copy the Firebase configuration object

## 4. Update Your Firebase Configuration

1. Open `src/firebase/config.js`
2. Replace the demo configuration with your own Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 5. (Optional) Set Up Environment Variables

For better security in production, you can use environment variables:

1. Create a `.env` file in the root of your project
2. Add your Firebase configuration as environment variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Update `src/firebase/config.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
```

## 6. Test Authentication

1. Start your application
2. Try to sign in with email/password or Google
3. After successful login, you should see the welcome page with your profile information

## Troubleshooting

- If you encounter CORS issues with Google authentication, make sure your domain is authorized in the Firebase Console under Authentication > Sign-in method > Authorized domains
- For local development, `localhost` should be automatically authorized
- Check the browser console for any Firebase-related errors