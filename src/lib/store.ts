import { create } from 'zustand'

export interface User {
  uid: string
  username: string
  displayName: string
  avatar: string | null
  isOnline?: boolean
  lastSeen?: number | null
}

export interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'system'
  senderId: string
  senderName: string
  chatRoomId: string
  createdAt: number
  read: boolean
}

export interface ChatRoom {
  id: string
  type: 'direct' | 'group'
  name: string | null
  avatar: string | null
  participants: string[]
  lastMessage: Message | null
  unreadCount: number
  updatedAt: number
  createdAt: number
}

type AppView = 'login' | 'register' | 'chat' | 'setup'
type ThemeMode = 'dark' | 'light'

interface AppState {
  // Auth
  currentUser: User | null
  view: AppView
  setAuth: (user: User) => void
  logout: () => void
  setView: (view: AppView) => void

  // Chat rooms
  chatRooms: ChatRoom[]
  setChatRooms: (rooms: ChatRoom[]) => void
  addChatRoom: (room: ChatRoom) => void
  updateChatRoom: (roomId: string, updates: Partial<ChatRoom>) => void
  removeChatRoom: (roomId: string) => void

  // Active room
  activeRoomId: string | null
  setActiveRoomId: (id: string | null) => void

  // Messages
  messages: Record<string, Message[]>
  setMessages: (roomId: string, messages: Message[]) => void
  addMessage: (roomId: string, message: Message) => void

  // Online users
  onlineUsers: Record<string, boolean>
  setOnlineUsers: (users: Record<string, boolean>) => void
  setUserOnline: (uid: string, online: boolean) => void

  // UI state
  sidebarTab: 'chats' | 'users' | 'settings'
  setSidebarTab: (tab: 'chats' | 'users' | 'settings') => void
  showMobileChat: boolean
  setShowMobileChat: (show: boolean) => void
  showProfile: boolean
  setShowProfile: (show: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void

  // Theme
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void

  // All registered users (for search)
  allUsers: User[]
  setAllUsers: (users: User[]) => void

  // Typing indicators
  typingUsers: Record<string, string[]>
  setTypingUsers: (roomId: string, users: string[]) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  view: 'login',
  setAuth: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatUser', JSON.stringify(user))
    }
    set({ currentUser: user, view: 'chat' })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatUser')
    }
    set({
      currentUser: null,
      view: 'login',
      chatRooms: [],
      activeRoomId: null,
      messages: {},
      onlineUsers: {},
      allUsers: [],
      showMobileChat: false,
      showProfile: false,
      typingUsers: {},
    })
  },
  setView: (view) => set({ view }),

  // Chat rooms
  chatRooms: [],
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  addChatRoom: (room) => set((state) => ({
    chatRooms: [room, ...state.chatRooms]
  })),
  updateChatRoom: (roomId, updates) => set((state) => ({
    chatRooms: state.chatRooms.map(r => r.id === roomId ? { ...r, ...updates } : r)
  })),
  removeChatRoom: (roomId) => set((state) => {
    const newMessages = { ...state.messages }
    delete newMessages[roomId]
    return {
      chatRooms: state.chatRooms.filter(r => r.id !== roomId),
      activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId,
      messages: newMessages,
    }
  }),

  // Active room
  activeRoomId: null,
  setActiveRoomId: (id) => set({ activeRoomId: id }),

  // Messages
  messages: {},
  setMessages: (roomId, messages) => set((state) => ({
    messages: { ...state.messages, [roomId]: messages }
  })),
  addMessage: (roomId, message) => set((state) => {
    const existing = state.messages[roomId] || []
    if (existing.find(m => m.id === message.id)) return state
    return {
      messages: { ...state.messages, [roomId]: [...existing, message] }
    }
  }),

  // Online users
  onlineUsers: {},
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setUserOnline: (uid, online) => set((state) => ({
    onlineUsers: { ...state.onlineUsers, [uid]: online }
  })),

  // UI state
  sidebarTab: 'chats',
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  showMobileChat: false,
  setShowMobileChat: (show) => set({ showMobileChat: show }),
  showProfile: false,
  setShowProfile: (show) => set({ showProfile: show }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Theme
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as ThemeMode) || 'dark',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    set({ theme })
  },

  // All users
  allUsers: [],
  setAllUsers: (users) => set({ allUsers: users }),

  // Typing
  typingUsers: {},
  setTypingUsers: (roomId, users) => set((state) => ({
    typingUsers: { ...state.typingUsers, [roomId]: users }
  })),
}))
