import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore'
import {
  ref, set, onDisconnect, onValue, off,
  serverTimestamp as rtdbServerTimestamp,
} from 'firebase/database'
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth'
import { auth, db, rtdb } from './firebase'
import type { User, Message, ChatRoom, ChatRequest, MessageStatus } from './store'
import { getAvatarColor } from './store'

// AI Assistant constants
export const AI_UID = 'furtherai_assistant'
export const AI_USERNAME = 'furtherai'
export const AI_DISPLAY_NAME = 'FurtherAI'
export const AI_AVATAR_COLOR = '#8b5cf6'

export interface SendChatRequestResult {
  type: 'request' | 'restored'
  roomId?: string
  requestId?: string
}

export function sanitizeInput(input: string, maxLength: number = 500): string {
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLength)
}

export function sanitizeUsername(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9_]/g, '').trim().slice(0, 20)
}

export function usernameToEmail(username: string): string {
  return `${username.toLowerCase().trim()}@chatapp.local`
}

// ==================== ENCRYPTION ====================
// Simple but effective AES-like encryption to prevent casual reading of messages in Firebase console
// Uses a deterministic key derived from the room ID so all participants can decrypt

const ENCRYPTION_SALT = 'FurtherChat_2024_SecureKey_v1'

function deriveKey(roomId: string): string {
  // Simple key derivation from room ID
  let hash = 0
  const combined = roomId + ENCRYPTION_SALT
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Generate a longer key by repeating the hash pattern
  const keyBase = Math.abs(hash).toString(36).padStart(8, '0')
  return (keyBase + keyBase.split('').reverse().join('') + keyBase).slice(0, 32)
}

export function encryptMessage(content: string, roomId: string): string {
  if (!content || content === 'This message was deleted' || content === 'Chat request accepted! You can now message each other.') return content
  try {
    const key = deriveKey(roomId)
    let result = ''
    for (let i = 0; i < content.length; i++) {
      const charCode = content.charCodeAt(i)
      const keyCode = key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode ^ keyCode)
    }
    // Encode to base64 for safe storage
    return 'ENC:' + btoa(unescape(encodeURIComponent(result)))
  } catch {
    return content
  }
}

export function decryptMessage(encrypted: string, roomId: string): string {
  if (!encrypted || !encrypted.startsWith('ENC:')) return encrypted
  try {
    const key = deriveKey(roomId)
    const decoded = decodeURIComponent(escape(atob(encrypted.slice(4))))
    let result = ''
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i)
      const keyCode = key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode ^ keyCode)
    }
    return result
  } catch {
    return encrypted
  }
}

// ==================== AUTH ====================

export async function registerUser(username: string, password: string, displayName: string): Promise<User> {
  const cleanUsername = sanitizeUsername(username)
  const cleanDisplayName = sanitizeInput(displayName, 30)
  if (cleanUsername.length < 3) throw new Error('Username must be at least 3 characters')
  if (password.length < 6) throw new Error('Password must be at least 6 characters')
  if (cleanDisplayName.length < 2) throw new Error('Display name must be at least 2 characters')
  const email = usernameToEmail(cleanUsername)
  const usernameDoc = await getDoc(doc(db, 'usernames', cleanUsername))
  if (usernameDoc.exists()) throw new Error('Username already taken')
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: cleanDisplayName })
  const avatarColor = getAvatarColor(cred.user.uid)
  await setDoc(doc(db, 'users', cred.user.uid), {
    username: cleanUsername, displayName: cleanDisplayName, avatar: null, avatarColor,
    isOnline: true, lastSeen: null, usernameChangedAt: null,
    lastActiveAt: serverTimestamp() as Timestamp,
    createdAt: serverTimestamp() as Timestamp,
    blockedUsers: [],
    starredUsers: [],
  })
  await setDoc(doc(db, 'usernames', cleanUsername), { uid: cred.user.uid, createdAt: serverTimestamp() as Timestamp })
  return { uid: cred.user.uid, username: cleanUsername, displayName: cleanDisplayName, avatar: null, avatarColor, isOnline: true, lastSeen: null, usernameChangedAt: null }
}

export async function loginUser(username: string, password: string): Promise<User> {
  const email = usernameToEmail(username)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
  if (!userDoc.exists()) throw new Error('User data not found')
  const data = userDoc.data()
  // Update last active timestamp
  await updateDoc(doc(db, 'users', cred.user.uid), { lastActiveAt: serverTimestamp(), isOnline: true }).catch(() => {})
  // Check for and cleanup inactive users (30 days)
  try { await cleanupInactiveUsers() } catch {}
  return { uid: cred.user.uid, username: data.username, displayName: data.displayName || username, avatar: data.avatar, avatarColor: data.avatarColor || getAvatarColor(cred.user.uid), isOnline: true, lastSeen: null, usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null }
}

export async function logoutUser(): Promise<void> {
  const user = auth.currentUser
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), { isOnline: false, lastSeen: serverTimestamp(), lastActiveAt: serverTimestamp() }).catch(() => {})
    await set(ref(rtdb, `presence/${user.uid}`), null).catch(() => {})
  }
  await signOut(auth)
}

export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Not authenticated')
  if (newPassword.length < 6) throw new Error('New password must be at least 6 characters')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

// ==================== AUTO-DELETE INACTIVE USERS (30 DAYS) ====================

