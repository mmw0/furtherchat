'use client'

import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react'
import { useAppStore, getAvatarColor, getInitials, BUILT_IN_AVATARS } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import {
  setupPresence, listenToPresence, listenToChatRooms,
  createGroupChatRoom, getAllUsers, searchUsers,
  sendMessage, listenToMessages, setTyping, listenToTyping,
  logoutUser, updateProfileData, changeUsername, changeUserPassword,
  sendChatRequest, listenToSentRequests, listenToReceivedRequests,
  acceptChatRequest, rejectChatRequest, cancelChatRequest,
  deleteMessageForMe, deleteMessageForEveryone,
  clearChatForMe, deleteChatRoom,
  blockUser, unblockUser, listenToBlockedUsers,
  starUser, unstarUser, listenToStarredUsers,
} from '@/lib/firebase-service'
import type { Message, ThemePreset } from '@/lib/store'
const LazyEmojiPicker = lazy(() => import('@/components/emoji-picker').then(m => ({ default: m.EmojiPicker })))
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Search, Users, Settings, LogOut, Send, ArrowLeft,
  Hash, Edit3, Check, X, UserPlus, UserCheck,
  UserX, Clock, Bell, BellRing, Smile, Trash2,
  Palette, Moon, MoreVertical, Shield, ChevronRight,
  Camera, Sun, ImagePlus, Trash, Ban, Unlock,
  Lock, Star,
} from 'lucide-react'

