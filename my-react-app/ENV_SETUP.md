# Environment Variables Setup

This project uses environment variables to store sensitive information like Firebase credentials. Follow these steps to set up your environment:

## Setup Instructions

1. Copy the `.env.example` file to a new file named `.env`:

```bash
cp .env.example .env
```

2. Fill in your Firebase credentials in the `.env` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Make sure the `.env` file is in your `.gitignore` to prevent committing sensitive information to your repository.

## Getting Firebase Credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
4. Scroll down to "Your apps" section
5. Copy the configuration values from the Firebase SDK snippet

## Important Notes

- Never commit your `.env` file to version control
- Each developer should create their own `.env` file locally
- For production deployments, set the environment variables in your hosting platform's configuration