// ============================================================
// FIREBASE SERVICE - All Firestore/RTDB operations
// ============================================================

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
} from 'firebase/auth'
import { auth, db, rtdb } from './firebase'
import type { User, Message, ChatRoom, ChatRequest, MessageStatus } from './store'
import { getAvatarColor } from './store'

// ============================================================
// INPUT SANITIZATION (Security)
// ============================================================
export function sanitizeInput(input: string, maxLength: number = 500): string {
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLength)
}

export function sanitizeUsername(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9_]/g, '').trim().slice(0, 20)
}

// ============================================================
// AUTHENTICATION
// ============================================================

export function usernameToEmail(username: string): string {
  return `${username.toLowerCase().trim()}@chatapp.local`
}

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
    createdAt: serverTimestamp() as Timestamp,
  })
  await setDoc(doc(db, 'usernames', cleanUsername), {
    uid: cred.user.uid, createdAt: serverTimestamp() as Timestamp,
  })
  return { uid: cred.user.uid, username: cleanUsername, displayName: cleanDisplayName, avatar: null, avatarColor, isOnline: true, lastSeen: null, usernameChangedAt: null }
}

export async function loginUser(username: string, password: string): Promise<User> {
  const email = usernameToEmail(username)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
  if (!userDoc.exists()) throw new Error('User data not found')
  const data = userDoc.data()
  return { uid: cred.user.uid, username: data.username, displayName: data.displayName || username, avatar: data.avatar, avatarColor: data.avatarColor || getAvatarColor(cred.user.uid), isOnline: true, lastSeen: null, usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null }
}

export async function logoutUser(): Promise<void> {
  const user = auth.currentUser
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {})
    await set(ref(rtdb, `presence/${user.uid}`), null).catch(() => {})
  }
  await signOut(auth)
}

// ============================================================
// PASSWORD CHANGE
// ============================================================

export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('Not authenticated')
  if (newPassword.length < 6) throw new Error('New password must be at least 6 characters')
  // Re-authenticate before password change for security
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

// ============================================================
// PRESENCE (Real-time online/offline)
// ============================================================

export function setupPresence(uid: string): () => void {
  const presenceRef = ref(rtdb, `presence/${uid}`)
  // Set online immediately
  set(presenceRef, { online: true, lastSeen: rtdbServerTimestamp() })
  // Set offline on disconnect
  onDisconnect(presenceRef).set({ online: false, lastSeen: rtdbServerTimestamp() })
  // Also update Firestore
  updateDoc(doc(db, 'users', uid), { isOnline: true }).catch(() => {})
  // Heartbeat every 20 seconds to keep presence fresh
  const heartbeat = setInterval(() => {
    set(presenceRef, { online: true, lastSeen: rtdbServerTimestamp() })
  }, 20000)
  return () => {
    clearInterval(heartbeat)
    set(presenceRef, { online: false, lastSeen: rtdbServerTimestamp() }).catch(() => {})
    updateDoc(doc(db, 'users', uid), { isOnline: false, lastSeen: serverTimestamp() }).catch(() => {})
  }
}

export function listenToPresence(callback: (users: Record<string, { online: boolean; lastSeen: number }>) => void): () => void {
  const presenceRef = ref(rtdb, 'presence')
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const data = snapshot.val() || {}
    const users: Record<string, { online: boolean; lastSeen: number }> = {}
    Object.keys(data).forEach((uid) => {
      const val = data[uid]
      users[uid] = { online: val?.online === true, lastSeen: val?.lastSeen || 0 }
    })
    callback(users)
  })
  return () => off(presenceRef)
}

// ============================================================
// CHAT ROOMS
// ============================================================

