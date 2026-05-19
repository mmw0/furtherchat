import { create } from 'zustand'

export interface User {
  uid: string
  username: string
  displayName: string
  avatar: string | null
  avatarColor: string
  isOnline?: boolean
  lastSeen?: number | null
  usernameChangedAt?: number | null
}

export type MessageStatus = 'sent' | 'delivered' | 'read'

export interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'system' | 'deleted'
  senderId: string
  senderName: string
  senderAvatar: string | null
  senderAvatarColor: string
  chatRoomId: string
  createdAt: number
  status: MessageStatus
  readBy: string[]
  deletedFor: string[]
  deletedForEveryone: boolean
  replyTo?: string | null
  replyToContent?: string | null
  replyToSender?: string | null
}

export interface ChatRoom {
  id: string
  type: 'direct' | 'group'
  name: string | null
  avatar: string | null
  avatarColor: string
  participants: string[]
  lastMessage: Message | null
  unreadCount: number
  updatedAt: number
  createdAt: number
}

export interface ChatRequest {
  id: string
  fromUid: string
  fromUsername: string
  fromDisplayName: string
  fromAvatar: string | null
  fromAvatarColor: string
  toUid: string
  toUsername: string
  toDisplayName: string
  toAvatar: string | null
  toAvatarColor: string
  status: 'pending' | 'accepted' | 'rejected'
  message: string
  createdAt: number
  chatRoomId?: string | null
}

export type ThemePreset = 'emerald' | 'ocean' | 'sunset' | 'lavender' | 'rose' | 'midnight'
export type ThemeMode = 'dark' | 'light'

export interface ThemeConfig {
  mode: ThemeMode
  preset: ThemePreset
  fontSize: 'small' | 'medium' | 'large'
  bubbleStyle: 'rounded' | 'classic' | 'modern'
}

type AppView = 'login' | 'register' | 'chat' | 'setup'

interface AppState {
  currentUser: User | null
  view: AppView
  setAuth: (user: User) => void
  logout: () => void
  setView: (view: AppView) => void
  chatRooms: ChatRoom[]
  setChatRooms: (rooms: ChatRoom[]) => void
  addChatRoom: (room: ChatRoom) => void
  updateChatRoom: (roomId: string, updates: Partial<ChatRoom>) => void
  removeChatRoom: (roomId: string) => void
  activeRoomId: string | null
  setActiveRoomId: (id: string | null) => void
  messages: Record<string, Message[]>
  setMessages: (roomId: string, messages: Message[]) => void
  addMessage: (roomId: string, message: Message) => void
  updateMessage: (roomId: string, messageId: string, updates: Partial<Message>) => void
  onlineUsers: Record<string, boolean>
  setOnlineUsers: (users: Record<string, boolean>) => void
  setUserOnline: (uid: string, online: boolean) => void
  sidebarTab: 'chats' | 'users' | 'requests' | 'settings'
  setSidebarTab: (tab: 'chats' | 'users' | 'requests' | 'settings') => void
  showMobileChat: boolean
  setShowMobileChat: (show: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  allUsers: User[]
  setAllUsers: (users: User[]) => void
  typingUsers: Record<string, string[]>
  setTypingUsers: (roomId: string, users: string[]) => void
  sentRequests: ChatRequest[]
  receivedRequests: ChatRequest[]
  setSentRequests: (requests: ChatRequest[]) => void
  setReceivedRequests: (requests: ChatRequest[]) => void
  updateRequestStatus: (requestId: string, status: 'accepted' | 'rejected', chatRoomId?: string) => void
  removeRequestFromList: (requestId: string) => void
  chatSearchQuery: string
  setChatSearchQuery: (q: string) => void
  showEmojiPicker: boolean
  setShowEmojiPicker: (show: boolean) => void
  replyingTo: Message | null
  setReplyingTo: (msg: Message | null) => void
  contextMenuMessage: Message | null
  setContextMenuMessage: (msg: Message | null) => void
  deleteConfirm: { msg: Message; forEveryone: boolean } | null
  setDeleteConfirm: (confirm: { msg: Message; forEveryone: boolean } | null) => void
  chatActionMenu: boolean
  setChatActionMenu: (show: boolean) => void
  clearDeleteConfirm: { roomId: string; action: 'clear' | 'delete' } | null
  setClearDeleteConfirm: (confirm: { roomId: string; action: 'clear' | 'delete' } | null) => void
  showPasswordChange: boolean
  setShowPasswordChange: (show: boolean) => void
  showAvatarPicker: boolean
  setShowAvatarPicker: (show: boolean) => void
}

const AVATAR_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
]

