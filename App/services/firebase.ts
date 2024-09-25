
// App/services/firebase.ts

import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MSG_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

let firebaseApp: FirebaseApp;

if (!initializeApp.apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = initializeApp.initializeApp();
}

export { firebaseApp, auth };