export async function createDirectChatRoom(currentUid: string, otherUid: string): Promise<string> {
  const roomsRef = collection(db, 'chatRooms')
  const q = query(roomsRef, where('type', '==', 'direct'), where('participants', 'array-contains', currentUid))
  const snapshot = await getDocs(q)
  // Check for existing room - if found and not deleted for current user, restore it
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    if (data.participants.includes(otherUid)) {
      // If room was "deleted" by current user, restore it by removing from deletedFor
      const deletedFor = data.deletedFor || []
      if (deletedFor.includes(currentUid)) {
        await updateDoc(doc(db, 'chatRooms', docSnap.id), {
          deletedFor: deletedFor.filter((uid: string) => uid !== currentUid),
          updatedAt: serverTimestamp() as Timestamp,
        })
      }
      return docSnap.id
    }
  }
  // Create new room
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
      // Skip rooms deleted for this user
      const roomDeletedFor: string[] = data.deletedFor || []
      if (roomDeletedFor.includes(uid)) continue
      let roomName = data.name, roomAvatar = data.avatar
      if (data.type === 'direct') {
        const otherUid = data.participants.find((p: string) => p !== uid)
        if (otherUid) {
          try {
            const d = await getDoc(doc(db, 'users', otherUid))
            if (d.exists()) { const od = d.data(); roomName = od.displayName || od.username; roomAvatar = od.avatar }
          } catch { roomName = 'User' }
        }
      }
      rooms.push({
        id: docSnap.id, type: data.type, name: roomName, avatar: roomAvatar,
        avatarColor: data.avatarColor || getAvatarColor(docSnap.id), participants: data.participants,
        lastMessage: data.lastMessage ? {
          id: '', content: data.lastMessage.content || '', type: data.lastMessage.type || 'text',
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

// ============================================================
// MESSAGES
// ============================================================

export async function sendMessage(roomId: string, content: string, senderId: string, senderName: string, senderAvatar: string | null, senderAvatarColor: string, type: 'text' | 'image' = 'text', replyTo?: string | null, replyToContent?: string | null, replyToSender?: string | null): Promise<string> {
  const cleanContent = sanitizeInput(content, 2000)
  if (!cleanContent) throw new Error('Message cannot be empty')
  const messageData = {
    content: cleanContent, type, senderId, senderName, senderAvatar, senderAvatarColor,
    createdAt: serverTimestamp() as Timestamp, status: 'sent' as MessageStatus,
    readBy: [senderId], deletedFor: [], deletedForEveryone: false,
    replyTo: replyTo || null, replyToContent: replyToContent ? sanitizeInput(replyToContent, 200) : null, replyToSender: replyToSender || null,
  }
  const docRef = await addDoc(collection(db, 'chatRooms', roomId, 'messages'), messageData)
  await updateDoc(doc(db, 'chatRooms', roomId), {
    lastMessage: {
      content: type === 'text' ? cleanContent : '📷 Photo', type, senderId, senderName,
      createdAt: serverTimestamp() as Timestamp, status: 'sent' as MessageStatus, readBy: [senderId],
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
      return {
        id: docSnap.id, content: data.content, type: data.type || 'text',
        senderId: data.senderId, senderName: data.senderName,
        senderAvatar: data.senderAvatar || null, senderAvatarColor: data.senderAvatarColor || '',
        chatRoomId: roomId, createdAt: data.createdAt?.toMillis?.() || Date.now(),
        status: data.status || 'sent', readBy: data.readBy || [],
        deletedFor: data.deletedFor || [], deletedForEveryone: data.deletedForEveryone || false,
        replyTo: data.replyTo || null, replyToContent: data.replyToContent || null, replyToSender: data.replyToSender || null,
      }
    })
    // Mark messages as read (batch)
    const unreadMsgs = msgs.filter(m => m.senderId !== currentUid && !m.readBy.includes(currentUid) && !m.deletedForEveryone && m.type !== 'system')
    if (unreadMsgs.length > 0) {
      const batch = writeBatch(db)
      unreadMsgs.forEach(m => {
        batch.update(doc(db, 'chatRooms', roomId, 'messages', m.id), { readBy: [...m.readBy, currentUid], status: 'read' })
      })
      batch.commit().catch(() => {})
    }
    callback(msgs)
  }, (error) => { console.error('Error listening to messages:', error) })
}

// Delete message for me only
export async function deleteMessageForMe(roomId: string, messageId: string, uid: string): Promise<void> {
  const msgDoc = await getDoc(doc(db, 'chatRooms', roomId, 'messages', messageId))
  if (!msgDoc.exists()) return
  const data = msgDoc.data()
  const deletedFor: string[] = data.deletedFor || []
  if (!deletedFor.includes(uid)) {
    await updateDoc(doc(db, 'chatRooms', roomId, 'messages', messageId), { deletedFor: [...deletedFor, uid] })
  }
}

// Delete message for everyone (48 hour limit, sender only)
export async function deleteMessageForEveryone(roomId: string, messageId: string, senderId: string): Promise<void> {
  const msgDoc = await getDoc(doc(db, 'chatRooms', roomId, 'messages', messageId))
  if (!msgDoc.exists()) throw new Error('Message not found')
  const data = msgDoc.data()
  if (data.senderId !== senderId) throw new Error('Only the sender can delete this message for everyone')
  const messageTime = data.createdAt?.toMillis?.() || 0
  const hoursSince = (Date.now() - messageTime) / (1000 * 60 * 60)
  if (hoursSince > 48) throw new Error('You can only delete messages for everyone within 48 hours')
  await updateDoc(doc(db, 'chatRooms', roomId, 'messages', messageId), {
    deletedForEveryone: true, content: 'This message was deleted', type: 'deleted',
  })
  // Update lastMessage preview if this was the last message
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

// Clear chat for me (keep chat in list, clear all messages)
export async function clearChatForMe(roomId: string, uid: string): Promise<void> {
  const msgsSnap = await getDocs(collection(db, 'chatRooms', roomId, 'messages'))
  const batch = writeBatch(db)
  let count = 0
  msgsSnap.docs.forEach((docSnap) => {
    const data = docSnap.data()
    if (data.type === 'system') return
    const deletedFor: string[] = data.deletedFor || []
    if (!deletedFor.includes(uid)) {
      batch.update(doc(db, 'chatRooms', roomId, 'messages', docSnap.id), { deletedFor: [...deletedFor, uid] })
      count++
    }
  })
  if (count > 0) await batch.commit()
}

// Delete chat (remove from my chat list, allow re-requesting later)
export async function deleteChatRoom(roomId: string, uid: string): Promise<void> {
  await clearChatForMe(roomId, uid)
  const roomDoc = await getDoc(doc(db, 'chatRooms', roomId))
  if (roomDoc.exists()) {
    const data = roomDoc.data()
    const roomDeletedFor: string[] = data.deletedFor || []
    if (!roomDeletedFor.includes(uid)) {
      await updateDoc(doc(db, 'chatRooms', roomId), { deletedFor: [...roomDeletedFor, uid] })
    }
  }
}

// ============================================================
// USERNAME CHANGE (30 day cooldown)
// ============================================================

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

// ============================================================
// USERS
// ============================================================

export async function searchUsers(q: string, currentUid: string): Promise<User[]> {
  const usersRef = collection(db, 'users')
  const q1 = query(usersRef, where('username', '>=', q.toLowerCase()), where('username', '<=', q.toLowerCase() + '\uf8ff'), limit(10))
  const q2 = query(usersRef, where('displayName', '>=', q), where('displayName', '<=', q + '\uf8ff'), limit(10))
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
  const usersMap = new Map<string, User>()
  const process = (snapshot: any) => {
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
  const cleanUpdates: any = {}
  if (updates.displayName) cleanUpdates.displayName = sanitizeInput(updates.displayName, 30)
  if (updates.avatar) cleanUpdates.avatar = updates.avatar
  if (updates.avatarColor) cleanUpdates.avatarColor = updates.avatarColor
  await updateDoc(doc(db, 'users', uid), cleanUpdates)
  if (cleanUpdates.displayName && auth.currentUser) await updateProfile(auth.currentUser, { displayName: cleanUpdates.displayName })
}

// ============================================================
// TYPING
// ============================================================

export function setTyping(roomId: string, uid: string, username: string, isTyping: boolean): void {
  const typingRef = ref(rtdb, `typing/${roomId}/${uid}`)
  if (isTyping) {
    set(typingRef, { username, timestamp: rtdbServerTimestamp() })
    setTimeout(() => set(typingRef, null), 3000)
  } else {
    set(typingRef, null)
  }
}

export function listenToTyping(roomId: string, callback: (usernames: string[]) => void): () => void {
  const typingRef = ref(rtdb, `typing/${roomId}`)
  const unsub = onValue(typingRef, (snapshot) => {
    const data = snapshot.val() || {}
    callback(Object.values(data).map((v: any) => v.username).filter(Boolean))
  })
  return () => off(typingRef)
}

// ============================================================
// CHAT REQUESTS
// ============================================================

export async function sendChatRequest(fromUid: string, fromUsername: string, fromDisplayName: string, fromAvatar: string | null, fromAvatarColor: string, toUid: string, toUsername: string, toDisplayName: string, toAvatar: string | null, toAvatarColor: string, message: string = 'Hi, I would like to chat with you!'): Promise<string> {
  // Check for pending requests
  const requestsRef = collection(db, 'chatRequests')
  const snap1 = await getDocs(query(requestsRef, where('fromUid', '==', fromUid), where('toUid', '==', toUid)))
  if (snap1.docs.find(d => d.data().status === 'pending')) throw new Error('You already sent a request to this user')
  const snap2 = await getDocs(query(requestsRef, where('fromUid', '==', toUid), where('toUid', '==', fromUid)))
  if (snap2.docs.find(d => d.data().status === 'pending')) throw new Error('This user already sent you a request. Check your incoming requests!')
  // Check for existing ACTIVE chat room (not deleted for current user)
  const roomsSnap = await getDocs(query(collection(db, 'chatRooms'), where('type', '==', 'direct'), where('participants', 'array-contains', fromUid)))
  for (const roomDoc of roomsSnap.docs) {
    const data = roomDoc.data()
    if (data.participants.includes(toUid)) {
      // Only block if the room is NOT deleted for the current user
      const roomDeletedFor: string[] = data.deletedFor || []
      if (!roomDeletedFor.includes(fromUid)) {
        throw new Error('You already have a chat with this user')
      }
      // Room exists but was deleted by current user - restore it instead of sending request
      await updateDoc(doc(db, 'chatRooms', roomDoc.id), {
        deletedFor: roomDeletedFor.filter((uid: string) => uid !== fromUid),
        updatedAt: serverTimestamp() as Timestamp,
      })
      throw new Error('Chat restored! Check your chats.')
    }
  }
  const docRef = await addDoc(collection(db, 'chatRequests'), {
    fromUid, fromUsername, fromDisplayName, fromAvatar, fromAvatarColor,
    toUid, toUsername, toDisplayName, toAvatar, toAvatarColor,
    status: 'pending' as const, message: sanitizeInput(message, 200), createdAt: serverTimestamp() as Timestamp, chatRoomId: null as string | null,
  })
  return docRef.id
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
  })
  return roomId
}

export async function rejectChatRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'chatRequests', requestId), { status: 'rejected' })
}

export async function cancelChatRequest(requestId: string): Promise<void> {
  await deleteDoc(doc(db, 'chatRequests', requestId))
}
