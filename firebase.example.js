/**
 * firebase.js — Firebase initialization and configuration
 * 
 * HOW TO SET UP:
 * 1. Copy firebase.example.js to firebase.js
 * 2. Replace the placeholder values with your Firebase project credentials
 * 3. Go to https://console.firebase.google.com
 * 4. Enable: Authentication → Email/Password
 * 5. Enable: Cloud Firestore (test mode)
 * 6. Enable: Storage
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE these with YOUR Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