async function cleanupInactiveUsers(): Promise<void> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const usersSnap = await getDocs(collection(db, 'users'))
  const batchDeletes: Promise<void>[] = []

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data()
    const lastActive = data.lastActiveAt?.toMillis?.() || data.createdAt?.toMillis?.() || 0
    const isCurrentlyOnline = data.isOnline === true

    // Only delete if offline AND inactive for 30+ days
    if (!isCurrentlyOnline && lastActive > 0 && lastActive < thirtyDaysAgo.getTime()) {
      const uid = userDoc.id
      // Delete user document
      batchDeletes.push(deleteDoc(doc(db, 'users', uid)).catch(() => {}))
      // Delete username mapping
      if (data.username) {
        batchDeletes.push(deleteDoc(doc(db, 'usernames', data.username)).catch(() => {}))
      }
      // Delete user's chat rooms (where they're the only remaining participant)
      try {
        const roomsSnap = await getDocs(query(collection(db, 'chatRooms'), where('participants', 'array-contains', uid)))
        for (const roomDoc of roomsSnap.docs) {
          const roomData = roomDoc.data()
          // Mark user as having deleted the room
          const deletedFor: string[] = roomData.deletedFor || []
          if (!deletedFor.includes(uid)) {
            deletedFor.push(uid)
          }
          // If all participants have deleted, remove the room entirely
          const allDeleted = (roomData.participants as string[]).every((p: string) => deletedFor.includes(p))
          if (allDeleted) {
            // Delete messages
            const msgsSnap = await getDocs(collection(db, 'chatRooms', roomDoc.id, 'messages'))
            for (let i = 0; i < msgsSnap.docs.length; i += 400) {
              const chunk = msgsSnap.docs.slice(i, i + 400)
              const batch = writeBatch(db)
              chunk.forEach(d => batch.delete(d.ref))
              await batch.commit()
            }
            await deleteDoc(doc(db, 'chatRooms', roomDoc.id))
          } else {
            await updateDoc(doc(db, 'chatRooms', roomDoc.id), { deletedFor })
          }
        }
      } catch {}
      // Delete presence data
      await set(ref(rtdb, `presence/${uid}`), null).catch(() => {})
    }
  }

  await Promise.all(batchDeletes)
}

// ==================== DELETE ACCOUNT ====================

export async function deleteAccount(uid: string, password: string): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Not authenticated')
  if (user.uid !== uid) throw new Error('User mismatch')

  // Re-authenticate before deletion
  const credential = EmailAuthProvider.credential(user.email, password)
  await reauthenticateWithCredential(user, credential)

  // Get user data for cleanup
  const userDoc = await getDoc(doc(db, 'users', uid))
  const userData = userDoc.exists() ? userDoc.data() : null
  const username = userData?.username

  // Delete all chat rooms the user is part of
  try {
    const roomsSnap = await getDocs(query(collection(db, 'chatRooms'), where('participants', 'array-contains', uid)))
    for (const roomDoc of roomsSnap.docs) {
      const roomData = roomDoc.data()
      const deletedFor: string[] = roomData.deletedFor || []
      const allParticipants = roomData.participants as string[]
      const newDeletedFor = [...deletedFor, uid]
      const allDeleted = allParticipants.every((p: string) => newDeletedFor.includes(p))

      if (allDeleted) {
        // All participants deleted - remove room entirely
        const msgsSnap = await getDocs(collection(db, 'chatRooms', roomDoc.id, 'messages'))
        for (let i = 0; i < msgsSnap.docs.length; i += 400) {
          const chunk = msgsSnap.docs.slice(i, i + 400)
          const batch = writeBatch(db)
          chunk.forEach(d => batch.delete(d.ref))
          await batch.commit()
        }
        await deleteDoc(doc(db, 'chatRooms', roomDoc.id))
      } else {
        // Mark as deleted for this user only
        await updateDoc(doc(db, 'chatRooms', roomDoc.id), { deletedFor: newDeletedFor })
      }
    }
  } catch (err) { console.error('Error cleaning up chat rooms:', err) }

  // Delete chat requests involving this user
  try {
    const sentReqSnap = await getDocs(query(collection(db, 'chatRequests'), where('fromUid', '==', uid)))
    const recvReqSnap = await getDocs(query(collection(db, 'chatRequests'), where('toUid', '==', uid)))
    const allReqs = [...sentReqSnap.docs, ...recvReqSnap.docs]
    for (let i = 0; i < allReqs.length; i += 400) {
      const chunk = allReqs.slice(i, i + 400)
      const batch = writeBatch(db)
      chunk.forEach(d => batch.delete(d.ref))
      await batch.commit()
    }
  } catch (err) { console.error('Error cleaning up chat requests:', err) }

  // Delete presence data from RTDB
  await set(ref(rtdb, `presence/${uid}`), null).catch(() => {})
  await set(ref(rtdb, `typing`), null).catch(() => {}) // Clean up any lingering typing status

  // Delete username reservation
  if (username) {
    await deleteDoc(doc(db, 'usernames', username)).catch(() => {})
  }

  // Delete user document
  await deleteDoc(doc(db, 'users', uid))

  // Delete Firebase Auth account (must be last)
  await deleteUser(user)

  // Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('chatUser')
    localStorage.removeItem('chatTheme')
    localStorage.removeItem('chatWallpaper')
    localStorage.removeItem('pinnedChats')
    localStorage.removeItem('messageReactions')
    localStorage.removeItem('notifSound')
  }
}

// ==================== STAR USER ====================

export async function starUser(currentUid: string, userToStarUid: string): Promise<void> {
  const userDoc = await getDoc(doc(db, 'users', currentUid))
  if (!userDoc.exists()) throw new Error('User not found')
  const data = userDoc.data()
  const starredUsers: string[] = data.starredUsers || []
  if (!starredUsers.includes(userToStarUid)) {
    await updateDoc(doc(db, 'users', currentUid), {
      starredUsers: [...starredUsers, userToStarUid]
    })
  }
}

