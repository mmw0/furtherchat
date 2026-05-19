import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// To use this chat app, you need to create a Firebase project:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Enable Authentication (Email/Password sign-in method)
// 4. Create a Firestore Database
// 5. Create a Realtime Database
// 6. Add a Web App to get your config
// 7. Replace the values below with your Firebase config
// ============================================================

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBt7v-4xEP30HA5o35xBtb9ErFSs7aaecE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "chat-eef3b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "chat-eef3b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "chat-eef3b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "68858117687",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:68858117687:web:75ace5acc508643cdb89b2",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://chat-eef3b-default-rtdb.firebaseio.com",
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId
}

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export default app
