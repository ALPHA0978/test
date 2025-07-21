# Firebase Setup Guide

Follow these steps to set up Firebase authentication for this project:

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name and continue

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. Click "Save"

## 3. Create a Test User

1. In the Authentication section, go to the "Users" tab
2. Click "Add user"
3. Enter an email and password
4. Click "Add user"

## 4. Get Your Firebase Configuration

1. Go to Project Settings (gear icon near the top of the left sidebar)
2. Scroll down to "Your apps" section
3. If you don't have an app yet, click the web icon (</>) to create one
4. Register your app with a nickname
5. Copy the firebaseConfig object

## 5. Update Your Configuration

Open `src/firebase/config.js` and replace the placeholder configuration with your actual Firebase configuration:

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

## 6. Test Your Authentication

1. Start your development server: `npm run dev`
2. Try logging in with the test user you created
3. You should be able to log in successfully and see the protected content