export async function unstarUser(currentUid: string, userToUnstarUid: string): Promise<void> {
  const userDoc = await getDoc(doc(db, 'users', currentUid))
  if (!userDoc.exists()) throw new Error('User not found')
  const data = userDoc.data()
  const starredUsers: string[] = data.starredUsers || []
  await updateDoc(doc(db, 'users', currentUid), {
    starredUsers: starredUsers.filter(uid => uid !== userToUnstarUid)
  })
}

export async function getStarredUsers(uid: string): Promise<string[]> {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) return []
  return userDoc.data().starredUsers || []
}

export function listenToStarredUsers(uid: string, callback: (starred: string[]) => void): () => void {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) {
      callback(snap.data().starredUsers || [])
    } else {
      callback([])
    }
  }, () => callback([]))
}

// ==================== BLOCK USER ====================

export async function blockUser(currentUid: string, userToBlockUid: string): Promise<void> {
  const userDoc = await getDoc(doc(db, 'users', currentUid))
  if (!userDoc.exists()) throw new Error('User not found')
  const data = userDoc.data()
  const blockedUsers: string[] = data.blockedUsers || []
  if (!blockedUsers.includes(userToBlockUid)) {
    await updateDoc(doc(db, 'users', currentUid), {
      blockedUsers: [...blockedUsers, userToBlockUid]
    })
  }
}

export async function unblockUser(currentUid: string, userToUnblockUid: string): Promise<void> {
  const userDoc = await getDoc(doc(db, 'users', currentUid))
  if (!userDoc.exists()) throw new Error('User not found')
  const data = userDoc.data()
  const blockedUsers: string[] = data.blockedUsers || []
  await updateDoc(doc(db, 'users', currentUid), {
    blockedUsers: blockedUsers.filter(uid => uid !== userToUnblockUid)
  })
}

export async function getBlockedUsers(uid: string): Promise<string[]> {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) return []
  return userDoc.data().blockedUsers || []
}

export function listenToBlockedUsers(uid: string, callback: (blocked: string[]) => void): () => void {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) {
      callback(snap.data().blockedUsers || [])
    } else {
      callback([])
    }
  }, () => callback([]))
}

export async function isUserBlocked(currentUid: string, otherUid: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, 'users', otherUid))
  if (!userDoc.exists()) return false
  const blockedUsers: string[] = userDoc.data().blockedUsers || []
  return blockedUsers.includes(currentUid)
}

// ==================== PRESENCE ====================

export function setupPresence(uid: string): () => void {
  const presenceRef = ref(rtdb, `presence/${uid}`)
  const connectedRef = ref(rtdb, '.info/connected')
  
  let isConnected = false
  const connUnsub = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      isConnected = true
      set(presenceRef, { online: true, lastSeen: rtdbServerTimestamp() })
      onDisconnect(presenceRef).set({ online: false, lastSeen: rtdbServerTimestamp() })
    } else {
      isConnected = false
    }
  })
  
  updateDoc(doc(db, 'users', uid), { isOnline: true, lastSeen: serverTimestamp(), lastActiveAt: serverTimestamp() }).catch(() => {})
  
  const heartbeat = setInterval(() => {
    if (isConnected) {
      set(presenceRef, { online: true, lastSeen: rtdbServerTimestamp() })
    }
    updateDoc(doc(db, 'users', uid), { isOnline: true, lastSeen: serverTimestamp(), lastActiveAt: serverTimestamp() }).catch(() => {})
  }, 30000)
  
  return () => {
    clearInterval(heartbeat)
    connUnsub()
    set(presenceRef, { online: false, lastSeen: rtdbServerTimestamp() }).catch(() => {})
    updateDoc(doc(db, 'users', uid), { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {})
  }
}

export function listenToPresence(callback: (users: Record<string, { online: boolean; lastSeen: number }>) => void): () => void {
  let rtdbUsers: Record<string, { online: boolean; lastSeen: number }> = {}
  let firestoreUsers: Record<string, { online: boolean; lastSeen: number }> = {}
  
  const presenceRef = ref(rtdb, 'presence')
  const rtdbUnsub = onValue(presenceRef, (snapshot) => {
    const data = snapshot.val() || {}
    rtdbUsers = {}
    Object.keys(data).forEach((uid) => {
      const val = data[uid]
      if (val) {
        rtdbUsers[uid] = { online: val.online === true, lastSeen: val.lastSeen || 0 }
      }
    })
    const merged = { ...firestoreUsers }
    Object.keys(rtdbUsers).forEach(uid => {
      merged[uid] = rtdbUsers[uid]
    })
    callback(merged)
  }, (error) => {
    console.warn('RTDB presence listen failed, using Firestore only:', error)
    callback(firestoreUsers)
  })
  
  const firestoreUnsub = onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      firestoreUsers = {}
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data()
        firestoreUsers[docSnap.id] = {
          online: data.isOnline === true,
          lastSeen: data.lastSeen?.toMillis?.() || 0,
        }
      })
      const merged = { ...firestoreUsers }
      Object.keys(rtdbUsers).forEach(uid => {
        merged[uid] = rtdbUsers[uid]
      })
      callback(merged)
    },
    (error) => {
      console.warn('Firestore presence listen failed:', error)
    }
  )
  
  return () => {
    rtdbUnsub()
    firestoreUnsub()
  }
}

// ==================== CHAT ROOMS ====================

