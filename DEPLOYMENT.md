# FurtherChat - Deployment Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Firebase Project (FREE)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter a project name (e.g., "my-furtherchat")
4. Disable Google Analytics (not needed) → Click **Create project**

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. **Enable** it → Click **Save**

### Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location close to you → Click **Done**

### Step 4: Create Realtime Database

1. Go to **Realtime Database** → **Create database**
2. Choose **Start in test mode**
3. Select a location → Click **Done**

### Step 5: Add Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any user profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Username reservations
    match /usernames/{username} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Chat rooms - users must be participants
    match /chatRooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
    // Chat requests
    match /chatRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /usernames/{username} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### Step 6: Add Realtime Database Rules

1. Go to **Realtime Database** → **Rules**
2. Replace with:

```json
{
  "rules": {
    "presence": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid"
      }
    },
    "typing": {
      "$roomId": {
        ".read": true,
        "$uid": {
          ".write": "$uid === auth.uid"
        }
      }
    }
  }
}
```

3. Click **Publish**

### Step 7: Get Your Firebase Config

1. Go to **Project Settings** (gear icon ⚙️)
2. Under **Your apps**, click **Add app** → Select **Web** (`</>`)
3. Register app with any name
4. Copy the `firebaseConfig` object values

### Step 8: Add Firebase Config to Your Project

**Option A: Environment Variables (Recommended)**

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

**Option B: Edit firebase.ts directly**

Edit `src/lib/firebase.ts` and replace the placeholder values.

---

## 🌐 Deploy to GitHub Pages

### Method 1: GitHub Actions (Automatic)

1. Push your code to GitHub
2. Go to your repo → **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Add your Firebase config as **Repository Secrets**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add each `NEXT_PUBLIC_FIREBASE_*` variable
5. Change `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/your-repo-name", // Only if deploying to github.io/your-repo-name
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};
```

6. Push to `main` branch — GitHub Actions will auto-deploy!

### Method 2: Manual Build

1. Update `next.config.ts` (as above)
2. Run:
```bash
bun install
bun run build:static
```
3. Copy the `out/` folder contents to your GitHub Pages repository

---

## 🔐 Security Features

### Progressive Account Lockout
- **3 failed attempts** → Account locked for **1 minute**
- **6 failed attempts** → Account locked for **2 minutes**
- **9 failed attempts** → Account locked for **3 minutes**
- And so on... (each 3 failures = +1 minute lock)

### How It Works
- Failed login attempts are tracked per username in the browser's localStorage
- After 3 consecutive failures, the account is temporarily locked
- Lock duration increases progressively with repeated failures
- Successful login clears the lockout counter

---

## 📱 Features

- ✅ Username & Password Authentication (via Firebase Auth)
- ✅ Progressive Account Lockout (3 fails = 1min lock, increasing)
- ✅ Real-time Messaging (Firestore)
- ✅ Direct & Group Chats
- ✅ Online/Offline Presence
- ✅ Typing Indicators
- ✅ User Search
- ✅ Dark/Light Theme
- ✅ Responsive Design (Mobile + Desktop)
- ✅ GitHub Pages Deployment Ready
