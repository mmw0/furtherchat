// ============================================================
// FIREBASE SERVICE - All Firestore/RTDB operations
// ============================================================

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  or,
  and,
} from 'firebase/firestore'
import {
  ref,
  set,
  get,
  onDisconnect,
  onValue,
  off,
  serverTimestamp as rtdbServerTimestamp,
} from 'firebase/database'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, db, rtdb } from './firebase'
import type { User, Message, ChatRoom } from './store'

// ============================================================
// AUTHENTICATION
// ============================================================

// Convert username to a fake email for Firebase Auth
export function usernameToEmail(username: string): string {
  return `${username.toLowerCase().trim()}@chatapp.local`
}

export async function registerUser(username: string, password: string, displayName: string): Promise<User> {
  const email = usernameToEmail(username)
  
  // Check if username already exists
  const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase().trim()))
  if (usernameDoc.exists()) {
    throw new Error('Username already taken')
  }
  
  // Create auth account
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  
  // Update display name
  await updateProfile(cred.user, { displayName })
  
  // Create user document in Firestore
  const userData: Omit<User, 'uid'> & { createdAt: Timestamp } = {
    username: username.toLowerCase().trim(),
    displayName,
    avatar: null,
    isOnline: true,
    lastSeen: null,
    createdAt: serverTimestamp() as Timestamp,
  }
  
  await setDoc(doc(db, 'users', cred.user.uid), userData)
  
  // Reserve username
  await setDoc(doc(db, 'usernames', username.toLowerCase().trim()), {
    uid: cred.user.uid,
    createdAt: serverTimestamp() as Timestamp,
  })
  
  return {
    uid: cred.user.uid,
    username: username.toLowerCase().trim(),
    displayName,
    avatar: null,
    isOnline: true,
    lastSeen: null,
  }
}

export async function loginUser(username: string, password: string): Promise<User> {
  const email = usernameToEmail(username)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  
  // Get user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
  if (!userDoc.exists()) {
    throw new Error('User data not found')
  }
  
  const data = userDoc.data()
  return {
    uid: cred.user.uid,
    username: data.username,
    displayName: data.displayName || username,
    avatar: data.avatar || null,
    isOnline: true,
    lastSeen: null,
  }
}

export async function logoutUser(): Promise<void> {
  const user = auth.currentUser
  if (user) {
    // Set offline status
    await updateDoc(doc(db, 'users', user.uid), {
      isOnline: false,
      lastSeen: serverTimestamp(),
    }).catch(() => {})
    
    // Remove from RTDB presence
    await set(ref(rtdb, `presence/${user.uid}`), null).catch(() => {})
  }
  await signOut(auth)
}

// ============================================================
// PRESENCE (Realtime Database)
// ============================================================

export function setupPresence(uid: string): () => void {
  const presenceRef = ref(rtdb, `presence/${uid}`)
  
  // Set online
  set(presenceRef, {
    online: true,
    lastSeen: rtdbServerTimestamp(),
  })
  
  // Set offline on disconnect
  onDisconnect(presenceRef).set({
    online: false,
    lastSeen: rtdbServerTimestamp(),
  })
  
  // Also update Firestore
  updateDoc(doc(db, 'users', uid), { isOnline: true }).catch(() => {})
  
  // Listen for heartbeat - update presence periodically
  const heartbeat = setInterval(() => {
    set(presenceRef, {
      online: true,
      lastSeen: rtdbServerTimestamp(),
    })
  }, 30000) // Every 30 seconds
  
  return () => {
    clearInterval(heartbeat)
    set(presenceRef, {
      online: false,
      lastSeen: rtdbServerTimestamp(),
    }).catch(() => {})
  }
}

export function listenToPresence(callback: (users: Record<string, boolean>) => void): () => void {
  const presenceRef = ref(rtdb, 'presence')
  
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const data = snapshot.val() || {}
    const onlineUsers: Record<string, boolean> = {}
    Object.keys(data).forEach((uid) => {
      onlineUsers[uid] = data[uid]?.online || false
    })
    callback(onlineUsers)
  })
  
  return () => off(presenceRef)
}

// ============================================================
// CHAT ROOMS
// ============================================================

export async function createDirectChatRoom(currentUid: string, otherUid: string): Promise<string> {
  // Check if room already exists
  const roomsRef = collection(db, 'chatRooms')
  const q = query(
    roomsRef,
    where('type', '==', 'direct'),
    where('participants', 'array-contains', currentUid),
  )
  const snapshot = await getDocs(q)
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    if (data.participants.includes(otherUid)) {
      return docSnap.id // Room already exists
    }
  }
  
  // Create new room
  const roomData = {
    type: 'direct',
    name: null,
    avatar: null,
    participants: [currentUid, otherUid],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    lastMessage: null,
  }
  
  const docRef = await addDoc(collection(db, 'chatRooms'), roomData)
  return docRef.id
}

export async function createGroupChatRoom(name: string, creatorUid: string, participantUids: string[]): Promise<string> {
  const allParticipants = [creatorUid, ...participantUids.filter(uid => uid !== creatorUid)]
  
  const roomData = {
    type: 'group' as const,
    name,
    avatar: null,
    participants: allParticipants,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    lastMessage: null,
  }
  
  const docRef = await addDoc(collection(db, 'chatRooms'), roomData)
  return docRef.id
}