export async function createDirectChatRoom(currentUid: string, otherUid: string): Promise<string> {
  const roomsRef = collection(db, 'chatRooms')
  const q = query(roomsRef, where('type', '==', 'direct'), where('participants', 'array-contains', currentUid))
  const snapshot = await getDocs(q)
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    if (data.participants.includes(otherUid)) {
      const deletedFor: string[] = data.deletedFor || []
      if (deletedFor.includes(currentUid)) {
        await updateDoc(doc(db, 'chatRooms', docSnap.id), {
          deletedFor: deletedFor.filter((uid: string) => uid !== currentUid),
          updatedAt: serverTimestamp() as Timestamp,
        })
      }
      return docSnap.id
    }
  }
  const docRef = await addDoc(collection(db, 'chatRooms'), {
    type: 'direct', name: null, avatar: null, avatarColor: getAvatarColor(otherUid),
    participants: [currentUid, otherUid], deletedFor: [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp, lastMessage: null,
  })
  return docRef.id
}

export async function createGroupChatRoom(name: string, creatorUid: string, participantUids: string[]): Promise<string> {
  const allParticipants = [creatorUid, ...participantUids.filter(uid => uid !== creatorUid)]
  const docRef = await addDoc(collection(db, 'chatRooms'), {
    type: 'group' as const, name: sanitizeInput(name, 50), avatar: null, avatarColor: '#8b5cf6',
    participants: allParticipants, deletedFor: [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp, lastMessage: null,
  })
  return docRef.id
}

export function listenToChatRooms(uid: string, callback: (rooms: ChatRoom[]) => void): () => void {
  const q = query(collection(db, 'chatRooms'), where('participants', 'array-contains', uid))
  return onSnapshot(q, async (snapshot) => {
    const rooms: ChatRoom[] = []
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      const roomDeletedFor: string[] = data.deletedFor || []
      if (roomDeletedFor.includes(uid)) continue
      let roomName = data.name, roomAvatar = data.avatar
      if (data.type === 'direct') {
        const otherUid = data.participants.find((p: string) => p !== uid)
        if (otherUid) {
          // Handle AI user specially
          if (otherUid === AI_UID) {
            roomName = AI_DISPLAY_NAME
            roomAvatar = null
          } else {
            try {
              const d = await getDoc(doc(db, 'users', otherUid))
              if (d.exists()) { const od = d.data(); roomName = od.displayName || od.username; roomAvatar = od.avatar }
            } catch { roomName = 'User' }
          }
        }
      }
      rooms.push({
        id: docSnap.id, type: data.type, name: roomName, avatar: roomAvatar,
        avatarColor: data.avatarColor || getAvatarColor(docSnap.id), participants: data.participants,
        lastMessage: data.lastMessage ? {
          id: '', content: decryptMessage(data.lastMessage.content || '', docSnap.id), type: data.lastMessage.type || 'text',
          senderId: data.lastMessage.senderId || '', senderName: data.lastMessage.senderName || '',
          senderAvatar: null, senderAvatarColor: '', chatRoomId: docSnap.id,
          createdAt: data.lastMessage.createdAt?.toMillis?.() || Date.now(),
          status: data.lastMessage.status || 'sent', readBy: data.lastMessage.readBy || [],
          deletedFor: [], deletedForEveryone: false,
        } : null,
        unreadCount: 0, updatedAt: data.updatedAt?.toMillis?.() || Date.now(), createdAt: data.createdAt?.toMillis?.() || Date.now(),
      })
    }
    rooms.sort((a, b) => b.updatedAt - a.updatedAt)
    callback(rooms)
  }, (error) => { console.error('Error listening to chat rooms:', error) })
}

// ==================== MESSAGES ====================

export async function sendMessage(roomId: string, content: string, senderId: string, senderName: string, senderAvatar: string | null, senderAvatarColor: string, type: 'text' | 'image' = 'text', replyTo?: string | null, replyToContent?: string | null, replyToSender?: string | null): Promise<string> {
  const cleanContent = sanitizeInput(content, 2000)
  if (!cleanContent) throw new Error('Message cannot be empty')
  // Encrypt content before storing
  const encryptedContent = encryptMessage(cleanContent, roomId)
  const encryptedReplyContent = replyToContent ? encryptMessage(sanitizeInput(replyToContent, 200), roomId) : null
  const messageData = {
    content: encryptedContent, type, senderId, senderName, senderAvatar, senderAvatarColor,
    createdAt: serverTimestamp() as Timestamp, status: 'sent' as MessageStatus,
    readBy: [senderId], deletedFor: [], deletedForEveryone: false,
    replyTo: replyTo || null, replyToContent: encryptedReplyContent, replyToSender: replyToSender || null,
    encrypted: true,
  }
  const docRef = await addDoc(collection(db, 'chatRooms', roomId, 'messages'), messageData)
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage: {
      content: encryptMessage(type === 'text' ? cleanContent : '📷 Photo', roomId), type, senderId, senderName,
      createdAt: serverTimestamp() as Timestamp, status: 'sent' as MessageStatus, readBy: [senderId],
      encrypted: true,
    },
    updatedAt: serverTimestamp() as Timestamp,
  })
  return docRef.id
}