export function getAvatarColor(uid: string): string {
  let hash = 0
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export const BUILT_IN_AVATARS = [
  { id: 'avatar_1', emoji: '🐱', bg: '#FF6B6B', label: 'Cat' },
  { id: 'avatar_2', emoji: '🐶', bg: '#4ECDC4', label: 'Dog' },
  { id: 'avatar_3', emoji: '🦊', bg: '#FF8C42', label: 'Fox' },
  { id: 'avatar_4', emoji: '🐼', bg: '#A8E6CF', label: 'Panda' },
  { id: 'avatar_5', emoji: '🦁', bg: '#FFD93D', label: 'Lion' },
  { id: 'avatar_6', emoji: '🐸', bg: '#6BCB77', label: 'Frog' },
  { id: 'avatar_7', emoji: '🦋', bg: '#9B59B6', label: 'Butterfly' },
  { id: 'avatar_8', emoji: '🐲', bg: '#E74C3C', label: 'Dragon' },
  { id: 'avatar_9', emoji: '🦄', bg: '#3498DB', label: 'Unicorn' },
  { id: 'avatar_10', emoji: '🐧', bg: '#1ABC9C', label: 'Penguin' },
  { id: 'avatar_11', emoji: '🦉', bg: '#CD853F', label: 'Owl' },
  { id: 'avatar_12', emoji: '🐬', bg: '#00CED1', label: 'Dolphin' },
]

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  view: 'login',
  setAuth: (user) => {
    if (typeof window !== 'undefined') localStorage.setItem('chatUser', JSON.stringify(user))
    set({ currentUser: user, view: 'chat' })
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('chatUser')
    set({
      currentUser: null, view: 'login', chatRooms: [], activeRoomId: null,
      messages: {}, onlineUsers: {}, allUsers: [], showMobileChat: false,
      typingUsers: {}, sentRequests: [], receivedRequests: [],
      chatSearchQuery: '', showEmojiPicker: false,
      replyingTo: null, contextMenuMessage: null, deleteConfirm: null, chatActionMenu: false,
      clearDeleteConfirm: null, showPasswordChange: false, showAvatarPicker: false,
    })
  },
  setView: (view) => set({ view }),
  chatRooms: [],
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  addChatRoom: (room) => set((state) => ({ chatRooms: [room, ...state.chatRooms] })),
  updateChatRoom: (roomId, updates) => set((state) => ({
    chatRooms: state.chatRooms.map(r => r.id === roomId ? { ...r, ...updates } : r)
  })),
  removeChatRoom: (roomId) => set((state) => {
    const newMessages = { ...state.messages }
    delete newMessages[roomId]
    return { chatRooms: state.chatRooms.filter(r => r.id !== roomId), activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId, messages: newMessages }
  }),
  activeRoomId: null,
  setActiveRoomId: (id) => set({ activeRoomId: id }),
  messages: {},
  setMessages: (roomId, messages) => set((state) => ({ messages: { ...state.messages, [roomId]: messages } })),
  addMessage: (roomId, message) => set((state) => {
    const existing = state.messages[roomId] || []
    if (existing.find(m => m.id === message.id)) return state
    return { messages: { ...state.messages, [roomId]: [...existing, message] } }
  }),
  updateMessage: (roomId, messageId, updates) => set((state) => {
    const existing = state.messages[roomId] || []
    return { messages: { ...state.messages, [roomId]: existing.map(m => m.id === messageId ? { ...m, ...updates } : m) } }
  }),
  onlineUsers: {},
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setUserOnline: (uid, online) => set((state) => ({ onlineUsers: { ...state.onlineUsers, [uid]: online } })),
  sidebarTab: 'chats',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  showMobileChat: false,
  setShowMobileChat: (show) => set({ showMobileChat: show }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  theme: (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('chatTheme') || 'null')) || {
    mode: 'dark' as ThemeMode, preset: 'emerald' as ThemePreset, fontSize: 'medium' as const, bubbleStyle: 'rounded' as const,
  },
  setTheme: (updates) => {
    const newTheme = { ...get().theme, ...updates }
    if (typeof window !== 'undefined') localStorage.setItem('chatTheme', JSON.stringify(newTheme))
    set({ theme: newTheme })
  },
  allUsers: [],
  setAllUsers: (users) => set({ allUsers: users }),
  typingUsers: {},
  setTypingUsers: (roomId, users) => set((state) => ({ typingUsers: { ...state.typingUsers, [roomId]: users } })),
  sentRequests: [],
  receivedRequests: [],
  setSentRequests: (requests) => set({ sentRequests: requests }),
  setReceivedRequests: (requests) => set({ receivedRequests: requests }),
  updateRequestStatus: (requestId, status, chatRoomId) => set((state) => ({
    receivedRequests: state.receivedRequests.map(r => r.id === requestId ? { ...r, status, chatRoomId: chatRoomId || r.chatRoomId } : r),
    sentRequests: state.sentRequests.map(r => r.id === requestId ? { ...r, status, chatRoomId: chatRoomId || r.chatRoomId } : r),
  })),
  removeRequestFromList: (requestId) => set((state) => ({
    receivedRequests: state.receivedRequests.filter(r => r.id !== requestId),
    sentRequests: state.sentRequests.filter(r => r.id !== requestId),
  })),
  chatSearchQuery: '',
  setChatSearchQuery: (q) => set({ chatSearchQuery: q }),
  showEmojiPicker: false,
  setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
  replyingTo: null,
  setReplyingTo: (msg) => set({ replyingTo: msg }),
  contextMenuMessage: null,
  setContextMenuMessage: (msg) => set({ contextMenuMessage: msg }),
  deleteConfirm: null,
  setDeleteConfirm: (confirm) => set({ deleteConfirm: confirm }),
  chatActionMenu: false,
  setChatActionMenu: (show) => set({ chatActionMenu: show }),
  clearDeleteConfirm: null,
  setClearDeleteConfirm: (confirm) => set({ clearDeleteConfirm: confirm }),
  showPasswordChange: false,
  setShowPasswordChange: (show) => set({ showPasswordChange: show }),
  showAvatarPicker: false,
  setShowAvatarPicker: (show) => set({ showAvatarPicker: show }),
}))
