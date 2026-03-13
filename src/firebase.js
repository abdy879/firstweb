import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your Firebase project configuration
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Create a project and add a Web app.
// 3. Copy the configuration object here:
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webapp-96b23.firebaseapp.com",
  databaseURL: "https://webapp-96b23-default-rtdb.firebaseio.com",
  projectId: "webapp-96b23",
  storageBucket: "webapp-96b23.firebasestorage.app",
  messagingSenderId: "992831015219",
  appId: "1:992831015219:web:1ff963884930628f259646"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