export function listenToMessages(roomId: string, currentUid: string, callback: (messages: Message[]) => void): () => void {
  const q = query(collection(db, 'chatRooms', roomId, 'messages'), orderBy('createdAt', 'asc'), limit(500))
  return onSnapshot(q, (snapshot) => {
    const msgs: Message[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      const isEncrypted = data.encrypted === true
      const decryptedContent = isEncrypted ? decryptMessage(data.content, roomId) : data.content
      const decryptedReplyContent = data.replyToContent && isEncrypted ? decryptMessage(data.replyToContent, roomId) : data.replyToContent
      return {
        id: docSnap.id, content: decryptedContent, type: data.type || 'text',
        senderId: data.senderId, senderName: data.senderName,
        senderAvatar: data.senderAvatar || null, senderAvatarColor: data.senderAvatarColor || '',
        chatRoomId: roomId, createdAt: data.createdAt?.toMillis?.() || Date.now(),
        status: data.status || 'sent', readBy: data.readBy || [],
        deletedFor: data.deletedFor || [], deletedForEveryone: data.deletedForEveryone || false,
        replyTo: data.replyTo || null, replyToContent: decryptedReplyContent, replyToSender: data.replyToSender || null,
      }
    })
    // Mark messages as "delivered" for messages sent by other users that are still 'sent'
    const deliveredMsgs = msgs.filter(m => m.senderId !== currentUid && m.status === 'sent' && !m.deletedForEveryone && m.type !== 'system')
    if (deliveredMsgs.length > 0) {
      const dBatch = writeBatch(db)
      deliveredMsgs.forEach(m => {
        dBatch.update(doc(db, 'chatRooms', roomId, 'messages', m.id), { status: 'delivered' })
      })
      const lastM = msgs[msgs.length - 1]
      if (lastM && deliveredMsgs.some(m => m.id === lastM.id) && lastM.senderId !== currentUid) {
        dBatch.update(doc(db, 'chatRooms', roomId), {
          'lastMessage.status': 'delivered',
        })
      }
      dBatch.commit().catch(() => {})
    }

    const unreadMsgs = msgs.filter(m => m.senderId !== currentUid && !m.readBy.includes(currentUid) && !m.deletedForEveryone && m.type !== 'system')
    if (unreadMsgs.length > 0) {
      const batch = writeBatch(db)
      unreadMsgs.forEach(m => {
        batch.update(doc(db, 'chatRooms', roomId, 'messages', m.id), { readBy: [...m.readBy, currentUid], status: 'read' })
      })
      const lastMsg = msgs[msgs.length - 1]
      if (lastMsg && unreadMsgs.some(m => m.id === lastMsg.id)) {
        batch.update(doc(db, 'chatRooms', roomId), {
          'lastMessage.status': 'read',
          'lastMessage.readBy': [...lastMsg.readBy, currentUid],
        })
      }
      batch.commit().catch(() => {})
    }
    const lastMsg = msgs[msgs.length - 1]
    if (lastMsg && lastMsg.status === 'read' && lastMsg.senderId === currentUid) {
      getDoc(doc(db, 'chatRooms', roomId)).then(roomSnap => {
        if (roomSnap.exists() && roomSnap.data().lastMessage?.status !== 'read' && roomSnap.data().lastMessage?.senderId === currentUid) {
          updateDoc(doc(db, 'chatRooms', roomId), {
            'lastMessage.status': 'read',
            'lastMessage.readBy': lastMsg.readBy,
          }).catch(() => {})
        }
      }).catch(() => {})
    }
    callback(msgs)
  }, (error) => { console.error('Error listening to messages:', error) })
}

export async function deleteMessageForMe(roomId: string, messageId: string, uid: string): Promise<void> {
  const msgDoc = await getDoc(doc(db, 'chatRooms', roomId, 'messages', messageId))
  if (!msgDoc.exists()) return
  const data = msgDoc.data()
  const deletedFor: string[] = data.deletedFor || []
  if (!deletedFor.includes(uid)) {
    await updateDoc(doc(db, 'chatRooms', roomId, 'messages', messageId), { deletedFor: [...deletedFor, uid] })
  }
}

export async function deleteMessageForEveryone(roomId: string, messageId: string, senderId: string): Promise<void> {
  const msgDoc = await getDoc(doc(db, 'chatRooms', roomId, 'messages', messageId))
  if (!msgDoc.exists()) throw new Error('Message not found')
  const data = msgDoc.data()
  if (data.senderId !== senderId) throw new Error('Only the sender can delete this message for everyone')
  const messageTime = data.createdAt?.toMillis?.() || 0
  const hoursSince = (Date.now() - messageTime) / (1000 * 60 * 60)
  if (hoursSince > 48) throw new Error('You can only delete messages for everyone within 48 hours')
  // Store the deleted message indicator unencrypted (it's a system message)
  await updateDoc(doc(db, 'chatRooms', roomId, 'messages', messageId), {
    deletedForEveryone: true, content: 'This message was deleted', type: 'deleted', encrypted: false,
  })
  try {
    const roomDoc = await getDoc(doc(db, 'chatRooms', roomId))
    if (roomDoc.exists()) {
      const roomData = roomDoc.data()
      if (roomData.lastMessage) {
        const lastMsgTime = roomData.lastMessage.createdAt?.toMillis?.() || 0
        if (Math.abs(lastMsgTime - messageTime) < 2000) {
          await updateDoc(doc(db, 'chatRooms', roomId), {
            lastMessage: { ...roomData.lastMessage, content: 'This message was deleted', type: 'deleted' },
          })
        }
      }
    }
  } catch {}
}

export async function clearChatForMe(roomId: string, uid: string): Promise<void> {
  const msgsSnap = await getDocs(collection(db, 'chatRooms', roomId, 'messages'))
  const updates: { id: string; deletedFor: string[] }[] = []
  msgsSnap.docs.forEach((docSnap) => {
    const data = docSnap.data()
    if (data.type === 'system') return
    const deletedFor: string[] = data.deletedFor || []
    if (!deletedFor.includes(uid)) {
      updates.push({ id: docSnap.id, deletedFor })
    }
  })
  for (let i = 0; i < updates.length; i += 400) {
    const chunk = updates.slice(i, i + 400)
    const batch = writeBatch(db)
    chunk.forEach(u => {
      batch.update(doc(db, 'chatRooms', roomId, 'messages', u.id), { deletedFor: [...u.deletedFor, uid] })
    })
    await batch.commit()
  }
}

