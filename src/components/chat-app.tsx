'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore, getAvatarColor } from '@/lib/store'
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
} from '@/lib/firebase-service'
import type { Message, ThemePreset } from '@/lib/store'
import { EmojiPicker } from '@/components/emoji-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Search, Users, Settings, LogOut, Send, ArrowLeft,
  Phone, Video, Hash, Edit3, Check, X, UserPlus, UserCheck,
  UserX, Clock, Bell, BellRing, Smile, Reply, Trash2,
  Palette, Sun, Moon, MoreVertical, Ban, AlertTriangle, Lock,
  Sparkles, Paperclip, Shield, ChevronRight,
} from 'lucide-react'

// ============================================================
// THEME CONFIG - Modern gradients and colors
// ============================================================
const THEME_PRESETS: Record<ThemePreset, { primary: string; primaryRgb: string; gradient: string; glow: string; name: string; bubbleMine: string; bubbleOther: string }> = {
  emerald: { primary: 'bg-emerald-500', primaryRgb: '16,185,129', gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/25', name: 'Emerald', bubbleMine: 'bg-emerald-600', bubbleOther: 'bg-slate-700' },
  ocean: { primary: 'bg-blue-500', primaryRgb: '59,130,246', gradient: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/25', name: 'Ocean', bubbleMine: 'bg-blue-600', bubbleOther: 'bg-slate-700' },
  sunset: { primary: 'bg-orange-500', primaryRgb: '249,115,22', gradient: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/25', name: 'Sunset', bubbleMine: 'bg-orange-600', bubbleOther: 'bg-slate-700' },
  lavender: { primary: 'bg-violet-500', primaryRgb: '139,92,246', gradient: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/25', name: 'Lavender', bubbleMine: 'bg-violet-600', bubbleOther: 'bg-slate-700' },
  rose: { primary: 'bg-pink-500', primaryRgb: '236,72,153', gradient: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/25', name: 'Rose', bubbleMine: 'bg-pink-600', bubbleOther: 'bg-slate-700' },
  midnight: { primary: 'bg-indigo-500', primaryRgb: '99,102,241', gradient: 'from-indigo-500 to-blue-500', glow: 'shadow-indigo-500/25', name: 'Midnight', bubbleMine: 'bg-indigo-600', bubbleOther: 'bg-slate-700' },
}

// ============================================================
// TICK INDICATOR (WhatsApp style)
// ============================================================
function TickIndicator({ status, color }: { status: Message['status']; color: string }) {
  if (status === 'sent') return <svg width="14" height="9" viewBox="0 0 14 9" className="inline-block ml-1 opacity-60"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  if (status === 'delivered') return <svg width="18" height="9" viewBox="0 0 18 9" className="inline-block ml-1 opacity-70"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4.5L7.5 7L13 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  return <svg width="18" height="9" viewBox="0 0 18 9" className="inline-block ml-1"><path d="M1 4.5L3.5 7L9 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4.5L7.5 7L13 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ============================================================
// ONLINE INDICATOR
// ============================================================
function OnlineDot({ online, size = 'sm' }: { online: boolean; size?: 'sm' | 'md' }) {
  if (!online) return null
  const s = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  return (
    <span className={`absolute -bottom-0.5 -right-0.5 ${s} bg-emerald-500 rounded-full border-2 border-slate-900`}>
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
    </span>
  )
}

// ============================================================
// TYPING DOTS
// ============================================================
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  )
}

// ============================================================
// MAIN CHAT APP
// ============================================================
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
    logout } = store

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
  const [chatSearchOpen, setChatSearchOpen] = useState(false)
  const [deletingMsg, setDeletingMsg] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [clearingChat, setClearingChat] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const listenersRef = useRef<(() => void)[]>([])
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  const preset = theme.preset
  const tp = THEME_PRESETS[preset]
  const isDark = theme.mode === 'dark'
  const fontSizeClass = theme.fontSize === 'small' ? 'text-xs' : theme.fontSize === 'large' ? 'text-base' : 'text-sm'
  const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length

  // ---- LISTENERS ----
  useEffect(() => {
    if (!currentUser || !isFirebaseConfigured()) return
    const cleanup = setupPresence(currentUser.uid)
    const u1 = listenToPresence((users) => {
      const onlineMap: Record<string, boolean> = {}
      Object.keys(users).forEach(uid => { onlineMap[uid] = users[uid].online })
      setOnlineUsers(onlineMap)
    })
    const u2 = listenToChatRooms(currentUser.uid, (rooms) => setChatRooms(rooms))
    const u3 = listenToSentRequests(currentUser.uid, setSentRequests)
    const u4 = listenToReceivedRequests(currentUser.uid, setReceivedRequests)
    getAllUsers(currentUser.uid).then(setAllUsers)
    listenersRef.current = [cleanup, u1, u2, u3, u4]
    return () => { listenersRef.current.forEach(fn => fn()) }
  }, [currentUser?.uid])

  useEffect(() => {
    if (!activeRoomId || !isFirebaseConfigured() || !currentUser) return
    const u1 = listenToMessages(activeRoomId, currentUser.uid, (msgs) => setMessages(activeRoomId, msgs))
    const u2 = listenToTyping(activeRoomId, (u) => setTypingUsers(activeRoomId, u.filter(n => n !== currentUser?.displayName)))
    return () => { u1(); u2() }
  }, [activeRoomId, currentUser?.uid])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages[activeRoomId || '']?.length])

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
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(activeRoomId!, currentUser!.uid, currentUser!.displayName, false), 3000)
  }, [activeRoomId, currentUser])

  const handleSendRequest = useCallback(async (toUser: any) => {
    if (!currentUser) return
    setSendingRequest(toUser.uid)
    setRequestError('')
    setRequestSuccess('')
    try {
      const result = await sendChatRequest(
        currentUser.uid, currentUser.username, currentUser.displayName, currentUser.avatar, currentUser.avatarColor,
        toUser.uid, toUser.username, toUser.displayName, toUser.avatar, toUser.avatarColor
      )
      if (result.type === 'restored') {
        setRequestSuccess('Chat restored!')
        setSidebarTab('chats')
        setTimeout(() => setRequestSuccess(''), 3000)
      } else {
        setRequestSuccess('Request sent!')
        setTimeout(() => setRequestSuccess(''), 3000)
      }
    } catch (err: any) {
      setRequestError(err.message)
    } finally { setSendingRequest(null) }
  }, [currentUser])

  const handleAccept = useCallback(async (reqId: string, fromUid: string) => {
    if (!currentUser) return
    setAcceptingRequest(reqId)
    try {
      const roomId = await acceptChatRequest(reqId, fromUid, currentUser.uid)
      updateRequestStatus(reqId, 'accepted', roomId)
      setActiveRoomId(roomId)
      setShowMobileChat(true)
      setSidebarTab('chats')
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
    setDeletingMsg(true); setDeleteError('')
    try {
      if (forEveryone) {
        await deleteMessageForEveryone(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedForEveryone: true, content: 'This message was deleted', type: 'deleted' })
      } else {
        await deleteMessageForMe(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedFor: [...msg.deletedFor, currentUser.uid] })
      }
      setContextMenuMessage(null); setDeleteConfirm(null)
    } catch (err: any) { setDeleteError(err.message || 'Failed to delete') } finally { setDeletingMsg(false) }
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

  // ---- DERIVED STATE ----
  const activeRoom = chatRooms.find(r => r.id === activeRoomId)
  const activeMessages = activeRoomId ? (messages[activeRoomId] || []) : []
  const activeTyping = activeRoomId ? (typingUsers[activeRoomId] || []) : []
  const filteredRooms = chatRooms.filter(room => !searchQuery || (room.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const searchFilteredMsgs = chatSearchQuery ? activeMessages.filter(m => !m.deletedForEveryone && !m.deletedFor.includes(currentUser?.uid || '') && m.content.toLowerCase().includes(chatSearchQuery.toLowerCase())) : []

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const formatTime = (ts: number) => { const d = new Date(ts); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  const formatLastSeen = (ts: number) => {
    const d = new Date(ts); const now = new Date()
    if (d.toDateString() === now.toDateString()) return `last seen today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    return `last seen ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  // ---- COLOR SCHEME ----
  const colors = isDark ? {
    bg: 'bg-[#0b141a]', sidebar: 'bg-[#111b21]', card: 'bg-[#1f2c34]',
    hover: 'hover:bg-[#202c33]', border: 'border-[#2a3942]', input: 'bg-[#2a3942] border-[#2a3942]',
    text: 'text-[#e9edef]', muted: 'text-[#8696a0]', sub: 'text-[#8696a0]',
    bubbleMine: 'bg-[#005c4b]', bubbleOther: 'bg-[#1f2c34]',
    headerBg: 'bg-[#202c33]', panelBg: 'bg-[#111b21]',
  } : {
    bg: 'bg-[#f0f2f5]', sidebar: 'bg-[#ffffff]', card: 'bg-[#ffffff]',
    hover: 'hover:bg-[#f5f6f6]', border: 'border-[#e9edef]', input: 'bg-[#f0f2f5] border-[#e9edef]',
    text: 'text-[#111b21]', muted: 'text-[#667781]', sub: 'text-[#667781]',
    bubbleMine: 'bg-[#d9fdd3]', bubbleOther: 'bg-[#ffffff]',
    headerBg: 'bg-[#f0f2f5]', panelBg: 'bg-[#ffffff]',
  }

  return (
    <div className={`h-screen flex overflow-hidden ${colors.bg} transition-colors duration-200`}>
      {/* ====== SIDEBAR ====== */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col shrink-0 border-r ${colors.border} ${colors.sidebar} transition-colors duration-200`}>
        {/* Header */}
        <div className={`px-4 py-3 ${colors.headerBg} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: `linear-gradient(135deg, ${tp.primaryRgb}, ${tp.primaryRgb}88)` }}>
                {currentUser ? getInitials(currentUser.displayName) : '?'}
              </div>
              <OnlineDot online={!!onlineUsers[currentUser?.uid || '']} size="sm" />
            </div>
            <div className="min-w-0">
              <h2 className={`font-semibold text-sm truncate ${colors.text}`}>{currentUser?.displayName}</h2>
              <p className={`text-[11px] ${colors.muted}`}>@{currentUser?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setSidebarTab('settings')} className={`p-2 rounded-full ${colors.hover} ${colors.muted} hover:text-white transition-colors`}><Settings className="h-4 w-4" /></button>
            <button onClick={handleLogout} className={`p-2 rounded-full ${colors.hover} ${colors.muted} hover:text-red-400 transition-colors`}><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Search */}
        <div className={`px-3 py-2 ${colors.sidebar}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
            <Input placeholder="Search or start new chat" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 h-9 rounded-lg text-sm ${colors.input} ${colors.text} placeholder:text-[#8696a0] border-0 focus-visible:ring-1 focus-visible:ring-emerald-500/30`} />
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex ${colors.border} border-b`}>
          {([['chats', MessageCircle, 'Chats'], ['users', Users, 'Users'], ['requests', pendingReceivedCount > 0 ? BellRing : Bell, 'Requests']] as const).map(([tab, Icon, label]) => (
            <button key={tab} onClick={() => { setSidebarTab(tab as any); setRequestError(''); setRequestSuccess('') }}
              className={`flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all relative ${sidebarTab === tab ? colors.text : colors.muted}`}>
              <Icon className="h-3.5 w-3.5" />{label}
              {tab === 'requests' && pendingReceivedCount > 0 && (
                <span className="absolute -top-0.5 right-2 bg-emerald-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">{pendingReceivedCount}</span>
              )}
              {sidebarTab === tab && <div className={`absolute bottom-0 left-[30%] right-[30%] h-[3px] rounded-full bg-gradient-to-r ${tp.gradient}`} />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* CHATS TAB */}
          {sidebarTab === 'chats' && (filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-xl ${tp.glow}`}>
                <MessageCircle className="h-9 w-9 text-white" />
              </div>
              <p className={`text-sm ${colors.muted} text-center mb-3`}>No conversations yet</p>
              <p className={`text-xs ${colors.muted} text-center max-w-[200px] mb-4`}>Find users and send a chat request to start messaging</p>
              <Button onClick={() => setSidebarTab('users')} className={`bg-gradient-to-r ${tp.gradient} text-white text-xs h-9 rounded-full px-6 shadow-lg ${tp.glow}`}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />Find Users
              </Button>
            </div>
          ) : filteredRooms.map((room) => {
            const isActive = activeRoomId === room.id
            const otherUid = room.type === 'direct' ? room.participants.find(p => p !== currentUser?.uid) : null
            const isOn = otherUid ? !!onlineUsers[otherUid] : false
            const lastMsg = room.lastMessage
            return (
              <button key={room.id} onClick={() => { setActiveRoomId(room.id); setShowMobileChat(true) }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${isActive ? (isDark ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]') : colors.hover}`}>
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: room.avatarColor || getAvatarColor(room.id) }}>
                    {room.type === 'group' ? <Hash className="h-5 w-5" /> : getInitials(room.name || 'U')}
                  </div>
                  <OnlineDot online={isOn} />
                </div>
                <div className="flex-1 min-w-0 text-left border-b ${isDark ? 'border-[#222d34]' : 'border-[#e9edef]'} pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-[15px] truncate ${colors.text}`}>{room.name || 'Chat'}</h3>
                    {lastMsg && <span className={`text-[11px] ${lastMsg.createdAt > Date.now() - 60000 ? 'text-emerald-400' : colors.muted} shrink-0 ml-2`}>{formatTime(lastMsg.createdAt)}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {lastMsg && lastMsg.senderId === currentUser?.uid && <TickIndicator status={lastMsg.status} color={lastMsg.status === 'read' ? '#53bdeb' : '#8696a0'} />}
                    {lastMsg ? (
                      <p className={`text-[13px] truncate ${colors.muted}`}>
                        {lastMsg.type === 'deleted' ? '🚫 Message deleted' : room.type === 'group' ? `${lastMsg.senderName}: ${lastMsg.content}` : lastMsg.senderId === currentUser?.uid ? lastMsg.content : lastMsg.content}
                      </p>
                    ) : (
                      <p className={`text-[13px] ${colors.muted}`}>No messages yet</p>
                    )}
                  </div>
                </div>
              </button>
            )
          }))}

          {/* USERS TAB */}
          {sidebarTab === 'users' && (
            <div>
              <div className="p-3 space-y-2">
                <Button onClick={() => setShowNewGroup(true)} variant="outline" className={`w-full justify-start gap-2 rounded-xl h-10 ${isDark ? 'border-[#2a3942] hover:bg-[#202c33] text-[#e9edef]' : 'border-[#e9edef] hover:bg-[#f5f6f6] text-[#111b21]'}`}>
                  <Users className="h-4 w-4 text-violet-400" />Create Group Chat
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                  <Input placeholder="Search users by name or username..." value={userSearch} onChange={(e) => {
                    setUserSearch(e.target.value)
                    if (!e.target.value.trim()) { setSearchResults(allUsers) }
                    else { searchUsers(e.target.value, currentUser!.uid).then(setSearchResults).catch(() => setSearchResults(allUsers.filter(u => u.username.includes(e.target.value.toLowerCase()) || u.displayName.toLowerCase().includes(e.target.value.toLowerCase())))) }
                  }} className={`pl-10 h-9 rounded-lg text-sm ${colors.input} ${colors.text} placeholder:text-[#8696a0] border-0 focus-visible:ring-1 focus-visible:ring-emerald-500/30`} />
                </div>
                {requestError && <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{requestError}</div>}
                {requestSuccess && <div className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">{requestSuccess}</div>}
              </div>
              {(userSearch ? searchResults : allUsers).map((user) => {
                const isOn = !!onlineUsers[user.uid]
                const p = hasPendingRequest(user.uid)
                const ec = hasExistingChat(user.uid)
                return (
                  <div key={user.uid} className={`flex items-center gap-3 px-4 py-3 ${colors.hover} transition-colors`}>
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-xs"
                        style={{ background: user.avatarColor || getAvatarColor(user.uid) }}>
                        {getInitials(user.displayName)}
                      </div>
                      <OnlineDot online={isOn} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-[14px] truncate ${colors.text}`}>{user.displayName}</p>
                      <p className={`text-[12px] ${colors.muted}`}>
                        @{user.username} · <span className={isOn ? 'text-emerald-400' : ''}>{isOn ? 'online' : 'offline'}</span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      {ec ? (
                        <Badge className={`${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} text-[10px] rounded-full px-2.5 border-0`}>
                          <MessageCircle className="h-3 w-3 mr-1" />Chat
                        </Badge>
                      ) : p.sent ? (
                        <Badge className={`${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'} text-[10px] rounded-full px-2.5 border-0`}>
                          <Clock className="h-3 w-3 mr-1" />Sent
                        </Badge>
                      ) : p.received ? (
                        <Badge className={`${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'} text-[10px] rounded-full px-2.5 border-0`}>
                          <Bell className="h-3 w-3 mr-1" />Wants chat
                        </Badge>
                      ) : (
                        <Button size="sm" className={`h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 rounded-full px-3 shadow-md ${tp.glow}`}
                          onClick={() => handleSendRequest(user)} disabled={sendingRequest === user.uid}>
                          {sendingRequest === user.uid ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="h-3 w-3" />Request</>}
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
              <div className="px-4 py-2"><h3 className={`text-[12px] font-bold uppercase tracking-wider ${colors.muted}`}>Incoming {receivedRequests.filter(r => r.status === 'pending').length > 0 && `(${receivedRequests.filter(r => r.status === 'pending').length})`}</h3></div>
              {receivedRequests.length === 0 ? (
                <p className={`text-sm text-center py-8 ${colors.muted}`}>No requests yet</p>
              ) : receivedRequests.map((req) => (
                <div key={req.id} className={`px-4 py-3 ${colors.border} border-b`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                      style={{ background: req.fromAvatarColor || getAvatarColor(req.fromUid) }}>
                      {getInitials(req.fromDisplayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium text-[14px] truncate ${colors.text}`}>{req.fromDisplayName}</p>
                        {req.status === 'pending' && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                      </div>
                      <p className={`text-[12px] ${colors.muted}`}>@{req.fromUsername}</p>
                      {req.message && <p className={`text-[12px] mt-0.5 italic ${colors.sub}`}>"{req.message}"</p>}
                    </div>
                  </div>
                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2 mt-2.5 ml-14">
                      <Button size="sm" className={`h-8 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 flex-1 rounded-full shadow-md ${tp.glow}`}
                        onClick={() => handleAccept(req.id, req.fromUid)} disabled={acceptingRequest === req.id}>
                        {acceptingRequest === req.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserCheck className="h-3 w-3" />Accept</>}
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1 flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10 rounded-full"
                        onClick={() => handleReject(req.id)}>
                        <UserX className="h-3 w-3" />Reject
                      </Button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <div className="flex items-center gap-2 mt-2 ml-14">
                      <Badge className={`${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} text-[10px] rounded-full border-0`}>
                        <UserCheck className="h-3 w-3 mr-1" />Accepted
                      </Badge>
                      {req.chatRoomId && <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-400 hover:text-emerald-300" onClick={() => { setActiveRoomId(req.chatRoomId!); setShowMobileChat(true) }}>Chat <ChevronRight className="h-3 w-3" /></Button>}
                    </div>
                  ) : (
                    <Badge className={`${isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'} text-[10px] mt-2 ml-14 rounded-full border-0`}>
                      <UserX className="h-3 w-3 mr-1" />Rejected
                    </Badge>
                  )}
                </div>
              ))}
              <Separator className={`${colors.border} my-1`} />
              <div className="px-4 py-2"><h3 className={`text-[12px] font-bold uppercase tracking-wider ${colors.muted}`}>Sent {sentRequests.filter(r => r.status === 'pending').length > 0 && `(${sentRequests.filter(r => r.status === 'pending').length})`}</h3></div>
              {sentRequests.length === 0 ? (
                <p className={`text-sm text-center py-8 ${colors.muted}`}>No sent requests</p>
              ) : sentRequests.map((req) => (
                <div key={req.id} className={`px-4 py-3 ${colors.border} border-b`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                      style={{ background: req.toAvatarColor || getAvatarColor(req.toUid) }}>
                      {getInitials(req.toDisplayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-[14px] truncate ${colors.text}`}>{req.toDisplayName}</p>
                      <p className={`text-[12px] ${colors.muted}`}>@{req.toUsername}</p>
                    </div>
                    <div className="shrink-0">
                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <Badge className={`${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'} text-[10px] rounded-full border-0`}>
                            <Clock className="h-3 w-3 mr-1" />Pending
                          </Badge>
                          <button className="text-red-400 hover:text-red-300 p-1" onClick={() => cancelChatRequest(req.id).then(() => removeRequestFromList(req.id))}><X className="h-3 w-3" /></button>
                        </div>
                      ) : req.status === 'accepted' ? (
                        <div className="flex items-center gap-1">
                          <Badge className={`${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} text-[10px] rounded-full border-0`}>
                            <UserCheck className="h-3 w-3 mr-1" />Accepted
                          </Badge>
                          {req.chatRoomId && <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-400 hover:text-emerald-300" onClick={() => { setActiveRoomId(req.chatRoomId!); setShowMobileChat(true) }}>Chat <ChevronRight className="h-3 w-3" /></Button>}
                        </div>
                      ) : (
                        <Badge className={`${isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600'} text-[10px] rounded-full border-0`}>
                          <UserX className="h-3 w-3 mr-1" />Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {sidebarTab === 'settings' && (
            <div className="p-4 space-y-5">
              {/* Profile Card */}
              <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#1f2c34]' : 'bg-[#f0f2f5]'} space-y-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                    style={{ background: `linear-gradient(135deg, ${tp.primaryRgb}, ${tp.primaryRgb}88)` }}>
                    {currentUser ? getInitials(currentUser.displayName) : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingName ? (
                      <div className="flex items-center gap-1">
                        <Input value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} className={`h-7 text-sm rounded-lg ${colors.input} ${colors.text} border-0`} onKeyDown={(e) => e.key === 'Enter' && newDisplayName.trim() && updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) })} />
                        <button className="text-emerald-400 p-1" onClick={() => newDisplayName.trim() && updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) })}><Check className="h-4 w-4" /></button>
                        <button className="text-red-400 p-1" onClick={() => setEditingName(false)}><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className={`font-semibold text-[15px] ${colors.text}`}>{currentUser?.displayName}</h3>
                        <button onClick={() => { setEditingName(true); setNewDisplayName(currentUser?.displayName || '') }} className={`${colors.muted} hover:text-emerald-400`}><Edit3 className="h-3 w-3" /></button>
                      </div>
                    )}
                    <p className={`text-[12px] ${colors.muted}`}>@{currentUser?.username}</p>
                  </div>
                </div>
              </div>

              {/* Theme Mode */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Appearance</h3>
                <div className="flex gap-2">
                  <button onClick={() => setTheme({ mode: 'dark' })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${colors.card} ${colors.text} border ${colors.border}`}`}>
                    <Moon className="h-3.5 w-3.5" />Dark
                  </button>
                  <button onClick={() => setTheme({ mode: 'light' })} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${!isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${colors.card} ${colors.text} border ${colors.border}`}`}>
                    <Sun className="h-3.5 w-3.5" />Light
                  </button>
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Accent Color</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(THEME_PRESETS) as [ThemePreset, typeof tp][]).map(([key, val]) => (
                    <button key={key} onClick={() => setTheme({ preset: key })}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${preset === key ? `border-emerald-400/50 scale-[1.02]` : `${colors.border} ${colors.hover}`}`}>
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${val.gradient} shadow-sm`} />
                      <span className={`text-[11px] font-medium ${colors.text}`}>{val.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Text Size</h3>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map(s => (
                    <button key={s} onClick={() => setTheme({ fontSize: s })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${theme.fontSize === s ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${colors.card} ${colors.text} border ${colors.border}`}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Account</h3>
                <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#1f2c34]' : 'bg-[#f0f2f5]'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[12px] ${colors.muted}`}>Username</span>
                    {editingUsername ? (
                      <div className="flex items-center gap-1">
                        <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="h-6 text-xs w-24 rounded-lg border-0" onKeyDown={(e) => e.key === 'Enter' && handleChangeUsername()} />
                        <button className="text-emerald-400" onClick={handleChangeUsername}><Check className="h-3 w-3" /></button>
                        <button className="text-red-400" onClick={() => { setEditingUsername(false); setUsernameError('') }}><X className="h-3 w-3" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${colors.text}`}>@{currentUser?.username}</span>
                        <button onClick={() => { setEditingUsername(true); setNewUsername('') }} className={colors.muted}><Edit3 className="h-2.5 w-2.5" /></button>
                      </div>
                    )}
                  </div>
                  {usernameError && <p className="text-[10px] text-red-400">{usernameError}</p>}
                  {currentUser?.usernameChangedAt && <p className={`text-[10px] ${colors.muted}`}>Can change again in {Math.max(0, Math.ceil(30 - (Date.now() - currentUser.usernameChangedAt) / 86400000))} days</p>}
                  <div className="flex items-center justify-between">
                    <span className={`text-[12px] ${colors.muted}`}>Password</span>
                    <button onClick={() => setShowPasswordChange(true)} className="text-xs font-medium text-emerald-400 hover:text-emerald-300">Change</button>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${colors.muted}`}>Security</h3>
                <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#1f2c34]' : 'bg-[#f0f2f5]'} flex items-center gap-3`}>
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className={`text-xs font-medium ${colors.text}`}>Progressive Lockout Active</p>
                    <p className={`text-[10px] ${colors.muted}`}>3 failed attempts → 1min lock (increasing)</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleLogout} variant="destructive" className="w-full rounded-xl h-10">
                <LogOut className="h-4 w-4 mr-2" />Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ====== CHAT WINDOW ====== */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 ${colors.bg} transition-colors duration-200`}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className={`flex items-center gap-3 px-4 py-2.5 ${colors.headerBg} border-b ${colors.border}`}>
              <button onClick={() => setShowMobileChat(false)} className={`md:hidden ${colors.muted} hover:text-white`}><ArrowLeft className="h-5 w-5" /></button>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: activeRoom.avatarColor || getAvatarColor(activeRoom.id) }}>
                  {activeRoom.type === 'group' ? <Hash className="h-4 w-4" /> : getInitials(activeRoom.name || 'U')}
                </div>
                {activeRoom.type === 'direct' && <OnlineDot online={!!onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || '']} size="md" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-[15px] ${colors.text}`}>{activeRoom.name || 'Chat'}</h3>
                <p className={`text-[12px] ${colors.muted}`}>
                  {activeRoom.type === 'group' ? `${activeRoom.participants.length} members` :
                    onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || ''] ? (
                      <span className="text-emerald-400">online</span>
                    ) : (
                      <span>offline</span>
                    )
                  }
                  {activeTyping.length > 0 && <span className="text-emerald-400 ml-2">typing<TypingDots /></span>}
                </p>
              </div>
              <div className="flex items-center gap-0.5 relative">
                <Button variant="ghost" size="icon" className={`h-9 w-9 ${colors.muted} hover:text-white rounded-full`} onClick={() => setChatSearchOpen(!chatSearchOpen)}><Search className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className={`h-9 w-9 ${colors.muted} rounded-full`}><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className={`h-9 w-9 ${colors.muted} rounded-full`}><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className={`h-9 w-9 ${colors.muted} rounded-full`} onClick={() => setChatActionMenu(!chatActionMenu)}><MoreVertical className="h-4 w-4" /></Button>
                {chatActionMenu && (
                  <div className={`absolute right-0 top-full mt-1 z-50 ${colors.card} border ${colors.border} rounded-xl shadow-2xl py-1 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-150`}>
                    <button onClick={() => { setChatSearchOpen(true); setChatActionMenu(false) }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs ${colors.hover} ${colors.text}`}><Search className="h-4 w-4 text-[#8696a0]" />Search in Chat</button>
                    <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoomId!, action: 'clear' }); setChatActionMenu(false) }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs ${colors.hover} ${colors.text}`}><Trash2 className="h-4 w-4 text-amber-400" />Clear Chat</button>
                    <div className={`my-1 border-t ${colors.border}`} />
                    <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoomId!, action: 'delete' }); setChatActionMenu(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-500/10 text-red-400"><Ban className="h-4 w-4" />Delete Chat</button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Search Bar */}
            {chatSearchOpen && (
              <div className={`px-4 py-2 border-b ${colors.border} ${colors.card} flex items-center gap-2`}>
                <Search className="h-4 w-4 text-[#8696a0]" />
                <Input placeholder="Search messages..." value={chatSearchQuery} onChange={(e) => setChatSearchQuery(e.target.value)} className={`flex-1 h-8 text-sm rounded-lg ${colors.input} ${colors.text} border-0`} autoFocus />
                <button onClick={() => { setChatSearchOpen(false); setChatSearchQuery('') }}><X className="h-4 w-4 text-[#8696a0]" /></button>
                {chatSearchQuery && <span className={`text-[10px] ${colors.muted}`}>{searchFilteredMsgs.length} found</span>}
              </div>
            )}

            {/* Messages */}
            <div ref={messageContainerRef} className={`flex-1 overflow-y-auto px-4 py-3 ${isDark ? 'chat-wallpaper-dark' : 'chat-wallpaper-light'}`}
              onClick={() => { setContextMenuMessage(null); setShowEmojiPicker(false); setChatActionMenu(false) }}>
              {activeMessages.filter(m => !m.deletedFor.includes(currentUser?.uid || '')).map((msg) => {
                const isOwn = msg.senderId === currentUser?.uid
                const isSystem = msg.type === 'system'
                const isDeleted = msg.deletedForEveryone || msg.type === 'deleted'
                if (isSystem) return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className={`px-3 py-1 rounded-lg text-[11px] ${isDark ? 'bg-[#1f2c34] text-[#8696a0]' : 'bg-[#ffefa6] text-[#54656f]'}`}>{msg.content}</div>
                  </div>
                )
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-0.5 group`}
                    onContextMenu={(e) => { e.preventDefault(); setContextMenuMessage(msg) }}
                    onTouchStart={() => handleTouchStart(msg)} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchEnd}>
                    <div className="max-w-[65%] relative">
                      {/* Reply Preview */}
                      {msg.replyTo && msg.replyToContent && (
                        <div className={`rounded-t-lg px-3 py-1.5 mb-0.5 text-[11px] border-l-2 ${isOwn ? `${isDark ? 'bg-emerald-900/30 border-emerald-400' : 'bg-emerald-50 border-emerald-400'}` : `${isDark ? 'bg-[#2a3942] border-[#8696a0]' : 'bg-gray-100 border-gray-300'}`} ${colors.muted}`}>
                          <span className="font-medium text-emerald-400">{msg.replyToSender}</span><br />{msg.replyToContent?.slice(0, 80)}{msg.replyToContent && msg.replyToContent.length > 80 ? '...' : ''}
                        </div>
                      )}
                      {/* Message Bubble */}
                      <div className={`px-2.5 py-1.5 ${isOwn ? isDark ? 'bg-[#005c4b]' : 'bg-[#d9fdd3]' : isDark ? 'bg-[#1f2c34]' : 'bg-white'} ${msg.replyTo ? 'rounded-b-lg' : 'rounded-lg'} ${isOwn ? isDark ? 'rounded-tr-sm' : 'rounded-tr-sm' : isDark ? 'rounded-tl-sm' : 'rounded-tl-sm'} shadow-sm`}>
                        {!isOwn && activeRoom.type === 'group' && !isDeleted && <p className="text-[11px] font-semibold mb-0.5" style={{ color: msg.senderAvatarColor || getAvatarColor(msg.senderId) }}>{msg.senderName}</p>}
                        {isDeleted ? (
                          <div className="flex items-center gap-2">
                            <Ban className={`h-3.5 w-3.5 ${isOwn ? (isDark ? 'text-white/30' : 'text-gray-400') : (isDark ? 'text-white/30' : 'text-gray-400')} shrink-0`} />
                            <p className={`${fontSizeClass} italic ${isOwn ? (isDark ? 'text-white/40' : 'text-gray-400') : (isDark ? 'text-white/40' : 'text-gray-400')}`}>This message was deleted</p>
                          </div>
                        ) : (
                          <p className={`${fontSizeClass} whitespace-pre-wrap break-words ${isOwn ? (isDark ? 'text-[#e9edef]' : 'text-[#111b21]') : (isDark ? 'text-[#e9edef]' : 'text-[#111b21]')}`}>{msg.content}</p>
                        )}
                        <div className="flex items-center justify-end gap-1 -mt-0.5">
                          <span className={`text-[10px] ${isOwn ? (isDark ? 'text-white/50' : 'text-[#667781]') : colors.muted}`}>{formatTime(msg.createdAt)}</span>
                          {isOwn && !isDeleted && <TickIndicator status={msg.status} color={msg.status === 'read' ? '#53bdeb' : (isDark ? '#8696a0' : '#667781')} />}
                        </div>
                      </div>
                      {/* Context Menu */}
                      {contextMenuMessage?.id === msg.id && (
                        <div className={`absolute ${isOwn ? 'left-0 -translate-x-full mr-1' : 'right-0 translate-x-full ml-1'} top-0 z-50 ${colors.card} border ${colors.border} rounded-xl shadow-2xl py-1 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-150`}>
                          <button onClick={() => { setReplyingTo(msg); setContextMenuMessage(null) }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs ${colors.hover} ${colors.text}`}><Reply className="h-4 w-4 text-[#8696a0]" />Reply</button>
                          {!isDeleted && <button onClick={() => { navigator.clipboard.writeText(msg.content); setContextMenuMessage(null) }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs ${colors.hover} ${colors.text}`}>📋 Copy</button>}
                          {canDeleteForEveryone(msg) && <button onClick={() => { setDeleteConfirm({ msg, forEveryone: true }); setContextMenuMessage(null) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4" />Delete for Everyone</button>}
                          <button onClick={() => { setDeleteConfirm({ msg, forEveryone: false }); setContextMenuMessage(null) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4" />Delete for Me</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Typing indicator */}
            {activeTyping.length > 0 && (
              <div className={`px-4 py-1.5 ${colors.card}`}><p className="text-xs text-emerald-400">{activeTyping.join(', ')} typing<TypingDots /></p></div>
            )}

            {/* Reply preview */}
            {replyingTo && (
              <div className={`px-4 py-2 ${colors.card} border-t ${colors.border} flex items-center gap-2`}>
                <div className="flex-1 min-w-0 border-l-2 border-emerald-400 pl-3">
                  <p className="text-[11px] font-medium text-emerald-400">{replyingTo.senderName}</p>
                  <p className={`text-[11px] ${colors.muted} truncate`}>{replyingTo.content?.slice(0, 60)}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className={`${colors.muted} hover:text-white p-1`}><X className="h-4 w-4" /></button>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && <div className="relative"><EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)} onClose={() => setShowEmojiPicker(false)} isDark={isDark} /></div>}

            {/* Message Input */}
            <div className={`px-3 py-2.5 ${colors.headerBg} border-t ${colors.border}`}>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full ${colors.muted} hover:text-emerald-400 transition-colors shrink-0`}><Smile className="h-5 w-5" /></button>
                <button className={`p-2 rounded-full ${colors.muted} hover:text-emerald-400 transition-colors shrink-0`}><Paperclip className="h-5 w-5" /></button>
                <div className="flex-1">
                  <Input placeholder="Type a message" value={messageInput} onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    className={`h-10 rounded-xl text-sm ${isDark ? 'bg-[#2a3942] border-0 text-[#e9edef] placeholder:text-[#8696a0]' : 'bg-[#f0f2f5] border-0 text-[#111b21] placeholder:text-[#667781]'} focus-visible:ring-1 focus-visible:ring-emerald-500/30`} />
                </div>
                <Button onClick={handleSend} disabled={!messageInput.trim() || sendingMessage}
                  className={`h-10 w-10 rounded-full bg-gradient-to-r ${tp.gradient} text-white shrink-0 shadow-lg ${tp.glow} p-0`} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${tp.gradient} flex items-center justify-center mx-auto mb-6 shadow-2xl ${tp.glow}`}>
                <Sparkles className="h-14 w-14 text-white" />
              </div>
              <h2 className={`text-3xl font-light mb-2 ${colors.text}`}>FurtherChat</h2>
              <p className={`text-sm ${colors.muted} mb-6 leading-relaxed`}>Send and receive messages in real-time. Find users, send a chat request, and start chatting when they accept.</p>
              <Button onClick={() => setSidebarTab('users')} className={`bg-gradient-to-r ${tp.gradient} text-white shadow-lg ${tp.glow} rounded-full px-8 h-11`}>
                <UserPlus className="h-4 w-4 mr-2" />Find Users
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ====== DIALOGS ====== */}

      {/* Group Dialog */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent className={isDark ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-white border-[#e9edef]'}>
          <DialogHeader><DialogTitle className={colors.text}>Create Group Chat</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Group name..." value={groupName} onChange={(e) => setGroupName(e.target.value)} className={`rounded-xl ${isDark ? 'bg-[#2a3942] border-0 text-[#e9edef]' : 'bg-[#f0f2f5] border-0 text-[#111b21]'}`} />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {allUsers.filter(u => hasExistingChat(u.uid)).map(u => {
                const sel = selectedUsers.includes(u.uid)
                return (
                  <button key={u.uid} onClick={() => setSelectedUsers(p => sel ? p.filter(i => i !== u.uid) : [...p, u.uid])}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${sel ? (isDark ? 'bg-emerald-600/10 border border-emerald-600/30' : 'bg-emerald-50 border border-emerald-200') : colors.hover}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px]" style={{ background: u.avatarColor }}>{getInitials(u.displayName)}</div>
                    <span className={`text-sm ${colors.text}`}>{u.displayName}</span>
                    {sel && <Check className="h-3.5 w-3.5 text-emerald-400 ml-auto" />}
                  </button>
                )
              })}
            </div>
            <Button onClick={() => { createGroupChatRoom(groupName, currentUser!.uid, selectedUsers).then(r => { setActiveRoomId(r); setShowMobileChat(true); setShowNewGroup(false); setGroupName(''); setSelectedUsers([]); setSidebarTab('chats') }) }}
              disabled={!groupName.trim() || selectedUsers.length === 0} className={`w-full bg-gradient-to-r ${tp.gradient} text-white rounded-xl`}>
              <Users className="h-4 w-4 mr-2" />Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Message Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) { setDeleteConfirm(null); setDeleteError('') } }}>
        <DialogContent className={`${isDark ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-white border-[#e9edef]'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${colors.text}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              {deleteConfirm?.forEveryone ? 'Delete for Everyone?' : 'Delete for Me?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className={`text-sm ${colors.muted}`}>
              {deleteConfirm?.forEveryone ? 'This message will be permanently deleted for everyone. Others will see "This message was deleted" instead.' : 'This message will only be deleted from your view. The other person will still see it.'}
            </p>
            {deleteConfirm && (
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]'}`}>
                <p className={`text-[11px] ${colors.muted} mb-1`}>{deleteConfirm.msg.senderName}</p>
                <p className={`text-sm ${colors.text} line-clamp-2`}>{deleteConfirm.msg.content}</p>
              </div>
            )}
            {deleteError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-xl">{deleteError}</p>}
            <div className="flex gap-2">
              <Button variant="outline" className={`flex-1 rounded-xl ${isDark ? 'border-[#2a3942] text-[#e9edef]' : ''}`} onClick={() => { setDeleteConfirm(null); setDeleteError('') }} disabled={deletingMsg}>Cancel</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => deleteConfirm && handleDeleteMsg(deleteConfirm.msg, deleteConfirm.forEveryone)} disabled={deletingMsg}>
                {deletingMsg ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{deleteConfirm?.forEveryone ? 'Delete for Everyone' : 'Delete for Me'}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear/Delete Chat Confirmation */}
      <Dialog open={!!clearDeleteConfirm} onOpenChange={(open) => { if (!open) setClearDeleteConfirm(null) }}>
        <DialogContent className={`${isDark ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-white border-[#e9edef]'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${colors.text}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              {clearDeleteConfirm?.action === 'delete' ? 'Delete Chat?' : 'Clear Chat?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className={`text-sm ${colors.muted}`}>
              {clearDeleteConfirm?.action === 'delete'
                ? 'This chat will be deleted from your list. You can send a new chat request to this user later if you want to chat again.'
                : 'All messages will be deleted from your view. The other person will still have the messages.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className={`flex-1 rounded-xl ${isDark ? 'border-[#2a3942] text-[#e9edef]' : ''}`} onClick={() => setClearDeleteConfirm(null)} disabled={clearingChat}>Cancel</Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => clearDeleteConfirm && handleClearChat(clearDeleteConfirm.roomId, clearDeleteConfirm.action)} disabled={clearingChat}>
                {clearingChat ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{clearDeleteConfirm?.action === 'delete' ? 'Delete Chat' : 'Clear Chat'}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change */}
      <Dialog open={showPasswordChange} onOpenChange={(open) => { if (!open) { setShowPasswordChange(false); setPasswordError(''); setPasswordSuccess(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') } }}>
        <DialogContent className={`${isDark ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-white border-[#e9edef]'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${colors.text}`}>
              <Lock className="h-5 w-5 text-emerald-400" />Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {passwordError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2"><p className="text-xs text-red-400">{passwordError}</p></div>}
            {passwordSuccess && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2"><p className="text-xs text-emerald-400">Password changed successfully!</p></div>}
            <div className="space-y-1.5">
              <label className={`text-[11px] font-medium ${colors.muted}`}>Current Password</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`rounded-xl ${isDark ? 'bg-[#2a3942] border-0 text-[#e9edef]' : 'bg-[#f0f2f5] border-0 text-[#111b21]'}`} placeholder="Enter current password" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-[11px] font-medium ${colors.muted}`}>New Password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`rounded-xl ${isDark ? 'bg-[#2a3942] border-0 text-[#e9edef]' : 'bg-[#f0f2f5] border-0 text-[#111b21]'}`} placeholder="Min 6 characters" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-[11px] font-medium ${colors.muted}`}>Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`rounded-xl ${isDark ? 'bg-[#2a3942] border-0 text-[#e9edef]' : 'bg-[#f0f2f5] border-0 text-[#111b21]'}`} placeholder="Confirm new password" onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className={`flex-1 rounded-xl ${isDark ? 'border-[#2a3942] text-[#e9edef]' : ''}`} onClick={() => { setShowPasswordChange(false); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} disabled={changingPassword}>Cancel</Button>
              <Button className={`flex-1 bg-gradient-to-r ${tp.gradient} text-white rounded-xl`} onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}>
                {changingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Change Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
