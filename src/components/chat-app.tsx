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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Search, Users, Settings, LogOut, Send, ArrowLeft,
  Circle, Phone, Video, Hash, Edit3, Check, X, UserPlus, UserCheck,
  UserX, Clock, Bell, BellRing, Smile, Reply, Trash2, CheckCheck,
  CheckCircle, Palette, Type, MessageSquare, Sun, Moon, Image as ImageIcon,
  RotateCcw, AtSign, ChevronDown, Sparkles, MoreVertical, Ban, AlertTriangle, Lock,
} from 'lucide-react'

// ============================================================
// THEME CONFIG
// ============================================================
const THEME_PRESETS: Record<ThemePreset, { primary: string; primaryHover: string; gradient: string; glow: string; name: string }> = {
  emerald: { primary: 'bg-emerald-600', primaryHover: 'hover:bg-emerald-500', gradient: 'from-emerald-600 to-teal-600', glow: 'shadow-emerald-500/20', name: 'Emerald' },
  ocean: { primary: 'bg-blue-600', primaryHover: 'hover:bg-blue-500', gradient: 'from-blue-600 to-cyan-600', glow: 'shadow-blue-500/20', name: 'Ocean' },
  sunset: { primary: 'bg-orange-600', primaryHover: 'hover:bg-orange-500', gradient: 'from-orange-600 to-amber-600', glow: 'shadow-orange-500/20', name: 'Sunset' },
  lavender: { primary: 'bg-violet-600', primaryHover: 'hover:bg-violet-500', gradient: 'from-violet-600 to-purple-600', glow: 'shadow-violet-500/20', name: 'Lavender' },
  rose: { primary: 'bg-pink-600', primaryHover: 'hover:bg-pink-500', gradient: 'from-pink-600 to-rose-600', glow: 'shadow-pink-500/20', name: 'Rose' },
  midnight: { primary: 'bg-slate-600', primaryHover: 'hover:bg-slate-500', gradient: 'from-slate-600 to-zinc-600', glow: 'shadow-slate-500/20', name: 'Midnight' },
}