export async function deleteChatRoom(roomId: string, uid: string): Promise<void> {
  await clearChatForMe(roomId, uid)
  const roomDoc = await getDoc(doc(db, 'chatRooms', roomId))
  if (roomDoc.exists()) {
    const data = roomDoc.data()
    const roomDeletedFor: string[] = data.deletedFor || []
    if (!roomDeletedFor.includes(uid)) {
      const newDeletedFor = [...roomDeletedFor, uid]
      const allParticipants = data.participants as string[]
      const allDeleted = allParticipants.every((p: string) => newDeletedFor.includes(p))
      if (allDeleted) {
        const msgsSnap = await getDocs(collection(db, 'chatRooms', roomId, 'messages'))
        for (let i = 0; i < msgsSnap.docs.length; i += 400) {
          const chunk = msgsSnap.docs.slice(i, i + 400)
          const batch = writeBatch(db)
          chunk.forEach((d) => { batch.delete(d.ref) })
          await batch.commit()
        }
        await deleteDoc(doc(db, 'chatRooms', roomId))
      } else {
        await updateDoc(doc(db, 'chatRooms', roomId), { deletedFor: newDeletedFor })
      }
    }
  }
}

// ==================== USERNAME ====================

export async function changeUsername(uid: string, newUsername: string): Promise<void> {
  const cleanUsername = sanitizeUsername(newUsername)
  if (cleanUsername.length < 3) throw new Error('Username must be at least 3 characters')
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) throw new Error('User not found')
  const data = userDoc.data()
  if (data.usernameChangedAt) {
    const lastChanged = data.usernameChangedAt.toMillis?.() || 0
    const daysSince = (Date.now() - lastChanged) / (1000 * 60 * 60 * 24)
    if (daysSince < 30) {
      const daysLeft = Math.ceil(30 - daysSince)
      throw new Error(`You can change username again in ${daysLeft} days`)
    }
  }
  const oldUsername = data.username
  const usernameDoc = await getDoc(doc(db, 'usernames', cleanUsername))
  if (usernameDoc.exists()) throw new Error('Username already taken')
  await setDoc(doc(db, 'usernames', cleanUsername), { uid, createdAt: serverTimestamp() as Timestamp })
  await updateDoc(doc(db, 'users', uid), { username: cleanUsername, usernameChangedAt: serverTimestamp() as Timestamp })
  if (oldUsername !== cleanUsername) await deleteDoc(doc(db, 'usernames', oldUsername)).catch(() => {})
}

// ==================== USERS ====================

export async function searchUsers(q: string, currentUid: string): Promise<User[]> {
  const usersRef = collection(db, 'users')
  const q1 = query(usersRef, where('username', '>=', q.toLowerCase()), where('username', '<=', q.toLowerCase() + '\uf8ff'), limit(10))
  const q2 = query(usersRef, where('displayName', '>=', q), where('displayName', '<=', q + '\uf8ff'), limit(10))
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
  const usersMap = new Map<string, User>()
  const process = (snapshot: { docs: any[] }) => {
    snapshot.docs.forEach((d: any) => {
      if (d.id !== currentUid && !usersMap.has(d.id)) {
        const data = d.data()
        usersMap.set(d.id, { uid: d.id, username: data.username, displayName: data.displayName || data.username, avatar: data.avatar, avatarColor: data.avatarColor || getAvatarColor(d.id), isOnline: data.isOnline, lastSeen: data.lastSeen?.toMillis?.() || null, usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null })
      }
    })
  }
  process(snap1); process(snap2)
  return Array.from(usersMap.values())
}

export async function getAllUsers(currentUid: string): Promise<User[]> {
  const snapshot = await getDocs(query(collection(db, 'users'), limit(100)))
  return snapshot.docs.filter(d => d.id !== currentUid).map(d => {
    const data = d.data()
    return { uid: d.id, username: data.username, displayName: data.displayName || data.username, avatar: data.avatar, avatarColor: data.avatarColor || getAvatarColor(d.id), isOnline: data.isOnline, lastSeen: data.lastSeen?.toMillis?.() || null, usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null }
  })
}

export async function updateProfileData(uid: string, updates: { displayName?: string; avatar?: string; avatarColor?: string }): Promise<void> {
  const cleanUpdates: Record<string, string> = {}
  if (updates.displayName) cleanUpdates.displayName = sanitizeInput(updates.displayName, 30)
  if (updates.avatar !== undefined) cleanUpdates.avatar = updates.avatar
  if (updates.avatarColor) cleanUpdates.avatarColor = updates.avatarColor
  await updateDoc(doc(db, 'users', uid), cleanUpdates)
  if (cleanUpdates.displayName && auth.currentUser) await updateProfile(auth.currentUser, { displayName: cleanUpdates.displayName })
}

// ==================== TYPING ====================

export function setTyping(roomId: string, uid: string, username: string, isTyping: boolean): void {
  const typingRef = ref(rtdb, `typing/${roomId}/${uid}`)
  if (isTyping) {
    set(typingRef, { username, timestamp: rtdbServerTimestamp() }).catch((err) => {
      console.warn('Failed to set typing status:', err)
    })
    if (typeof window !== 'undefined') {
      const key = `typing_timeout_${roomId}_${uid}`
      const existing = (window as any)[key]
      if (existing) clearTimeout(existing)
      ;(window as any)[key] = setTimeout(() => {
        set(typingRef, null).catch(() => {})
        delete (window as any)[key]
      }, 3000)
    }
  } else {
    set(typingRef, null).catch(() => {})
  }
}

