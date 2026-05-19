'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import {
  setupPresence,
  listenToPresence,
  listenToChatRooms,
  createDirectChatRoom,
  createGroupChatRoom,
  getAllUsers,
  searchUsers,
  sendMessage,
  listenToMessages,
  setTyping,
  listenToTyping,
  logoutUser,
  updateProfileData,
} from '@/lib/firebase-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Search,
  Users,
  Settings,
  LogOut,
  Plus,
  Send,
  ArrowLeft,
  Circle,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Hash,
  UserPlus,
  Edit3,
  Check,
  X,
  Typing,
} from 'lucide-react'

// ============================================================
// MAIN CHAT APP COMPONENT
// ============================================================

export function ChatApp() {
  const {
    currentUser,
    chatRooms,
    setChatRooms,
    addChatRoom,
    activeRoomId,
    setActiveRoomId,
    messages,
    setMessages,
    addMessage,
    onlineUsers,
    setOnlineUsers,
    setUserOnline,
    sidebarTab,
    setSidebarTab,
    showMobileChat,
    setShowMobileChat,
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
    allUsers,
    setAllUsers,
    typingUsers,
    setTypingUsers,
    logout,
  } = useAppStore()

  const [messageInput, setMessageInput] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [groupName, setGroupName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [editingName, setEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const presenceCleanupRef = useRef<(() => void) | null>(null)
  const listenersCleanupRef = useRef<(() => void)[]>([])

  // Setup Firebase listeners on mount
  useEffect(() => {
    if (!currentUser || !isFirebaseConfigured()) return

    // Setup presence
    const cleanupPresence = setupPresence(currentUser.uid)
    presenceCleanupRef.current = cleanupPresence

    // Listen to presence
    const unsubPresence = listenToPresence((users) => {
      setOnlineUsers(users)
    })

    // Listen to chat rooms
    const unsubRooms = listenToChatRooms(currentUser.uid, (rooms) => {
      setChatRooms(rooms)
    })

    // Load all users
    getAllUsers(currentUser.uid).then(setAllUsers).catch(console.error)

    listenersCleanupRef.current = [unsubPresence, unsubRooms]

    return () => {
      cleanupPresence()
      listenersCleanupRef.current.forEach(fn => fn())
    }
  }, [currentUser?.uid])

  // Listen to messages when active room changes
  useEffect(() => {
    if (!activeRoomId || !isFirebaseConfigured()) return

    const unsubMessages = listenToMessages(activeRoomId, (msgs) => {
      setMessages(activeRoomId, msgs)
    })

    const unsubTyping = listenToTyping(activeRoomId, (usernames) => {
      setTypingUsers(activeRoomId, usernames.filter(u => u !== currentUser?.displayName))
    })

    return () => {
      unsubMessages()
      unsubTyping()
    }
  }, [activeRoomId])

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages[activeRoomId || '']?.length])

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !activeRoomId || !currentUser || sendingMessage) return

    setSendingMessage(true)
    try {
      await sendMessage(activeRoomId, messageInput.trim(), currentUser.uid, currentUser.displayName)
      setMessageInput('')
      // Clear typing
      setTyping(activeRoomId, currentUser.uid, currentUser.displayName, false)
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSendingMessage(false)
    }
  }, [messageInput, activeRoomId, currentUser, sendingMessage])

  // Handle typing indicator
  const handleTyping = useCallback((value: string) => {
    setMessageInput(value)
    if (!activeRoomId || !currentUser) return

    if (value.trim()) {
      setTyping(activeRoomId, currentUser.uid, currentUser.displayName, true)
    }

    // Clear typing after inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeRoomId!, currentUser!.uid, currentUser!.displayName, false)
    }, 3000)
  }, [activeRoomId, currentUser])

  // Start direct chat
  const startDirectChat = useCallback(async (otherUid: string) => {
    if (!currentUser) return
    try {
      const roomId = await createDirectChatRoom(currentUser.uid, otherUid)
      setActiveRoomId(roomId)
      setShowMobileChat(true)
      setShowNewChat(false)
      setUserSearch('')
      setSearchResults([])
    } catch (err) {
      console.error('Failed to create chat room:', err)
    }
  }, [currentUser, setActiveRoomId])

  // Create group chat
  const handleCreateGroup = useCallback(async () => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return
    try {
      const roomId = await createGroupChatRoom(groupName.trim(), currentUser.uid, selectedUsers)
      setActiveRoomId(roomId)
      setShowMobileChat(true)
      setShowNewGroup(false)
      setGroupName('')
      setSelectedUsers([])
    } catch (err) {
      console.error('Failed to create group:', err)
    }
  }, [currentUser, groupName, selectedUsers])

  // Search users
  const handleUserSearch = useCallback(async (query: string) => {
    setUserSearch(query)
    if (!currentUser || !query.trim()) {
      setSearchResults(allUsers)
      return
    }
    try {
      const results = await searchUsers(query, currentUser.uid)
      setSearchResults(results)
    } catch {
      // Fallback to local search
      const filtered = allUsers.filter(u =>
        u.username.includes(query.toLowerCase()) ||
        u.displayName.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    }
  }, [currentUser, allUsers])

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Continue even if Firebase logout fails
    }
    logout()
  }, [logout])

  // Get active room data
  const activeRoom = chatRooms.find(r => r.id === activeRoomId)
  const activeMessages = activeRoomId ? (messages[activeRoomId] || []) : []
  const activeTyping = activeRoomId ? (typingUsers[activeRoomId] || []) : []
  const isDark = theme === 'dark'

  // Get user avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (isToday) return time
    if (isYesterday) return `Yesterday ${time}`
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`
  }

  // Update display name
  const handleUpdateName = useCallback(async () => {
    if (!currentUser || !newDisplayName.trim()) return
    try {
      await updateProfileData(currentUser.uid, { displayName: newDisplayName.trim() })
      useAppStore.getState().setAuth({ ...currentUser, displayName: newDisplayName.trim() })
      setEditingName(false)
    } catch (err) {
      console.error('Failed to update name:', err)
    }
  }, [currentUser, newDisplayName])

  // Filter rooms by search
  const filteredRooms = chatRooms.filter(room =>
    !searchQuery || (room.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`h-screen flex overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* ====== SIDEBAR ====== */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[360px] lg:w-[400px] flex-col shrink-0 border-r ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
        {/* Sidebar Header */}
        <div className={`p-4 ${isDark ? 'bg-slate-900' : 'bg-white'} border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-sm font-bold">
                  {currentUser ? getInitials(currentUser.displayName) : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="h-7 text-sm w-32 bg-slate-800 border-slate-600"
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                    />
                    <button onClick={handleUpdateName} className="text-emerald-400 hover:text-emerald-300"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <h2 className="font-semibold text-sm">{currentUser?.displayName}</h2>
                    <button onClick={() => { setEditingName(true); setNewDisplayName(currentUser?.displayName || '') }} className="text-slate-500 hover:text-emerald-400">
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>@{currentUser?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400" onClick={() => setShowNewChat(true)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 h-9 text-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50 placeholder:text-slate-500' : 'bg-slate-100 border-slate-200 placeholder:text-slate-400'}`}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setSidebarTab('chats')}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${sidebarTab === 'chats' ? 'text-emerald-400 border-b-2 border-emerald-400' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MessageCircle className="h-4 w-4" /> Chats
          </button>
          <button
            onClick={() => setSidebarTab('users')}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${sidebarTab === 'users' ? 'text-emerald-400 border-b-2 border-emerald-400' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users className="h-4 w-4" /> Users
          </button>
          <button
            onClick={() => setSidebarTab('settings')}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${sidebarTab === 'settings' ? 'text-emerald-400 border-b-2 border-emerald-400' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebarTab === 'chats' && (
            <div>
              {filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <MessageCircle className={`h-12 w-12 ${isDark ? 'text-slate-700' : 'text-slate-300'} mb-3`} />
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'} text-center`}>
                    No conversations yet.<br />Start a new chat!
                  </p>
                  <Button
                    onClick={() => setShowNewChat(true)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Chat
                  </Button>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const isActive = activeRoomId === room.id
                  const isOnline = room.type === 'direct' && room.participants.some(p => p !== currentUser?.uid && onlineUsers[p])
                  const lastMsg = room.lastMessage

                  return (
                    <button
                      key={room.id}
                      onClick={() => { setActiveRoomId(room.id); setShowMobileChat(true) }}
                      className={`w-full flex items-center gap-3 p-3 transition-colors ${isActive ? (isDark ? 'bg-slate-800' : 'bg-slate-100') : (isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50')}`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className={`${room.type === 'group' ? 'bg-gradient-to-br from-violet-600 to-purple-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'} text-white text-sm font-bold`}>
                            {room.type === 'group' ? <Hash className="h-5 w-5" /> : getInitials(room.name || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{room.name || 'Chat'}</h3>
                          {lastMsg && (
                            <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                              {formatTime(lastMsg.createdAt)}
                            </span>
                          )}
                        </div>
                        {lastMsg && (
                          <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {lastMsg.senderName}: {lastMsg.content}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}

          {sidebarTab === 'users' && (
            <div>
              {/* Group chat button */}
              <div className="p-3">
                <Button
                  onClick={() => setShowNewGroup(true)}
                  variant="outline"
                  className={`w-full justify-start gap-2 ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <Users className="h-4 w-4 text-violet-400" /> Create Group Chat
                </Button>
              </div>
              <Separator className={isDark ? 'bg-slate-800' : 'bg-slate-200'} />
              <div className="p-3">
                <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>
                  All Users ({allUsers.length})
                </p>
              </div>
              {allUsers.map((user) => {
                const isOnline = onlineUsers[user.uid]
                return (
                  <button
                    key={user.uid}
                    onClick={() => startDirectChat(user.uid)}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xs font-bold">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-medium text-sm truncate">{user.displayName}</h3>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>@{user.username}</p>
                    </div>
                    <span className={`text-xs ${isOnline ? 'text-emerald-400' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {sidebarTab === 'settings' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Theme</h3>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                  >
                    Light
                  </Button>
                </div>
              </div>

              <Separator className={isDark ? 'bg-slate-800' : 'bg-slate-200'} />

              <div>
                <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Account</h3>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>Manage your account settings</p>
                <div className="space-y-2">
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Username</p>
                    <p className="text-sm font-medium">@{currentUser?.username}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Display Name</p>
                    <p className="text-sm font-medium">{currentUser?.displayName}</p>
                  </div>
                </div>
              </div>

              <Separator className={isDark ? 'bg-slate-800' : 'bg-slate-200'} />

              <div>
                <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Security</h3>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>Account protection features</p>
                <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <p className="text-sm font-medium">Progressive Lockout Active</p>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Account locks after 3 failed login attempts (1min, 2min, 3min...)
                  </p>
                </div>
              </div>

              <Separator className={isDark ? 'bg-slate-800' : 'bg-slate-200'} />

              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ====== CHAT WINDOW ====== */}
      <div className={`${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className={`flex items-center gap-3 p-3 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <button onClick={() => setShowMobileChat(false)} className="md:hidden text-slate-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${activeRoom.type === 'group' ? 'bg-gradient-to-br from-violet-600 to-purple-600' : 'bg-gradient-to-br from-emerald-600 to-teal-600'} text-white text-sm font-bold`}>
                    {activeRoom.type === 'group' ? <Hash className="h-4 w-4" /> : getInitials(activeRoom.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                {activeRoom.type === 'direct' && onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || ''] && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{activeRoom.name || 'Chat'}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {activeRoom.type === 'group'
                    ? `${activeRoom.participants.length} members`
                    : onlineUsers[activeRoom.participants.find(p => p !== currentUser?.uid) || '']
                      ? 'Online'
                      : 'Offline'
                  }
                  {activeTyping.length > 0 && (
                    <span className="text-emerald-400 ml-2">
                      {activeTyping.join(', ')} typing...
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              {activeMessages.map((msg) => {
                const isOwn = msg.senderId === currentUser?.uid
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      {!isOwn && (
                        <p className={`text-xs font-medium mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {msg.senderName}
                        </p>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-md'
                          : isDark
                            ? 'bg-slate-800 text-slate-200 rounded-bl-md'
                            : 'bg-slate-200 text-slate-900 rounded-bl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-right' : 'text-left'} ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Typing Indicator */}
            {activeTyping.length > 0 && (
              <div className={`px-4 py-1 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                <p className="text-xs text-emerald-400 animate-pulse">
                  {activeTyping.join(', ')} {activeTyping.length === 1 ? 'is' : 'are'} typing...
                </p>
              </div>
            )}

            {/* Message Input */}
            <div className={`p-3 border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className={`h-10 text-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50 placeholder:text-slate-500 focus:border-emerald-500/50' : 'bg-slate-100 border-slate-200 placeholder:text-slate-400'}`}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendingMessage}
                  className="h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shrink-0 shadow-lg shadow-emerald-500/20"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">FurtherChat</h2>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'} max-w-xs`}>
                Select a conversation or start a new chat to begin messaging
              </p>
              <Button
                onClick={() => setShowNewChat(true)}
                className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
              >
                <Plus className="h-4 w-4 mr-2" /> New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ====== NEW CHAT DIALOG ====== */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search users by name or username..."
                value={userSearch}
                onChange={(e) => handleUserSearch(e.target.value)}
                className={`pl-9 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {(userSearch ? searchResults : allUsers).map((user) => (
                <button
                  key={user.uid}
                  onClick={() => startDirectChat(user.uid)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xs">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{user.displayName}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>@{user.username}</p>
                  </div>
                  {onlineUsers[user.uid] && <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />}
                </button>
              ))}
              {(userSearch ? searchResults : allUsers).length === 0 && (
                <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No users found
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====== NEW GROUP DIALOG ====== */}
      <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
          <DialogHeader>
            <DialogTitle>Create Group Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Group Name</label>
              <Input
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`mt-1 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Select Members ({selectedUsers.length} selected)
              </label>
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedUsers.map(uid => {
                    const u = allUsers.find(u => u.uid === uid)
                    return u ? (
                      <Badge key={uid} variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                        {u.displayName}
                        <button onClick={() => setSelectedUsers(prev => prev.filter(id => id !== uid))} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {allUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.uid)
                return (
                  <button
                    key={user.uid}
                    onClick={() => setSelectedUsers(prev =>
                      isSelected ? prev.filter(id => id !== user.uid) : [...prev, user.uid]
                    )}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors ${isSelected ? (isDark ? 'bg-emerald-600/10 border border-emerald-600/30' : 'bg-emerald-50 border border-emerald-200') : (isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50')}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xs">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.displayName}</span>
                    {isSelected && <Check className="h-4 w-4 text-emerald-400 ml-auto" />}
                  </button>
                )
              })}
            </div>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            >
              <Users className="h-4 w-4 mr-2" /> Create Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