// ============================================================
// TICK INDICATOR (WhatsApp style)
// ============================================================
function TickIndicator({ status, isDark, preset }: { status: Message['status']; isDark: boolean; preset: ThemePreset }) {
  const color = status === 'read' ? (preset === 'emerald' ? '#10b981' : preset === 'ocean' ? '#3b82f6' : preset === 'lavender' ? '#8b5cf6' : preset === 'sunset' ? '#f59e0b' : preset === 'rose' ? '#ec4899' : '#94a3b8') : '#64748b'
  if (status === 'sent') return <svg width="16" height="11" viewBox="0 0 16 11" className="inline-block ml-1"><path d="M1 5.5L4.5 9L11 1" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  if (status === 'delivered') return <svg width="20" height="11" viewBox="0 0 20 11" className="inline-block ml-1"><path d="M1 5.5L4.5 9L11 1" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L9.5 9L16 1" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
  return <svg width="20" height="11" viewBox="0 0 20 11" className="inline-block ml-1"><path d="M1 5.5L4.5 9L11 1" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L9.5 9L16 1" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ============================================================
// MAIN CHAT APP
// ============================================================
export function ChatApp() {
  const store = useAppStore()
  const { currentUser, chatRooms, setChatRooms, activeRoomId, setActiveRoomId,
    messages, setMessages, addMessage, updateMessage, onlineUsers, setOnlineUsers,
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
  const [requestError, setRequestError] = useState('')
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)
  const [showSettingsSub, setShowSettingsSub] = useState<string | null>(null)
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
  const preset = theme.preset
  const tp = THEME_PRESETS[preset]
  const isDark = theme.mode === 'dark'
  const fontSize = theme.fontSize === 'small' ? 'text-xs' : theme.fontSize === 'large' ? 'text-base' : 'text-sm'
  const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length

  // Listeners
  useEffect(() => {
    if (!currentUser || !isFirebaseConfigured()) return
    const cleanup = setupPresence(currentUser.uid)
    const u1 = listenToPresence((users) => { const onlineMap: Record<string, boolean> = {}; Object.keys(users).forEach(uid => { onlineMap[uid] = users[uid].online }); setOnlineUsers(onlineMap) })
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

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages[activeRoomId || '']?.length])

  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || !activeRoomId || !currentUser || sendingMessage) return
    setSendingMessage(true)
    try {
      await sendMessage(activeRoomId, messageInput.trim(), currentUser.uid, currentUser.displayName, currentUser.avatar, currentUser.avatarColor, 'text', replyingTo?.id || null, replyingTo?.content || null, replyingTo?.senderName || null)
      setMessageInput(''); setTyping(activeRoomId, currentUser.uid, currentUser.displayName, false); setReplyingTo(null)
    } catch (err) { console.error(err) } finally { setSendingMessage(false) }
  }, [messageInput, activeRoomId, currentUser, sendingMessage, replyingTo])

  const handleTyping = useCallback((v: string) => {
    setMessageInput(v); if (!activeRoomId || !currentUser) return
    if (v.trim()) setTyping(activeRoomId, currentUser.uid, currentUser.displayName, true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTyping(activeRoomId!, currentUser!.uid, currentUser!.displayName, false), 3000)
  }, [activeRoomId, currentUser])

  const handleSendRequest = useCallback(async (toUser: any) => {
    if (!currentUser) return; setSendingRequest(toUser.uid); setRequestError('')
    try {
      await sendChatRequest(currentUser.uid, currentUser.username, currentUser.displayName, currentUser.avatar, currentUser.avatarColor, toUser.uid, toUser.username, toUser.displayName, toUser.avatar, toUser.avatarColor)
    } catch (err: any) {
      if (err.message === 'Chat restored! Check your chats.') {
        setRequestError('')
        // Refresh chat rooms to show the restored chat
        setSidebarTab('chats')
      } else {
        setRequestError(err.message)
      }
    } finally { setSendingRequest(null) }
  }, [currentUser])

  const handleAccept = useCallback(async (reqId: string, fromUid: string) => {
    if (!currentUser) return; setAcceptingRequest(reqId)
    try { const roomId = await acceptChatRequest(reqId, fromUid, currentUser.uid); updateRequestStatus(reqId, 'accepted', roomId); setActiveRoomId(roomId); setShowMobileChat(true); setSidebarTab('chats') } catch (err) { console.error(err) } finally { setAcceptingRequest(null) }
  }, [currentUser])

  const handleReject = useCallback(async (reqId: string) => { try { await rejectChatRequest(reqId); updateRequestStatus(reqId, 'rejected') } catch (err) { console.error(err) } }, [])

  const handleLogout = useCallback(async () => { try { await logoutUser() } catch {} logout() }, [logout])

  const hasPendingRequest = (uid: string) => ({ sent: !!sentRequests.find(r => r.toUid === uid && r.status === 'pending'), received: !!receivedRequests.find(r => r.fromUid === uid && r.status === 'pending') })
  const hasExistingChat = (uid: string) => chatRooms.some(r => r.type === 'direct' && r.participants.includes(uid))

  // Long-press handler for mobile (WhatsApp-style)
  const handleTouchStart = useCallback((msg: Message) => {
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuMessage(msg)
    }, 500)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }, [])

  // Check if message is within 48 hours (for "Delete for Everyone" eligibility)
  const canDeleteForEveryone = useCallback((msg: Message) => {
    if (msg.senderId !== currentUser?.uid) return false
    if (msg.deletedForEveryone || msg.type === 'deleted') return false
    const hoursSince = (Date.now() - msg.createdAt) / (1000 * 60 * 60)
    return hoursSince <= 48
  }, [currentUser])

  const handleDeleteMsg = useCallback(async (msg: Message, forEveryone: boolean) => {
    if (!activeRoomId || !currentUser) return
    setDeletingMsg(true)
    setDeleteError('')
    try {
      if (forEveryone) {
        await deleteMessageForEveryone(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedForEveryone: true, content: 'This message was deleted', type: 'deleted' })
      } else {
        await deleteMessageForMe(activeRoomId, msg.id, currentUser.uid)
        updateMessage(activeRoomId, msg.id, { deletedFor: [...msg.deletedFor, currentUser.uid] })
      }
      setContextMenuMessage(null)
      setDeleteConfirm(null)
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete message')
    } finally {
      setDeletingMsg(false)
    }
  }, [activeRoomId, currentUser])

  const handleClearChat = useCallback(async (roomId: string, action: 'clear' | 'delete') => {
    if (!currentUser) return
    setClearingChat(true)
    try {
      if (action === 'delete') {
        await deleteChatRoom(roomId, currentUser.uid)
        setActiveRoomId(null)
        setShowMobileChat(false)
      } else {
        await clearChatForMe(roomId, currentUser.uid)
      }
      setClearDeleteConfirm(null)
      setChatActionMenu(false)
    } catch (err) {
      console.error(err)
    } finally {
      setClearingChat(false)
    }
  }, [currentUser])

  const handleChangeUsername = useCallback(async () => {
    if (!currentUser || !newUsername.trim()) return; setUsernameError('')
    try { await changeUsername(currentUser.uid, newUsername.trim()); useAppStore.getState().setAuth({ ...currentUser, username: newUsername.trim(), usernameChangedAt: Date.now() }); setEditingUsername(false) } catch (err: any) { setUsernameError(err.message) }
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

  const activeRoom = chatRooms.find(r => r.id === activeRoomId)
  const activeMessages = activeRoomId ? (messages[activeRoomId] || []) : []
  const activeTyping = activeRoomId ? (typingUsers[activeRoomId] || []) : []
  const filteredRooms = chatRooms.filter(room => !searchQuery || (room.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const searchFilteredMsgs = chatSearchQuery ? activeMessages.filter(m => !m.deletedForEveryone && !m.deletedFor.includes(currentUser?.uid || '') && m.content.toLowerCase().includes(chatSearchQuery.toLowerCase())) : []

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const formatTime = (ts: number) => { const d = new Date(ts); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  const formatLastSeen = (ts: number) => { const d = new Date(ts); const now = new Date(); if (d.toDateString() === now.toDateString()) return `last seen today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; return `last seen ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }

  const bgMain = isDark ? 'bg-slate-950' : 'bg-white'
  const bgSidebar = isDark ? 'bg-slate-950' : 'bg-slate-50'
  const bgCard = isDark ? 'bg-slate-900' : 'bg-white'
  const borderC = isDark ? 'border-slate-800' : 'border-slate-200'
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400'
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500'
  const hoverBg = isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
  const inputBg = isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-200'

  return (
    <div className={`h-screen flex overflow-hidden ${bgMain} text-white transition-colors duration-300`}>
      {/* ====== SIDEBAR ====== */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[360px] lg:w-[400px] flex-col shrink-0 border-r ${borderC} ${bgSidebar} transition-colors duration-300`}>
        {/* Header */}
        <div className={`p-3 ${bgCard} border-b ${borderC}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-offset-2 ring-offset-transparent" style={{ ringColor: tp.name !== 'Midnight' ? '' : '' }}>
                  <AvatarFallback style={{ background: `linear-gradient(135deg, var(--avatar-from), var(--avatar-to))` }} className="text-white text-sm font-bold">
                    {currentUser ? getInitials(currentUser.displayName) : '?'}
                  </AvatarFallback>
                </Avatar>
                {onlineUsers[currentUser?.uid || ''] && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className={`font-bold ${fontSize} truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser?.displayName}</h2>
                  <button onClick={() => { setEditingName(true); setNewDisplayName(currentUser?.displayName || '') }} className={`${textMuted} hover:text-emerald-400 transition-colors`}><Edit3 className="h-3 w-3" /></button>
                </div>
                <p className={`text-[11px] ${textMuted}`}>@{currentUser?.username}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400" onClick={() => setSidebarTab('settings')}><Settings className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>
          {editingName && (
            <div className="flex items-center gap-1 mb-2"><Input value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} className={`h-7 ${fontSize} ${inputBg}`} onKeyDown={(e) => e.key === 'Enter' && (updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) }))} /><button className="text-emerald-400" onClick={() => updateProfileData(currentUser!.uid, { displayName: newDisplayName.trim() }).then(() => { useAppStore.getState().setAuth({ ...currentUser!, displayName: newDisplayName.trim() }); setEditingName(false) })}><Check className="h-4 w-4" /></button><button className="text-red-400" onClick={() => setEditingName(false)}><X className="h-4 w-4" /></button></div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-9 h-9 ${fontSize} ${inputBg}`} />
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${borderC}`}>
          {([['chats', MessageCircle, 'Chats'], ['users', Users, 'Users'], ['requests', pendingReceivedCount > 0 ? BellRing : Bell, 'Requests'], ['settings', Palette, 'Theme']] as const).map(([tab, Icon, label]) => (
            <button key={tab} onClick={() => setSidebarTab(tab as any)} className={`flex-1 py-2.5 text-[11px] font-medium flex items-center justify-center gap-1 transition-all relative ${sidebarTab === tab ? `text-${preset === 'emerald' ? 'emerald' : preset === 'ocean' ? 'blue' : preset === 'lavender' ? 'violet' : preset === 'sunset' ? 'orange' : preset === 'rose' ? 'pink' : 'slate'}-400` : textMuted}`}>
              <Icon className="h-3.5 w-3.5" />{label}
              {tab === 'requests' && pendingReceivedCount > 0 && <span className="absolute -top-0.5 right-3 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">{pendingReceivedCount}</span>}
              {sidebarTab === tab && <div className={`absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-gradient-to-r ${tp.gradient}`} />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* CHATS TAB */}
          {sidebarTab === 'chats' && (filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-lg ${tp.glow} animate-pulse`}><MessageCircle className="h-8 w-8 text-white" /></div>
              <p className={`text-sm ${textMuted} text-center`}>No chats yet.<br />Find users and send a request!</p>
              <Button onClick={() => setSidebarTab('users')} className={`mt-3 bg-gradient-to-r ${tp.gradient} text-white text-xs h-8`}><UserPlus className="h-3 w-3 mr-1" />Find Users</Button>
            </div>
          ) : filteredRooms.map((room) => {
            const isActive = activeRoomId === room.id
            const isOn = room.type === 'direct' && room.participants.some(p => p !== currentUser?.uid && onlineUsers[p])
            const lastMsg = room.lastMessage
            return (
              <button key={room.id} onClick={() => { setActiveRoomId(room.id); setShowMobileChat(true) }} className={`w-full flex items-center gap-3 p-3 transition-all ${isActive ? (isDark ? 'bg-slate-800/80' : 'bg-slate-100') : hoverBg}`}>
                <div className="relative">
                  <Avatar className="h-12 w-12"><AvatarFallback style={{ background: room.avatarColor || getAvatarColor(room.id) }} className="text-white text-sm font-bold">{room.type === 'group' ? <Hash className="h-5 w-5" /> : getInitials(room.name || 'U')}</AvatarFallback></Avatar>
                  {isOn && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between"><h3 className={`font-semibold ${fontSize} truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{room.name || 'Chat'}</h3>{lastMsg && <span className={`text-[10px] ${textMuted}`}>{formatTime(lastMsg.createdAt)}</span>}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {lastMsg && lastMsg.senderId === currentUser?.uid && <TickIndicator status={lastMsg.status} isDark={isDark} preset={preset} />}
                    {lastMsg && <p className={`text-xs truncate ${textMuted}`}>{lastMsg.type === 'deleted' ? '🚫 Message deleted' : `${lastMsg.senderName}: ${lastMsg.content}`}</p>}
                  </div>
                </div>
              </button>
            )
          }))}

          {/* USERS TAB */}
          {sidebarTab === 'users' && (<div>
            <div className="p-3 space-y-2">
              <Button onClick={() => setShowNewGroup(true)} variant="outline" className={`w-full justify-start gap-2 ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100'}`}><Users className="h-4 w-4 text-violet-400" />Create Group</Button>
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" /><Input placeholder="Search users..." value={userSearch} onChange={(e) => { setUserSearch(e.target.value); if (!e.target.value.trim()) { setSearchResults(allUsers) } else { searchUsers(e.target.value, currentUser!.uid).then(setSearchResults).catch(() => setSearchResults(allUsers.filter(u => u.username.includes(e.target.value.toLowerCase()) || u.displayName.toLowerCase().includes(e.target.value.toLowerCase())))) } }} className={`pl-9 h-9 ${fontSize} ${inputBg}`} /></div>
              {requestError && <p className="text-xs text-red-400">{requestError}</p>}
            </div>
            {(userSearch ? searchResults : allUsers).map((user) => {
              const isOn = onlineUsers[user.uid]; const p = hasPendingRequest(user.uid); const ec = hasExistingChat(user.uid)
              return (
                <div key={user.uid} className={`flex items-center gap-3 p-3 ${hoverBg} transition-colors`}>
                  <div className="relative"><Avatar className="h-10 w-10"><AvatarFallback style={{ background: user.avatarColor || getAvatarColor(user.uid) }} className="text-white text-xs font-bold">{getInitials(user.displayName)}</AvatarFallback></Avatar>{isOn && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />}</div>
                  <div className="flex-1 min-w-0"><p className={`font-medium ${fontSize} truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.displayName}</p><p className={`text-[11px] ${textMuted}`}>@{user.username} · {isOn ? '🟢 Online' : '⚫ Offline'}</p></div>
                  <div className="shrink-0">
                    {ec ? <Badge className={`${isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} text-[10px]`}><MessageCircle className="h-3 w-3 mr-1" />Chatting</Badge>
                    : p.sent ? <Badge className={`${isDark ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-100 text-amber-700'} text-[10px]`}><Clock className="h-3 w-3 mr-1" />Sent</Badge>
                    : p.received ? <Badge className={`${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'} text-[10px]`}><Bell className="h-3 w-3 mr-1" />Wants chat</Badge>
                    : <Button size="sm" className={`h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1`} onClick={() => handleSendRequest(user)} disabled={sendingRequest === user.uid}>{sendingRequest === user.uid ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus className="h-3 w-3" />Request</>}</Button>}
                  </div>
                </div>
              )
            })}
          </div>)}

          {/* REQUESTS TAB */}
          {sidebarTab === 'requests' && (<div>
            <div className={`p-3 pb-1`}><h3 className={`text-[11px] font-bold uppercase tracking-wider ${textMuted}`}>Incoming {receivedRequests.filter(r => r.status === 'pending').length > 0 && `(${receivedRequests.filter(r => r.status === 'pending').length})`}</h3></div>
            {receivedRequests.length === 0 ? <p className={`text-sm text-center py-6 ${textMuted}`}>No requests yet</p> : receivedRequests.map((req) => (
              <div key={req.id} className={`p-3 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3"><Avatar className="h-10 w-10"><AvatarFallback style={{ background: req.fromAvatarColor || getAvatarColor(req.fromUid) }} className="text-white text-xs font-bold">{getInitials(req.fromDisplayName)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className={`font-medium ${fontSize} truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{req.fromDisplayName}</p>{req.status === 'pending' && <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}</div><p className={`text-[11px] ${textMuted}`}>@{req.fromUsername}</p>{req.message && <p className={`text-xs mt-0.5 italic ${textSub}`}>"{req.message}"</p>}</div></div>
                {req.status === 'pending' ? (<div className="flex items-center gap-2 mt-2 ml-13"><Button size="sm" className={`h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 flex-1`} onClick={() => handleAccept(req.id, req.fromUid)} disabled={acceptingRequest === req.id}>{acceptingRequest === req.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserCheck className="h-3 w-3" />Accept</>}</Button><Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleReject(req.id)}><UserX className="h-3 w-3" />Reject</Button></div>)
                : req.status === 'accepted' ? (<div className="flex items-center gap-2 mt-2 ml-13"><Badge className={`${isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} text-[10px]`}><UserCheck className="h-3 w-3 mr-1" />Accepted</Badge>{req.chatRoomId && <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-400" onClick={() => { setActiveRoomId(req.chatRoomId!); setShowMobileChat(true) }}>Chat →</Button>}</div>)
                : (<Badge className={`${isDark ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700'} text-[10px] mt-2 ml-13`}><UserX className="h-3 w-3 mr-1" />Rejected</Badge>)}
              </div>
            ))}
            <Separator className={`${borderC} my-1`} />
            <div className="p-3 pb-1"><h3 className={`text-[11px] font-bold uppercase tracking-wider ${textMuted}`}>Sent {sentRequests.filter(r => r.status === 'pending').length > 0 && `(${sentRequests.filter(r => r.status === 'pending').length})`}</h3></div>
            {sentRequests.length === 0 ? <p className={`text-sm text-center py-6 ${textMuted}`}>No sent requests</p> : sentRequests.map((req) => (
              <div key={req.id} className={`p-3 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3"><Avatar className="h-10 w-10"><AvatarFallback style={{ background: req.toAvatarColor || getAvatarColor(req.toUid) }} className="text-white text-xs font-bold">{getInitials(req.toDisplayName)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0"><p className={`font-medium ${fontSize} truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{req.toDisplayName}</p><p className={`text-[11px] ${textMuted}`}>@{req.toUsername}</p></div>
                  <div className="shrink-0">{req.status === 'pending' ? <div className="flex items-center gap-1"><Badge className={`${isDark ? 'bg-amber-600/20 text-amber-400' : 'bg-amber-100 text-amber-700'} text-[10px]`}><Clock className="h-3 w-3 mr-1" />Pending</Badge><button className="text-red-400 hover:text-red-300" onClick={() => cancelChatRequest(req.id).then(() => removeRequestFromList(req.id))}><X className="h-3 w-3" /></button></div>
                  : req.status === 'accepted' ? <div className="flex items-center gap-1"><Badge className={`${isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} text-[10px]`}><UserCheck className="h-3 w-3 mr-1" />Accepted</Badge>{req.chatRoomId && <Button size="sm" variant="ghost" className="h-6 text-[10px] text-emerald-400" onClick={() => { setActiveRoomId(req.chatRoomId!); setShowMobileChat(true) }}>Chat →</Button>}</div>
                  : <Badge className={`${isDark ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700'} text-[10px]`}><UserX className="h-3 w-3 mr-1" />Rejected</Badge>}</div>
                </div>
              </div>
            ))}
          </div>)}

          {/* THEME/SETTINGS TAB */}
          {sidebarTab === 'settings' && (<div className="p-4 space-y-5">
            {/* Mode */}
            <div><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Mode</h3><div className="flex gap-2"><Button variant={isDark ? 'default' : 'outline'} size="sm" onClick={() => setTheme({ mode: 'dark' })} className={isDark ? `bg-gradient-to-r ${tp.gradient} text-white` : ''}><Moon className="h-3 w-3 mr-1" />Dark</Button><Button variant={!isDark ? 'default' : 'outline'} size="sm" onClick={() => setTheme({ mode: 'light' })} className={!isDark ? `bg-gradient-to-r ${tp.gradient} text-white` : ''}><Sun className="h-3 w-3 mr-1" />Light</Button></div></div>
            {/* Color Theme */}
            <div><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Color Theme</h3><div className="grid grid-cols-3 gap-2">{(Object.entries(THEME_PRESETS) as [ThemePreset, typeof tp][]).map(([key, val]) => (
              <button key={key} onClick={() => setTheme({ preset: key })} className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${preset === key ? 'border-white/50 scale-105' : `${borderC} ${hoverBg}`}`}><div className={`w-5 h-5 rounded-full bg-gradient-to-r ${val.gradient}`} /><span className={`text-[11px] font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>{val.name}</span></button>
            ))}</div></div>
            {/* Font Size */}
            <div><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Font Size</h3><div className="flex gap-2">{(['small', 'medium', 'large'] as const).map(s => (<Button key={s} variant={theme.fontSize === s ? 'default' : 'outline'} size="sm" onClick={() => setTheme({ fontSize: s })} className={theme.fontSize === s ? `bg-gradient-to-r ${tp.gradient} text-white` : ''} style={{ fontSize: s === 'small' ? '10px' : s === 'large' ? '16px' : '13px' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</Button>))}</div></div>
            {/* Account */}
            <div><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Account</h3>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} space-y-2`}>
                <div className="flex items-center justify-between"><span className={`text-[11px] ${textMuted}`}>Username</span>{editingUsername ? <div className="flex items-center gap-1"><Input value={newUsername} onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="h-6 text-xs w-24" onKeyDown={(e) => e.key === 'Enter' && handleChangeUsername()} /><button className="text-emerald-400" onClick={handleChangeUsername}><Check className="h-3 w-3" /></button><button className="text-red-400" onClick={() => { setEditingUsername(false); setUsernameError('') }}><X className="h-3 w-3" /></button></div> : <div className="flex items-center gap-1"><span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>@{currentUser?.username}</span><button onClick={() => { setEditingUsername(true); setNewUsername('') }} className={textMuted}><Edit3 className="h-2.5 w-2.5" /></button></div>}</div>
                {usernameError && <p className="text-[10px] text-red-400">{usernameError}</p>}
                {currentUser?.usernameChangedAt && <p className={`text-[10px] ${textMuted}`}>Can change again in {Math.max(0, Math.ceil(30 - (Date.now() - currentUser.usernameChangedAt) / 86400000))} days</p>}
                <div className="flex items-center justify-between"><span className={`text-[11px] ${textMuted}`}>Display Name</span><span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser?.displayName}</span></div>
                <div className="flex items-center justify-between"><span className={`text-[11px] ${textMuted}`}>Password</span><button onClick={() => setShowPasswordChange(true)} className={`text-xs font-medium text-emerald-400 hover:text-emerald-300`}>Change</button></div>
              </div>
            </div>
            {/* Security */}
            <div><h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Security</h3><div className={`rounded-xl p-3 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}><div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full" /><p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Progressive Lockout Active</p></div><p className={`text-[10px] ${textMuted} mt-0.5`}>3 failed attempts → 1min lock (increasing)</p></div></div>
            <Button onClick={handleLogout} variant="destructive" className="w-full"><LogOut className="h-4 w-4 mr-2" />Sign Out</Button>
          </div>)}
        </div>
      </div>

      {/* ====== CHAT WINDOW ====== */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors duration-300`}>
        {activeRoom ? (<>
          {/* Header */}
          <div className={`flex items-center gap-3 p-3 border-b ${borderC} ${bgCard}`}>
            <button onClick={() => setShowMobileChat(false)} className="md:hidden text-slate-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
            <div className="relative"><Avatar className="h-10 w-10"><AvatarFallback style={{ background: activeRoom.avatarColor || getAvatarColor(activeRoom.id) }} className="text-white text-sm font-bold">{activeRoom.type === 'group' ? <Hash className="h-4 w-4" /> : getInitials(activeRoom.name || 'U')}</AvatarFallback></Avatar>{activeRoom.type === 'direct' && onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || ''] && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />}</div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${fontSize} ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeRoom.name || 'Chat'}</h3>
              <p className={`text-[11px] ${textMuted}`}>{activeRoom.type === 'group' ? `${activeRoom.participants.length} members` : onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || ''] ? '🟢 Online' : '⚫ Offline'}{activeTyping.length > 0 && <span className="text-emerald-400 ml-2">typing...</span>}</p>
            </div>
            <div className="flex gap-0.5 relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setChatSearchOpen(!chatSearchOpen)}><Search className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setChatActionMenu(!chatActionMenu)}><MoreVertical className="h-4 w-4" /></Button>
              {/* Chat action dropdown menu (WhatsApp-style) */}
              {chatActionMenu && (
                <div className={`absolute right-0 top-full mt-1 z-50 ${bgCard} border ${borderC} rounded-xl shadow-2xl py-1 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-150`}>
                  <button onClick={() => { setChatSearchOpen(true); setChatActionMenu(false) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs ${hoverBg} ${isDark ? 'text-white' : 'text-slate-900'}`}><Search className="h-3.5 w-3.5 text-slate-400" />Search in Chat</button>
                  <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoomId!, action: 'clear' }); setChatActionMenu(false) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs ${hoverBg} ${isDark ? 'text-white' : 'text-slate-900'}`}><Trash2 className="h-3.5 w-3.5 text-amber-400" />Clear Chat</button>
                  <div className={`my-1 border-t ${borderC}`} />
                  <button onClick={() => { setClearDeleteConfirm({ roomId: activeRoomId!, action: 'delete' }); setChatActionMenu(false) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-red-500/10 text-red-400`}><Ban className="h-3.5 w-3.5" />Delete Chat</button>
                </div>
              )}
            </div>
          </div>

          {/* Chat search bar */}
          {chatSearchOpen && (<div className={`p-2 border-b ${borderC} ${bgCard} flex items-center gap-2`}><Search className="h-4 w-4 text-slate-500" /><Input placeholder="Search in chat..." value={chatSearchQuery} onChange={(e) => setChatSearchQuery(e.target.value)} className={`flex-1 h-8 ${fontSize} ${inputBg}`} autoFocus /><button onClick={() => { setChatSearchOpen(false); setChatSearchQuery('') }}><X className="h-4 w-4 text-slate-400" /></button>{chatSearchQuery && <span className={`text-[10px] ${textMuted}`}>{searchFilteredMsgs.length} found</span>}</div>)}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-1 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`} onClick={() => { setContextMenuMessage(null); setShowEmojiPicker(false); setChatActionMenu(false) }}>
            {activeMessages.filter(m => !m.deletedFor.includes(currentUser?.uid || '')).map((msg) => {
              const isOwn = msg.senderId === currentUser?.uid
              const isSystem = msg.type === 'system'
              const isDeleted = msg.deletedForEveryone || msg.type === 'deleted'
              if (isSystem) return (<div key={msg.id} className="flex justify-center"><div className={`px-4 py-1.5 rounded-full text-[11px] ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>{msg.content}</div></div>)
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenuMessage(msg) }}
                  onTouchStart={() => handleTouchStart(msg)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                >
                  <div className={`max-w-[75%] relative`}>
                    {/* Reply preview */}
                    {msg.replyTo && msg.replyToContent && (<div className={`rounded-t-xl px-3 py-1.5 mb-0.5 text-[11px] border-l-2 ${isOwn ? `${isDark ? 'bg-emerald-900/30 border-emerald-500' : 'bg-emerald-50 border-emerald-400'}` : `${isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-300'}`} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><span className="font-medium">{msg.replyToSender}</span><br />{msg.replyToContent?.slice(0, 80)}{msg.replyToContent && msg.replyToContent.length > 80 ? '...' : ''}</div>)}
                    {/* Message bubble */}
                    <div className={`px-3 py-2 ${isOwn ? `bg-gradient-to-br ${tp.gradient} text-white rounded-2xl rounded-br-md` : isDark ? 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-md' : 'bg-slate-200 text-slate-900 rounded-2xl rounded-bl-md'} ${isDeleted ? '' : ''}`}>
                      {!isOwn && activeRoom.type === 'group' && !isDeleted && <p className={`text-[11px] font-semibold mb-0.5`} style={{ color: msg.senderAvatarColor || getAvatarColor(msg.senderId) }}>{msg.senderName}</p>}
                      {isDeleted ? (
                        /* WhatsApp-style deleted message */
                        <div className="flex items-center gap-2">
                          <Ban className={`h-3.5 w-3.5 ${isOwn ? 'text-white/40' : isDark ? 'text-slate-500' : 'text-slate-400'} shrink-0`} />
                          <p className={`${fontSize} italic ${isOwn ? 'text-white/50' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>This message was deleted</p>
                        </div>
                      ) : (
                        <p className={`${fontSize} whitespace-pre-wrap break-words`}>{msg.content}</p>
                      )}
                      <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                        <span className={`text-[9px] ${isOwn ? 'text-white/60' : textMuted}`}>{formatTime(msg.createdAt)}</span>
                        {isOwn && !isDeleted && <TickIndicator status={msg.status} isDark={isDark} preset={preset} />}
                      </div>
                    </div>
                    {/* WhatsApp-style context menu with animation */}
                    {contextMenuMessage?.id === msg.id && (
                      <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-0 -translate-y-full z-50 ${bgCard} border ${borderC} rounded-xl shadow-2xl py-1 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-150`}>
                        <button onClick={() => { setReplyingTo(msg); setContextMenuMessage(null) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs ${hoverBg} ${isDark ? 'text-white' : 'text-slate-900'}`}><Reply className="h-3.5 w-3.5 text-slate-400" />Reply</button>
                        {!isDeleted && <button onClick={() => { navigator.clipboard.writeText(msg.content); setContextMenuMessage(null) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs ${hoverBg} ${isDark ? 'text-white' : 'text-slate-900'}`}>📋 Copy</button>}
                        {canDeleteForEveryone(msg) && <button onClick={() => { setDeleteConfirm({ msg, forEveryone: true }); setContextMenuMessage(null) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-red-500/10 text-red-400`}><Trash2 className="h-3.5 w-3.5" />Delete for Everyone</button>}
                        <button onClick={() => { setDeleteConfirm({ msg, forEveryone: false }); setContextMenuMessage(null) }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs hover:bg-red-500/10 text-red-400`}><Trash2 className="h-3.5 w-3.5" />Delete for Me</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messageEndRef} />
          </div>

          {/* Typing indicator */}
          {activeTyping.length > 0 && (<div className={`px-4 py-1 ${bgCard}`}><p className="text-xs text-emerald-400 animate-pulse">{activeTyping.join(', ')} typing<span className="animate-ping">...</span></p></div>)}

          {/* Reply preview */}
          {replyingTo && (<div className={`px-3 py-2 border-t ${borderC} ${bgCard} flex items-center gap-2`}><div className={`flex-1 min-w-0 border-l-2 border-emerald-500 pl-2`}><p className={`text-[11px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{replyingTo.senderName}</p><p className={`text-[11px] ${textMuted} truncate`}>{replyingTo.content?.slice(0, 60)}</p></div><button onClick={() => setReplyingTo(null)}><X className="h-4 w-4 text-slate-400" /></button></div>)}

          {/* Emoji Picker */}
          {showEmojiPicker && <div className="relative"><EmojiPicker onSelect={(emoji) => setMessageInput(prev => prev + emoji)} onClose={() => setShowEmojiPicker(false)} isDark={isDark} /></div>}

          {/* Input */}
          <div className={`p-2 border-t ${borderC} ${bgCard}`}>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-emerald-400 shrink-0" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile className="h-5 w-5" /></Button>
              <div className="flex-1"><Input placeholder="Type a message..." value={messageInput} onChange={(e) => handleTyping(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} className={`h-10 ${fontSize} ${inputBg}`} /></div>
              <Button onClick={handleSend} disabled={!messageInput.trim() || sendingMessage} className={`h-10 bg-gradient-to-r ${tp.gradient} text-white shrink-0 shadow-lg ${tp.glow}`} size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </>) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mx-auto mb-6 shadow-2xl ${tp.glow} animate-pulse`}><Sparkles className="h-12 w-12 text-white" /></div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>FurtherChat</h2>
              <p className={`text-sm ${textMuted} max-w-xs mx-auto`}>Find users, send a chat request, and start messaging when they accept!</p>
              <Button onClick={() => setSidebarTab('users')} className={`mt-4 bg-gradient-to-r ${tp.gradient} text-white shadow-lg ${tp.glow}`}><UserPlus className="h-4 w-4 mr-2" />Find Users</Button>
            </div>
          </div>
        )}
      </div>

      {/* Group Dialog */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
          <DialogHeader><DialogTitle>Create Group Chat</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Group name..." value={groupName} onChange={(e) => setGroupName(e.target.value)} className={inputBg} />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {allUsers.filter(u => hasExistingChat(u.uid)).map(u => { const sel = selectedUsers.includes(u.uid); return <button key={u.uid} onClick={() => setSelectedUsers(p => sel ? p.filter(i => i !== u.uid) : [...p, u.uid])} className={`w-full flex items-center gap-2 p-2 rounded-lg ${sel ? (isDark ? 'bg-emerald-600/10 border border-emerald-600/30' : 'bg-emerald-50 border border-emerald-200') : hoverBg}`}><Avatar className="h-7 w-7"><AvatarFallback style={{ background: u.avatarColor }} className="text-white text-[10px]">{getInitials(u.displayName)}</AvatarFallback></Avatar><span className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.displayName}</span>{sel && <Check className="h-3 w-3 text-emerald-400 ml-auto" />}</button> })}
            </div>
            <Button onClick={() => { createGroupChatRoom(groupName, currentUser!.uid, selectedUsers).then(r => { setActiveRoomId(r); setShowMobileChat(true); setShowNewGroup(false); setGroupName(''); setSelectedUsers([]); setSidebarTab('chats') }) }} disabled={!groupName.trim() || selectedUsers.length === 0} className={`w-full bg-gradient-to-r ${tp.gradient} text-white`}><Users className="h-4 w-4 mr-2" />Create Group</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp-style Delete Message Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) { setDeleteConfirm(null); setDeleteError('') } }}>
        <DialogContent className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              {deleteConfirm?.forEveryone ? 'Delete for Everyone?' : 'Delete for Me?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {deleteConfirm?.forEveryone ? (
              <p className={`text-sm ${textSub}`}>
                This message will be permanently deleted for everyone in this chat. Other participants will see "This message was deleted" instead.
              </p>
            ) : (
              <p className={`text-sm ${textSub}`}>
                This message will only be deleted from your view. The other person will still be able to see it.
              </p>
            )}
            {/* Preview of the message being deleted */}
            {deleteConfirm && (
              <div className={`rounded-lg p-2.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} border ${borderC}`}>
                <p className={`text-xs ${textMuted} mb-1`}>{deleteConfirm.msg.senderName}</p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} line-clamp-2`}>{deleteConfirm.msg.content}</p>
              </div>
            )}
            {deleteError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{deleteError}</p>}
            <div className="flex gap-2">
              <Button variant="outline" className={`flex-1 ${isDark ? 'border-slate-700 text-white' : ''}`} onClick={() => { setDeleteConfirm(null); setDeleteError('') }} disabled={deletingMsg}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => deleteConfirm && handleDeleteMsg(deleteConfirm.msg, deleteConfirm.forEveryone)} disabled={deletingMsg}>
                {deletingMsg ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{deleteConfirm?.forEveryone ? 'Delete for Everyone' : 'Delete for Me'}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear/Delete Chat Confirmation Dialog */}
      <Dialog open={!!clearDeleteConfirm} onOpenChange={(open) => { if (!open) setClearDeleteConfirm(null) }}>
        <DialogContent className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <AlertTriangle className="h-5 w-5 text-red-400" />
              {clearDeleteConfirm?.action === 'delete' ? 'Delete Chat?' : 'Clear Chat?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {clearDeleteConfirm?.action === 'delete' ? (
              <p className={`text-sm ${textSub}`}>
                This chat will be deleted from your chat list. You can send a new chat request to this user later if you want to chat again. This action cannot be undone.
              </p>
            ) : (
              <p className={`text-sm ${textSub}`}>
                All messages in this chat will be deleted from your view. The other person will still have the messages. This action cannot be undone.
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className={`flex-1 ${isDark ? 'border-slate-700 text-white' : ''}`} onClick={() => setClearDeleteConfirm(null)} disabled={clearingChat}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={() => clearDeleteConfirm && handleClearChat(clearDeleteConfirm.roomId, clearDeleteConfirm.action)} disabled={clearingChat}>
                {clearingChat ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{clearDeleteConfirm?.action === 'delete' ? 'Delete Chat' : 'Clear Chat'}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordChange} onOpenChange={(open) => { if (!open) { setShowPasswordChange(false); setPasswordError(''); setPasswordSuccess(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') } }}>
        <DialogContent className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} max-w-sm`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Lock className="h-5 w-5 text-emerald-400" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {passwordError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"><p className="text-xs text-red-400">{passwordError}</p></div>}
            {passwordSuccess && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2"><p className="text-xs text-emerald-400">Password changed successfully!</p></div>}
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${textMuted}`}>Current Password</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputBg} placeholder="Enter current password" />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${textMuted}`}>New Password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputBg} placeholder="Enter new password (min 6 chars)" />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${textMuted}`}>Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputBg} placeholder="Confirm new password" onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className={`flex-1 ${isDark ? 'border-slate-700 text-white' : ''}`} onClick={() => { setShowPasswordChange(false); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} disabled={changingPassword}>Cancel</Button>
              <Button className={`flex-1 bg-gradient-to-r ${tp.gradient} text-white`} onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}>
                {changingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Change Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