export function listenToTyping(roomId: string, callback: (usernames: string[]) => void): () => void {
  const typingRef = ref(rtdb, `typing/${roomId}`)
  const unsub = onValue(typingRef, (snapshot) => {
    const data = snapshot.val() || {}
    const now = Date.now()
    const usernames: string[] = []
    Object.values(data).forEach((v: any) => {
      if (v && v.username) {
        const ts = v.timestamp || 0
        if (now - ts < 5000) {
          usernames.push(v.username)
        }
      }
    })
    callback(usernames)
  }, (error) => {
    console.warn('Failed to listen to typing:', error)
    callback([])
  })
  return () => {
    off(typingRef)
    unsub()
  }
}

// ==================== CHAT REQUESTS ====================

export async function sendChatRequest(
  fromUid: string, fromUsername: string, fromDisplayName: string, fromAvatar: string | null, fromAvatarColor: string,
  toUid: string, toUsername: string, toDisplayName: string, toAvatar: string | null, toAvatarColor: string,
  message: string = 'Hi, I would like to chat with you!'
): Promise<SendChatRequestResult> {
  // Check if the other user has blocked the current user
  const otherUserDoc = await getDoc(doc(db, 'users', toUid))
  if (otherUserDoc.exists()) {
    const otherBlockedUsers: string[] = otherUserDoc.data().blockedUsers || []
    if (otherBlockedUsers.includes(fromUid)) throw new Error('Cannot send request to this user')
  }

  const requestsRef = collection(db, 'chatRequests')
  const snap1 = await getDocs(query(requestsRef, where('fromUid', '==', fromUid), where('toUid', '==', toUid)))
  if (snap1.docs.find(d => d.data().status === 'pending')) throw new Error('You already sent a request to this user')
  const snap2 = await getDocs(query(requestsRef, where('fromUid', '==', toUid), where('toUid', '==', fromUid)))
  if (snap2.docs.find(d => d.data().status === 'pending')) throw new Error('This user already sent you a request. Check your incoming requests!')

  // Check for existing chat room - if room exists but user deleted it, RESTORE it
  const roomsSnap = await getDocs(query(collection(db, 'chatRooms'), where('type', '==', 'direct'), where('participants', 'array-contains', fromUid)))
  for (const roomDoc of roomsSnap.docs) {
    const data = roomDoc.data()
    if (data.participants.includes(toUid)) {
      const roomDeletedFor: string[] = data.deletedFor || []
      if (roomDeletedFor.includes(fromUid)) {
        await updateDoc(doc(db, 'chatRooms', roomDoc.id), {
          deletedFor: roomDeletedFor.filter((uid: string) => uid !== fromUid),
          updatedAt: serverTimestamp() as Timestamp,
        })
        return { type: 'restored', roomId: roomDoc.id }
      }
      throw new Error('You already have a chat with this user')
    }
  }

  const docRef = await addDoc(collection(db, 'chatRequests'), {
    fromUid, fromUsername, fromDisplayName, fromAvatar, fromAvatarColor,
    toUid, toUsername, toDisplayName, toAvatar, toAvatarColor,
    status: 'pending' as const, message: sanitizeInput(message, 200), createdAt: serverTimestamp() as Timestamp, chatRoomId: null as string | null,
  })
  return { type: 'request', requestId: docRef.id }
}

export function listenToSentRequests(uid: string, callback: (requests: ChatRequest[]) => void): () => void {
  return onSnapshot(query(collection(db, 'chatRequests'), where('fromUid', '==', uid)), (snapshot) => {
    const requests = snapshot.docs.map(d => {
      const data = d.data()
      return { id: d.id, fromUid: data.fromUid, fromUsername: data.fromUsername, fromDisplayName: data.fromDisplayName, fromAvatar: data.fromAvatar || null, fromAvatarColor: data.fromAvatarColor || '', toUid: data.toUid, toUsername: data.toUsername, toDisplayName: data.toDisplayName, toAvatar: data.toAvatar || null, toAvatarColor: data.toAvatarColor || '', status: data.status, message: data.message || '', createdAt: data.createdAt?.toMillis?.() || Date.now(), chatRoomId: data.chatRoomId || null }
    })
    requests.sort((a, b) => b.createdAt - a.createdAt)
    callback(requests)
  })
}

export function listenToReceivedRequests(uid: string, callback: (requests: ChatRequest[]) => void): () => void {
  return onSnapshot(query(collection(db, 'chatRequests'), where('toUid', '==', uid)), (snapshot) => {
    const requests = snapshot.docs.map(d => {
      const data = d.data()
      return { id: d.id, fromUid: data.fromUid, fromUsername: data.fromUsername, fromDisplayName: data.fromDisplayName, fromAvatar: data.fromAvatar || null, fromAvatarColor: data.fromAvatarColor || '', toUid: data.toUid, toUsername: data.toUsername, toDisplayName: data.toDisplayName, toAvatar: data.toAvatar || null, toAvatarColor: data.toAvatarColor || '', status: data.status, message: data.message || '', createdAt: data.createdAt?.toMillis?.() || Date.now(), chatRoomId: data.chatRoomId || null }
    })
    requests.sort((a, b) => { if (a.status === 'pending' && b.status !== 'pending') return -1; if (a.status !== 'pending' && b.status === 'pending') return 1; return b.createdAt - a.createdAt })
    callback(requests)
  })
}