const THEME_PRESETS: Record<ThemePreset, { primary: string; primaryRgb: string; gradient: string; glow: string; name: string; hex: string }> = {
  emerald: { primary: 'bg-emerald-500', primaryRgb: '0,200,150', gradient: 'from-emerald-500 to-teal-400', glow: 'shadow-emerald-500/30', name: 'Emerald', hex: '#00C896' },
  ocean: { primary: 'bg-blue-500', primaryRgb: '59,130,246', gradient: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/30', name: 'Ocean', hex: '#3b82f6' },
  sunset: { primary: 'bg-orange-500', primaryRgb: '249,115,22', gradient: 'from-orange-500 to-amber-400', glow: 'shadow-orange-500/30', name: 'Sunset', hex: '#f97316' },
  lavender: { primary: 'bg-violet-500', primaryRgb: '139,92,246', gradient: 'from-violet-500 to-purple-400', glow: 'shadow-violet-500/30', name: 'Lavender', hex: '#8b5cf6' },
  rose: { primary: 'bg-pink-500', primaryRgb: '236,72,153', gradient: 'from-pink-500 to-rose-400', glow: 'shadow-pink-500/30', name: 'Rose', hex: '#ec4899' },
  midnight: { primary: 'bg-indigo-500', primaryRgb: '99,102,241', gradient: 'from-indigo-500 to-blue-400', glow: 'shadow-indigo-500/30', name: 'Midnight', hex: '#6366f1' },
}

function TickIndicator({ status, color }: { status: Message['status']; color: string }) {
  if (status === 'sent') return <svg width="14" height="9" viewBox="0 0 14 9" className="inline-block ml-1 opacity-60"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  if (status === 'delivered') return <svg width="18" height="9" viewBox="0 0 18 9" className="inline-block ml-1 opacity-70"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4.5L7.5 7L13 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  return <svg width="18" height="9" viewBox="0 0 18 9" className="inline-block ml-1"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4.5L7.5 7L13 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function OnlineDot({ online, size = 'sm', isDark = true }: { online: boolean; size?: 'sm' | 'md'; isDark?: boolean }) {
  if (!online) return null
  const s = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  const border = size === 'sm' ? 'border-2' : 'border-[2.5px]'
  return (
    <span className={`absolute -bottom-0.5 -right-0.5 ${s} rounded-full ${border} ${isDark ? 'border-[#0c1220]' : 'border-white'} bg-emerald-500 shadow-lg shadow-emerald-500/50`}>
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
    </span>
  )
}

function Avatar({ avatar, name, avatarColor, size = 40 }: { avatar: string | null; name: string; avatarColor: string; size?: number }) {
  const fontSize = Math.max(size * 0.45, 12)
  if (avatar?.startsWith('data:image')) {
    return (
      <div className="rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <img src={avatar} alt={name} className="w-full h-full object-cover" loading="lazy" />
      </div>
    )
  }
  if (avatar?.startsWith('avatar_')) {
    const av = BUILT_IN_AVATARS.find(a => a.id === avatar)
    if (av) {
      return (
        <div className="rounded-full overflow-hidden flex items-center justify-center" style={{ width: size, height: size, background: av.bg }}>
          <span style={{ fontSize }}>{av.emoji}</span>
        </div>
      )
    }
  }
  const initials = getInitials(name)
  return (
    <div className="rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0" style={{ width: size, height: size, background: avatarColor, fontSize: fontSize * 0.85 }}>
      {initials}
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  )
}

export function ChatApp() {
  const store = useAppStore()
  const { currentUser, chatRooms, setChatRooms, activeRoomId, setActiveRoomId,
    messages, setMessages, updateMessage, onlineUsers, setOnlineUsers,
    sidebarTab, setSidebarTab, showMobileChat, setShowMobileChat, searchQuery, setSearchQuery,
    theme, setTheme, allUsers, setAllUsers, typingUsers, setTypingUsers,
    sentRequests, receivedRequests, setSentRequests, setReceivedRequests, updateRequestStatus, removeRequestFromList,
    showEmojiPicker, setShowEmojiPicker, replyingTo, setReplyingTo,
    contextMenuMessage, setContextMenuMessage, chatSearchQuery, setChatSearchQuery,
    deleteConfirm, setDeleteConfirm, chatActionMenu, setChatActionMenu,
    clearDeleteConfirm, setClearDeleteConfirm, showPasswordChange, setShowPasswordChange,
    showAvatarPicker, setShowAvatarPicker, logout,
    blockedUsers, setBlockedUsers, starredUsers, setStarredUsers } = store

  const [messageInput, setMessageInput] = useState('')
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [editingName, setEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [sendingRequest, setSendingRequest] = useState<string | null>(null)
  const [requestSuccess, setRequestSuccess] = useState('')
  const [requestError, setRequestError] = useState('')
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [deletingMsg, setDeletingMsg] = useState(false)
  const [clearingChat, setClearingChat] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [blockingUser, setBlockingUser] = useState<string | null>(null)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const listenersRef = useRef<(() => void)[]>([])
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiBtnRef = useRef<HTMLButtonElement>(null)
  const userSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const chatSearchRef = useRef<HTMLInputElement>(null)
  const [emojiAnchorRect, setEmojiAnchorRect] = useState<DOMRect | null>(null)

  const preset = theme.preset
  const tp = THEME_PRESETS[preset]
  const isDark = theme.mode === 'dark'
  const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length

  // ---- LISTENERS ----
  useEffect(() => {
    if (!currentUser || !isFirebaseConfigured()) return
    const cleanup = setupPresence(currentUser.uid)
    const u1 = listenToPresence((users) => {
      setOnlineUsers(users)
    })
    const u2 = listenToChatRooms(currentUser.uid, (rooms) => setChatRooms(rooms))
    const u3 = listenToSentRequests(currentUser.uid, setSentRequests)
    const u4 = listenToReceivedRequests(currentUser.uid, setReceivedRequests)
    const u5 = listenToBlockedUsers(currentUser.uid, setBlockedUsers)
    const u6 = listenToStarredUsers(currentUser.uid, setStarredUsers)
    getAllUsers(currentUser.uid).then(setAllUsers)
    listenersRef.current = [cleanup, u1, u2, u3, u4, u5, u6]
    return () => { listenersRef.current.forEach(fn => fn()) }
  }, [currentUser?.uid])

  useEffect(() => {
    if (!activeRoomId || !isFirebaseConfigured() || !currentUser) return
    setShowEmojiPicker(false)
    const u1 = listenToMessages(activeRoomId, currentUser.uid, (msgs) => setMessages(activeRoomId, msgs))
    const u2 = listenToTyping(activeRoomId, (u) => setTypingUsers(activeRoomId, u.filter(n => n !== currentUser?.displayName)))
    return () => { u1(); u2() }
  }, [activeRoomId, currentUser?.uid])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages[activeRoomId || '']?.length])

  // Close chat action menu on outside click
  useEffect(() => {
    if (!chatActionMenu) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-chat-menu]')) setChatActionMenu(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [chatActionMenu])

  // Close sidebar search on outside click
  useEffect(() => {
    if (!searchQuery) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-sidebar-search]')) {
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [searchQuery])

  // Close chat search on outside click
  useEffect(() => {
    if (!chatSearchQuery || chatSearchQuery === ' ') return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-chat-search]')) {
        setChatSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [chatSearchQuery])

  // ---- HANDLERS ----
  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || !activeRoomId || !currentUser || sendingMessage) return
    setSendingMessage(true)
    try {
      await sendMessage(activeRoomId, messageInput.trim(), currentUser.uid, currentUser.displayName, currentUser.avatar, currentUser.avatarColor, 'text', replyingTo?.id || null, replyingTo?.content || null, replyingTo?.senderName || null)
      setMessageInput('')
      setTyping(activeRoomId, currentUser.uid, currentUser.displayName, false)
      setReplyingTo(null)
    } catch (err) { console.error(err) } finally { setSendingMessage(false) }
  }, [messageInput, activeRoomId, currentUser, sendingMessage, replyingTo])

  const handleTyping = useCallback((v: string) => {
    setMessageInput(v)
    if (!activeRoomId || !currentUser) return
    if (v.trim()) setTyping(activeRoomId, currentUser.uid, currentUser.displayName, true)
    else setTyping(activeRoomId, currentUser.uid, currentUser.displayName, false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(activeRoomId!, currentUser!.uid, currentUser!.displayName, false), 3000)
  }, [activeRoomId, currentUser])

  const handleSendRequest = useCallback(async (toUser: any) => {
    if (!currentUser) return
    // Check if user is blocked
    if (blockedUsers.includes(toUser.uid)) {
      setRequestError('You have blocked this user. Unblock them first.')
      setTimeout(() => setRequestError(''), 3000)
      return
    }
    setSendingRequest(toUser.uid)
    setRequestError(''); setRequestSuccess('')
    try {
      const result = await sendChatRequest(
        currentUser.uid, currentUser.username, currentUser.displayName, currentUser.avatar, currentUser.avatarColor,
        toUser.uid, toUser.username, toUser.displayName, toUser.avatar, toUser.avatarColor
      )
      if (result.type === 'restored') {
        setRequestSuccess('Chat restored!'); setSidebarTab('chats')
      } else {
        setRequestSuccess('Request sent!')
      }
      setTimeout(() => { setRequestSuccess(''); setRequestError('') }, 3000)
    } catch (err: any) {
      setRequestError(err.message); setTimeout(() => setRequestError(''), 5000)
    } finally { setSendingRequest(null) }
  }, [currentUser, blockedUsers])

  const handleAccept = useCallback(async (reqId: string, fromUid: string) => {
    if (!currentUser) return
    setAcceptingRequest(reqId)
    try {
      const roomId = await acceptChatRequest(reqId, fromUid, currentUser.uid)
      updateRequestStatus(reqId, 'accepted', roomId)
      setActiveRoomId(roomId); setShowMobileChat(true); setSidebarTab('chats')
    } catch (err) { console.error(err) } finally { setAcceptingRequest(null) }
  }, [currentUser])

  const handleReject = useCallback(async (reqId: string) => {
    try { await rejectChatRequest(reqId); updateRequestStatus(reqId, 'rejected') } catch (err) { console.error(err) }
  }, [])

  const handleLogout = useCallback(async () => { try { await logoutUser() } catch {} logout() }, [logout])

  const hasPendingRequest = (uid: string) => ({
    sent: !!sentRequests.find(r => r.toUid === uid && r.status === 'pending'),
    received: !!receivedRequests.find(r => r.fromUid === uid && r.status === 'pending')
  })
  const hasExistingChat = (uid: string) => chatRooms.some(r => r.type === 'direct' && r.participants.includes(uid))

  const handleTouchStart = useCallback((msg: Message) => {
    longPressTimerRef.current = setTimeout(() => { setContextMenuMessage(msg) }, 500)
  }, [])
  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null }
  }, [])

  const canDeleteForEveryone = useCallback((msg: Message) => {
    if (msg.senderId !== currentUser?.uid) return false
    if (msg.deletedForEveryone || msg.type === 'deleted') return false
    const hoursSince = (Date.now() - msg.createdAt) / (1000 * 60 * 60)
    return hoursSince <= 48
  }, [currentUser])

  const handleDeleteMsg = useCallback(async (msg: Message, forEveryone: boolean) => {
    if (!activeRoomId || !currentUser) return
    setDeletingMsg(true)
    try {
      if (forEveryone) {
        await deleteMessageForEveryone(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedForEveryone: true, content: 'This message was deleted', type: 'deleted' })
      } else {
        await deleteMessageForMe(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedFor: [...msg.deletedFor, currentUser.uid] })
      }
      setContextMenuMessage(null); setDeleteConfirm(null)
    } catch (err: any) { console.error(err) } finally { setDeletingMsg(false) }
  }, [activeRoomId, currentUser])

  const handleClearChat = useCallback(async (roomId: string, action: 'clear' | 'delete') => {
    if (!currentUser) return
    setClearingChat(true)
    try {
      if (action === 'delete') {
        await deleteChatRoom(roomId, currentUser.uid)
        setActiveRoomId(null); setShowMobileChat(false)
      } else {
        await clearChatForMe(roomId, currentUser.uid)
      }
      setClearDeleteConfirm(null); setChatActionMenu(false)
    } catch (err) { console.error(err) } finally { setClearingChat(false) }
  }, [currentUser])

  const handleBlockUser = useCallback(async (uid: string) => {
    if (!currentUser || blockingUser) return
    setBlockingUser(uid)
    try {
      await blockUser(currentUser.uid, uid)
    } catch (err) { console.error(err) } finally { setBlockingUser(null) }
  }, [currentUser, blockingUser])

  const handleUnblockUser = useCallback(async (uid: string) => {
    if (!currentUser) return
    try {
      await unblockUser(currentUser.uid, uid)
    } catch (err) { console.error(err) }
  }, [currentUser])

  const handleStarUser = useCallback(async (uid: string) => {
    if (!currentUser) return
    try {
      await starUser(currentUser.uid, uid)
    } catch (err) { console.error(err) }
  }, [currentUser])

  const handleUnstarUser = useCallback(async (uid: string) => {
    if (!currentUser) return
    try {
      await unstarUser(currentUser.uid, uid)
    } catch (err) { console.error(err) }
  }, [currentUser])

  const handleChangeUsername = useCallback(async () => {
    if (!currentUser || !newUsername.trim()) return; setUsernameError('')
    try {
      await changeUsername(currentUser.uid, newUsername.trim())
      useAppStore.getState().setAuth({ ...currentUser, username: newUsername.trim(), usernameChangedAt: Date.now() })
      setEditingUsername(false)
    } catch (err: any) { setUsernameError(err.message) }
  }, [currentUser, newUsername])

  const handleChangePassword = useCallback(async () => {
    setPasswordError(''); setPasswordSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError('All fields are required'); return }
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match'); return }
    setChangingPassword(true)
    try {
      await changeUserPassword(currentPassword, newPassword)
      setPasswordSuccess(true); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => { setShowPasswordChange(false); setPasswordSuccess(false) }, 2000)
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setPasswordError('Current password is incorrect')
      else if (err.code === 'auth/requires-recent-login') setPasswordError('Please log out and log back in, then try again')
      else setPasswordError(err.message || 'Failed to change password')
    } finally { setChangingPassword(false) }
  }, [currentPassword, newPassword, confirmPassword])

  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string
      let finalUrl = dataUrl
      if (dataUrl.length > 200 * 1024) {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const maxDim = 200
          let w = img.width, h = img.height
          if (w > h) { if (w > maxDim) { h = h * maxDim / w; w = maxDim } }
          else { if (h > maxDim) { w = w * maxDim / h; h = maxDim } }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
          finalUrl = canvas.toDataURL('image/jpeg', 0.7)
          await updateProfileData(currentUser.uid, { avatar: finalUrl })
          useAppStore.getState().setAuth({ ...currentUser, avatar: finalUrl })
        }
        img.src = dataUrl
      } else {
        await updateProfileData(currentUser.uid, { avatar: finalUrl })
        useAppStore.getState().setAuth({ ...currentUser, avatar: finalUrl })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [currentUser])

  const handleSelectBuiltInAvatar = useCallback(async (avatarId: string) => {
    if (!currentUser) return
    await updateProfileData(currentUser.uid, { avatar: avatarId })
    useAppStore.getState().setAuth({ ...currentUser, avatar: avatarId })
    setShowAvatarPicker(false)
  }, [currentUser])

  const handleRemoveAvatar = useCallback(async () => {
    if (!currentUser) return
    await updateProfileData(currentUser.uid, { avatar: null as any })
    useAppStore.getState().setAuth({ ...currentUser, avatar: null })
    setShowAvatarPicker(false)
  }, [currentUser])

  // Navigate to chat from request - handle deleted chats
  const handleOpenChatFromRequest = useCallback((roomId: string) => {
    const roomExists = chatRooms.some(r => r.id === roomId)
    if (roomExists) {
      setActiveRoomId(roomId)
      setShowMobileChat(true)
      setSidebarTab('chats')
    }
    // If chat was deleted, room doesn't exist - just switch to chats tab, don't set active room
    if (!roomExists) {
      setSidebarTab('chats')
      return
    }
  }, [chatRooms])

  // ---- DERIVED STATE ----
  const activeRoom = chatRooms.find(r => r.id === activeRoomId)
  const activeMessages = activeRoomId ? (messages[activeRoomId] || []) : []
  const activeTyping = activeRoomId ? (typingUsers[activeRoomId] || []) : []
  const filteredRooms = useMemo(() => chatRooms.filter(room => !searchQuery || (room.name || '').toLowerCase().includes(searchQuery.toLowerCase())), [chatRooms, searchQuery])

  const starredUserDetails = useMemo(() => {
    return starredUsers
      .map(uid => allUsers.find(u => u.uid === uid))
      .filter((u): u is NonNullable<typeof u> => !!u)
  }, [starredUsers, allUsers])

  // Dynamic favicon based on theme
  useEffect(() => {
    const color = tp.hex.replace('#', '%23')
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='2' y='2' width='96' height='96' rx='22' fill='${color}'/><path d='M22 24h56c5.5 0 10 4.5 10 10v22c0 5.5-4.5 10-10 10H42L30 80V66H22c-5.5 0-10-4.5-10-10V34c0-5.5 4.5-10 10-10z' fill='white'/></svg>`
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('type', 'image/svg+xml')
    link.setAttribute('href', 'data:image/svg+xml,' + svg)
    if (!link.parentNode) document.head.appendChild(link)
    document.title = 'FurtherChat'
  }, [preset])

  const formatTime = (ts: number) => { const d = new Date(ts); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  const formatLastSeen = (ts: number) => {
    const d = new Date(ts); const now = new Date()
    if (d.toDateString() === now.toDateString()) return `last seen today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    return `last seen ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  // ---- COLORS ----
  const c = isDark ? {
    bg: 'bg-[#080c16]', sidebar: 'bg-[#0c1220]', card: 'bg-white/[0.04]',
    hover: 'hover:bg-white/[0.06]', border: 'border-white/[0.06]', input: 'bg-white/[0.06] border-white/[0.08]',
    text: 'text-white', muted: 'text-slate-400', sub: 'text-slate-500',
    bubbleMine: '', bubbleOther: '',
    headerBg: 'bg-[#0c1220]/90 backdrop-blur-2xl', panelBg: 'bg-[#0c1220]',
  } : {
    bg: 'bg-slate-50', sidebar: 'bg-white', card: 'bg-slate-50',
    hover: 'hover:bg-slate-50', border: 'border-slate-200', input: 'bg-slate-100 border-slate-200',
    text: 'text-slate-900', muted: 'text-slate-500', sub: 'text-slate-400',
    bubbleMine: '', bubbleOther: '',
    headerBg: 'bg-white/90 backdrop-blur-2xl', panelBg: 'bg-white',
  }

  const otherUidInActiveRoom = activeRoom?.type === 'direct' ? activeRoom.participants.find(p => p !== currentUser?.uid) : null
  const otherIsOnline = otherUidInActiveRoom ? !!onlineUsers[otherUidInActiveRoom]?.online : false
  const otherLastSeen = otherUidInActiveRoom ? onlineUsers[otherUidInActiveRoom]?.lastSeen || null : null
  const isOtherBlocked = otherUidInActiveRoom ? blockedUsers.includes(otherUidInActiveRoom) : false

  return (
    <div className={`h-screen flex overflow-hidden ${c.bg} transition-colors duration-300`}>
      {/* ====== SIDEBAR ====== */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col shrink-0 border-r ${c.border} ${c.sidebar} transition-colors duration-300`}>
        {/* Header */}
        <div className={`px-4 py-3 ${c.headerBg} border-b ${c.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <Avatar avatar={currentUser?.avatar || null} name={currentUser?.displayName || ''} avatarColor={currentUser?.avatarColor || ''} size={40} />
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center border-2 ${isDark ? 'border-[#0f1525]' : 'border-white'}`}>
                <Camera className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className={`font-semibold text-sm truncate ${c.text}`}>{currentUser?.displayName}</h2>
              <div className="flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-500" />
                <p className={`text-[11px] ${c.muted}`}>@{currentUser?.username}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSidebarTab('settings')} className={`p-2 rounded-xl ${c.hover} ${c.muted} hover:text-white transition-colors`}><Settings className="h-4 w-4" /></button>
            <button onClick={handleLogout} className={`p-2 rounded-xl ${c.hover} ${c.muted} hover:text-red-400 transition-colors`}><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2" data-sidebar-search>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input ref={searchInputRef} placeholder="Search or start new chat" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 h-9 rounded-xl text-sm ${c.input} ${c.text} placeholder:text-slate-500 border focus-visible:ring-1 focus-visible:ring-emerald-500/30`} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex ${c.border} border-b`}>
          {([['chats', MessageCircle, 'Chats'], ['star', Star, 'Star'], ['users', Users, 'Users'], ['requests', pendingReceivedCount > 0 ? BellRing : Bell, 'Requests']] as const).map(([tab, Icon, label]) => (
            <button key={tab} onClick={() => { setSidebarTab(tab as any); setRequestError(''); setRequestSuccess('') }}
              className={`flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all relative ${sidebarTab === tab ? c.text : c.muted}`}>
              <Icon className="h-3.5 w-3.5" />{label}
              {tab === 'star' && starredUsers.length > 0 && (
                <span className="absolute -top-0.5 right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">{starredUsers.length}</span>
              )}
              {tab === 'requests' && pendingReceivedCount > 0 && (
                <span className="absolute -top-0.5 right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-bounce-subtle">{pendingReceivedCount}</span>
              )}
              {sidebarTab === tab && <div className={`absolute bottom-0 left-[25%] right-[25%] h-[2.5px] rounded-full bg-gradient-to-r ${tp.gradient} transition-all duration-300`} />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* CHATS TAB */}
          {sidebarTab === 'chats' && (() => {
            const starredRooms = filteredRooms.filter(r => r.type === 'direct' && starredUsers.includes(r.participants.find(p => p !== currentUser?.uid) || ''))
            const regularRooms = filteredRooms.filter(r => !(r.type === 'direct' && starredUsers.includes(r.participants.find(p => p !== currentUser?.uid) || '')))
            return filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
                <div className={`w-20 h-20 rounded-[18px] bg-[#00C896] flex items-center justify-center mb-4 shadow-xl ${tp.glow}`}>
                  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                    <path d="M22 24h56c5.5 0 10 4.5 10 10v22c0 5.5-4.5 10-10 10H42L30 80V66H22c-5.5 0-10-4.5-10-10V34c0-5.5 4.5-10 10-10z" fill="white"/>
                  </svg>
                </div>
                <p className={`text-sm ${c.muted} text-center mb-3`}>No conversations yet</p>
                <p className={`text-xs ${c.sub} text-center max-w-[200px] mb-4`}>Find users and send a chat request to start messaging</p>
                <Button onClick={() => setSidebarTab('users')} className={`bg-gradient-to-r ${tp.gradient} text-white text-xs h-9 rounded-xl px-6 shadow-lg ${tp.glow} btn-glow`}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />Find Users
                </Button>
              </div>
            ) : (<>
              {/* Starred Users Section */}
              {starredRooms.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1"><h3 className={`text-[10px] font-bold uppercase tracking-widest ${c.muted} flex items-center gap-1`}><Star className="h-3 w-3 text-amber-400" />Starred</h3></div>
                  {starredRooms.map((room) => {
                    const isActive = activeRoomId === room.id
                    const otherUid = room.type === 'direct' ? room.participants.find(p => p !== currentUser?.uid) : null
                    const isOn = otherUid ? !!onlineUsers[otherUid]?.online : false
                    const isBlocked = otherUid ? blockedUsers.includes(otherUid) : false
                    const lastMsg = room.lastMessage
                    return (
                      <button key={room.id} onClick={() => { setActiveRoomId(room.id); setShowMobileChat(true) }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${isActive ? (isDark ? 'bg-white/8' : 'bg-slate-100') : c.hover}`}>
                        <div className="relative shrink-0">
                          <Avatar avatar={room.avatar} name={room.name || 'Chat'} avatarColor={room.avatarColor || getAvatarColor(room.id)} size={44} />
                          <OnlineDot online={isOn} isDark={isDark} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1">
                            <h3 className={`font-semibold text-[13px] truncate ${c.text}`}>{room.name || 'Chat'}</h3>
                            {isBlocked && <Ban className="h-3 w-3 text-red-400 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {lastMsg && lastMsg.senderId === currentUser?.uid && <TickIndicator status={lastMsg.status} color={lastMsg.status === 'read' ? '#53bdeb' : '#8696a0'} />}
                            {lastMsg ? (
                              <p className={`text-[11px] truncate ${c.muted}`}>{lastMsg.type === 'deleted' ? 'Message deleted' : lastMsg.content}</p>
                            ) : (
                              <p className={`text-[11px] ${c.muted}`}>No messages yet</p>
                            )}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); otherUid && handleUnstarUser(otherUid) }} className="p-1 text-amber-400 hover:text-amber-300 transition-colors shrink-0">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                        </button>
                      </button>
                    )
                  })}
                  <div className={`mx-4 border-b ${c.border}`} />
                </div>
              )}
              {/* Regular Chats */}
              {regularRooms.map((room, idx) => {
                const isActive = activeRoomId === room.id
                const otherUid = room.type === 'direct' ? room.participants.find(p => p !== currentUser?.uid) : null
                const isOn = otherUid ? !!onlineUsers[otherUid]?.online : false
                const isBlocked = otherUid ? blockedUsers.includes(otherUid) : false
                const isStarred = otherUid ? starredUsers.includes(otherUid) : false
                const lastMsg = room.lastMessage
                return (
                  <button key={room.id} onClick={() => { setActiveRoomId(room.id); setShowMobileChat(true) }}
                    className={`group w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${isActive ? (isDark ? 'bg-white/8' : 'bg-slate-100') : c.hover} animate-slide-in`}
                    style={{ animationDelay: `${idx * 30}ms` }}>
                    <div className="relative shrink-0">
                      <Avatar avatar={room.avatar} name={room.name || 'Chat'} avatarColor={room.avatarColor || getAvatarColor(room.id)} size={48} />
                      <OnlineDot online={isOn} isDark={isDark} />
                    </div>
                    <div className={`flex-1 min-w-0 text-left border-b ${c.border} pb-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 min-w-0">
                          <h3 className={`font-semibold text-[14px] truncate ${c.text}`}>{room.name || 'Chat'}</h3>
                          {isBlocked && <Ban className="h-3 w-3 text-red-400 shrink-0" />}
                        </div>
                        <div className="flex items-center shrink-0 gap-1">
                          {lastMsg && <span className={`text-[10px] ${lastMsg.createdAt > Date.now() - 60000 ? 'text-emerald-400' : c.muted}`}>{formatTime(lastMsg.createdAt)}</span>}
                          {(() => {
                            const roomMsgs = messages[room.id] || []
                            const unreadCount = roomMsgs.filter(m => m.senderId !== currentUser?.uid && !m.readBy?.includes(currentUser?.uid || '') && m.type !== 'system').length
                            return unreadCount > 0 ? (
                              <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r ${tp.gradient} text-white text-[9px] font-bold px-1 animate-bounce-subtle`}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                            ) : null
                          })()}
                          <span onClick={(e) => { e.stopPropagation(); isStarred ? handleUnstarUser(otherUid!) : otherUid && handleStarUser(otherUid) }}
                            className={`p-1 cursor-pointer transition-colors ${isStarred ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400 opacity-0 group-hover:opacity-100'}`}>
                            <Star className={`h-3.5 w-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {lastMsg && lastMsg.senderId === currentUser?.uid && <TickIndicator status={lastMsg.status} color={lastMsg.status === 'read' ? '#53bdeb' : lastMsg.status === 'delivered' ? '#8696a0' : '#8696a0'} />}
                        {lastMsg ? (
                          <p className={`text-[12px] truncate ${c.muted}`}>
                            {lastMsg.type === 'deleted' ? 'Message deleted' : room.type === 'group' ? `${lastMsg.senderName}: ${lastMsg.content}` : lastMsg.content}
                          </p>
                        ) : (
                          <p className={`text-[12px] ${c.muted}`}>No messages yet</p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </>)
          })()}

          {/* STAR TAB */}
          {sidebarTab === 'star' && (() => {
            if (starredUserDetails.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-xl ${tp.glow}`}>
                    <Star className="h-9 w-9 text-white" />
                  </div>
                  <p className={`text-sm ${c.muted} text-center mb-3`}>No starred users yet</p>
                  <p className={`text-xs ${c.sub} text-center max-w-[200px]`}>Star users you chat with frequently for quick access</p>
                </div>
              )
            }

            return (
              <div>
                {starredUserDetails.map((user) => {
                  const isOn = !!onlineUsers[user.uid]?.online
                  const room = chatRooms.find(r => r.type === 'direct' && r.participants.includes(user.uid))
                  return (
                    <button key={user.uid} onClick={() => { if (room) { setActiveRoomId(room.id); setShowMobileChat(true) } }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${room ? c.hover : ''}`}>
                      <div className="relative shrink-0">
                        <Avatar avatar={user.avatar} name={user.displayName} avatarColor={user.avatarColor || getAvatarColor(user.uid)} size={48} />
                        <OnlineDot online={isOn} isDark={isDark} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <h3 className={`font-semibold text-[14px] truncate ${c.text}`}>{user.displayName}</h3>
                        </div>
                        <p className={`text-[12px] ${c.muted}`}>
                          @{user.username} · <span className={isOn ? 'text-emerald-400' : ''}>{isOn ? 'online' : 'offline'}</span>
                        </p>
                        {room?.lastMessage && (
                          <p className={`text-[11px] ${c.sub} truncate mt-0.5`}>{room.lastMessage.type === 'deleted' ? 'Message deleted' : room.lastMessage.content}</p>
                        )}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleUnstarUser(user.uid) }} className="p-1.5 text-amber-400 hover:text-amber-300 transition-colors shrink-0">
                        <Star className="h-4 w-4 fill-amber-400" />
                      </button>
                    </button>
                  )
                })}
              </div>
            )
          })()}

          {/* USERS TAB */}
          {sidebarTab === 'users' && (
            <div>
              <div className="p-3 space-y-2">
                <Button onClick={() => setShowNewGroup(true)} variant="outline" className={`w-full justify-start gap-2 rounded-xl h-10 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-900'}`}>
                  <Users className="h-4 w-4 text-violet-400" />Create Group Chat
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input placeholder="Search by exact username..." value={userSearch} onChange={(e) => {
                    const val = e.target.value
                    setUserSearch(val)
                    if (!val.trim()) {
                      setSearchResults([])
                    } else {
                      if (userSearchTimeoutRef.current) clearTimeout(userSearchTimeoutRef.current)
                      userSearchTimeoutRef.current = setTimeout(() => {
                        const trimmed = val.trim().toLowerCase()
                        const exactMatch = allUsers.filter(u => u.username === trimmed)
                        if (exactMatch.length === 1) {
                          setSearchResults(exactMatch)
                        } else {
                          searchUsers(val.trim(), currentUser!.uid).then(results => {
                            const filtered = results.filter(u =>
                              u.username.toLowerCase().startsWith(trimmed) ||
                              u.displayName.toLowerCase().startsWith(trimmed.toLowerCase())
                            )
                            setSearchResults(filtered)
                          }).catch(() => {
                            const local = allUsers.filter(u =>
                              u.username.toLowerCase().startsWith(trimmed) ||
                              u.displayName.toLowerCase().startsWith(trimmed.toLowerCase())
                            )
                            setSearchResults(local)
                          })
                        }
                      }, 300)
                    }
                  }} className={`pl-10 h-9 rounded-xl text-sm ${c.input} ${c.text} placeholder:text-slate-500 border focus-visible:ring-1 focus-visible:ring-emerald-500/30`} />
                </div>
                {requestError && <div className="text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2 animate-fade-in">{requestError}</div>}
                {requestSuccess && <div className="text-xs text-emerald-400 bg-emerald-500/10 rounded-xl px-3 py-2 animate-fade-in">{requestSuccess}</div>}
              </div>
              {!userSearch.trim() ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-lg ${tp.glow}`}>
                    <Search className="h-7 w-7 text-white" />
                  </div>
                  <p className={`text-sm ${c.muted} text-center mb-1`}>Search for users</p>
                  <p className={`text-xs ${c.sub} text-center max-w-[220px]`}>Type an exact username to find and send a chat request</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
                  <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center mb-4`}>
                    <Users className={`h-7 w-7 ${c.muted}`} />
                  </div>
                  <p className={`text-sm ${c.muted} text-center mb-1`}>No user found</p>
                  <p className={`text-xs ${c.sub} text-center`}>Make sure the username is correct</p>
                </div>
              ) : searchResults.map((user) => {
                const isOn = !!onlineUsers[user.uid]?.online
                const p = hasPendingRequest(user.uid)
                const ec = hasExistingChat(user.uid)
                const isBlk = blockedUsers.includes(user.uid)
                const isStarred = starredUsers.includes(user.uid)
                return (
                  <div key={user.uid} className={`flex items-center gap-3 px-4 py-3 ${c.hover} transition-colors animate-slide-in`}>
                    <div className="relative shrink-0">
                      <Avatar avatar={user.avatar} name={user.displayName} avatarColor={user.avatarColor || getAvatarColor(user.uid)} size={44} />
                      <OnlineDot online={isOn} isDark={isDark} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className={`font-medium text-[14px] truncate ${c.text}`}>{user.displayName}</p>
                        {isBlk && <Ban className="h-3 w-3 text-red-400 shrink-0" />}
                        {isStarred && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <p className={`text-[11px] ${c.muted}`}>
                        @{user.username} · <span className={isOn ? 'text-emerald-400' : ''}>{isOn ? 'online' : 'offline'}</span>
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1">
                      {isStarred ? (
                        <button onClick={() => handleUnstarUser(user.uid)} className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all" title="Unstar user">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                        </button>
                      ) : ec ? (
                        <>
                          <button onClick={() => handleStarUser(user.uid)} className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Star user">
                            <Star className="h-3.5 w-3.5" />
                          </button>
                          <Badge className={`${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} text-[10px] rounded-lg px-2 border-0 cursor-pointer`}
                            onClick={() => { const room = chatRooms.find(r => r.type === 'direct' && r.participants.includes(user.uid)); if (room) { setActiveRoomId(room.id); setShowMobileChat(true) } }}>
                            <MessageCircle className="h-3 w-3 mr-1" />Chat
                          </Badge>
                        </>
                      ) : p.sent ? (
                        <Badge className={`${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'} text-[10px] rounded-lg px-2 border-0`}>
                          <Clock className="h-3 w-3 mr-1" />Sent
                        </Badge>
                      ) : p.received ? (
                        <Badge className={`${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'} text-[10px] rounded-lg px-2 border-0`}>
                          <Bell className="h-3 w-3 mr-1" />Wants chat
                        </Badge>
                      ) : (
                        <Button size="sm" className={`h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 rounded-lg px-3 shadow-md ${tp.glow}`}
                          onClick={() => handleSendRequest(user)} disabled={sendingRequest === user.uid}>
                          {sendingRequest === user.uid ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="h-3 w-3" />Request</>}
                        </Button>
                      )}
                      {isBlk && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 rounded-lg px-3 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                          onClick={() => handleUnblockUser(user.uid)}>
                          <Unlock className="h-3 w-3" />Unblock
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* REQUESTS TAB */}
          {sidebarTab === 'requests' && (
            <div>
              {receivedRequests.filter(r => r.status === 'pending').length === 0 && sentRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-lg ${tp.glow}`}>
                    <Bell className="h-7 w-7 text-white" />
                  </div>
                  <p className={`text-sm ${c.muted} text-center mb-1`}>No chat requests</p>
                  <p className={`text-xs ${c.sub} text-center max-w-[220px]`}>When someone wants to chat with you, their request will appear here</p>
                </div>
              ) : (<>
                {/* Incoming Requests */}
                {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                  <div>
                    <div className="px-4 py-2"><h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.muted} flex items-center gap-1`}><BellRing className="h-3 w-3 text-emerald-400" />Incoming ({receivedRequests.filter(r => r.status === 'pending').length})</h3></div>
                    {receivedRequests.filter(r => r.status === 'pending').map((req) => (
                      <div key={req.id} className={`px-4 py-3 ${c.border} border-b animate-slide-in`}>
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            <Avatar avatar={req.fromAvatar} name={req.fromDisplayName} avatarColor={req.fromAvatarColor || getAvatarColor(req.fromUid)} size={44} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium text-[14px] truncate ${c.text}`}>{req.fromDisplayName}</p>
                              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            </div>
                            <p className={`text-[11px] ${c.muted}`}>@{req.fromUsername}</p>
                            {req.message && <p className={`text-[11px] mt-0.5 italic ${c.sub}`}>"{req.message}"</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2.5 ml-14">
                          <Button size="sm" className={`h-8 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 flex-1 rounded-lg shadow-md ${tp.glow}`}
                            onClick={() => handleAccept(req.id, req.fromUid)} disabled={acceptingRequest === req.id}>
                            {acceptingRequest === req.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserCheck className="h-3 w-3" />Accept</>}
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1 flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10 rounded-lg"
                            onClick={() => handleReject(req.id)}>
                            <UserX className="h-3 w-3" />Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Sent Requests */}
                {sentRequests.filter(r => r.status === 'pending').length > 0 && (
                  <div>
                    <div className={`mx-4 border-b ${c.border}`} />
                    <div className="px-4 py-2"><h3 className={`text-[11px] font-bold uppercase tracking-wider ${c.muted}`}>Sent ({sentRequests.filter(r => r.status === 'pending').length})</h3></div>
                    {sentRequests.filter(r => r.status === 'pending').map((req) => (
                      <div key={req.id} className={`px-4 py-3 ${c.border} border-b`}>
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            <Avatar avatar={req.toAvatar} name={req.toDisplayName} avatarColor={req.toAvatarColor || getAvatarColor(req.toUid)} size={40} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-[13px] truncate ${c.text}`}>{req.toDisplayName}</p>
                            <div className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5 text-amber-400" />
                              <p className={`text-[11px] ${c.muted}`}>@{req.toUsername} · Pending</p>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors" onClick={() => cancelChatRequest(req.id).then(() => removeRequestFromList(req.id))}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>)}
            </div>
          )}

          {/* SETTINGS TAB */}
          {sidebarTab === 'settings' && (
            <div className="p-4 space-y-4 animate-fade-in">
              {/* Profile Card */}
              <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'} space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="relative cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
                    <Avatar avatar={currentUser?.avatar || null} name={currentUser?.displayName || ''} avatarColor={currentUser?.avatarColor || ''} size={56} />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md border-2 ${isDark ? 'border-[#0f1525]' : 'border-white'}`}>
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingName ? (
                      <div className="flex items-center gap-1">
                        <Input value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} className={`h-7 text-sm rounded-lg ${c.input} ${c.text} border`} onKeyDown={(e) => e.key === 'Enter' && newDisplayName.trim() && updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) })} />
                        <button className="text-emerald-400 p-1" onClick={() => newDisplayName.trim() && updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) })}><Check className="h-4 w-4" /></button>
                        <button className="text-red-400 p-1" onClick={() => setEditingName(false)}><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className={`font-semibold text-[15px] ${c.text}`}>{currentUser?.displayName}</h3>
                        <button onClick={() => { setEditingName(true); setNewDisplayName(currentUser?.displayName || '') }} className={`${c.muted} hover:text-emerald-400`}><Edit3 className="h-3 w-3" /></button>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Lock className="w-2.5 h-2.5 text-emerald-500" />
                      <p className={`text-[12px] ${c.muted}`}>@{currentUser?.username}</p>
                      <button onClick={() => { setEditingUsername(true); setNewUsername(currentUser?.username || ''); setUsernameError('') }} className={`${c.muted} hover:text-emerald-400`}><Edit3 className="h-2.5 w-2.5" /></button>
                    </div>
                    {editingUsername && (
                      <div className="mt-2 space-y-1">
                        <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className={`h-7 text-sm rounded-lg ${c.input} ${c.text} border`} placeholder="New username" />
                        {usernameError && <p className="text-[10px] text-red-400">{usernameError}</p>}
                        <div className="flex gap-1">
                          <Button size="sm" className={`h-6 text-[10px] bg-gradient-to-r ${tp.gradient} text-white rounded-lg px-2`} onClick={handleChangeUsername}>Save</Button>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-slate-400" onClick={() => setEditingUsername(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Encryption Badge */}
              <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? 'bg-emerald-500/8' : 'bg-emerald-50'}`}>
                <Shield className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className={`text-xs font-medium text-emerald-400`}>End-to-End Encrypted</p>
                  <p className={`text-[10px] ${c.sub}`}>Messages are encrypted and only readable by chat participants</p>
                </div>
              </div>

              {/* Change Avatar */}
              <button onClick={() => setShowAvatarPicker(true)} className={`w-full flex items-center gap-3 p-3 rounded-xl ${c.hover} transition-colors text-left`}>
                <ImagePlus className={`h-4 w-4 ${c.muted}`} />
                <span className={`text-sm ${c.text}`}>Change Profile Picture</span>
              </button>

              {/* Change Password */}
              <button onClick={() => setShowPasswordChange(true)} className={`w-full flex items-center gap-3 p-3 rounded-xl ${c.hover} transition-colors text-left`}>
                <Lock className={`h-4 w-4 ${c.muted}`} />
                <span className={`text-sm ${c.text}`}>Change Password</span>
              </button>

              {/* Blocked Users */}
              {blockedUsers.length > 0 && (
                <div>
                  <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`}>Blocked Users ({blockedUsers.length})</h3>
                  <div className="space-y-1">
                    {blockedUsers.map(uid => {
                      const blkUser = allUsers.find(u => u.uid === uid)
                      if (!blkUser) return null
                      return (
                        <div key={uid} className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <Avatar avatar={blkUser.avatar} name={blkUser.displayName} avatarColor={blkUser.avatarColor || getAvatarColor(uid)} size={28} />
                          <span className={`text-sm flex-1 ${c.text}`}>{blkUser.displayName}</span>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-400 hover:text-emerald-300" onClick={() => handleUnblockUser(uid)}>
                            <Unlock className="h-3 w-3 mr-1" />Unblock
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Theme Mode */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`}>Appearance</h3>
                <div className="flex gap-2">
                  <button onClick={() => setTheme({ mode: 'dark' })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${c.card} ${c.text} border ${c.border}`}`}>
                    <Moon className="h-3.5 w-3.5" />Dark
                  </button>
                  <button onClick={() => setTheme({ mode: 'light' })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${!isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${c.card} ${c.text} border ${c.border}`}`}>
                    <Sun className="h-3.5 w-3.5" />Light
                  </button>
                </div>
              </div>

              {/* Theme Color */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`}>Accent Color</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(THEME_PRESETS) as [ThemePreset, typeof THEME_PRESETS[ThemePreset]][]).map(([key, val]) => (
                    <button key={key} onClick={() => setTheme({ preset: key })}
                      className={`flex items-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 ${preset === key ? `bg-gradient-to-r ${val.gradient} text-white shadow-md ${val.glow}` : `${c.card} ${c.text} border ${c.border}`}`}>
                      <div className={`w-3.5 h-3.5 rounded-full ${val.primary} shadow-sm`} style={{ boxShadow: preset === key ? `0 0 8px ${val.hex}40` : 'none' }} />{val.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`}>Font Size</h3>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button key={size} onClick={() => setTheme({ fontSize: size })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-200 ${theme.fontSize === size ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md` : `${c.card} ${c.text} border ${c.border}`}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== CHAT AREA ====== */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col ${c.bg} transition-colors duration-300`}>
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className={`w-24 h-24 rounded-[22px] bg-[#00C896] flex items-center justify-center mb-6 shadow-2xl ${tp.glow} animate-float`}>
              <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
                <path d="M22 24h56c5.5 0 10 4.5 10 10v22c0 5.5-4.5 10-10 10H42L30 80V66H22c-5.5 0-10-4.5-10-10V34c0-5.5 4.5-10 10-10z" fill="white"/>
              </svg>
            </div>
            <h2 className={`text-xl font-bold ${c.text} mb-2`}>FurtherChat</h2>
            <p className={`text-sm ${c.muted} max-w-[280px] text-center`}>Select a conversation to start messaging, or find new users to chat with.</p>
            <div className={`flex items-center gap-1.5 mt-4 ${c.sub}`}>
              <Lock className="h-3 w-3" />
              <span className="text-[11px]">Messages are end-to-end encrypted</span>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className={`px-4 py-3 ${c.headerBg} border-b ${c.border} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowMobileChat(false); setActiveRoomId(null) }} className={`md:hidden p-1.5 rounded-lg ${c.hover} ${c.muted}`}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="relative">
                  <Avatar avatar={activeRoom.avatar} name={activeRoom.name || 'Chat'} avatarColor={activeRoom.avatarColor || getAvatarColor(activeRoom.id)} size={40} />
                  <OnlineDot online={otherIsOnline} size="md" isDark={isDark} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-semibold text-sm ${c.text}`}>{activeRoom.name || 'Chat'}</h3>
                    {isOtherBlocked && <Ban className="h-3.5 w-3.5 text-red-400" />}
                    {otherUidInActiveRoom && starredUsers.includes(otherUidInActiveRoom) && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                  </div>
                  {activeRoom.type === 'direct' && (
                    <p className={`text-[11px] ${otherIsOnline ? 'text-emerald-400' : c.muted}`}>
                      {isOtherBlocked ? 'Blocked' :
                        activeTyping.length > 0 ? (
                        <>{activeTyping.join(', ')} typing<TypingDots /></>
                      ) : otherIsOnline ? 'Online' : otherLastSeen ? formatLastSeen(otherLastSeen) : otherUidInActiveRoom ? 'Offline' : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setChatSearchQuery(chatSearchQuery ? '' : ' ')} className={`p-2 rounded-xl ${c.hover} ${c.muted} transition-colors`}><Search className="h-4 w-4" /></button>
                <button onClick={() => setChatActionMenu(!chatActionMenu)} data-chat-menu className={`p-2 rounded-xl ${c.hover} ${c.muted} transition-colors`}><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Chat Action Menu */}
            {chatActionMenu && (
              <div data-chat-menu className={`absolute top-14 right-4 z-50 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'} border rounded-xl shadow-xl py-1 min-w-[200px] animate-scale-in`}>
                {otherUidInActiveRoom && (
                  starredUsers.includes(otherUidInActiveRoom) ? (
                    <button onClick={() => { handleUnstarUser(otherUidInActiveRoom); setChatActionMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} text-amber-400 transition-colors flex items-center gap-2`}>
                      <Star className="h-3.5 w-3.5 fill-amber-400" />Unstar User
                    </button>
                  ) : (
                    <button onClick={() => { handleStarUser(otherUidInActiveRoom); setChatActionMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`}>
                      <Star className="h-3.5 w-3.5" />Star User
                    </button>
                  )
                )}
                <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoom.id, action: 'clear' }); setChatActionMenu(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`}>
                  <Trash2 className="h-3.5 w-3.5" />Clear Chat
                </button>
                <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoom.id, action: 'delete' }); setChatActionMenu(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2">
                  <Trash className="h-3.5 w-3.5" />Delete Chat
                </button>
                {otherUidInActiveRoom && (
                  isOtherBlocked ? (
                    <button onClick={() => { handleUnblockUser(otherUidInActiveRoom); setChatActionMenu(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} text-emerald-400 transition-colors flex items-center gap-2`}>
                      <Unlock className="h-3.5 w-3.5" />Unblock User
                    </button>
                  ) : (
                    <button onClick={() => { handleBlockUser(otherUidInActiveRoom); setChatActionMenu(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2">
                      <Ban className="h-3.5 w-3.5" />Block User
                    </button>
                  )
                )}
              </div>
            )}

            {/* Search bar */}
            {chatSearchQuery !== '' && (
              <div className="px-4 py-2 border-b border-white/5" data-chat-search>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <Input ref={chatSearchRef} placeholder="Search in chat..." value={chatSearchQuery === ' ' ? '' : chatSearchQuery} onChange={(e) => setChatSearchQuery(e.target.value)}
                    className={`h-8 text-sm rounded-lg pl-9 ${c.input} ${c.text} placeholder:text-slate-500 border`} autoFocus />
                  <button onClick={() => setChatSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Blocked user notice */}
            {isOtherBlocked && (
              <div className={`px-4 py-3 ${isDark ? 'bg-red-500/8 border-red-500/15' : 'bg-red-50 border-red-100'} border-b flex items-center gap-3`}>
                <Ban className="h-4 w-4 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-red-400 font-medium">This user is blocked</p>
                  <p className={`text-[10px] ${c.sub}`}>You won't receive messages from blocked users. Unblock to chat again.</p>
                </div>
                <Button size="sm" className="h-7 text-[11px] text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 rounded-lg" variant="outline"
                  onClick={() => otherUidInActiveRoom && handleUnblockUser(otherUidInActiveRoom)}>
                  <Unlock className="h-3 w-3 mr-1" />Unblock
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto px-4 py-3 ${isDark ? 'chat-wallpaper-dark' : 'chat-wallpaper-light'}`}>
              {activeMessages
                .filter(m => !m.deletedFor.includes(currentUser?.uid || ''))
                .filter(m => chatSearchQuery && chatSearchQuery !== ' ' ? m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) : true)
                .map((msg, idx, arr) => {
                const isMine = msg.senderId === currentUser?.uid
                const isDeleted = msg.deletedForEveryone || msg.type === 'deleted'
                const isSystem = msg.type === 'system'
                const showAvatar = !isMine && !isSystem && (idx === 0 || arr[idx - 1]?.senderId !== msg.senderId)
                const prevMsg = idx > 0 ? arr[idx - 1] : null
                const showDateSep = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString()

                if (isSystem) return (
                  <div key={msg.id} className="flex justify-center my-3 animate-fade-in">
                    <span className={`text-[11px] ${c.muted} ${isDark ? 'bg-white/5' : 'bg-slate-100'} backdrop-blur-sm rounded-lg px-3 py-1`}>{msg.content}</span>
                  </div>
                )

                return (
                  <div key={msg.id}>
                    {showDateSep && (
                      <div className="flex justify-center my-4 animate-fade-in">
                        <span className={`text-[11px] ${c.muted} ${isDark ? 'bg-white/5' : 'bg-slate-100'} backdrop-blur-sm rounded-lg px-3 py-1`}>
                          {new Date(msg.createdAt).toDateString() === new Date().toDateString() ? 'Today' :
                           new Date(msg.createdAt).toDateString() === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' :
                           new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 ${showAvatar ? 'mt-3' : ''} msg-enter`}
                    onContextMenu={(e) => { e.preventDefault(); setContextMenuMessage(msg) }}
                    onTouchStart={() => handleTouchStart(msg)} onTouchEnd={handleTouchEnd}>
                    <div className={`flex items-end gap-2 max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`}>
                      {!isMine && (
                        <div className="w-7 shrink-0">
                          {showAvatar && <Avatar avatar={msg.senderAvatar} name={msg.senderName} avatarColor={msg.senderAvatarColor} size={28} />}
                        </div>
                      )}
                      <div className={`group relative`}>
                        {msg.replyTo && (
                          <div className={`text-[10px] ${c.muted} px-3 pt-2 pb-1 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-t-2xl border-b ${c.border}`}>
                            <span className="font-medium">{msg.replyToSender}</span>: {msg.replyToContent}
                          </div>
                        )}
                        <div className={`px-3 py-2 rounded-2xl ${isDeleted ? 'italic' : ''} transition-all duration-200 hover:shadow-md`} style={isMine ? {
                          background: `linear-gradient(135deg, rgba(${tp.primaryRgb},0.22) 0%, rgba(${tp.primaryRgb},0.08) 100%)`,
                          border: `1px solid rgba(${tp.primaryRgb},0.18)`,
                        } : isDark ? {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        } : {
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                        }}>
                          {!isMine && showAvatar && activeRoom?.type === 'group' && (
                            <p className={`text-[10px] font-medium mb-0.5`} style={{ color: msg.senderAvatarColor || getAvatarColor(msg.senderId) }}>{msg.senderName}</p>
                          )}
                          {isDeleted ? (
                            <p className={`text-[13px] ${c.muted}`}>&#x1F6AB; This message was deleted</p>
                          ) : (
                            <p className={`text-[13px] ${c.text} break-words whitespace-pre-wrap`}>{msg.content}</p>
                          )}
                          <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                            <span className={`text-[10px] ${c.muted}`}>{formatTime(msg.createdAt)}</span>
                            {isMine && <TickIndicator status={msg.status} color={msg.status === 'read' ? '#53bdeb' : (isDark ? '#8696a0' : '#8696a0')} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                )
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className={`px-4 py-2 ${isDark ? 'bg-white/5' : 'bg-slate-50'} border-t ${c.border} flex items-center gap-2 animate-slide-up`}>
                <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${tp.gradient}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-medium ${c.muted}`}>{replyingTo.senderName}</p>
                  <p className={`text-[11px] ${c.sub} truncate`}>{replyingTo.content}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className={`${c.muted} hover:text-white`}><X className="h-4 w-4" /></button>
              </div>
            )}

            {/* Message Input */}
            <div className={`px-3 py-2 ${c.border} border-t`}>
              <div className={`flex items-end gap-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-2xl px-3 py-1.5`}>
                <button ref={emojiBtnRef} onClick={(e) => { e.stopPropagation(); if (showEmojiPicker) { setShowEmojiPicker(false) } else { setEmojiAnchorRect(emojiBtnRef.current?.getBoundingClientRect() || null); setShowEmojiPicker(true) } }} className={`p-1.5 rounded-lg ${c.hover} ${showEmojiPicker ? 'text-emerald-400' : c.muted} transition-colors shrink-0 mb-0.5`}>
                  <Smile className="h-5 w-5" />
                </button>
                {showEmojiPicker && <Suspense fallback={<div className="w-64 h-48 animate-pulse bg-white/5 rounded-xl" />}><LazyEmojiPicker onSelect={(e) => setMessageInput(prev => prev + e)} onClose={() => setShowEmojiPicker(false)} isDark={isDark} anchorRect={emojiAnchorRect} /></Suspense>}
                <textarea
                  value={messageInput}
                  onChange={(e) => { handleTyping(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px' }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Type a message..."
                  rows={1}
                  className={`flex-1 bg-transparent ${c.text} placeholder:text-slate-500 outline-none resize-none text-sm leading-5 max-h-24 py-1.5`}
                />
                <button onClick={handleSend} disabled={!messageInput.trim() || sendingMessage || isOtherBlocked}
                  className={`p-2 rounded-xl bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow} disabled:opacity-30 transition-all duration-200 shrink-0 mb-0.5 active:scale-90`}>
                  {sendingMessage ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ====== CONTEXT MENU ====== */}
      {contextMenuMessage && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setContextMenuMessage(null)}>
          <div className={`absolute ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'} border rounded-xl shadow-2xl py-1 min-w-[180px] animate-scale-in`}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { navigator.clipboard.writeText(contextMenuMessage.content); setContextMenuMessage(null) }}
              className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`}>
              <Hash className="h-3.5 w-3.5" />Copy
            </button>
            <button onClick={() => { setReplyingTo(contextMenuMessage); setContextMenuMessage(null) }}
              className={`w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`}>
              <ChevronRight className="h-3.5 w-3.5" />Reply
            </button>
            <button onClick={() => { setDeleteConfirm({ msg: contextMenuMessage, forEveryone: false }); setContextMenuMessage(null) }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2">
              <Trash2 className="h-3.5 w-3.5" />Delete for Me
            </button>
            {canDeleteForEveryone(contextMenuMessage) && (
              <button onClick={() => { setDeleteConfirm({ msg: contextMenuMessage, forEveryone: true }); setContextMenuMessage(null) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2">
                <Trash2 className="h-3.5 w-3.5" />Delete for Everyone
              </button>
            )}
          </div>
        </div>
      )}

      {/* ====== DELETE CONFIRM DIALOG ====== */}
      {deleteConfirm && (
        <Dialog open={true} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <DialogHeader>
              <DialogTitle className={c.text}>{deleteConfirm.forEveryone ? 'Delete for Everyone?' : 'Delete for Me?'}</DialogTitle>
            </DialogHeader>
            <p className={`text-sm ${c.muted}`}>
              {deleteConfirm.forEveryone
                ? 'This message will be deleted for everyone in this chat. This action cannot be undone.'
                : 'This message will only be deleted for you. Other participants can still see it.'}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className={c.muted}>Cancel</Button>
              <Button onClick={() => handleDeleteMsg(deleteConfirm.msg, deleteConfirm.forEveryone)} disabled={deletingMsg}
                className="bg-red-500 hover:bg-red-600 text-white">
                {deletingMsg ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ====== CLEAR/DELETE CHAT CONFIRM ====== */}
      {clearDeleteConfirm && (
        <Dialog open={true} onOpenChange={() => setClearDeleteConfirm(null)}>
          <DialogContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <DialogHeader>
              <DialogTitle className={c.text}>{clearDeleteConfirm.action === 'delete' ? 'Delete Chat?' : 'Clear Chat?'}</DialogTitle>
            </DialogHeader>
            <p className={`text-sm ${c.muted}`}>
              {clearDeleteConfirm.action === 'delete'
                ? 'This chat will be removed from your list. You can send a new chat request later if you want to reconnect.'
                : 'All messages will be cleared for you only. The chat will remain in your list.'}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setClearDeleteConfirm(null)} className={c.muted}>Cancel</Button>
              <Button onClick={() => handleClearChat(clearDeleteConfirm.roomId, clearDeleteConfirm.action)} disabled={clearingChat}
                className="bg-red-500 hover:bg-red-600 text-white">
                {clearingChat ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : clearDeleteConfirm.action === 'delete' ? 'Delete' : 'Clear'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ====== PASSWORD CHANGE DIALOG ====== */}
      {showPasswordChange && (
        <Dialog open={true} onOpenChange={setShowPasswordChange}>
          <DialogContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <DialogHeader>
              <DialogTitle className={c.text}>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {passwordError && <div className="text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2 animate-fade-in">{passwordError}</div>}
              {passwordSuccess && <div className="text-xs text-emerald-400 bg-emerald-500/10 rounded-xl px-3 py-2 animate-fade-in">Password changed successfully!</div>}
              <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className={`h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`} />
              <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className={`h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`} />
              <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`} />
              <Button onClick={handleChangePassword} disabled={changingPassword} className={`w-full bg-gradient-to-r ${tp.gradient} text-white h-10 rounded-xl`}>
                {changingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Change Password'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ====== AVATAR PICKER DIALOG ====== */}
      {showAvatarPicker && (
        <Dialog open={true} onOpenChange={setShowAvatarPicker}>
          <DialogContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} max-w-md`}>
            <DialogHeader>
              <DialogTitle className={c.text}>Change Profile Picture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Current Avatar */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <Avatar avatar={currentUser?.avatar || null} name={currentUser?.displayName || ''} avatarColor={currentUser?.avatarColor || ''} size={80} />
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r ${tp.gradient} rounded-full flex items-center justify-center shadow-md`}>
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className={`w-full h-10 rounded-xl gap-2 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50'}`}>
                <ImagePlus className="h-4 w-4" />Upload from Device
              </Button>

              {/* Built-in Avatars */}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${c.muted}`}>Choose an Avatar</h3>
                <div className="grid grid-cols-4 gap-3">
                  {BUILT_IN_AVATARS.map((av) => (
                    <button key={av.id} onClick={() => handleSelectBuiltInAvatar(av.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${currentUser?.avatar === av.id
                        ? `bg-gradient-to-r ${tp.gradient} shadow-md ${tp.glow} ring-2 ring-emerald-400/50`
                        : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: av.bg }}>
                        <span className="text-lg">{av.emoji}</span>
                      </div>
                      <span className={`text-[9px] ${currentUser?.avatar === av.id ? 'text-white' : c.muted}`}>{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Remove Avatar */}
              {currentUser?.avatar && (
                <Button onClick={handleRemoveAvatar} variant="outline" className="w-full h-10 rounded-xl gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
                  <Trash className="h-4 w-4" />Remove Picture
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ====== GROUP CREATION DIALOG ====== */}
      {showNewGroup && (
        <Dialog open={true} onOpenChange={setShowNewGroup}>
          <DialogContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <DialogHeader>
              <DialogTitle className={c.text}>Create Group Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)}
                className={`h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`} />
              <div className="max-h-60 overflow-y-auto space-y-1">
                {allUsers.map((user) => (
                  <button key={user.uid} onClick={() => setSelectedUsers(prev => prev.includes(user.uid) ? prev.filter(u => u !== user.uid) : [...prev, user.uid])}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${selectedUsers.includes(user.uid) ? (isDark ? 'bg-emerald-500/15' : 'bg-emerald-50') : c.hover}`}>
                    <Avatar avatar={user.avatar} name={user.displayName} avatarColor={user.avatarColor || getAvatarColor(user.uid)} size={32} />
                    <span className={`text-sm ${c.text}`}>{user.displayName}</span>
                    {selectedUsers.includes(user.uid) && <Check className="h-4 w-4 text-emerald-400 ml-auto" />}
                  </button>
                ))}
              </div>
              <Button onClick={async () => {
                if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) return
                const roomId = await createGroupChatRoom(groupName, currentUser.uid, selectedUsers)
                setActiveRoomId(roomId); setShowMobileChat(true); setShowNewGroup(false)
                setGroupName(''); setSelectedUsers([])
              }} disabled={!groupName.trim() || selectedUsers.length === 0}
                className={`w-full bg-gradient-to-r ${tp.gradient} text-white h-10 rounded-xl`}>
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
