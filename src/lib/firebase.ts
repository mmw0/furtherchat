import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBt7v-4xEP30HA5o35xBtb9ErFSs7aaecE",
  authDomain: "chat-eef3b.firebaseapp.com",
  projectId: "chat-eef3b",
  storageBucket: "chat-eef3b.firebasestorage.app",
  messagingSenderId: "68858117687",
  appId: "1:68858117687:web:75ace5acc508643cdb89b2",
  databaseURL: "https://chat-eef3b-default-rtdb.firebaseio.com",
}

export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export default app