export function listenToChatRooms(uid: string, callback: (rooms: ChatRoom[]) => void): () => void {
  const roomsRef = collection(db, 'chatRooms')
  // Note: Removed orderBy to avoid needing a composite index.
  // Sorting is done client-side instead.
  const q = query(
    roomsRef,
    where('participants', 'array-contains', uid),
  )
  
  return onSnapshot(q, async (snapshot) => {
    const rooms: ChatRoom[] = []
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      
      // Get participant info for display names
      let roomName = data.name
      let roomAvatar = data.avatar
      
      if (data.type === 'direct') {
        // Get other user's info
        const otherUid = data.participants.find((p: string) => p !== uid)
        if (otherUid) {
          try {
            const otherUserDoc = await getDoc(doc(db, 'users', otherUid))
            if (otherUserDoc.exists()) {
              const otherData = otherUserDoc.data()
              roomName = otherData.displayName || otherData.username
              roomAvatar = otherData.avatar
            }
          } catch {
            roomName = 'User'
          }
        }
      }
      
      rooms.push({
        id: docSnap.id,
        type: data.type,
        name: roomName,
        avatar: roomAvatar,
        participants: data.participants,
        lastMessage: data.lastMessage ? {
          id: '',
          content: data.lastMessage.content || '',
          type: data.lastMessage.type || 'text',
          senderId: data.lastMessage.senderId || '',
          senderName: data.lastMessage.senderName || '',
          chatRoomId: docSnap.id,
          createdAt: data.lastMessage.createdAt?.toMillis?.() || Date.now(),
          read: data.lastMessage.read !== false,
        } : null,
        unreadCount: 0,
        updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
      })
    }
    
    // Sort rooms by updatedAt descending (client-side, avoids needing composite index)
    rooms.sort((a, b) => b.updatedAt - a.updatedAt)
    
    callback(rooms)
  }, (error) => {
    console.error('Error listening to chat rooms:', error)
  })
}

// ============================================================
// MESSAGES
// ============================================================

export async function sendMessage(roomId: string, content: string, senderId: string, senderName: string, type: 'text' | 'image' = 'text'): Promise<string> {
  const messagesRef = collection(db, 'chatRooms', roomId, 'messages')
  
  const messageData = {
    content,
    type,
    senderId,
    senderName,
    createdAt: serverTimestamp() as Timestamp,
    read: false,
  }
  
  const docRef = await addDoc(messagesRef, messageData)
  
  // Update room's last message and timestamp
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage: {
      content: type === 'text' ? content : '📷 Photo',
      type,
      senderId,
      senderName,
      createdAt: serverTimestamp() as Timestamp,
      read: false,
    },
    updatedAt: serverTimestamp() as Timestamp,
  })
  
  return docRef.id
}

export function listenToMessages(roomId: string, callback: (messages: Message[]) => void): () => void {
  const messagesRef = collection(db, 'chatRooms', roomId, 'messages')
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(200))
  
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        content: data.content,
        type: data.type || 'text',
        senderId: data.senderId,
        senderName: data.senderName,
        chatRoomId: roomId,
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
        read: data.read,
      }
    })
    callback(messages)
  }, (error) => {
    console.error('Error listening to messages:', error)
  })
}

// ============================================================
// USERS
// ============================================================

export async function searchUsers(query: string, currentUid: string): Promise<User[]> {
  const usersRef = collection(db, 'users')
  const q1 = query_search(usersRef, 'username', query.toLowerCase())
  const q2 = query_search(usersRef, 'displayName', query)
  
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
  
  const usersMap = new Map<string, User>()
  
  const processSnapshot = (snapshot: any) => {
    snapshot.docs.forEach((docSnap: any) => {
      if (docSnap.id !== currentUid && !usersMap.has(docSnap.id)) {
        const data = docSnap.data()
        usersMap.set(docSnap.id, {
          uid: docSnap.id,
          username: data.username,
          displayName: data.displayName || data.username,
          avatar: data.avatar,
          isOnline: data.isOnline,
          lastSeen: data.lastSeen?.toMillis?.() || null,
        })
      }
    })
  }
  
  processSnapshot(snap1)
  processSnapshot(snap2)
  
  return Array.from(usersMap.values())
}

// Helper for case-insensitive prefix search
function query_search(ref: any, field: string, searchTerm: string) {
  return query(
    ref,
    where(field, '>=', searchTerm),
    where(field, '<=', searchTerm + '\uf8ff'),
    limit(10),
  )
}

export async function getAllUsers(currentUid: string): Promise<User[]> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, limit(100))
  const snapshot = await getDocs(q)
  
  return snapshot.docs
    .filter(docSnap => docSnap.id !== currentUid)
    .map(docSnap => {
      const data = docSnap.data()
      return {
        uid: docSnap.id,
        username: data.username,
        displayName: data.displayName || data.username,
        avatar: data.avatar,
        isOnline: data.isOnline,
        lastSeen: data.lastSeen?.toMillis?.() || null,
      }
    })
}

export async function updateProfileData(uid: string, updates: { displayName?: string; avatar?: string }): Promise<void> {
  await updateDoc(doc(db, 'users', uid), updates)
  if (updates.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: updates.displayName })
  }
}

// ============================================================
// TYPING INDICATORS
// ============================================================

export function setTyping(roomId: string, uid: string, username: string, isTyping: boolean): void {
  const typingRef = ref(rtdb, `typing/${roomId}/${uid}`)
  if (isTyping) {
    set(typingRef, { username, timestamp: rtdbServerTimestamp() })
    // Auto-clear after 3 seconds
    setTimeout(() => {
      set(typingRef, null)
    }, 3000)
  } else {
    set(typingRef, null)
  }
}

export function listenToTyping(roomId: string, callback: (usernames: string[]) => void): () => void {
  const typingRef = ref(rtdb, `typing/${roomId}`)
  
  const unsubscribe = onValue(typingRef, (snapshot) => {
    const data = snapshot.val() || {}
    const usernames = Object.values(data).map((v: any) => v.username).filter(Boolean)
    callback(usernames)
  })
  
  return () => off(typingRef)
}