export async function acceptChatRequest(requestId: string, fromUid: string, toUid: string): Promise<string> {
  const roomId = await createDirectChatRoom(fromUid, toUid)
  await updateDoc(doc(db, 'chatRequests', requestId), { status: 'accepted', chatRoomId: roomId })
  await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
    content: 'Chat request accepted! You can now message each other.', type: 'system',
    senderId: 'system', senderName: 'System', senderAvatar: null, senderAvatarColor: '',
    createdAt: serverTimestamp() as Timestamp, status: 'read' as MessageStatus,
    readBy: [fromUid, toUid], deletedFor: [], deletedForEveryone: false,
    encrypted: false,
  })
  return roomId
}

export async function rejectChatRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'chatRequests', requestId), { status: 'rejected' })
}

export async function cancelChatRequest(requestId: string): Promise<void> {
  await deleteDoc(doc(db, 'chatRequests', requestId))
}

// ==================== AI ASSISTANT ====================

// Ensure the AI "user" document exists in Firestore
export async function ensureAIUser(): Promise<void> {
  const aiUserDoc = await getDoc(doc(db, 'users', AI_UID))
  if (!aiUserDoc.exists()) {
    await setDoc(doc(db, 'users', AI_UID), {
      username: AI_USERNAME,
      displayName: AI_DISPLAY_NAME,
      avatar: null,
      avatarColor: AI_AVATAR_COLOR,
      isOnline: true,
      lastSeen: null,
      usernameChangedAt: null,
      lastActiveAt: serverTimestamp() as Timestamp,
      createdAt: serverTimestamp() as Timestamp,
      blockedUsers: [],
      starredUsers: [],
      isAI: true,
    })
    // Reserve the AI username
    await setDoc(doc(db, 'usernames', AI_USERNAME), { uid: AI_UID, createdAt: serverTimestamp() as Timestamp })
  }
}

// Create or get the AI chat room for a user
export async function createAIChatRoom(userUid: string): Promise<string> {
  // Ensure AI user exists
  await ensureAIUser()

  // Check if AI chat room already exists
  const roomsRef = collection(db, 'chatRooms')
  const q = query(roomsRef, where('type', '==', 'direct'), where('participants', 'array-contains', userUid))
  const snapshot = await getDocs(q)

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    if (data.participants.includes(AI_UID)) {
      // Room exists - restore if user deleted it
      const deletedFor: string[] = data.deletedFor || []
      if (deletedFor.includes(userUid)) {
        await updateDoc(doc(db, 'chatRooms', docSnap.id), {
          deletedFor: deletedFor.filter((uid: string) => uid !== userUid),
          updatedAt: serverTimestamp() as Timestamp,
        })
      }
      return docSnap.id
    }
  }

  // Create new AI chat room
  const docRef = await addDoc(collection(db, 'chatRooms'), {
    type: 'direct',
    name: null,
    avatar: null,
    avatarColor: AI_AVATAR_COLOR,
    participants: [userUid, AI_UID],
    deletedFor: [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    lastMessage: null,
    isAIRoom: true,
  })

  // Add welcome message from AI
  await addDoc(collection(db, 'chatRooms', docRef.id, 'messages'), {
    content: encryptMessage("Hey there! I'm FurtherAI, your AI assistant in FurtherChat! I can help you with questions, coding, creative writing, jokes, advice, and much more. Just type anything and I'll respond! What would you like to talk about? ", docRef.id),
    type: 'text',
    senderId: AI_UID,
    senderName: AI_DISPLAY_NAME,
    senderAvatar: null,
    senderAvatarColor: AI_AVATAR_COLOR,
    createdAt: serverTimestamp() as Timestamp,
    status: 'read' as MessageStatus,
    readBy: [userUid],
    deletedFor: [],
    deletedForEveryone: false,
    encrypted: true,
    isAIMessage: true,
  })

  // Update last message
  await updateDoc(doc(db, 'chatRooms', docRef.id), {
    lastMessage: {
      content: encryptMessage("Hey there! I'm FurtherAI, your AI assistant in FurtherChat! I can help you with questions, coding, creative writing, jokes, advice, and much more. Just type anything and I'll respond! What would you like to talk about? ", docRef.id),
      type: 'text',
      senderId: AI_UID,
      senderName: AI_DISPLAY_NAME,
      createdAt: serverTimestamp() as Timestamp,
      status: 'read' as MessageStatus,
      readBy: [userUid],
      encrypted: true,
      isAIMessage: true,
    },
    updatedAt: serverTimestamp() as Timestamp,
  })

  return docRef.id
}

// Send AI response message to a chat room
export async function sendAIMessage(roomId: string, content: string): Promise<string> {
  const encryptedContent = encryptMessage(sanitizeInput(content, 2000), roomId)
  const messageData = {
    content: encryptedContent,
    type: 'text',
    senderId: AI_UID,
    senderName: AI_DISPLAY_NAME,
    senderAvatar: null,
    senderAvatarColor: AI_AVATAR_COLOR,
    createdAt: serverTimestamp() as Timestamp,
    status: 'read' as MessageStatus,
    readBy: [],
    deletedFor: [],
    deletedForEveryone: false,
    encrypted: true,
    isAIMessage: true,
  }
  const docRef = await addDoc(collection(db, 'chatRooms', roomId, 'messages'), messageData)
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage: {
      content: encryptMessage(content.length > 100 ? content.slice(0, 100) + '...' : content, roomId),
      type: 'text',
      senderId: AI_UID,
      senderName: AI_DISPLAY_NAME,
      createdAt: serverTimestamp() as Timestamp,
      status: 'read' as MessageStatus,
      readBy: [],
      encrypted: true,
      isAIMessage: true,
    },
    updatedAt: serverTimestamp() as Timestamp,
  })
  return docRef.id
}
