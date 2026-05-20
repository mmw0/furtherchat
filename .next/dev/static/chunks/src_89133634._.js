(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUILT_IN_AVATARS",
    ()=>BUILT_IN_AVATARS,
    "getAvatarColor",
    ()=>getAvatarColor,
    "getInitials",
    ()=>getInitials,
    "useAppStore",
    ()=>useAppStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const AVATAR_COLORS = [
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1'
];
function getAvatarColor(uid) {
    let hash = 0;
    for(let i = 0; i < uid.length; i++){
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
const BUILT_IN_AVATARS = [
    {
        id: 'avatar_1',
        emoji: '🐱',
        bg: '#FF6B6B',
        label: 'Cat'
    },
    {
        id: 'avatar_2',
        emoji: '🐶',
        bg: '#4ECDC4',
        label: 'Dog'
    },
    {
        id: 'avatar_3',
        emoji: '🦊',
        bg: '#FF8C42',
        label: 'Fox'
    },
    {
        id: 'avatar_4',
        emoji: '🐼',
        bg: '#A8E6CF',
        label: 'Panda'
    },
    {
        id: 'avatar_5',
        emoji: '🦁',
        bg: '#FFD93D',
        label: 'Lion'
    },
    {
        id: 'avatar_6',
        emoji: '🐸',
        bg: '#6BCB77',
        label: 'Frog'
    },
    {
        id: 'avatar_7',
        emoji: '🦋',
        bg: '#9B59B6',
        label: 'Butterfly'
    },
    {
        id: 'avatar_8',
        emoji: '🐲',
        bg: '#E74C3C',
        label: 'Dragon'
    },
    {
        id: 'avatar_9',
        emoji: '🦄',
        bg: '#3498DB',
        label: 'Unicorn'
    },
    {
        id: 'avatar_10',
        emoji: '🐧',
        bg: '#1ABC9C',
        label: 'Penguin'
    },
    {
        id: 'avatar_11',
        emoji: '🦉',
        bg: '#CD853F',
        label: 'Owl'
    },
    {
        id: 'avatar_12',
        emoji: '🐬',
        bg: '#00CED1',
        label: 'Dolphin'
    }
];
function getInitials(name) {
    return name.split(' ').map((n)=>n[0]).join('').toUpperCase().slice(0, 2);
}
const useAppStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        currentUser: null,
        view: 'login',
        setAuth: (user)=>{
            if ("TURBOPACK compile-time truthy", 1) localStorage.setItem('chatUser', JSON.stringify(user));
            set({
                currentUser: user,
                view: 'chat'
            });
        },
        logout: ()=>{
            if ("TURBOPACK compile-time truthy", 1) localStorage.removeItem('chatUser');
            set({
                currentUser: null,
                view: 'login',
                chatRooms: [],
                activeRoomId: null,
                messages: {},
                onlineUsers: {},
                allUsers: [],
                showMobileChat: false,
                typingUsers: {},
                sentRequests: [],
                receivedRequests: [],
                chatSearchQuery: '',
                showEmojiPicker: false,
                replyingTo: null,
                contextMenuMessage: null,
                deleteConfirm: null,
                chatActionMenu: false,
                clearDeleteConfirm: null,
                showPasswordChange: false,
                showAvatarPicker: false
            });
        },
        setView: (view)=>set({
                view
            }),
        chatRooms: [],
        setChatRooms: (rooms)=>set({
                chatRooms: rooms
            }),
        addChatRoom: (room)=>set((state)=>({
                    chatRooms: [
                        room,
                        ...state.chatRooms
                    ]
                })),
        updateChatRoom: (roomId, updates)=>set((state)=>({
                    chatRooms: state.chatRooms.map((r)=>r.id === roomId ? {
                            ...r,
                            ...updates
                        } : r)
                })),
        removeChatRoom: (roomId)=>set((state)=>{
                const newMessages = {
                    ...state.messages
                };
                delete newMessages[roomId];
                return {
                    chatRooms: state.chatRooms.filter((r)=>r.id !== roomId),
                    activeRoomId: state.activeRoomId === roomId ? null : state.activeRoomId,
                    messages: newMessages
                };
            }),
        activeRoomId: null,
        setActiveRoomId: (id)=>set({
                activeRoomId: id
            }),
        messages: {},
        setMessages: (roomId, messages)=>set((state)=>({
                    messages: {
                        ...state.messages,
                        [roomId]: messages
                    }
                })),
        addMessage: (roomId, message)=>set((state)=>{
                const existing = state.messages[roomId] || [];
                if (existing.find((m)=>m.id === message.id)) return state;
                return {
                    messages: {
                        ...state.messages,
                        [roomId]: [
                            ...existing,
                            message
                        ]
                    }
                };
            }),
        updateMessage: (roomId, messageId, updates)=>set((state)=>{
                const existing = state.messages[roomId] || [];
                return {
                    messages: {
                        ...state.messages,
                        [roomId]: existing.map((m)=>m.id === messageId ? {
                                ...m,
                                ...updates
                            } : m)
                    }
                };
            }),
        onlineUsers: {},
        setOnlineUsers: (users)=>set({
                onlineUsers: users
            }),
        setUserOnline: (uid, online)=>set((state)=>({
                    onlineUsers: {
                        ...state.onlineUsers,
                        [uid]: {
                            online,
                            lastSeen: online ? Date.now() : state.onlineUsers[uid]?.lastSeen || 0
                        }
                    }
                })),
        sidebarTab: 'chats',
        setSidebarTab: (tab)=>set({
                sidebarTab: tab
            }),
        showMobileChat: false,
        setShowMobileChat: (show)=>set({
                showMobileChat: show
            }),
        searchQuery: '',
        setSearchQuery: (q)=>set({
                searchQuery: q
            }),
        theme: ("TURBOPACK compile-time value", "object") !== 'undefined' && JSON.parse(localStorage.getItem('chatTheme') || 'null') || {
            mode: 'dark',
            preset: 'emerald',
            fontSize: 'medium',
            bubbleStyle: 'rounded'
        },
        setTheme: (updates)=>{
            const newTheme = {
                ...get().theme,
                ...updates
            };
            if ("TURBOPACK compile-time truthy", 1) localStorage.setItem('chatTheme', JSON.stringify(newTheme));
            set({
                theme: newTheme
            });
        },
        allUsers: [],
        setAllUsers: (users)=>set({
                allUsers: users
            }),
        typingUsers: {},
        setTypingUsers: (roomId, users)=>set((state)=>({
                    typingUsers: {
                        ...state.typingUsers,
                        [roomId]: users
                    }
                })),
        sentRequests: [],
        receivedRequests: [],
        setSentRequests: (requests)=>set({
                sentRequests: requests
            }),
        setReceivedRequests: (requests)=>set({
                receivedRequests: requests
            }),
        updateRequestStatus: (requestId, status, chatRoomId)=>set((state)=>({
                    receivedRequests: state.receivedRequests.map((r)=>r.id === requestId ? {
                            ...r,
                            status,
                            chatRoomId: chatRoomId || r.chatRoomId
                        } : r),
                    sentRequests: state.sentRequests.map((r)=>r.id === requestId ? {
                            ...r,
                            status,
                            chatRoomId: chatRoomId || r.chatRoomId
                        } : r)
                })),
        removeRequestFromList: (requestId)=>set((state)=>({
                    receivedRequests: state.receivedRequests.filter((r)=>r.id !== requestId),
                    sentRequests: state.sentRequests.filter((r)=>r.id !== requestId)
                })),
        chatSearchQuery: '',
        setChatSearchQuery: (q)=>set({
                chatSearchQuery: q
            }),
        showEmojiPicker: false,
        setShowEmojiPicker: (show)=>set({
                showEmojiPicker: show
            }),
        replyingTo: null,
        setReplyingTo: (msg)=>set({
                replyingTo: msg
            }),
        contextMenuMessage: null,
        setContextMenuMessage: (msg)=>set({
                contextMenuMessage: msg
            }),
        deleteConfirm: null,
        setDeleteConfirm: (confirm)=>set({
                deleteConfirm: confirm
            }),
        chatActionMenu: false,
        setChatActionMenu: (show)=>set({
                chatActionMenu: show
            }),
        clearDeleteConfirm: null,
        setClearDeleteConfirm: (confirm)=>set({
                clearDeleteConfirm: confirm
            }),
        showPasswordChange: false,
        setShowPasswordChange: (show)=>set({
                showPasswordChange: show
            }),
        showAvatarPicker: false,
        setShowAvatarPicker: (show)=>set({
                showAvatarPicker: show
            }),
        blockedUsers: [],
        setBlockedUsers: (blocked)=>set({
                blockedUsers: blocked
            }),
        starredUsers: [],
        setStarredUsers: (starred)=>set({
                starredUsers: starred
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isFirebaseConfigured",
    ()=>isFirebaseConfigured,
    "rtdb",
    ()=>rtdb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$database$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/database/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/database/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
;
const firebaseConfig = {
    apiKey: "AIzaSyBt7v-4xEP30HA5o35xBtb9ErFSs7aaecE",
    authDomain: "chat-eef3b.firebaseapp.com",
    projectId: "chat-eef3b",
    storageBucket: "chat-eef3b.firebasestorage.app",
    messagingSenderId: "68858117687",
    appId: "1:68858117687:web:75ace5acc508643cdb89b2",
    databaseURL: "https://chat-eef3b-default-rtdb.firebaseio.com"
};
const isFirebaseConfigured = ()=>{
    return !!firebaseConfig.apiKey && !!firebaseConfig.projectId && !!firebaseConfig.appId;
};
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const rtdb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDatabase"])(app);
const __TURBOPACK__default__export__ = app;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acceptChatRequest",
    ()=>acceptChatRequest,
    "blockUser",
    ()=>blockUser,
    "cancelChatRequest",
    ()=>cancelChatRequest,
    "changeUserPassword",
    ()=>changeUserPassword,
    "changeUsername",
    ()=>changeUsername,
    "clearChatForMe",
    ()=>clearChatForMe,
    "createDirectChatRoom",
    ()=>createDirectChatRoom,
    "createGroupChatRoom",
    ()=>createGroupChatRoom,
    "decryptMessage",
    ()=>decryptMessage,
    "deleteChatRoom",
    ()=>deleteChatRoom,
    "deleteMessageForEveryone",
    ()=>deleteMessageForEveryone,
    "deleteMessageForMe",
    ()=>deleteMessageForMe,
    "encryptMessage",
    ()=>encryptMessage,
    "getAllUsers",
    ()=>getAllUsers,
    "getBlockedUsers",
    ()=>getBlockedUsers,
    "getStarredUsers",
    ()=>getStarredUsers,
    "isUserBlocked",
    ()=>isUserBlocked,
    "listenToBlockedUsers",
    ()=>listenToBlockedUsers,
    "listenToChatRooms",
    ()=>listenToChatRooms,
    "listenToMessages",
    ()=>listenToMessages,
    "listenToPresence",
    ()=>listenToPresence,
    "listenToReceivedRequests",
    ()=>listenToReceivedRequests,
    "listenToSentRequests",
    ()=>listenToSentRequests,
    "listenToStarredUsers",
    ()=>listenToStarredUsers,
    "listenToTyping",
    ()=>listenToTyping,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "registerUser",
    ()=>registerUser,
    "rejectChatRequest",
    ()=>rejectChatRequest,
    "sanitizeInput",
    ()=>sanitizeInput,
    "sanitizeUsername",
    ()=>sanitizeUsername,
    "searchUsers",
    ()=>searchUsers,
    "sendChatRequest",
    ()=>sendChatRequest,
    "sendMessage",
    ()=>sendMessage,
    "setTyping",
    ()=>setTyping,
    "setupPresence",
    ()=>setupPresence,
    "starUser",
    ()=>starUser,
    "unblockUser",
    ()=>unblockUser,
    "unstarUser",
    ()=>unstarUser,
    "updateProfileData",
    ()=>updateProfileData,
    "usernameToEmail",
    ()=>usernameToEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$database$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/database/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/database/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
;
;
;
;
;
function sanitizeInput(input, maxLength = 500) {
    return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
}
function sanitizeUsername(input) {
    return input.toLowerCase().replace(/[^a-z0-9_]/g, '').trim().slice(0, 20);
}
function usernameToEmail(username) {
    return `${username.toLowerCase().trim()}@chatapp.local`;
}
// ==================== ENCRYPTION ====================
// Simple but effective AES-like encryption to prevent casual reading of messages in Firebase console
// Uses a deterministic key derived from the room ID so all participants can decrypt
const ENCRYPTION_SALT = 'FurtherChat_2024_SecureKey_v1';
function deriveKey(roomId) {
    // Simple key derivation from room ID
    let hash = 0;
    const combined = roomId + ENCRYPTION_SALT;
    for(let i = 0; i < combined.length; i++){
        const char = combined.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Generate a longer key by repeating the hash pattern
    const keyBase = Math.abs(hash).toString(36).padStart(8, '0');
    return (keyBase + keyBase.split('').reverse().join('') + keyBase).slice(0, 32);
}
function encryptMessage(content, roomId) {
    if (!content || content === 'This message was deleted' || content === 'Chat request accepted! You can now message each other.') return content;
    try {
        const key = deriveKey(roomId);
        let result = '';
        for(let i = 0; i < content.length; i++){
            const charCode = content.charCodeAt(i);
            const keyCode = key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode ^ keyCode);
        }
        // Encode to base64 for safe storage
        return 'ENC:' + btoa(unescape(encodeURIComponent(result)));
    } catch  {
        return content;
    }
}
function decryptMessage(encrypted, roomId) {
    if (!encrypted || !encrypted.startsWith('ENC:')) return encrypted;
    try {
        const key = deriveKey(roomId);
        const decoded = decodeURIComponent(escape(atob(encrypted.slice(4))));
        let result = '';
        for(let i = 0; i < decoded.length; i++){
            const charCode = decoded.charCodeAt(i);
            const keyCode = key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode ^ keyCode);
        }
        return result;
    } catch  {
        return encrypted;
    }
}
async function registerUser(username, password, displayName) {
    const cleanUsername = sanitizeUsername(username);
    const cleanDisplayName = sanitizeInput(displayName, 30);
    if (cleanUsername.length < 3) throw new Error('Username must be at least 3 characters');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (cleanDisplayName.length < 2) throw new Error('Display name must be at least 2 characters');
    const email = usernameToEmail(cleanUsername);
    const usernameDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', cleanUsername));
    if (usernameDoc.exists()) throw new Error('Username already taken');
    const cred = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(cred.user, {
        displayName: cleanDisplayName
    });
    const avatarColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(cred.user.uid);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', cred.user.uid), {
        username: cleanUsername,
        displayName: cleanDisplayName,
        avatar: null,
        avatarColor,
        isOnline: true,
        lastSeen: null,
        usernameChangedAt: null,
        lastActiveAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        blockedUsers: [],
        starredUsers: []
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', cleanUsername), {
        uid: cred.user.uid,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    return {
        uid: cred.user.uid,
        username: cleanUsername,
        displayName: cleanDisplayName,
        avatar: null,
        avatarColor,
        isOnline: true,
        lastSeen: null,
        usernameChangedAt: null
    };
}
async function loginUser(username, password) {
    const email = usernameToEmail(username);
    const cred = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', cred.user.uid));
    if (!userDoc.exists()) throw new Error('User data not found');
    const data = userDoc.data();
    // Update last active timestamp
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', cred.user.uid), {
        lastActiveAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        isOnline: true
    }).catch(()=>{});
    // Check for and cleanup inactive users (30 days)
    try {
        await cleanupInactiveUsers();
    } catch  {}
    return {
        uid: cred.user.uid,
        username: data.username,
        displayName: data.displayName || username,
        avatar: data.avatar,
        avatarColor: data.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(cred.user.uid),
        isOnline: true,
        lastSeen: null,
        usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null
    };
}
async function logoutUser() {
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser;
    if (user) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid), {
            isOnline: false,
            lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            lastActiveAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }).catch(()=>{});
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], `presence/${user.uid}`), null).catch(()=>{});
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
}
async function changeUserPassword(currentPassword, newPassword) {
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser;
    if (!user || !user.email) throw new Error('Not authenticated');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    const credential = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmailAuthProvider"].credential(user.email, currentPassword);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reauthenticateWithCredential"])(user, credential);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePassword"])(user, newPassword);
}
// ==================== AUTO-DELETE INACTIVE USERS (30 DAYS) ====================
async function cleanupInactiveUsers() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usersSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users'));
    const batchDeletes = [];
    for (const userDoc of usersSnap.docs){
        const data = userDoc.data();
        const lastActive = data.lastActiveAt?.toMillis?.() || data.createdAt?.toMillis?.() || 0;
        const isCurrentlyOnline = data.isOnline === true;
        // Only delete if offline AND inactive for 30+ days
        if (!isCurrentlyOnline && lastActive > 0 && lastActive < thirtyDaysAgo.getTime()) {
            const uid = userDoc.id;
            // Delete user document
            batchDeletes.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid)).catch(()=>{}));
            // Delete username mapping
            if (data.username) {
                batchDeletes.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', data.username)).catch(()=>{}));
            }
            // Delete user's chat rooms (where they're the only remaining participant)
            try {
                const roomsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('participants', 'array-contains', uid)));
                for (const roomDoc of roomsSnap.docs){
                    const roomData = roomDoc.data();
                    // Mark user as having deleted the room
                    const deletedFor = roomData.deletedFor || [];
                    if (!deletedFor.includes(uid)) {
                        deletedFor.push(uid);
                    }
                    // If all participants have deleted, remove the room entirely
                    const allDeleted = roomData.participants.every((p)=>deletedFor.includes(p));
                    if (allDeleted) {
                        // Delete messages
                        const msgsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomDoc.id, 'messages'));
                        for(let i = 0; i < msgsSnap.docs.length; i += 400){
                            const chunk = msgsSnap.docs.slice(i, i + 400);
                            const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
                            chunk.forEach((d)=>batch.delete(d.ref));
                            await batch.commit();
                        }
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomDoc.id));
                    } else {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomDoc.id), {
                            deletedFor
                        });
                    }
                }
            } catch  {}
            // Delete presence data
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], `presence/${uid}`), null).catch(()=>{});
        }
    }
    await Promise.all(batchDeletes);
}
async function starUser(currentUid, userToStarUid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid));
    if (!userDoc.exists()) throw new Error('User not found');
    const data = userDoc.data();
    const starredUsers = data.starredUsers || [];
    if (!starredUsers.includes(userToStarUid)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid), {
            starredUsers: [
                ...starredUsers,
                userToStarUid
            ]
        });
    }
}
async function unstarUser(currentUid, userToUnstarUid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid));
    if (!userDoc.exists()) throw new Error('User not found');
    const data = userDoc.data();
    const starredUsers = data.starredUsers || [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid), {
        starredUsers: starredUsers.filter((uid)=>uid !== userToUnstarUid)
    });
}
async function getStarredUsers(uid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid));
    if (!userDoc.exists()) return [];
    return userDoc.data().starredUsers || [];
}
function listenToStarredUsers(uid, callback) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), (snap)=>{
        if (snap.exists()) {
            callback(snap.data().starredUsers || []);
        } else {
            callback([]);
        }
    }, ()=>callback([]));
}
async function blockUser(currentUid, userToBlockUid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid));
    if (!userDoc.exists()) throw new Error('User not found');
    const data = userDoc.data();
    const blockedUsers = data.blockedUsers || [];
    if (!blockedUsers.includes(userToBlockUid)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid), {
            blockedUsers: [
                ...blockedUsers,
                userToBlockUid
            ]
        });
    }
}
async function unblockUser(currentUid, userToUnblockUid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid));
    if (!userDoc.exists()) throw new Error('User not found');
    const data = userDoc.data();
    const blockedUsers = data.blockedUsers || [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUid), {
        blockedUsers: blockedUsers.filter((uid)=>uid !== userToUnblockUid)
    });
}
async function getBlockedUsers(uid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid));
    if (!userDoc.exists()) return [];
    return userDoc.data().blockedUsers || [];
}
function listenToBlockedUsers(uid, callback) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), (snap)=>{
        if (snap.exists()) {
            callback(snap.data().blockedUsers || []);
        } else {
            callback([]);
        }
    }, ()=>callback([]));
}
async function isUserBlocked(currentUid, otherUid) {
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', otherUid));
    if (!userDoc.exists()) return false;
    const blockedUsers = userDoc.data().blockedUsers || [];
    return blockedUsers.includes(currentUid);
}
function setupPresence(uid) {
    const presenceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], `presence/${uid}`);
    const connectedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], '.info/connected');
    let isConnected = false;
    const connUnsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onValue"])(connectedRef, (snap)=>{
        if (snap.val() === true) {
            isConnected = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(presenceRef, {
                online: true,
                lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onDisconnect"])(presenceRef).set({
                online: false,
                lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        } else {
            isConnected = false;
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), {
        isOnline: true,
        lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        lastActiveAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    }).catch(()=>{});
    const heartbeat = setInterval(()=>{
        if (isConnected) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(presenceRef, {
                online: true,
                lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), {
            isOnline: true,
            lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            lastActiveAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }).catch(()=>{});
    }, 30000);
    return ()=>{
        clearInterval(heartbeat);
        connUnsub();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(presenceRef, {
            online: false,
            lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }).catch(()=>{});
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), {
            isOnline: false,
            lastSeen: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }).catch(()=>{});
    };
}
function listenToPresence(callback) {
    let rtdbUsers = {};
    let firestoreUsers = {};
    const presenceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], 'presence');
    const rtdbUnsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onValue"])(presenceRef, (snapshot)=>{
        const data = snapshot.val() || {};
        rtdbUsers = {};
        Object.keys(data).forEach((uid)=>{
            const val = data[uid];
            if (val) {
                rtdbUsers[uid] = {
                    online: val.online === true,
                    lastSeen: val.lastSeen || 0
                };
            }
        });
        const merged = {
            ...firestoreUsers
        };
        Object.keys(rtdbUsers).forEach((uid)=>{
            merged[uid] = rtdbUsers[uid];
        });
        callback(merged);
    }, (error)=>{
        console.warn('RTDB presence listen failed, using Firestore only:', error);
        callback(firestoreUsers);
    });
    const firestoreUnsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users'), (snapshot)=>{
        firestoreUsers = {};
        snapshot.docs.forEach((docSnap)=>{
            const data = docSnap.data();
            firestoreUsers[docSnap.id] = {
                online: data.isOnline === true,
                lastSeen: data.lastSeen?.toMillis?.() || 0
            };
        });
        const merged = {
            ...firestoreUsers
        };
        Object.keys(rtdbUsers).forEach((uid)=>{
            merged[uid] = rtdbUsers[uid];
        });
        callback(merged);
    }, (error)=>{
        console.warn('Firestore presence listen failed:', error);
    });
    return ()=>{
        rtdbUnsub();
        firestoreUnsub();
    };
}
async function createDirectChatRoom(currentUid, otherUid) {
    const roomsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms');
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(roomsRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('type', '==', 'direct'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('participants', 'array-contains', currentUid));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
    for (const docSnap of snapshot.docs){
        const data = docSnap.data();
        if (data.participants.includes(otherUid)) {
            const deletedFor = data.deletedFor || [];
            if (deletedFor.includes(currentUid)) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', docSnap.id), {
                    deletedFor: deletedFor.filter((uid)=>uid !== currentUid),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
            }
            return docSnap.id;
        }
    }
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms'), {
        type: 'direct',
        name: null,
        avatar: null,
        avatarColor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(otherUid),
        participants: [
            currentUid,
            otherUid
        ],
        deletedFor: [],
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        lastMessage: null
    });
    return docRef.id;
}
async function createGroupChatRoom(name, creatorUid, participantUids) {
    const allParticipants = [
        creatorUid,
        ...participantUids.filter((uid)=>uid !== creatorUid)
    ];
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms'), {
        type: 'group',
        name: sanitizeInput(name, 50),
        avatar: null,
        avatarColor: '#8b5cf6',
        participants: allParticipants,
        deletedFor: [],
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        lastMessage: null
    });
    return docRef.id;
}
function listenToChatRooms(uid, callback) {
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('participants', 'array-contains', uid));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(q, async (snapshot)=>{
        const rooms = [];
        for (const docSnap of snapshot.docs){
            const data = docSnap.data();
            const roomDeletedFor = data.deletedFor || [];
            if (roomDeletedFor.includes(uid)) continue;
            let roomName = data.name, roomAvatar = data.avatar;
            if (data.type === 'direct') {
                const otherUid = data.participants.find((p)=>p !== uid);
                if (otherUid) {
                    try {
                        const d = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', otherUid));
                        if (d.exists()) {
                            const od = d.data();
                            roomName = od.displayName || od.username;
                            roomAvatar = od.avatar;
                        }
                    } catch  {
                        roomName = 'User';
                    }
                }
            }
            rooms.push({
                id: docSnap.id,
                type: data.type,
                name: roomName,
                avatar: roomAvatar,
                avatarColor: data.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(docSnap.id),
                participants: data.participants,
                lastMessage: data.lastMessage ? {
                    id: '',
                    content: decryptMessage(data.lastMessage.content || '', docSnap.id),
                    type: data.lastMessage.type || 'text',
                    senderId: data.lastMessage.senderId || '',
                    senderName: data.lastMessage.senderName || '',
                    senderAvatar: null,
                    senderAvatarColor: '',
                    chatRoomId: docSnap.id,
                    createdAt: data.lastMessage.createdAt?.toMillis?.() || Date.now(),
                    status: data.lastMessage.status || 'sent',
                    readBy: data.lastMessage.readBy || [],
                    deletedFor: [],
                    deletedForEveryone: false
                } : null,
                unreadCount: 0,
                updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
                createdAt: data.createdAt?.toMillis?.() || Date.now()
            });
        }
        rooms.sort((a, b)=>b.updatedAt - a.updatedAt);
        callback(rooms);
    }, (error)=>{
        console.error('Error listening to chat rooms:', error);
    });
}
async function sendMessage(roomId, content, senderId, senderName, senderAvatar, senderAvatarColor, type = 'text', replyTo, replyToContent, replyToSender) {
    const cleanContent = sanitizeInput(content, 2000);
    if (!cleanContent) throw new Error('Message cannot be empty');
    // Encrypt content before storing
    const encryptedContent = encryptMessage(cleanContent, roomId);
    const encryptedReplyContent = replyToContent ? encryptMessage(sanitizeInput(replyToContent, 200), roomId) : null;
    const messageData = {
        content: encryptedContent,
        type,
        senderId,
        senderName,
        senderAvatar,
        senderAvatarColor,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        status: 'sent',
        readBy: [
            senderId
        ],
        deletedFor: [],
        deletedForEveryone: false,
        replyTo: replyTo || null,
        replyToContent: encryptedReplyContent,
        replyToSender: replyToSender || null,
        encrypted: true
    };
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages'), messageData);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
        lastMessage: {
            content: encryptMessage(type === 'text' ? cleanContent : '📷 Photo', roomId),
            type,
            senderId,
            senderName,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            status: 'sent',
            readBy: [
                senderId
            ],
            encrypted: true
        },
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    return docRef.id;
}
function listenToMessages(roomId, currentUid, callback) {
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])('createdAt', 'asc'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(500));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(q, (snapshot)=>{
        const msgs = snapshot.docs.map((docSnap)=>{
            const data = docSnap.data();
            const isEncrypted = data.encrypted === true;
            const decryptedContent = isEncrypted ? decryptMessage(data.content, roomId) : data.content;
            const decryptedReplyContent = data.replyToContent && isEncrypted ? decryptMessage(data.replyToContent, roomId) : data.replyToContent;
            return {
                id: docSnap.id,
                content: decryptedContent,
                type: data.type || 'text',
                senderId: data.senderId,
                senderName: data.senderName,
                senderAvatar: data.senderAvatar || null,
                senderAvatarColor: data.senderAvatarColor || '',
                chatRoomId: roomId,
                createdAt: data.createdAt?.toMillis?.() || Date.now(),
                status: data.status || 'sent',
                readBy: data.readBy || [],
                deletedFor: data.deletedFor || [],
                deletedForEveryone: data.deletedForEveryone || false,
                replyTo: data.replyTo || null,
                replyToContent: decryptedReplyContent,
                replyToSender: data.replyToSender || null
            };
        });
        // Mark messages as "delivered" for messages sent by other users that are still 'sent'
        const deliveredMsgs = msgs.filter((m)=>m.senderId !== currentUid && m.status === 'sent' && !m.deletedForEveryone && m.type !== 'system');
        if (deliveredMsgs.length > 0) {
            const dBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
            deliveredMsgs.forEach((m)=>{
                dBatch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', m.id), {
                    status: 'delivered'
                });
            });
            const lastM = msgs[msgs.length - 1];
            if (lastM && deliveredMsgs.some((m)=>m.id === lastM.id) && lastM.senderId !== currentUid) {
                dBatch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
                    'lastMessage.status': 'delivered'
                });
            }
            dBatch.commit().catch(()=>{});
        }
        const unreadMsgs = msgs.filter((m)=>m.senderId !== currentUid && !m.readBy.includes(currentUid) && !m.deletedForEveryone && m.type !== 'system');
        if (unreadMsgs.length > 0) {
            const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
            unreadMsgs.forEach((m)=>{
                batch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', m.id), {
                    readBy: [
                        ...m.readBy,
                        currentUid
                    ],
                    status: 'read'
                });
            });
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg && unreadMsgs.some((m)=>m.id === lastMsg.id)) {
                batch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
                    'lastMessage.status': 'read',
                    'lastMessage.readBy': [
                        ...lastMsg.readBy,
                        currentUid
                    ]
                });
            }
            batch.commit().catch(()=>{});
        }
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg && lastMsg.status === 'read' && lastMsg.senderId === currentUid) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId)).then((roomSnap)=>{
                if (roomSnap.exists() && roomSnap.data().lastMessage?.status !== 'read' && roomSnap.data().lastMessage?.senderId === currentUid) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
                        'lastMessage.status': 'read',
                        'lastMessage.readBy': lastMsg.readBy
                    }).catch(()=>{});
                }
            }).catch(()=>{});
        }
        callback(msgs);
    }, (error)=>{
        console.error('Error listening to messages:', error);
    });
}
async function deleteMessageForMe(roomId, messageId, uid) {
    const msgDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', messageId));
    if (!msgDoc.exists()) return;
    const data = msgDoc.data();
    const deletedFor = data.deletedFor || [];
    if (!deletedFor.includes(uid)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', messageId), {
            deletedFor: [
                ...deletedFor,
                uid
            ]
        });
    }
}
async function deleteMessageForEveryone(roomId, messageId, senderId) {
    const msgDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', messageId));
    if (!msgDoc.exists()) throw new Error('Message not found');
    const data = msgDoc.data();
    if (data.senderId !== senderId) throw new Error('Only the sender can delete this message for everyone');
    const messageTime = data.createdAt?.toMillis?.() || 0;
    const hoursSince = (Date.now() - messageTime) / (1000 * 60 * 60);
    if (hoursSince > 48) throw new Error('You can only delete messages for everyone within 48 hours');
    // Store the deleted message indicator unencrypted (it's a system message)
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', messageId), {
        deletedForEveryone: true,
        content: 'This message was deleted',
        type: 'deleted',
        encrypted: false
    });
    try {
        const roomDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId));
        if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            if (roomData.lastMessage) {
                const lastMsgTime = roomData.lastMessage.createdAt?.toMillis?.() || 0;
                if (Math.abs(lastMsgTime - messageTime) < 2000) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
                        lastMessage: {
                            ...roomData.lastMessage,
                            content: 'This message was deleted',
                            type: 'deleted'
                        }
                    });
                }
            }
        }
    } catch  {}
}
async function clearChatForMe(roomId, uid) {
    const msgsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages'));
    const updates = [];
    msgsSnap.docs.forEach((docSnap)=>{
        const data = docSnap.data();
        if (data.type === 'system') return;
        const deletedFor = data.deletedFor || [];
        if (!deletedFor.includes(uid)) {
            updates.push({
                id: docSnap.id,
                deletedFor
            });
        }
    });
    for(let i = 0; i < updates.length; i += 400){
        const chunk = updates.slice(i, i + 400);
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
        chunk.forEach((u)=>{
            batch.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages', u.id), {
                deletedFor: [
                    ...u.deletedFor,
                    uid
                ]
            });
        });
        await batch.commit();
    }
}
async function deleteChatRoom(roomId, uid) {
    await clearChatForMe(roomId, uid);
    const roomDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId));
    if (roomDoc.exists()) {
        const data = roomDoc.data();
        const roomDeletedFor = data.deletedFor || [];
        if (!roomDeletedFor.includes(uid)) {
            const newDeletedFor = [
                ...roomDeletedFor,
                uid
            ];
            const allParticipants = data.participants;
            const allDeleted = allParticipants.every((p)=>newDeletedFor.includes(p));
            if (allDeleted) {
                const msgsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages'));
                for(let i = 0; i < msgsSnap.docs.length; i += 400){
                    const chunk = msgsSnap.docs.slice(i, i + 400);
                    const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"]);
                    chunk.forEach((d)=>{
                        batch.delete(d.ref);
                    });
                    await batch.commit();
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId));
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId), {
                    deletedFor: newDeletedFor
                });
            }
        }
    }
}
async function changeUsername(uid, newUsername) {
    const cleanUsername = sanitizeUsername(newUsername);
    if (cleanUsername.length < 3) throw new Error('Username must be at least 3 characters');
    const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid));
    if (!userDoc.exists()) throw new Error('User not found');
    const data = userDoc.data();
    if (data.usernameChangedAt) {
        const lastChanged = data.usernameChangedAt.toMillis?.() || 0;
        const daysSince = (Date.now() - lastChanged) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) {
            const daysLeft = Math.ceil(30 - daysSince);
            throw new Error(`You can change username again in ${daysLeft} days`);
        }
    }
    const oldUsername = data.username;
    const usernameDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', cleanUsername));
    if (usernameDoc.exists()) throw new Error('Username already taken');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', cleanUsername), {
        uid,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), {
        username: cleanUsername,
        usernameChangedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    if (oldUsername !== cleanUsername) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'usernames', oldUsername)).catch(()=>{});
}
async function searchUsers(q, currentUid) {
    const usersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users');
    const q1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(usersRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('username', '>=', q.toLowerCase()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('username', '<=', q.toLowerCase() + '\uf8ff'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(10));
    const q2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(usersRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('displayName', '>=', q), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('displayName', '<=', q + '\uf8ff'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(10));
    const [snap1, snap2] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q1),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q2)
    ]);
    const usersMap = new Map();
    const process = (snapshot)=>{
        snapshot.docs.forEach((d)=>{
            if (d.id !== currentUid && !usersMap.has(d.id)) {
                const data = d.data();
                usersMap.set(d.id, {
                    uid: d.id,
                    username: data.username,
                    displayName: data.displayName || data.username,
                    avatar: data.avatar,
                    avatarColor: data.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(d.id),
                    isOnline: data.isOnline,
                    lastSeen: data.lastSeen?.toMillis?.() || null,
                    usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null
                });
            }
        });
    };
    process(snap1);
    process(snap2);
    return Array.from(usersMap.values());
}
async function getAllUsers(currentUid) {
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(100)));
    return snapshot.docs.filter((d)=>d.id !== currentUid).map((d)=>{
        const data = d.data();
        return {
            uid: d.id,
            username: data.username,
            displayName: data.displayName || data.username,
            avatar: data.avatar,
            avatarColor: data.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(d.id),
            isOnline: data.isOnline,
            lastSeen: data.lastSeen?.toMillis?.() || null,
            usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null
        };
    });
}
async function updateProfileData(uid, updates) {
    const cleanUpdates = {};
    if (updates.displayName) cleanUpdates.displayName = sanitizeInput(updates.displayName, 30);
    if (updates.avatar !== undefined) cleanUpdates.avatar = updates.avatar;
    if (updates.avatarColor) cleanUpdates.avatarColor = updates.avatarColor;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid), cleanUpdates);
    if (cleanUpdates.displayName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser, {
        displayName: cleanUpdates.displayName
    });
}
function setTyping(roomId, uid, username, isTyping) {
    const typingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], `typing/${roomId}/${uid}`);
    if (isTyping) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(typingRef, {
            username,
            timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }).catch((err)=>{
            console.warn('Failed to set typing status:', err);
        });
        if ("TURBOPACK compile-time truthy", 1) {
            const key = `typing_timeout_${roomId}_${uid}`;
            const existing = window[key];
            if (existing) clearTimeout(existing);
            window[key] = setTimeout(()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(typingRef, null).catch(()=>{});
                delete window[key];
            }, 3000);
        }
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(typingRef, null).catch(()=>{});
    }
}
function listenToTyping(roomId, callback) {
    const typingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rtdb"], `typing/${roomId}`);
    const unsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onValue"])(typingRef, (snapshot)=>{
        const data = snapshot.val() || {};
        const now = Date.now();
        const usernames = [];
        Object.values(data).forEach((v)=>{
            if (v && v.username) {
                const ts = v.timestamp || 0;
                if (now - ts < 5000) {
                    usernames.push(v.username);
                }
            }
        });
        callback(usernames);
    }, (error)=>{
        console.warn('Failed to listen to typing:', error);
        callback([]);
    });
    return ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["off"])(typingRef);
        unsub();
    };
}
async function sendChatRequest(fromUid, fromUsername, fromDisplayName, fromAvatar, fromAvatarColor, toUid, toUsername, toDisplayName, toAvatar, toAvatarColor, message = 'Hi, I would like to chat with you!') {
    // Check if the other user has blocked the current user
    const otherUserDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', toUid));
    if (otherUserDoc.exists()) {
        const otherBlockedUsers = otherUserDoc.data().blockedUsers || [];
        if (otherBlockedUsers.includes(fromUid)) throw new Error('Cannot send request to this user');
    }
    const requestsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests');
    const snap1 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(requestsRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('fromUid', '==', fromUid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('toUid', '==', toUid)));
    if (snap1.docs.find((d)=>d.data().status === 'pending')) throw new Error('You already sent a request to this user');
    const snap2 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(requestsRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('fromUid', '==', toUid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('toUid', '==', fromUid)));
    if (snap2.docs.find((d)=>d.data().status === 'pending')) throw new Error('This user already sent you a request. Check your incoming requests!');
    // Check for existing chat room - if room exists but user deleted it, RESTORE it
    const roomsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('type', '==', 'direct'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('participants', 'array-contains', fromUid)));
    for (const roomDoc of roomsSnap.docs){
        const data = roomDoc.data();
        if (data.participants.includes(toUid)) {
            const roomDeletedFor = data.deletedFor || [];
            if (roomDeletedFor.includes(fromUid)) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomDoc.id), {
                    deletedFor: roomDeletedFor.filter((uid)=>uid !== fromUid),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
                return {
                    type: 'restored',
                    roomId: roomDoc.id
                };
            }
            throw new Error('You already have a chat with this user');
        }
    }
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests'), {
        fromUid,
        fromUsername,
        fromDisplayName,
        fromAvatar,
        fromAvatarColor,
        toUid,
        toUsername,
        toDisplayName,
        toAvatar,
        toAvatarColor,
        status: 'pending',
        message: sanitizeInput(message, 200),
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        chatRoomId: null
    });
    return {
        type: 'request',
        requestId: docRef.id
    };
}
function listenToSentRequests(uid, callback) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('fromUid', '==', uid)), (snapshot)=>{
        const requests = snapshot.docs.map((d)=>{
            const data = d.data();
            return {
                id: d.id,
                fromUid: data.fromUid,
                fromUsername: data.fromUsername,
                fromDisplayName: data.fromDisplayName,
                fromAvatar: data.fromAvatar || null,
                fromAvatarColor: data.fromAvatarColor || '',
                toUid: data.toUid,
                toUsername: data.toUsername,
                toDisplayName: data.toDisplayName,
                toAvatar: data.toAvatar || null,
                toAvatarColor: data.toAvatarColor || '',
                status: data.status,
                message: data.message || '',
                createdAt: data.createdAt?.toMillis?.() || Date.now(),
                chatRoomId: data.chatRoomId || null
            };
        });
        requests.sort((a, b)=>b.createdAt - a.createdAt);
        callback(requests);
    });
}
function listenToReceivedRequests(uid, callback) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('toUid', '==', uid)), (snapshot)=>{
        const requests = snapshot.docs.map((d)=>{
            const data = d.data();
            return {
                id: d.id,
                fromUid: data.fromUid,
                fromUsername: data.fromUsername,
                fromDisplayName: data.fromDisplayName,
                fromAvatar: data.fromAvatar || null,
                fromAvatarColor: data.fromAvatarColor || '',
                toUid: data.toUid,
                toUsername: data.toUsername,
                toDisplayName: data.toDisplayName,
                toAvatar: data.toAvatar || null,
                toAvatarColor: data.toAvatarColor || '',
                status: data.status,
                message: data.message || '',
                createdAt: data.createdAt?.toMillis?.() || Date.now(),
                chatRoomId: data.chatRoomId || null
            };
        });
        requests.sort((a, b)=>{
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return b.createdAt - a.createdAt;
        });
        callback(requests);
    });
}
async function acceptChatRequest(requestId, fromUid, toUid) {
    const roomId = await createDirectChatRoom(fromUid, toUid);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests', requestId), {
        status: 'accepted',
        chatRoomId: roomId
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRooms', roomId, 'messages'), {
        content: 'Chat request accepted! You can now message each other.',
        type: 'system',
        senderId: 'system',
        senderName: 'System',
        senderAvatar: null,
        senderAvatarColor: '',
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        status: 'read',
        readBy: [
            fromUid,
            toUid
        ],
        deletedFor: [],
        deletedForEveryone: false,
        encrypted: false
    });
    return roomId;
}
async function rejectChatRequest(requestId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests', requestId), {
        status: 'rejected'
    });
}
async function cancelChatRequest(requestId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'chatRequests', requestId));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth-lockout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearLockout",
    ()=>clearLockout,
    "formatRemainingTime",
    ()=>formatRemainingTime,
    "getLockoutState",
    ()=>getLockoutState,
    "isAccountLocked",
    ()=>isAccountLocked,
    "recordFailedAttempt",
    ()=>recordFailedAttempt
]);
const LOCKOUT_KEY = 'chatapp_lockout_';
const MAX_ATTEMPTS_BEFORE_LOCK = 3;
const BASE_LOCK_DURATION_MS = 60 * 1000;
function getLockoutKey(username) {
    return LOCKOUT_KEY + username.toLowerCase().trim();
}
function getLockoutState(username) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem(getLockoutKey(username));
        if (!stored) return {
            attempts: 0,
            lockedUntil: null,
            lastAttemptAt: null
        };
        return JSON.parse(stored);
    } catch  {
        return {
            attempts: 0,
            lockedUntil: null,
            lastAttemptAt: null
        };
    }
}
function saveLockoutState(username, state) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(getLockoutKey(username), JSON.stringify(state));
}
function recordFailedAttempt(username) {
    const current = getLockoutState(username);
    const now = Date.now();
    if (current.lockedUntil && now >= current.lockedUntil) {
        current.attempts = 0;
        current.lockedUntil = null;
    }
    const newState = {
        attempts: current.attempts + 1,
        lockedUntil: current.lockedUntil,
        lastAttemptAt: now
    };
    const lockoutCycle = Math.floor(newState.attempts / MAX_ATTEMPTS_BEFORE_LOCK);
    if (newState.attempts % MAX_ATTEMPTS_BEFORE_LOCK === 0 && lockoutCycle > 0) {
        const lockDuration = lockoutCycle * BASE_LOCK_DURATION_MS;
        newState.lockedUntil = now + lockDuration;
    }
    saveLockoutState(username, newState);
    return newState;
}
function clearLockout(username) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem(getLockoutKey(username));
}
function isAccountLocked(username) {
    const state = getLockoutState(username);
    const now = Date.now();
    if (state.lockedUntil && now < state.lockedUntil) {
        const remainingMs = state.lockedUntil - now;
        const attemptsInCycle = state.attempts % MAX_ATTEMPTS_BEFORE_LOCK;
        return {
            locked: true,
            remainingMs,
            attemptsLeft: MAX_ATTEMPTS_BEFORE_LOCK - attemptsInCycle
        };
    }
    if (state.lockedUntil && now >= state.lockedUntil) {
        saveLockoutState(username, {
            attempts: 0,
            lockedUntil: null,
            lastAttemptAt: null
        });
    }
    const attemptsInCycle = state.attempts % MAX_ATTEMPTS_BEFORE_LOCK;
    return {
        locked: false,
        remainingMs: 0,
        attemptsLeft: MAX_ATTEMPTS_BEFORE_LOCK - attemptsInCycle
    };
}
function formatRemainingTime(ms) {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/auth-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthForm",
    ()=>AuthForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth-lockout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-in.js [app-client] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function AuthForm() {
    _s();
    const { view, setView, setAuth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [displayName, setDisplayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [lockInfo, setLockInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lockTimer, setLockTimer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [firebaseReady, setFirebaseReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthForm.useEffect": ()=>{
            setFirebaseReady((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"])());
        }
    }["AuthForm.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthForm.useEffect": ()=>{
            if (!lockInfo?.locked) {
                setLockTimer('');
                return;
            }
            const interval = setInterval({
                "AuthForm.useEffect.interval": ()=>{
                    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAccountLocked"])(username);
                    if (info.locked) {
                        setLockTimer((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRemainingTime"])(info.remainingMs));
                    } else {
                        setLockInfo({
                            locked: false,
                            remainingMs: 0,
                            attemptsLeft: 3
                        });
                        setLockTimer('');
                        clearInterval(interval);
                    }
                }
            }["AuthForm.useEffect.interval"], 1000);
            return ({
                "AuthForm.useEffect": ()=>clearInterval(interval)
            })["AuthForm.useEffect"];
        }
    }["AuthForm.useEffect"], [
        lockInfo?.locked,
        username
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthForm.useEffect": ()=>{
            if (username.trim()) {
                setLockInfo((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAccountLocked"])(username));
            }
        }
    }["AuthForm.useEffect"], [
        username
    ]);
    const handleLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthForm.useCallback[handleLogin]": async (e)=>{
            e.preventDefault();
            if (!username.trim() || !password) return;
            const lockStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAccountLocked"])(username);
            if (lockStatus.locked) {
                setLockInfo(lockStatus);
                setLockTimer((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRemainingTime"])(lockStatus.remainingMs));
                setError(`Account locked. Try again in ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRemainingTime"])(lockStatus.remainingMs)}`);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginUser"])(username, password);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearLockout"])(username);
                setAuth(user);
            } catch (err) {
                const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordFailedAttempt"])(username);
                const lockStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAccountLocked"])(username);
                setLockInfo(lockStatus);
                if (lockStatus.locked) {
                    setError(`Too many failed attempts. Locked for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2d$lockout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRemainingTime"])(lockStatus.remainingMs)}`);
                } else {
                    const attemptsLeft = 3 - state.attempts % 3;
                    setError(`Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
                }
            } finally{
                setLoading(false);
            }
        }
    }["AuthForm.useCallback[handleLogin]"], [
        username,
        password,
        setAuth
    ]);
    const handleRegister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthForm.useCallback[handleRegister]": async (e)=>{
            e.preventDefault();
            if (!username.trim() || !password || !displayName.trim()) return;
            if (username.trim().length < 3) {
                setError('Username must be at least 3 characters');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (displayName.trim().length < 2) {
                setError('Display name must be at least 2 characters');
                return;
            }
            setLoading(true);
            setError('');
            try {
                const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerUser"])(username, password, displayName);
                setAuth(user);
            } catch (err) {
                if (err.code === 'auth/email-already-in-use' || err.message === 'Username already taken') {
                    setError('Username already taken');
                } else {
                    setError(err.message || 'Registration failed.');
                }
            } finally{
                setLoading(false);
            }
        }
    }["AuthForm.useCallback[handleRegister]"], [
        username,
        password,
        displayName,
        setAuth
    ]);
    if (!firebaseReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "w-8 h-8 text-white"
                        }, void 0, false, {
                            fileName: "[project]/src/components/auth-form.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth-form.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-white mb-2",
                        children: "Firebase Setup Required"
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth-form.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400 mb-4",
                        children: "This chat app requires Firebase for real-time messaging."
                    }, void 0, false, {
                        fileName: "[project]/src/components/auth-form.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "list-decimal list-inside space-y-1.5 text-slate-400 text-sm text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "Go to ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "https://console.firebase.google.com/",
                                        target: "_blank",
                                        className: "text-sky-400 underline",
                                        children: "Firebase Console"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth-form.tsx",
                                        lineNumber: 87,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "Create a new project (free)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "Enable Authentication with Email/Password"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "Create a Firestore Database"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "Create a Realtime Database"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "Add a Web App & copy config"
                            }, void 0, false, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "Edit ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "bg-white/10 px-1.5 py-0.5 rounded text-xs",
                                        children: "src/lib/firebase.ts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth-form.tsx",
                                        lineNumber: 93,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/auth-form.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/auth-form.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/auth-form.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    const isLogin = view === 'login' || view === 'chat';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]"
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md relative z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/25 rotate-3 hover:rotate-0 transition-transform duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                        className: "w-9 h-9 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth-form.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-white mb-1",
                                    children: isLogin ? 'Welcome back' : 'Create account'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-400",
                                    children: isLogin ? 'Sign in to continue to FurtherChat' : 'Sign up to start chatting'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/auth-form.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-8 pb-8 space-y-4",
                            children: [
                                lockInfo?.locked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "h-4 w-4 text-red-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-red-300",
                                            children: [
                                                "Account locked. Try again in ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: lockTimer
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 82
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this),
                                lockInfo && !lockInfo.locked && lockInfo.attemptsLeft < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "h-4 w-4 text-amber-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-amber-300",
                                            children: [
                                                lockInfo.attemptsLeft,
                                                " attempt",
                                                lockInfo.attemptsLeft !== 1 ? 's' : '',
                                                " remaining before lockout"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "h-4 w-4 text-red-400 shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 142,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-red-300",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: isLogin ? handleLogin : handleRegister,
                                    className: "space-y-4",
                                    children: [
                                        !isLogin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    className: "text-slate-400 text-xs font-medium",
                                                    children: "Display Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                                            className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 152,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            type: "text",
                                                            placeholder: "Your display name",
                                                            value: displayName,
                                                            onChange: (e)=>setDisplayName(e.target.value),
                                                            className: "pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30",
                                                            required: !isLogin
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    className: "text-slate-400 text-xs font-medium",
                                                    children: "Username"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                                                            className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            type: "text",
                                                            placeholder: "Enter your username",
                                                            value: username,
                                                            onChange: (e)=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')),
                                                            className: "pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30",
                                                            required: true,
                                                            disabled: lockInfo?.locked || false
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    className: "text-slate-400 text-xs font-medium",
                                                    children: "Password"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                            className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            type: showPassword ? 'text' : 'password',
                                                            placeholder: "Enter your password",
                                                            value: password,
                                                            onChange: (e)=>setPassword(e.target.value),
                                                            className: "pl-11 pr-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30",
                                                            required: true,
                                                            disabled: lockInfo?.locked || false
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 172,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setShowPassword(!showPassword),
                                                            className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors",
                                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/auth-form.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 37
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/auth-form.tsx",
                                                                lineNumber: 175,
                                                                columnNumber: 70
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/auth-form.tsx",
                                                            lineNumber: 174,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/auth-form.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: loading || lockInfo?.locked || false,
                                            className: "w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50",
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/auth-form.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 21
                                                    }, this),
                                                    isLogin ? 'Signing in...' : 'Creating account...'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/auth-form.tsx",
                                                lineNumber: 183,
                                                columnNumber: 19
                                            }, this) : isLogin ? 'Sign In' : 'Create Account'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center pt-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setView(isLogin ? 'register' : 'login');
                                            setError('');
                                            setLockInfo(null);
                                        },
                                        className: "text-sm text-slate-400 hover:text-emerald-400 transition-colors",
                                        children: isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/auth-form.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 justify-center pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "h-3.5 w-3.5 text-slate-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-slate-600",
                                            children: "Account locks after 3 failed attempts (1min, 2min, 3min...)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/auth-form.tsx",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/auth-form.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/auth-form.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/auth-form.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/auth-form.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/auth-form.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_s(AuthForm, "VMuDEs+DP9XLx/79mA47sotsT0M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = AuthForm;
var _c;
__turbopack_context__.k.register(_c, "AuthForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/emoji-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmojiPicker",
    ()=>EmojiPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EMOJI_DATA = [
    // Smileys
    {
        emoji: '😀',
        keywords: [
            'grinning',
            'happy',
            'smile'
        ]
    },
    {
        emoji: '😃',
        keywords: [
            'smiley',
            'happy',
            'big smile'
        ]
    },
    {
        emoji: '😄',
        keywords: [
            'smile',
            'happy',
            'laugh'
        ]
    },
    {
        emoji: '😁',
        keywords: [
            'grin',
            'happy',
            'teeth'
        ]
    },
    {
        emoji: '😆',
        keywords: [
            'laugh',
            'happy',
            'squint'
        ]
    },
    {
        emoji: '😅',
        keywords: [
            'sweat',
            'nervous',
            'laugh'
        ]
    },
    {
        emoji: '🤣',
        keywords: [
            'rofl',
            'laugh',
            'rolling'
        ]
    },
    {
        emoji: '😂',
        keywords: [
            'joy',
            'laugh',
            'tears',
            'crying'
        ]
    },
    {
        emoji: '🙂',
        keywords: [
            'slight smile',
            'happy'
        ]
    },
    {
        emoji: '🙃',
        keywords: [
            'upside down',
            'silly'
        ]
    },
    {
        emoji: '😉',
        keywords: [
            'wink',
            'flirt'
        ]
    },
    {
        emoji: '😊',
        keywords: [
            'blush',
            'happy',
            'shy'
        ]
    },
    {
        emoji: '😇',
        keywords: [
            'angel',
            'innocent',
            'halo'
        ]
    },
    {
        emoji: '🥰',
        keywords: [
            'love',
            'hearts',
            'adorable'
        ]
    },
    {
        emoji: '😍',
        keywords: [
            'heart eyes',
            'love',
            'adore'
        ]
    },
    {
        emoji: '🤩',
        keywords: [
            'star',
            'excited',
            'amazing'
        ]
    },
    {
        emoji: '😘',
        keywords: [
            'kiss',
            'love'
        ]
    },
    {
        emoji: '😗',
        keywords: [
            'kiss'
        ]
    },
    {
        emoji: '😚',
        keywords: [
            'kiss',
            'blush'
        ]
    },
    {
        emoji: '😙',
        keywords: [
            'kiss',
            'smile'
        ]
    },
    {
        emoji: '🥲',
        keywords: [
            'smile',
            'tear',
            'sad happy'
        ]
    },
    {
        emoji: '😋',
        keywords: [
            'yum',
            'delicious',
            'tasty'
        ]
    },
    {
        emoji: '😛',
        keywords: [
            'tongue',
            'playful'
        ]
    },
    {
        emoji: '😜',
        keywords: [
            'wink',
            'tongue',
            'silly'
        ]
    },
    {
        emoji: '🤪',
        keywords: [
            'crazy',
            'zany',
            'wild'
        ]
    },
    {
        emoji: '😝',
        keywords: [
            'tongue',
            'squint'
        ]
    },
    {
        emoji: '🤑',
        keywords: [
            'money',
            'rich'
        ]
    },
    {
        emoji: '🤗',
        keywords: [
            'hug',
            'embrace'
        ]
    },
    {
        emoji: '🤭',
        keywords: [
            'giggle',
            'cover mouth'
        ]
    },
    {
        emoji: '🤫',
        keywords: [
            'quiet',
            'shush',
            'silence'
        ]
    },
    {
        emoji: '🤔',
        keywords: [
            'thinking',
            'hmm',
            'wonder'
        ]
    },
    {
        emoji: '🫡',
        keywords: [
            'salute',
            'respect'
        ]
    },
    {
        emoji: '🤐',
        keywords: [
            'zip',
            'quiet',
            'mute'
        ]
    },
    {
        emoji: '🤨',
        keywords: [
            'skeptical',
            'raised eyebrow'
        ]
    },
    {
        emoji: '😐',
        keywords: [
            'neutral',
            'meh'
        ]
    },
    {
        emoji: '😑',
        keywords: [
            'expressionless',
            'blank'
        ]
    },
    {
        emoji: '😶',
        keywords: [
            'silent',
            'no mouth'
        ]
    },
    {
        emoji: '🫥',
        keywords: [
            'dotted',
            'invisible'
        ]
    },
    {
        emoji: '😏',
        keywords: [
            'smirk',
            'sly'
        ]
    },
    {
        emoji: '😒',
        keywords: [
            'unamused',
            'annoyed'
        ]
    },
    {
        emoji: '🙄',
        keywords: [
            'eye roll',
            'annoyed'
        ]
    },
    {
        emoji: '😬',
        keywords: [
            'grimace',
            'awkward'
        ]
    },
    {
        emoji: '🤥',
        keywords: [
            'liar',
            'pinocchio'
        ]
    },
    {
        emoji: '😌',
        keywords: [
            'relieved',
            'peaceful'
        ]
    },
    {
        emoji: '😔',
        keywords: [
            'pensive',
            'sad'
        ]
    },
    {
        emoji: '😪',
        keywords: [
            'sleepy',
            'tired'
        ]
    },
    {
        emoji: '🤤',
        keywords: [
            'drool',
            'delicious'
        ]
    },
    {
        emoji: '😴',
        keywords: [
            'sleep',
            'zzz'
        ]
    },
    {
        emoji: '😷',
        keywords: [
            'mask',
            'sick',
            'covid'
        ]
    },
    {
        emoji: '🤒',
        keywords: [
            'sick',
            'fever',
            'thermometer'
        ]
    },
    {
        emoji: '🤕',
        keywords: [
            'hurt',
            'bandage',
            'injury'
        ]
    },
    {
        emoji: '🤢',
        keywords: [
            'nauseated',
            'sick',
            'gross'
        ]
    },
    {
        emoji: '🤮',
        keywords: [
            'vomit',
            'sick',
            'gross'
        ]
    },
    {
        emoji: '🥵',
        keywords: [
            'hot',
            'heat',
            'dying'
        ]
    },
    {
        emoji: '🥶',
        keywords: [
            'cold',
            'freezing'
        ]
    },
    {
        emoji: '🥴',
        keywords: [
            'drunk',
            'dizzy',
            'woozy'
        ]
    },
    {
        emoji: '😵',
        keywords: [
            'dizzy',
            'dead'
        ]
    },
    {
        emoji: '🤯',
        keywords: [
            'mind blown',
            'exploding',
            'shocked'
        ]
    },
    {
        emoji: '🤠',
        keywords: [
            'cowboy',
            'yeehaw'
        ]
    },
    {
        emoji: '🥳',
        keywords: [
            'party',
            'celebrate',
            'birthday'
        ]
    },
    {
        emoji: '🥸',
        keywords: [
            'disguise',
            'incognito'
        ]
    },
    {
        emoji: '😎',
        keywords: [
            'cool',
            'sunglasses',
            'swagger'
        ]
    },
    {
        emoji: '🤓',
        keywords: [
            'nerd',
            'glasses',
            'smart'
        ]
    },
    {
        emoji: '🧐',
        keywords: [
            'monocle',
            'inspect',
            'curious'
        ]
    },
    // Hearts
    {
        emoji: '❤️',
        keywords: [
            'red heart',
            'love'
        ]
    },
    {
        emoji: '🧡',
        keywords: [
            'orange heart',
            'love'
        ]
    },
    {
        emoji: '💛',
        keywords: [
            'yellow heart',
            'love'
        ]
    },
    {
        emoji: '💚',
        keywords: [
            'green heart',
            'love'
        ]
    },
    {
        emoji: '💙',
        keywords: [
            'blue heart',
            'love'
        ]
    },
    {
        emoji: '💜',
        keywords: [
            'purple heart',
            'love'
        ]
    },
    {
        emoji: '🖤',
        keywords: [
            'black heart',
            'love',
            'dark'
        ]
    },
    {
        emoji: '🤍',
        keywords: [
            'white heart',
            'love',
            'pure'
        ]
    },
    {
        emoji: '🤎',
        keywords: [
            'brown heart',
            'love'
        ]
    },
    {
        emoji: '💔',
        keywords: [
            'broken heart',
            'sad',
            'heartbreak'
        ]
    },
    {
        emoji: '❤️‍🔥',
        keywords: [
            'fire heart',
            'passion'
        ]
    },
    {
        emoji: '❤️‍🩹',
        keywords: [
            'mending heart',
            'healing'
        ]
    },
    {
        emoji: '❣️',
        keywords: [
            'exclamation heart'
        ]
    },
    {
        emoji: '💕',
        keywords: [
            'two hearts',
            'love'
        ]
    },
    {
        emoji: '💞',
        keywords: [
            'revolving hearts',
            'love'
        ]
    },
    {
        emoji: '💓',
        keywords: [
            'beating heart',
            'love'
        ]
    },
    {
        emoji: '💗',
        keywords: [
            'growing heart',
            'love'
        ]
    },
    {
        emoji: '💖',
        keywords: [
            'sparkling heart',
            'love'
        ]
    },
    {
        emoji: '💘',
        keywords: [
            'cupid heart',
            'love'
        ]
    },
    {
        emoji: '💝',
        keywords: [
            'gift heart',
            'love'
        ]
    },
    {
        emoji: '💟',
        keywords: [
            'decoration heart',
            'love'
        ]
    },
    // Gestures
    {
        emoji: '👋',
        keywords: [
            'wave',
            'hello',
            'bye',
            'hi'
        ]
    },
    {
        emoji: '🤚',
        keywords: [
            'raised back hand',
            'stop'
        ]
    },
    {
        emoji: '🖐️',
        keywords: [
            'hand',
            'five',
            'splayed'
        ]
    },
    {
        emoji: '✋',
        keywords: [
            'hand',
            'stop',
            'high five'
        ]
    },
    {
        emoji: '🖖',
        keywords: [
            'spock',
            'vulcan',
            'star trek'
        ]
    },
    {
        emoji: '👌',
        keywords: [
            'ok',
            'perfect',
            'great'
        ]
    },
    {
        emoji: '🤌',
        keywords: [
            'pinched',
            'italian'
        ]
    },
    {
        emoji: '🤏',
        keywords: [
            'small',
            'pinching',
            'tiny'
        ]
    },
    {
        emoji: '✌️',
        keywords: [
            'peace',
            'victory',
            'two'
        ]
    },
    {
        emoji: '🤞',
        keywords: [
            'crossed fingers',
            'luck',
            'hope'
        ]
    },
    {
        emoji: '🫰',
        keywords: [
            'snapping',
            'love'
        ]
    },
    {
        emoji: '🤟',
        keywords: [
            'love you',
            'rock'
        ]
    },
    {
        emoji: '🤘',
        keywords: [
            'rock',
            'metal',
            'horns'
        ]
    },
    {
        emoji: '🤙',
        keywords: [
            'call me',
            'shaka',
            'hang loose'
        ]
    },
    {
        emoji: '👈',
        keywords: [
            'point left',
            'this'
        ]
    },
    {
        emoji: '👉',
        keywords: [
            'point right',
            'that'
        ]
    },
    {
        emoji: '👆',
        keywords: [
            'point up',
            'above'
        ]
    },
    {
        emoji: '🖕',
        keywords: [
            'middle finger',
            'rage'
        ]
    },
    {
        emoji: '👇',
        keywords: [
            'point down',
            'below'
        ]
    },
    {
        emoji: '☝️',
        keywords: [
            'point up',
            'one',
            'first'
        ]
    },
    {
        emoji: '🫵',
        keywords: [
            'point at you'
        ]
    },
    {
        emoji: '👍',
        keywords: [
            'thumbs up',
            'like',
            'good',
            'yes',
            'approve'
        ]
    },
    {
        emoji: '👎',
        keywords: [
            'thumbs down',
            'dislike',
            'bad',
            'no'
        ]
    },
    {
        emoji: '✊',
        keywords: [
            'fist',
            'power',
            'solidarity'
        ]
    },
    {
        emoji: '👊',
        keywords: [
            'punch',
            'fist bump'
        ]
    },
    {
        emoji: '🤛',
        keywords: [
            'left fist',
            'bump'
        ]
    },
    {
        emoji: '🤜',
        keywords: [
            'right fist',
            'bump'
        ]
    },
    {
        emoji: '👏',
        keywords: [
            'clap',
            'applause',
            'bravo'
        ]
    },
    {
        emoji: '🙌',
        keywords: [
            'raising hands',
            'celebration',
            'yay'
        ]
    },
    {
        emoji: '🫶',
        keywords: [
            'heart hands',
            'love'
        ]
    },
    {
        emoji: '👐',
        keywords: [
            'open hands',
            'hug'
        ]
    },
    {
        emoji: '🤲',
        keywords: [
            'palms up',
            'prayer',
            'receive'
        ]
    },
    {
        emoji: '🤝',
        keywords: [
            'handshake',
            'deal',
            'agreement'
        ]
    },
    {
        emoji: '🙏',
        keywords: [
            'pray',
            'please',
            'thanks',
            'namaste'
        ]
    },
    // Objects
    {
        emoji: '🎉',
        keywords: [
            'party',
            'celebrate',
            'congrats'
        ]
    },
    {
        emoji: '🎊',
        keywords: [
            'confetti',
            'celebrate'
        ]
    },
    {
        emoji: '🎈',
        keywords: [
            'balloon',
            'party',
            'birthday'
        ]
    },
    {
        emoji: '🎁',
        keywords: [
            'gift',
            'present',
            'birthday'
        ]
    },
    {
        emoji: '🎀',
        keywords: [
            'ribbon',
            'bow',
            'cute'
        ]
    },
    {
        emoji: '🎆',
        keywords: [
            'fireworks',
            'celebrate',
            'new year'
        ]
    },
    {
        emoji: '🎇',
        keywords: [
            'sparkler',
            'firework'
        ]
    },
    {
        emoji: '🧨',
        keywords: [
            'firecracker',
            'boom',
            'dynamite'
        ]
    },
    {
        emoji: '✨',
        keywords: [
            'sparkles',
            'magic',
            'shine',
            'new'
        ]
    },
    {
        emoji: '💫',
        keywords: [
            'dizzy',
            'star',
            'shooting'
        ]
    },
    {
        emoji: '🌟',
        keywords: [
            'glowing star',
            'awesome'
        ]
    },
    {
        emoji: '⭐',
        keywords: [
            'star',
            'favorite',
            'rating'
        ]
    },
    {
        emoji: '🔥',
        keywords: [
            'fire',
            'hot',
            'lit',
            'trendy'
        ]
    },
    {
        emoji: '💥',
        keywords: [
            'boom',
            'collision',
            'impact'
        ]
    },
    {
        emoji: '🎵',
        keywords: [
            'music',
            'note',
            'song'
        ]
    },
    {
        emoji: '🎶',
        keywords: [
            'music',
            'notes',
            'singing'
        ]
    },
    {
        emoji: '🎸',
        keywords: [
            'guitar',
            'rock',
            'music'
        ]
    },
    {
        emoji: '🎹',
        keywords: [
            'piano',
            'keyboard',
            'music'
        ]
    },
    {
        emoji: '🎤',
        keywords: [
            'microphone',
            'sing',
            'karaoke'
        ]
    },
    {
        emoji: '🏆',
        keywords: [
            'trophy',
            'win',
            'champion'
        ]
    },
    {
        emoji: '🥇',
        keywords: [
            'gold medal',
            'first',
            'winner'
        ]
    },
    {
        emoji: '🎯',
        keywords: [
            'target',
            'bullseye',
            'goal'
        ]
    },
    {
        emoji: '🎮',
        keywords: [
            'game',
            'controller',
            'gaming'
        ]
    },
    {
        emoji: '🎲',
        keywords: [
            'dice',
            'random',
            'luck'
        ]
    },
    {
        emoji: '🧩',
        keywords: [
            'puzzle',
            'piece'
        ]
    },
    {
        emoji: '💎',
        keywords: [
            'gem',
            'diamond',
            'jewel'
        ]
    },
    {
        emoji: '💰',
        keywords: [
            'money',
            'rich',
            'dollar'
        ]
    },
    {
        emoji: '📱',
        keywords: [
            'phone',
            'mobile',
            'call'
        ]
    },
    {
        emoji: '💻',
        keywords: [
            'computer',
            'laptop',
            'code'
        ]
    },
    {
        emoji: '📸',
        keywords: [
            'camera',
            'photo',
            'picture'
        ]
    },
    {
        emoji: '🎬',
        keywords: [
            'movie',
            'film',
            'clapper'
        ]
    },
    {
        emoji: '📚',
        keywords: [
            'books',
            'study',
            'read'
        ]
    },
    {
        emoji: '✏️',
        keywords: [
            'pencil',
            'write',
            'edit'
        ]
    },
    {
        emoji: '📝',
        keywords: [
            'memo',
            'write',
            'note'
        ]
    },
    {
        emoji: '📌',
        keywords: [
            'pin',
            'mark',
            'important'
        ]
    },
    // Animals
    {
        emoji: '🐶',
        keywords: [
            'dog',
            'puppy',
            'pet'
        ]
    },
    {
        emoji: '🐱',
        keywords: [
            'cat',
            'kitten',
            'pet'
        ]
    },
    {
        emoji: '🐭',
        keywords: [
            'mouse',
            'rat'
        ]
    },
    {
        emoji: '🐹',
        keywords: [
            'hamster',
            'pet'
        ]
    },
    {
        emoji: '🐰',
        keywords: [
            'rabbit',
            'bunny',
            'pet'
        ]
    },
    {
        emoji: '🦊',
        keywords: [
            'fox',
            'clever'
        ]
    },
    {
        emoji: '🐻',
        keywords: [
            'bear',
            'teddy'
        ]
    },
    {
        emoji: '🐼',
        keywords: [
            'panda',
            'cute'
        ]
    },
    {
        emoji: '🐻‍❄️',
        keywords: [
            'polar bear',
            'arctic'
        ]
    },
    {
        emoji: '🐨',
        keywords: [
            'koala',
            'cute',
            'australia'
        ]
    },
    {
        emoji: '🐯',
        keywords: [
            'tiger',
            'wild'
        ]
    },
    {
        emoji: '🦁',
        keywords: [
            'lion',
            'king',
            'roar'
        ]
    },
    {
        emoji: '🐮',
        keywords: [
            'cow',
            'moo'
        ]
    },
    {
        emoji: '🐷',
        keywords: [
            'pig',
            'oink'
        ]
    },
    {
        emoji: '🐸',
        keywords: [
            'frog',
            'ribbit'
        ]
    },
    {
        emoji: '🐵',
        keywords: [
            'monkey',
            'ape'
        ]
    },
    {
        emoji: '🙈',
        keywords: [
            'see no evil',
            'monkey',
            'shy'
        ]
    },
    {
        emoji: '🙉',
        keywords: [
            'hear no evil',
            'monkey'
        ]
    },
    {
        emoji: '🙊',
        keywords: [
            'speak no evil',
            'monkey',
            'quiet'
        ]
    },
    {
        emoji: '🐒',
        keywords: [
            'monkey'
        ]
    },
    {
        emoji: '🐔',
        keywords: [
            'chicken',
            'hen'
        ]
    },
    {
        emoji: '🐧',
        keywords: [
            'penguin',
            'cute'
        ]
    },
    {
        emoji: '🐦',
        keywords: [
            'bird'
        ]
    },
    {
        emoji: '🐤',
        keywords: [
            'baby chick',
            'cute'
        ]
    },
    {
        emoji: '🦆',
        keywords: [
            'duck',
            'quack'
        ]
    },
    {
        emoji: '🦅',
        keywords: [
            'eagle',
            'soar'
        ]
    },
    {
        emoji: '🦉',
        keywords: [
            'owl',
            'wise',
            'night'
        ]
    },
    {
        emoji: '🦇',
        keywords: [
            'bat',
            'vampire',
            'night'
        ]
    },
    {
        emoji: '🐺',
        keywords: [
            'wolf',
            'howl'
        ]
    },
    {
        emoji: '🐗',
        keywords: [
            'boar',
            'wild pig'
        ]
    },
    {
        emoji: '🐴',
        keywords: [
            'horse',
            'gallop'
        ]
    },
    {
        emoji: '🦄',
        keywords: [
            'unicorn',
            'magic',
            'rainbow'
        ]
    },
    {
        emoji: '🐝',
        keywords: [
            'bee',
            'honey',
            'buzz'
        ]
    },
    {
        emoji: '🪱',
        keywords: [
            'worm'
        ]
    },
    {
        emoji: '🐛',
        keywords: [
            'bug',
            'caterpillar'
        ]
    },
    {
        emoji: '🦋',
        keywords: [
            'butterfly',
            'beautiful'
        ]
    },
    {
        emoji: '🐌',
        keywords: [
            'snail',
            'slow'
        ]
    },
    {
        emoji: '🐞',
        keywords: [
            'ladybug',
            'lucky'
        ]
    },
    {
        emoji: '🐜',
        keywords: [
            'ant',
            'tiny'
        ]
    },
    {
        emoji: '🪰',
        keywords: [
            'fly'
        ]
    },
    {
        emoji: '🪲',
        keywords: [
            'beetle'
        ]
    },
    {
        emoji: '🪳',
        keywords: [
            'cockroach'
        ]
    },
    {
        emoji: '🦟',
        keywords: [
            'mosquito',
            'bite'
        ]
    },
    {
        emoji: '🦗',
        keywords: [
            'cricket'
        ]
    },
    {
        emoji: '🕷️',
        keywords: [
            'spider',
            'web'
        ]
    },
    {
        emoji: '🦂',
        keywords: [
            'scorpion'
        ]
    },
    {
        emoji: '🐢',
        keywords: [
            'turtle',
            'slow'
        ]
    },
    {
        emoji: '🐍',
        keywords: [
            'snake',
            'hiss'
        ]
    },
    {
        emoji: '🦎',
        keywords: [
            'lizard'
        ]
    },
    {
        emoji: '🦖',
        keywords: [
            'dinosaur',
            'trex'
        ]
    },
    {
        emoji: '🦕',
        keywords: [
            'dinosaur',
            'brontosaurus'
        ]
    },
    // Food
    {
        emoji: '🍎',
        keywords: [
            'apple',
            'fruit',
            'red'
        ]
    },
    {
        emoji: '🍊',
        keywords: [
            'orange',
            'fruit',
            'citrus'
        ]
    },
    {
        emoji: '🍋',
        keywords: [
            'lemon',
            'sour',
            'fruit'
        ]
    },
    {
        emoji: '🍌',
        keywords: [
            'banana',
            'fruit',
            'yellow'
        ]
    },
    {
        emoji: '🍉',
        keywords: [
            'watermelon',
            'fruit',
            'summer'
        ]
    },
    {
        emoji: '🍇',
        keywords: [
            'grapes',
            'fruit',
            'wine'
        ]
    },
    {
        emoji: '🍓',
        keywords: [
            'strawberry',
            'fruit',
            'sweet'
        ]
    },
    {
        emoji: '🫐',
        keywords: [
            'blueberry',
            'fruit'
        ]
    },
    {
        emoji: '🍈',
        keywords: [
            'melon',
            'fruit'
        ]
    },
    {
        emoji: '🍒',
        keywords: [
            'cherry',
            'fruit',
            'sweet'
        ]
    },
    {
        emoji: '🍑',
        keywords: [
            'peach',
            'fruit'
        ]
    },
    {
        emoji: '🥭',
        keywords: [
            'mango',
            'fruit',
            'tropical'
        ]
    },
    {
        emoji: '🍍',
        keywords: [
            'pineapple',
            'fruit',
            'tropical'
        ]
    },
    {
        emoji: '🥥',
        keywords: [
            'coconut',
            'tropical'
        ]
    },
    {
        emoji: '🥝',
        keywords: [
            'kiwi',
            'fruit'
        ]
    },
    {
        emoji: '🍅',
        keywords: [
            'tomato',
            'vegetable'
        ]
    },
    {
        emoji: '🍆',
        keywords: [
            'eggplant',
            'vegetable'
        ]
    },
    {
        emoji: '🥑',
        keywords: [
            'avocado',
            'healthy'
        ]
    },
    {
        emoji: '🥦',
        keywords: [
            'broccoli',
            'vegetable',
            'healthy'
        ]
    },
    {
        emoji: '🌶️',
        keywords: [
            'pepper',
            'hot',
            'spicy'
        ]
    },
    {
        emoji: '🌽',
        keywords: [
            'corn',
            'vegetable'
        ]
    },
    {
        emoji: '🥕',
        keywords: [
            'carrot',
            'vegetable'
        ]
    },
    {
        emoji: '🥐',
        keywords: [
            'croissant',
            'bread',
            'french'
        ]
    },
    {
        emoji: '🥖',
        keywords: [
            'baguette',
            'bread',
            'french'
        ]
    },
    {
        emoji: '🍞',
        keywords: [
            'bread',
            'toast'
        ]
    },
    {
        emoji: '🧀',
        keywords: [
            'cheese',
            'cheddar'
        ]
    },
    {
        emoji: '🍖',
        keywords: [
            'meat',
            'bone'
        ]
    },
    {
        emoji: '🍗',
        keywords: [
            'chicken',
            'drumstick'
        ]
    },
    {
        emoji: '🥩',
        keywords: [
            'steak',
            'meat'
        ]
    },
    {
        emoji: '🥓',
        keywords: [
            'bacon',
            'meat'
        ]
    },
    {
        emoji: '🍔',
        keywords: [
            'burger',
            'hamburger',
            'fast food'
        ]
    },
    {
        emoji: '🍟',
        keywords: [
            'fries',
            'french fries',
            'fast food'
        ]
    },
    {
        emoji: '🍕',
        keywords: [
            'pizza',
            'food',
            'italian'
        ]
    },
    {
        emoji: '🌭',
        keywords: [
            'hotdog',
            'sausage'
        ]
    },
    {
        emoji: '🥪',
        keywords: [
            'sandwich'
        ]
    },
    {
        emoji: '🌮',
        keywords: [
            'taco',
            'mexican'
        ]
    },
    {
        emoji: '🌯',
        keywords: [
            'burrito',
            'mexican'
        ]
    },
    {
        emoji: '🥙',
        keywords: [
            'pita',
            'kebab'
        ]
    },
    {
        emoji: '🧆',
        keywords: [
            'falafel'
        ]
    },
    {
        emoji: '🥚',
        keywords: [
            'egg'
        ]
    },
    {
        emoji: '🍳',
        keywords: [
            'cooking',
            'fried egg',
            'breakfast'
        ]
    },
    {
        emoji: '🥘',
        keywords: [
            'stew',
            'cooking'
        ]
    },
    {
        emoji: '🍲',
        keywords: [
            'soup',
            'pot'
        ]
    },
    {
        emoji: '🥣',
        keywords: [
            'bowl',
            'cereal',
            'soup'
        ]
    },
    {
        emoji: '🥗',
        keywords: [
            'salad',
            'healthy'
        ]
    },
    {
        emoji: '🍿',
        keywords: [
            'popcorn',
            'movie'
        ]
    },
    // Travel & Places
    {
        emoji: '🚗',
        keywords: [
            'car',
            'drive'
        ]
    },
    {
        emoji: '🚕',
        keywords: [
            'taxi',
            'cab'
        ]
    },
    {
        emoji: '🚌',
        keywords: [
            'bus'
        ]
    },
    {
        emoji: '🚀',
        keywords: [
            'rocket',
            'launch',
            'space'
        ]
    },
    {
        emoji: '✈️',
        keywords: [
            'airplane',
            'fly',
            'travel'
        ]
    },
    {
        emoji: '🚢',
        keywords: [
            'ship',
            'cruise'
        ]
    },
    {
        emoji: '🏠',
        keywords: [
            'house',
            'home'
        ]
    },
    {
        emoji: '🏢',
        keywords: [
            'office',
            'building'
        ]
    },
    {
        emoji: '🌍',
        keywords: [
            'earth',
            'world',
            'globe'
        ]
    },
    {
        emoji: '🌙',
        keywords: [
            'moon',
            'night',
            'crescent'
        ]
    },
    {
        emoji: '⭐',
        keywords: [
            'star'
        ]
    },
    {
        emoji: '☀️',
        keywords: [
            'sun',
            'sunny',
            'day'
        ]
    },
    {
        emoji: '⛅',
        keywords: [
            'cloud',
            'partly sunny'
        ]
    },
    {
        emoji: '🌧️',
        keywords: [
            'rain',
            'cloud'
        ]
    },
    {
        emoji: '❄️',
        keywords: [
            'snow',
            'cold',
            'winter'
        ]
    },
    {
        emoji: '⚡',
        keywords: [
            'lightning',
            'bolt',
            'electric'
        ]
    },
    {
        emoji: '🌈',
        keywords: [
            'rainbow',
            'colorful',
            'pride'
        ]
    },
    // Symbols
    {
        emoji: '💯',
        keywords: [
            'hundred',
            'perfect',
            '100'
        ]
    },
    {
        emoji: '💢',
        keywords: [
            'anger',
            'mad'
        ]
    },
    {
        emoji: '💥',
        keywords: [
            'boom',
            'crash'
        ]
    },
    {
        emoji: '💫',
        keywords: [
            'dizzy',
            'star'
        ]
    },
    {
        emoji: '💬',
        keywords: [
            'speech',
            'chat',
            'talk'
        ]
    },
    {
        emoji: '💭',
        keywords: [
            'thought',
            'think'
        ]
    },
    {
        emoji: '🕳️',
        keywords: [
            'hole',
            'abyss'
        ]
    },
    {
        emoji: '💤',
        keywords: [
            'sleep',
            'zzz'
        ]
    },
    {
        emoji: '⚠️',
        keywords: [
            'warning',
            'alert',
            'caution'
        ]
    },
    {
        emoji: '🚫',
        keywords: [
            'forbidden',
            'no',
            'blocked'
        ]
    },
    {
        emoji: '✅',
        keywords: [
            'check',
            'done',
            'yes',
            'complete'
        ]
    },
    {
        emoji: '❌',
        keywords: [
            'cross',
            'no',
            'wrong',
            'cancel'
        ]
    },
    {
        emoji: '❓',
        keywords: [
            'question',
            'what'
        ]
    },
    {
        emoji: '❗',
        keywords: [
            'exclamation',
            'important',
            'wow'
        ]
    },
    {
        emoji: '🔴',
        keywords: [
            'red',
            'circle'
        ]
    },
    {
        emoji: '🟢',
        keywords: [
            'green',
            'circle'
        ]
    },
    {
        emoji: '🔵',
        keywords: [
            'blue',
            'circle'
        ]
    },
    {
        emoji: '⬛',
        keywords: [
            'black',
            'square'
        ]
    },
    {
        emoji: '⬜',
        keywords: [
            'white',
            'square'
        ]
    }
];
const EMOJI_CATEGORIES = {
    'Smileys': {
        icon: '😊',
        emojis: [
            '😀',
            '😃',
            '😄',
            '😁',
            '😆',
            '😅',
            '🤣',
            '😂',
            '🙂',
            '🙃',
            '😉',
            '😊',
            '😇',
            '🥰',
            '😍',
            '🤩',
            '😘',
            '😗',
            '😚',
            '😙',
            '🥲',
            '😋',
            '😛',
            '😜',
            '🤪',
            '😝',
            '🤑',
            '🤗',
            '🤭',
            '🤫',
            '🤔',
            '🫡',
            '🤐',
            '🤨',
            '😐',
            '😑',
            '😶',
            '🫥',
            '😏',
            '😒',
            '🙄',
            '😬',
            '🤥',
            '😌',
            '😔',
            '😪',
            '🤤',
            '😴',
            '😷',
            '🤒',
            '🤕',
            '🤢',
            '🤮',
            '🥵',
            '🥶',
            '🥴',
            '😵',
            '🤯',
            '🤠',
            '🥳',
            '🥸',
            '😎',
            '🤓',
            '🧐'
        ]
    },
    'Hearts': {
        icon: '❤️',
        emojis: [
            '❤️',
            '🧡',
            '💛',
            '💚',
            '💙',
            '💜',
            '🖤',
            '🤍',
            '🤎',
            '💔',
            '❤️‍🔥',
            '❤️‍🩹',
            '❣️',
            '💕',
            '💞',
            '💓',
            '💗',
            '💖',
            '💘',
            '💝',
            '💟'
        ]
    },
    'Gestures': {
        icon: '👋',
        emojis: [
            '👋',
            '🤚',
            '🖐️',
            '✋',
            '🖖',
            '👌',
            '🤌',
            '🤏',
            '✌️',
            '🤞',
            '🫰',
            '🤟',
            '🤘',
            '🤙',
            '👈',
            '👉',
            '👆',
            '🖕',
            '👇',
            '☝️',
            '🫵',
            '👍',
            '👎',
            '✊',
            '👊',
            '🤛',
            '🤜',
            '👏',
            '🙌',
            '🫶',
            '👐',
            '🤲',
            '🤝',
            '🙏'
        ]
    },
    'Objects': {
        icon: '🎉',
        emojis: [
            '🎉',
            '🎊',
            '🎈',
            '🎁',
            '🎀',
            '🎆',
            '🎇',
            '🧨',
            '✨',
            '💫',
            '🌟',
            '⭐',
            '🔥',
            '💥',
            '🎵',
            '🎶',
            '🎸',
            '🎹',
            '🎤',
            '🏆',
            '🥇',
            '🎯',
            '🎮',
            '🎲',
            '🧩',
            '💎',
            '💰',
            '📱',
            '💻',
            '📸',
            '🎬',
            '📚',
            '✏️',
            '📝',
            '📌',
            '💯',
            '💬',
            '💭',
            '💤',
            '⚠️',
            '🚫',
            '✅',
            '❌',
            '❓',
            '❗'
        ]
    },
    'Animals': {
        icon: '🐱',
        emojis: [
            '🐶',
            '🐱',
            '🐭',
            '🐹',
            '🐰',
            '🦊',
            '🐻',
            '🐼',
            '🐻‍❄️',
            '🐨',
            '🐯',
            '🦁',
            '🐮',
            '🐷',
            '🐸',
            '🐵',
            '🙈',
            '🙉',
            '🙊',
            '🐒',
            '🐔',
            '🐧',
            '🐦',
            '🐤',
            '🦆',
            '🦅',
            '🦉',
            '🦇',
            '🐺',
            '🐗',
            '🐴',
            '🦄',
            '🐝',
            '🪱',
            '🐛',
            '🦋',
            '🐌',
            '🐞',
            '🐜',
            '🪰',
            '🪲',
            '🪳',
            '🦟',
            '🦗',
            '🕷️',
            '🦂',
            '🐢',
            '🐍',
            '🦎',
            '🦖',
            '🦕'
        ]
    },
    'Food': {
        icon: '🍕',
        emojis: [
            '🍎',
            '🍊',
            '🍋',
            '🍌',
            '🍉',
            '🍇',
            '🍓',
            '🫐',
            '🍈',
            '🍒',
            '🍑',
            '🥭',
            '🍍',
            '🥥',
            '🥝',
            '🍅',
            '🍆',
            '🥑',
            '🥦',
            '🌶️',
            '🌽',
            '🥕',
            '🥐',
            '🥖',
            '🍞',
            '🧀',
            '🍖',
            '🍗',
            '🥩',
            '🥓',
            '🍔',
            '🍟',
            '🍕',
            '🌭',
            '🥪',
            '🌮',
            '🌯',
            '🥙',
            '🧆',
            '🥚',
            '🍳',
            '🥘',
            '🍲',
            '🥣',
            '🥗',
            '🍿'
        ]
    },
    'Travel': {
        icon: '🌍',
        emojis: [
            '🚗',
            '🚕',
            '🚌',
            '🚀',
            '✈️',
            '🚢',
            '🏠',
            '🏢',
            '🌍',
            '🌙',
            '☀️',
            '⛅',
            '🌧️',
            '❄️',
            '⚡',
            '🌈'
        ]
    },
    'Symbols': {
        icon: '💬',
        emojis: [
            '🔴',
            '🟢',
            '🔵',
            '⬛',
            '⬜',
            '💯',
            '💢',
            '💥',
            '💫',
            '💬',
            '💭',
            '🕳️',
            '💤',
            '⚠️',
            '🚫',
            '✅',
            '❌',
            '❓',
            '❗'
        ]
    }
};
function EmojiPicker({ onSelect, onClose, isDark, anchorRect }) {
    _s();
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Object.keys(EMOJI_CATEGORIES)[0]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const pickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmojiPicker.useEffect": ()=>{
            const handleClick = {
                "EmojiPicker.useEffect.handleClick": (e)=>{
                    if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                        onClose();
                    }
                }
            }["EmojiPicker.useEffect.handleClick"];
            const handleEsc = {
                "EmojiPicker.useEffect.handleEsc": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["EmojiPicker.useEffect.handleEsc"];
            // Delay to avoid the same click that opened the picker
            const timer = setTimeout({
                "EmojiPicker.useEffect.timer": ()=>{
                    document.addEventListener('mousedown', handleClick);
                }
            }["EmojiPicker.useEffect.timer"], 0);
            document.addEventListener('keydown', handleEsc);
            return ({
                "EmojiPicker.useEffect": ()=>{
                    clearTimeout(timer);
                    document.removeEventListener('mousedown', handleClick);
                    document.removeEventListener('keydown', handleEsc);
                }
            })["EmojiPicker.useEffect"];
        }
    }["EmojiPicker.useEffect"], [
        onClose
    ]);
    const filteredEmojis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmojiPicker.useMemo[filteredEmojis]": ()=>{
            if (!search.trim()) return EMOJI_CATEGORIES[activeCategory]?.emojis || [];
            const q = search.toLowerCase().trim();
            return EMOJI_DATA.filter({
                "EmojiPicker.useMemo[filteredEmojis]": (e)=>e.keywords.some({
                        "EmojiPicker.useMemo[filteredEmojis]": (k)=>k.includes(q)
                    }["EmojiPicker.useMemo[filteredEmojis]"]) || e.emoji.includes(q)
            }["EmojiPicker.useMemo[filteredEmojis]"]).map({
                "EmojiPicker.useMemo[filteredEmojis]": (e)=>e.emoji
            }["EmojiPicker.useMemo[filteredEmojis]"]);
        }
    }["EmojiPicker.useMemo[filteredEmojis]"], [
        activeCategory,
        search
    ]);
    // Position the picker above the emoji button using fixed positioning
    const pickerStyle = anchorRect ? {
        position: 'fixed',
        bottom: window.innerHeight - anchorRect.top + 8,
        left: Math.max(8, Math.min(anchorRect.left - 40, window.innerWidth - 340))
    } : {
        position: 'fixed',
        bottom: 100,
        left: 20
    };
    const picker = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: pickerRef,
        style: pickerStyle,
        className: `w-[320px] rounded-2xl shadow-2xl border overflow-hidden z-[9999] ${isDark ? 'bg-[#1a1f2e]/98 backdrop-blur-xl border-white/10' : 'bg-white/98 backdrop-blur-xl border-slate-200'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-2.5 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    placeholder: "Search emoji...",
                    value: search,
                    onChange: (e)=>setSearch(e.target.value),
                    autoFocus: true,
                    className: `w-full h-8 text-sm rounded-xl px-3 outline-none ${isDark ? 'bg-white/5 text-white placeholder:text-slate-500' : 'bg-slate-100 text-slate-900 placeholder:text-slate-400'}`
                }, void 0, false, {
                    fileName: "[project]/src/components/emoji-picker.tsx",
                    lineNumber: 401,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/emoji-picker.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, this),
            !search.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex overflow-x-auto gap-0.5 px-2 py-1.5 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`,
                children: Object.entries(EMOJI_CATEGORIES).map(([cat, data])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setActiveCategory(cat);
                            setSearch('');
                        },
                        className: `shrink-0 px-2.5 py-1 text-base rounded-lg transition-all ${activeCategory === cat ? isDark ? 'bg-emerald-500/20 scale-110' : 'bg-emerald-100 scale-110' : isDark ? 'hover:bg-white/5 opacity-60 hover:opacity-100' : 'hover:bg-slate-100 opacity-60 hover:opacity-100'}`,
                        title: cat,
                        children: data.icon
                    }, cat, false, {
                        fileName: "[project]/src/components/emoji-picker.tsx",
                        lineNumber: 415,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/emoji-picker.tsx",
                lineNumber: 413,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[220px] overflow-y-auto p-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-8 gap-0.5",
                    children: [
                        filteredEmojis.map((emoji, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    onSelect(emoji);
                                },
                                className: `h-9 w-9 flex items-center justify-center text-xl rounded-lg transition-all active:scale-90 hover:scale-110 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`,
                                children: emoji
                            }, `${emoji}-${i}`, false, {
                                fileName: "[project]/src/components/emoji-picker.tsx",
                                lineNumber: 433,
                                columnNumber: 13
                            }, this)),
                        filteredEmojis.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `col-span-8 text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                            children: "No emojis found"
                        }, void 0, false, {
                            fileName: "[project]/src/components/emoji-picker.tsx",
                            lineNumber: 442,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/emoji-picker.tsx",
                    lineNumber: 431,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/emoji-picker.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            !search.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `px-3 py-1.5 border-t ${isDark ? 'border-white/8' : 'border-slate-100'}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`,
                    children: activeCategory
                }, void 0, false, {
                    fileName: "[project]/src/components/emoji-picker.tsx",
                    lineNumber: 452,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/emoji-picker.tsx",
                lineNumber: 451,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/emoji-picker.tsx",
        lineNumber: 394,
        columnNumber: 5
    }, this);
    // Use portal to render outside of any overflow:hidden containers
    if (typeof document !== 'undefined') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(picker, document.body);
    }
    return picker;
}
_s(EmojiPicker, "nbTFJu8+DJZRXe4FxOc4OfmdlUw=");
_c = EmojiPicker;
var _c;
__turbopack_context__.k.register(_c, "EmojiPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "span";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/chat-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatApp",
    ()=>ChatApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$emoji$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/emoji-picker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.js [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-client] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-x.js [app-client] (ecmascript) <export default as UserX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell-ring.js [app-client] (ecmascript) <export default as BellRing>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smile.js [app-client] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-client] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript) <export default as Trash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ban.js [app-client] (ecmascript) <export default as Ban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock-open.js [app-client] (ecmascript) <export default as Unlock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
const THEME_PRESETS = {
    emerald: {
        primary: 'bg-emerald-500',
        primaryRgb: '16,185,129',
        gradient: 'from-emerald-500 to-teal-400',
        glow: 'shadow-emerald-500/30',
        name: 'Emerald',
        hex: '#10b981'
    },
    ocean: {
        primary: 'bg-blue-500',
        primaryRgb: '59,130,246',
        gradient: 'from-blue-500 to-cyan-400',
        glow: 'shadow-blue-500/30',
        name: 'Ocean',
        hex: '#3b82f6'
    },
    sunset: {
        primary: 'bg-orange-500',
        primaryRgb: '249,115,22',
        gradient: 'from-orange-500 to-amber-400',
        glow: 'shadow-orange-500/30',
        name: 'Sunset',
        hex: '#f97316'
    },
    lavender: {
        primary: 'bg-violet-500',
        primaryRgb: '139,92,246',
        gradient: 'from-violet-500 to-purple-400',
        glow: 'shadow-violet-500/30',
        name: 'Lavender',
        hex: '#8b5cf6'
    },
    rose: {
        primary: 'bg-pink-500',
        primaryRgb: '236,72,153',
        gradient: 'from-pink-500 to-rose-400',
        glow: 'shadow-pink-500/30',
        name: 'Rose',
        hex: '#ec4899'
    },
    midnight: {
        primary: 'bg-indigo-500',
        primaryRgb: '99,102,241',
        gradient: 'from-indigo-500 to-blue-400',
        glow: 'shadow-indigo-500/30',
        name: 'Midnight',
        hex: '#6366f1'
    }
};
function TickIndicator({ status, color }) {
    if (status === 'sent') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "9",
        viewBox: "0 0 14 9",
        className: "inline-block ml-1 opacity-60",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M1 4.5L3.5 7L9 1",
            stroke: color,
            strokeWidth: "1.5",
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/chat-app.tsx",
            lineNumber: 43,
            columnNumber: 120
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 43,
        columnNumber: 33
    }, this);
    if (status === 'delivered') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "9",
        viewBox: "0 0 18 9",
        className: "inline-block ml-1 opacity-70",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 4.5L3.5 7L9 1",
                stroke: color,
                strokeWidth: "1.5",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 44,
                columnNumber: 125
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 4.5L7.5 7L13 1",
                stroke: color,
                strokeWidth: "1.5",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 44,
                columnNumber: 243
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 44,
        columnNumber: 38
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "9",
        viewBox: "0 0 18 9",
        className: "inline-block ml-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 4.5L3.5 7L9 1",
                stroke: color,
                strokeWidth: "1.5",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 45,
                columnNumber: 86
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 4.5L7.5 7L13 1",
                stroke: color,
                strokeWidth: "1.5",
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 45,
                columnNumber: 204
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
_c = TickIndicator;
function OnlineDot({ online, size = 'sm', isDark = true }) {
    if (!online) return null;
    const s = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    const border = size === 'sm' ? 'border-2' : 'border-[2.5px]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `absolute -bottom-0.5 -right-0.5 ${s} rounded-full ${border} ${isDark ? 'border-[#0c1220]' : 'border-white'} bg-emerald-500 shadow-lg shadow-emerald-500/50`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60"
        }, void 0, false, {
            fileName: "[project]/src/components/chat-app.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c1 = OnlineDot;
function Avatar({ avatar, name, avatarColor, size = 40 }) {
    const fontSize = Math.max(size * 0.45, 12);
    if (avatar?.startsWith('data:image')) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-full overflow-hidden",
            style: {
                width: size,
                height: size
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: avatar,
                alt: name,
                className: "w-full h-full object-cover"
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/chat-app.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this);
    }
    if (avatar?.startsWith('avatar_')) {
        const av = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BUILT_IN_AVATARS"].find((a)=>a.id === avatar);
        if (av) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-full overflow-hidden flex items-center justify-center",
                style: {
                    width: size,
                    height: size,
                    background: av.bg
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize
                    },
                    children: av.emoji
                }, void 0, false, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this);
        }
    }
    const initials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInitials"])(name);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0",
        style: {
            width: size,
            height: size,
            background: avatarColor,
            fontSize: fontSize * 0.85
        },
        children: initials
    }, void 0, false, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_c2 = Avatar;
function TypingDots() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-0.5 ml-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-1 h-1 bg-current rounded-full animate-bounce",
                style: {
                    animationDelay: '0ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-1 h-1 bg-current rounded-full animate-bounce",
                style: {
                    animationDelay: '150ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-1 h-1 bg-current rounded-full animate-bounce",
                style: {
                    animationDelay: '300ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_c3 = TypingDots;
function ChatApp() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    const { currentUser, chatRooms, setChatRooms, activeRoomId, setActiveRoomId, messages, setMessages, updateMessage, onlineUsers, setOnlineUsers, sidebarTab, setSidebarTab, showMobileChat, setShowMobileChat, searchQuery, setSearchQuery, theme, setTheme, allUsers, setAllUsers, typingUsers, setTypingUsers, sentRequests, receivedRequests, setSentRequests, setReceivedRequests, updateRequestStatus, removeRequestFromList, showEmojiPicker, setShowEmojiPicker, replyingTo, setReplyingTo, contextMenuMessage, setContextMenuMessage, chatSearchQuery, setChatSearchQuery, deleteConfirm, setDeleteConfirm, chatActionMenu, setChatActionMenu, clearDeleteConfirm, setClearDeleteConfirm, showPasswordChange, setShowPasswordChange, showAvatarPicker, setShowAvatarPicker, logout, blockedUsers, setBlockedUsers, starredUsers, setStarredUsers } = store;
    const [messageInput, setMessageInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showNewGroup, setShowNewGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userSearch, setUserSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [groupName, setGroupName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editingName, setEditingName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newDisplayName, setNewDisplayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sendingMessage, setSendingMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sendingRequest, setSendingRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [requestSuccess, setRequestSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [requestError, setRequestError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [acceptingRequest, setAcceptingRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingUsername, setEditingUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newUsername, setNewUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [usernameError, setUsernameError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [deletingMsg, setDeletingMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [clearingChat, setClearingChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPassword, setCurrentPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [passwordError, setPasswordError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [passwordSuccess, setPasswordSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [changingPassword, setChangingPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [blockingUser, setBlockingUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const messageEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const listenersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const emojiBtnRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const userSearchTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const searchInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chatSearchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [emojiAnchorRect, setEmojiAnchorRect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const preset = theme.preset;
    const tp = THEME_PRESETS[preset];
    const isDark = theme.mode === 'dark';
    const pendingReceivedCount = receivedRequests.filter((r)=>r.status === 'pending').length;
    // ---- LISTENERS ----
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (!currentUser || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"])()) return;
            const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupPresence"])(currentUser.uid);
            const u1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToPresence"])({
                "ChatApp.useEffect.u1": (users)=>{
                    setOnlineUsers(users);
                }
            }["ChatApp.useEffect.u1"]);
            const u2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToChatRooms"])(currentUser.uid, {
                "ChatApp.useEffect.u2": (rooms)=>setChatRooms(rooms)
            }["ChatApp.useEffect.u2"]);
            const u3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToSentRequests"])(currentUser.uid, setSentRequests);
            const u4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToReceivedRequests"])(currentUser.uid, setReceivedRequests);
            const u5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToBlockedUsers"])(currentUser.uid, setBlockedUsers);
            const u6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToStarredUsers"])(currentUser.uid, setStarredUsers);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllUsers"])(currentUser.uid).then(setAllUsers);
            listenersRef.current = [
                cleanup,
                u1,
                u2,
                u3,
                u4,
                u5,
                u6
            ];
            return ({
                "ChatApp.useEffect": ()=>{
                    listenersRef.current.forEach({
                        "ChatApp.useEffect": (fn)=>fn()
                    }["ChatApp.useEffect"]);
                }
            })["ChatApp.useEffect"];
        }
    }["ChatApp.useEffect"], [
        currentUser?.uid
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (!activeRoomId || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"])() || !currentUser) return;
            setShowEmojiPicker(false);
            const u1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToMessages"])(activeRoomId, currentUser.uid, {
                "ChatApp.useEffect.u1": (msgs)=>setMessages(activeRoomId, msgs)
            }["ChatApp.useEffect.u1"]);
            const u2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listenToTyping"])(activeRoomId, {
                "ChatApp.useEffect.u2": (u)=>setTypingUsers(activeRoomId, u.filter({
                        "ChatApp.useEffect.u2": (n)=>n !== currentUser?.displayName
                    }["ChatApp.useEffect.u2"]))
            }["ChatApp.useEffect.u2"]);
            return ({
                "ChatApp.useEffect": ()=>{
                    u1();
                    u2();
                }
            })["ChatApp.useEffect"];
        }
    }["ChatApp.useEffect"], [
        activeRoomId,
        currentUser?.uid
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }["ChatApp.useEffect"], [
        messages[activeRoomId || '']?.length
    ]);
    // Close chat action menu on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (!chatActionMenu) return;
            const handler = {
                "ChatApp.useEffect.handler": (e)=>{
                    const target = e.target;
                    if (!target.closest('[data-chat-menu]')) setChatActionMenu(false);
                }
            }["ChatApp.useEffect.handler"];
            document.addEventListener('click', handler);
            return ({
                "ChatApp.useEffect": ()=>document.removeEventListener('click', handler)
            })["ChatApp.useEffect"];
        }
    }["ChatApp.useEffect"], [
        chatActionMenu
    ]);
    // Close sidebar search on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (!searchQuery) return;
            const handler = {
                "ChatApp.useEffect.handler": (e)=>{
                    const target = e.target;
                    if (!target.closest('[data-sidebar-search]')) {
                        setSearchQuery('');
                    }
                }
            }["ChatApp.useEffect.handler"];
            document.addEventListener('mousedown', handler);
            return ({
                "ChatApp.useEffect": ()=>document.removeEventListener('mousedown', handler)
            })["ChatApp.useEffect"];
        }
    }["ChatApp.useEffect"], [
        searchQuery
    ]);
    // Close chat search on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatApp.useEffect": ()=>{
            if (!chatSearchQuery || chatSearchQuery === ' ') return;
            const handler = {
                "ChatApp.useEffect.handler": (e)=>{
                    const target = e.target;
                    if (!target.closest('[data-chat-search]')) {
                        setChatSearchQuery('');
                    }
                }
            }["ChatApp.useEffect.handler"];
            document.addEventListener('mousedown', handler);
            return ({
                "ChatApp.useEffect": ()=>document.removeEventListener('mousedown', handler)
            })["ChatApp.useEffect"];
        }
    }["ChatApp.useEffect"], [
        chatSearchQuery
    ]);
    // ---- HANDLERS ----
    const handleSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleSend]": async ()=>{
            if (!messageInput.trim() || !activeRoomId || !currentUser || sendingMessage) return;
            setSendingMessage(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendMessage"])(activeRoomId, messageInput.trim(), currentUser.uid, currentUser.displayName, currentUser.avatar, currentUser.avatarColor, 'text', replyingTo?.id || null, replyingTo?.content || null, replyingTo?.senderName || null);
                setMessageInput('');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTyping"])(activeRoomId, currentUser.uid, currentUser.displayName, false);
                setReplyingTo(null);
            } catch (err) {
                console.error(err);
            } finally{
                setSendingMessage(false);
            }
        }
    }["ChatApp.useCallback[handleSend]"], [
        messageInput,
        activeRoomId,
        currentUser,
        sendingMessage,
        replyingTo
    ]);
    const handleTyping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleTyping]": (v)=>{
            setMessageInput(v);
            if (!activeRoomId || !currentUser) return;
            if (v.trim()) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTyping"])(activeRoomId, currentUser.uid, currentUser.displayName, true);
            else (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTyping"])(activeRoomId, currentUser.uid, currentUser.displayName, false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout({
                "ChatApp.useCallback[handleTyping]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTyping"])(activeRoomId, currentUser.uid, currentUser.displayName, false)
            }["ChatApp.useCallback[handleTyping]"], 3000);
        }
    }["ChatApp.useCallback[handleTyping]"], [
        activeRoomId,
        currentUser
    ]);
    const handleSendRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleSendRequest]": async (toUser)=>{
            if (!currentUser) return;
            // Check if user is blocked
            if (blockedUsers.includes(toUser.uid)) {
                setRequestError('You have blocked this user. Unblock them first.');
                setTimeout({
                    "ChatApp.useCallback[handleSendRequest]": ()=>setRequestError('')
                }["ChatApp.useCallback[handleSendRequest]"], 3000);
                return;
            }
            setSendingRequest(toUser.uid);
            setRequestError('');
            setRequestSuccess('');
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendChatRequest"])(currentUser.uid, currentUser.username, currentUser.displayName, currentUser.avatar, currentUser.avatarColor, toUser.uid, toUser.username, toUser.displayName, toUser.avatar, toUser.avatarColor);
                if (result.type === 'restored') {
                    setRequestSuccess('Chat restored!');
                    setSidebarTab('chats');
                } else {
                    setRequestSuccess('Request sent!');
                }
                setTimeout({
                    "ChatApp.useCallback[handleSendRequest]": ()=>{
                        setRequestSuccess('');
                        setRequestError('');
                    }
                }["ChatApp.useCallback[handleSendRequest]"], 3000);
            } catch (err) {
                setRequestError(err.message);
                setTimeout({
                    "ChatApp.useCallback[handleSendRequest]": ()=>setRequestError('')
                }["ChatApp.useCallback[handleSendRequest]"], 5000);
            } finally{
                setSendingRequest(null);
            }
        }
    }["ChatApp.useCallback[handleSendRequest]"], [
        currentUser,
        blockedUsers
    ]);
    const handleAccept = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleAccept]": async (reqId, fromUid)=>{
            if (!currentUser) return;
            setAcceptingRequest(reqId);
            try {
                const roomId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["acceptChatRequest"])(reqId, fromUid, currentUser.uid);
                updateRequestStatus(reqId, 'accepted', roomId);
                setActiveRoomId(roomId);
                setShowMobileChat(true);
                setSidebarTab('chats');
            } catch (err) {
                console.error(err);
            } finally{
                setAcceptingRequest(null);
            }
        }
    }["ChatApp.useCallback[handleAccept]"], [
        currentUser
    ]);
    const handleReject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleReject]": async (reqId)=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rejectChatRequest"])(reqId);
                updateRequestStatus(reqId, 'rejected');
            } catch (err) {
                console.error(err);
            }
        }
    }["ChatApp.useCallback[handleReject]"], []);
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleLogout]": async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"])();
            } catch  {}
            logout();
        }
    }["ChatApp.useCallback[handleLogout]"], [
        logout
    ]);
    const hasPendingRequest = (uid)=>({
            sent: !!sentRequests.find((r)=>r.toUid === uid && r.status === 'pending'),
            received: !!receivedRequests.find((r)=>r.fromUid === uid && r.status === 'pending')
        });
    const hasExistingChat = (uid)=>chatRooms.some((r)=>r.type === 'direct' && r.participants.includes(uid));
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleTouchStart]": (msg)=>{
            longPressTimerRef.current = setTimeout({
                "ChatApp.useCallback[handleTouchStart]": ()=>{
                    setContextMenuMessage(msg);
                }
            }["ChatApp.useCallback[handleTouchStart]"], 500);
        }
    }["ChatApp.useCallback[handleTouchStart]"], []);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleTouchEnd]": ()=>{
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["ChatApp.useCallback[handleTouchEnd]"], []);
    const canDeleteForEveryone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[canDeleteForEveryone]": (msg)=>{
            if (msg.senderId !== currentUser?.uid) return false;
            if (msg.deletedForEveryone || msg.type === 'deleted') return false;
            const hoursSince = (Date.now() - msg.createdAt) / (1000 * 60 * 60);
            return hoursSince <= 48;
        }
    }["ChatApp.useCallback[canDeleteForEveryone]"], [
        currentUser
    ]);
    const handleDeleteMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleDeleteMsg]": async (msg, forEveryone)=>{
            if (!activeRoomId || !currentUser) return;
            setDeletingMsg(true);
            try {
                if (forEveryone) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteMessageForEveryone"])(activeRoomId, msg.id, currentUser.uid);
                    updateMessage(activeRoomId, msg.id, {
                        deletedForEveryone: true,
                        content: 'This message was deleted',
                        type: 'deleted'
                    });
                } else {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteMessageForMe"])(activeRoomId, msg.id, currentUser.uid);
                    updateMessage(activeRoomId, msg.id, {
                        deletedFor: [
                            ...msg.deletedFor,
                            currentUser.uid
                        ]
                    });
                }
                setContextMenuMessage(null);
                setDeleteConfirm(null);
            } catch (err) {
                console.error(err);
            } finally{
                setDeletingMsg(false);
            }
        }
    }["ChatApp.useCallback[handleDeleteMsg]"], [
        activeRoomId,
        currentUser
    ]);
    const handleClearChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleClearChat]": async (roomId, action)=>{
            if (!currentUser) return;
            setClearingChat(true);
            try {
                if (action === 'delete') {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteChatRoom"])(roomId, currentUser.uid);
                    setActiveRoomId(null);
                    setShowMobileChat(false);
                } else {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearChatForMe"])(roomId, currentUser.uid);
                }
                setClearDeleteConfirm(null);
                setChatActionMenu(false);
            } catch (err) {
                console.error(err);
            } finally{
                setClearingChat(false);
            }
        }
    }["ChatApp.useCallback[handleClearChat]"], [
        currentUser
    ]);
    const handleBlockUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleBlockUser]": async (uid)=>{
            if (!currentUser || blockingUser) return;
            setBlockingUser(uid);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blockUser"])(currentUser.uid, uid);
            } catch (err) {
                console.error(err);
            } finally{
                setBlockingUser(null);
            }
        }
    }["ChatApp.useCallback[handleBlockUser]"], [
        currentUser,
        blockingUser
    ]);
    const handleUnblockUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleUnblockUser]": async (uid)=>{
            if (!currentUser) return;
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unblockUser"])(currentUser.uid, uid);
            } catch (err) {
                console.error(err);
            }
        }
    }["ChatApp.useCallback[handleUnblockUser]"], [
        currentUser
    ]);
    const handleStarUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleStarUser]": async (uid)=>{
            if (!currentUser) return;
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["starUser"])(currentUser.uid, uid);
            } catch (err) {
                console.error(err);
            }
        }
    }["ChatApp.useCallback[handleStarUser]"], [
        currentUser
    ]);
    const handleUnstarUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleUnstarUser]": async (uid)=>{
            if (!currentUser) return;
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unstarUser"])(currentUser.uid, uid);
            } catch (err) {
                console.error(err);
            }
        }
    }["ChatApp.useCallback[handleUnstarUser]"], [
        currentUser
    ]);
    const handleChangeUsername = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleChangeUsername]": async ()=>{
            if (!currentUser || !newUsername.trim()) return;
            setUsernameError('');
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["changeUsername"])(currentUser.uid, newUsername.trim());
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                    ...currentUser,
                    username: newUsername.trim(),
                    usernameChangedAt: Date.now()
                });
                setEditingUsername(false);
            } catch (err) {
                setUsernameError(err.message);
            }
        }
    }["ChatApp.useCallback[handleChangeUsername]"], [
        currentUser,
        newUsername
    ]);
    const handleChangePassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleChangePassword]": async ()=>{
            setPasswordError('');
            setPasswordSuccess(false);
            if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError('All fields are required');
                return;
            }
            if (newPassword.length < 6) {
                setPasswordError('New password must be at least 6 characters');
                return;
            }
            if (newPassword !== confirmPassword) {
                setPasswordError('New passwords do not match');
                return;
            }
            setChangingPassword(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["changeUserPassword"])(currentPassword, newPassword);
                setPasswordSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout({
                    "ChatApp.useCallback[handleChangePassword]": ()=>{
                        setShowPasswordChange(false);
                        setPasswordSuccess(false);
                    }
                }["ChatApp.useCallback[handleChangePassword]"], 2000);
            } catch (err) {
                if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setPasswordError('Current password is incorrect');
                else if (err.code === 'auth/requires-recent-login') setPasswordError('Please log out and log back in, then try again');
                else setPasswordError(err.message || 'Failed to change password');
            } finally{
                setChangingPassword(false);
            }
        }
    }["ChatApp.useCallback[handleChangePassword]"], [
        currentPassword,
        newPassword,
        confirmPassword
    ]);
    const handleAvatarUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleAvatarUpload]": (e)=>{
            const file = e.target.files?.[0];
            if (!file || !currentUser) return;
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = ({
                "ChatApp.useCallback[handleAvatarUpload]": async (ev)=>{
                    const dataUrl = ev.target?.result;
                    let finalUrl = dataUrl;
                    if (dataUrl.length > 200 * 1024) {
                        const img = new Image();
                        img.onload = ({
                            "ChatApp.useCallback[handleAvatarUpload]": async ()=>{
                                const canvas = document.createElement('canvas');
                                const maxDim = 200;
                                let w = img.width, h = img.height;
                                if (w > h) {
                                    if (w > maxDim) {
                                        h = h * maxDim / w;
                                        w = maxDim;
                                    }
                                } else {
                                    if (h > maxDim) {
                                        w = w * maxDim / h;
                                        h = maxDim;
                                    }
                                }
                                canvas.width = w;
                                canvas.height = h;
                                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                finalUrl = canvas.toDataURL('image/jpeg', 0.7);
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                                    avatar: finalUrl
                                });
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                                    ...currentUser,
                                    avatar: finalUrl
                                });
                            }
                        })["ChatApp.useCallback[handleAvatarUpload]"];
                        img.src = dataUrl;
                    } else {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                            avatar: finalUrl
                        });
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                            ...currentUser,
                            avatar: finalUrl
                        });
                    }
                }
            })["ChatApp.useCallback[handleAvatarUpload]"];
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    }["ChatApp.useCallback[handleAvatarUpload]"], [
        currentUser
    ]);
    const handleSelectBuiltInAvatar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleSelectBuiltInAvatar]": async (avatarId)=>{
            if (!currentUser) return;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                avatar: avatarId
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                ...currentUser,
                avatar: avatarId
            });
            setShowAvatarPicker(false);
        }
    }["ChatApp.useCallback[handleSelectBuiltInAvatar]"], [
        currentUser
    ]);
    const handleRemoveAvatar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleRemoveAvatar]": async ()=>{
            if (!currentUser) return;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                avatar: null
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                ...currentUser,
                avatar: null
            });
            setShowAvatarPicker(false);
        }
    }["ChatApp.useCallback[handleRemoveAvatar]"], [
        currentUser
    ]);
    // Navigate to chat from request - handle deleted chats
    const handleOpenChatFromRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatApp.useCallback[handleOpenChatFromRequest]": (roomId)=>{
            const roomExists = chatRooms.some({
                "ChatApp.useCallback[handleOpenChatFromRequest].roomExists": (r)=>r.id === roomId
            }["ChatApp.useCallback[handleOpenChatFromRequest].roomExists"]);
            if (roomExists) {
                setActiveRoomId(roomId);
                setShowMobileChat(true);
                setSidebarTab('chats');
            }
            // If chat was deleted, room doesn't exist - just switch to chats tab, don't set active room
            if (!roomExists) {
                setSidebarTab('chats');
                return;
            }
        }
    }["ChatApp.useCallback[handleOpenChatFromRequest]"], [
        chatRooms
    ]);
    // ---- DERIVED STATE ----
    const activeRoom = chatRooms.find((r)=>r.id === activeRoomId);
    const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];
    const activeTyping = activeRoomId ? typingUsers[activeRoomId] || [] : [];
    const filteredRooms = chatRooms.filter((room)=>!searchQuery || (room.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const formatTime = (ts)=>{
        const d = new Date(ts);
        return d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatLastSeen = (ts)=>{
        const d = new Date(ts);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return `last seen today at ${d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
        return `last seen ${d.toLocaleDateString([], {
            month: 'short',
            day: 'numeric'
        })} at ${d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    };
    // ---- COLORS ----
    const c = isDark ? {
        bg: 'bg-[#080c16]',
        sidebar: 'bg-[#0c1220]',
        card: 'bg-white/[0.04]',
        hover: 'hover:bg-white/[0.06]',
        border: 'border-white/[0.06]',
        input: 'bg-white/[0.06] border-white/[0.08]',
        text: 'text-white',
        muted: 'text-slate-400',
        sub: 'text-slate-500',
        bubbleMine: '',
        bubbleOther: '',
        headerBg: 'bg-[#0c1220]/90 backdrop-blur-2xl',
        panelBg: 'bg-[#0c1220]'
    } : {
        bg: 'bg-slate-50',
        sidebar: 'bg-white',
        card: 'bg-slate-50',
        hover: 'hover:bg-slate-50',
        border: 'border-slate-200',
        input: 'bg-slate-100 border-slate-200',
        text: 'text-slate-900',
        muted: 'text-slate-500',
        sub: 'text-slate-400',
        bubbleMine: '',
        bubbleOther: '',
        headerBg: 'bg-white/90 backdrop-blur-2xl',
        panelBg: 'bg-white'
    };
    const otherUidInActiveRoom = activeRoom?.type === 'direct' ? activeRoom.participants.find((p)=>p !== currentUser?.uid) : null;
    const otherIsOnline = otherUidInActiveRoom ? !!onlineUsers[otherUidInActiveRoom]?.online : false;
    const otherLastSeen = otherUidInActiveRoom ? onlineUsers[otherUidInActiveRoom]?.lastSeen || null : null;
    const isOtherBlocked = otherUidInActiveRoom ? blockedUsers.includes(otherUidInActiveRoom) : false;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `h-screen flex overflow-hidden ${c.bg} transition-colors duration-300`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col shrink-0 border-r ${c.border} ${c.sidebar} transition-colors duration-300`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 py-3 ${c.headerBg} border-b ${c.border} flex items-center justify-between`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative cursor-pointer",
                                        onClick: ()=>setShowAvatarPicker(true),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                avatar: currentUser?.avatar || null,
                                                name: currentUser?.displayName || '',
                                                avatarColor: currentUser?.avatarColor || '',
                                                size: 40
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 489,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center border-2 ${isDark ? 'border-[#0f1525]' : 'border-white'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                    className: "w-2 h-2 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 488,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: `font-semibold text-sm truncate ${c.text}`,
                                                children: currentUser?.displayName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 495,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                        className: "w-2.5 h-2.5 text-emerald-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[11px] ${c.muted}`,
                                                        children: [
                                                            "@",
                                                            currentUser?.username
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 498,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 496,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 487,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSidebarTab('settings'),
                                        className: `p-2 rounded-xl ${c.hover} ${c.muted} hover:text-white transition-colors`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 503,
                                            columnNumber: 149
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        className: `p-2 rounded-xl ${c.hover} ${c.muted} hover:text-red-400 transition-colors`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 504,
                                            columnNumber: 132
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 504,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat-app.tsx",
                        lineNumber: 486,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2",
                        "data-sidebar-search": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    ref: searchInputRef,
                                    placeholder: "Search or start new chat",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    className: `pl-10 h-9 rounded-xl text-sm ${c.input} ${c.text} placeholder:text-slate-500 border focus-visible:ring-1 focus-visible:ring-emerald-500/30`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 512,
                                    columnNumber: 13
                                }, this),
                                searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSearchQuery(''),
                                    className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 516,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 515,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat-app.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex ${c.border} border-b`,
                        children: [
                            [
                                'chats',
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
                                'Chats'
                            ],
                            [
                                'users',
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                                'Users'
                            ],
                            [
                                'requests',
                                pendingReceivedCount > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
                                'Requests'
                            ]
                        ].map(([tab, Icon, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSidebarTab(tab);
                                    setRequestError('');
                                    setRequestSuccess('');
                                },
                                className: `flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all relative ${sidebarTab === tab ? c.text : c.muted}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 527,
                                        columnNumber: 15
                                    }, this),
                                    label,
                                    tab === 'requests' && pendingReceivedCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -top-0.5 right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-bounce-subtle",
                                        children: pendingReceivedCount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 529,
                                        columnNumber: 17
                                    }, this),
                                    sidebarTab === tab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute bottom-0 left-[25%] right-[25%] h-[2.5px] rounded-full bg-gradient-to-r ${tp.gradient} transition-all duration-300`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 531,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, tab, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/chat-app.tsx",
                        lineNumber: 523,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: [
                            sidebarTab === 'chats' && (()=>{
                                const starredRooms = filteredRooms.filter((r)=>r.type === 'direct' && starredUsers.includes(r.participants.find((p)=>p !== currentUser?.uid) || ''));
                                const regularRooms = filteredRooms.filter((r)=>!(r.type === 'direct' && starredUsers.includes(r.participants.find((p)=>p !== currentUser?.uid) || '')));
                                return filteredRooms.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-20 px-4 animate-fade-in",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-20 h-20 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-xl ${tp.glow}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                className: "h-9 w-9 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 545,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm ${c.muted} text-center mb-3`,
                                            children: "No conversations yet"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 547,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-xs ${c.sub} text-center max-w-[200px] mb-4`,
                                            children: "Find users and send a chat request to start messaging"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 548,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>setSidebarTab('users'),
                                            className: `bg-gradient-to-r ${tp.gradient} text-white text-xs h-9 rounded-xl px-6 shadow-lg ${tp.glow} btn-glow`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                                    className: "h-3.5 w-3.5 mr-1.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this),
                                                "Find Users"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 549,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        starredRooms.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 pt-3 pb-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-[10px] font-bold uppercase tracking-widest ${c.muted} flex items-center gap-1`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                className: "h-3 w-3 text-amber-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 557,
                                                                columnNumber: 152
                                                            }, this),
                                                            "Starred"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 51
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 19
                                                }, this),
                                                starredRooms.map((room)=>{
                                                    const isActive = activeRoomId === room.id;
                                                    const otherUid = room.type === 'direct' ? room.participants.find((p)=>p !== currentUser?.uid) : null;
                                                    const isOn = otherUid ? !!onlineUsers[otherUid]?.online : false;
                                                    const isBlocked = otherUid ? blockedUsers.includes(otherUid) : false;
                                                    const lastMsg = room.lastMessage;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setActiveRoomId(room.id);
                                                            setShowMobileChat(true);
                                                        },
                                                        className: `w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${isActive ? isDark ? 'bg-white/8' : 'bg-slate-100' : c.hover}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                        avatar: room.avatar,
                                                                        name: room.name || 'Chat',
                                                                        avatarColor: room.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(room.id),
                                                                        size: 44
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 568,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OnlineDot, {
                                                                        online: isOn,
                                                                        isDark: isDark
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 569,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 567,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0 text-left",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: `font-semibold text-[13px] truncate ${c.text}`,
                                                                                children: room.name || 'Chat'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 573,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                                                className: "h-3 w-3 text-red-400 shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 43
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 572,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1 mt-0.5",
                                                                        children: [
                                                                            lastMsg && lastMsg.senderId === currentUser?.uid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TickIndicator, {
                                                                                status: lastMsg.status,
                                                                                color: lastMsg.status === 'read' ? '#53bdeb' : '#8696a0'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 577,
                                                                                columnNumber: 82
                                                                            }, this),
                                                                            lastMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-[11px] truncate ${c.muted}`,
                                                                                children: lastMsg.type === 'deleted' ? 'Message deleted' : lastMsg.content
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 579,
                                                                                columnNumber: 31
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-[11px] ${c.muted}`,
                                                                                children: "No messages yet"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 581,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 576,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 571,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    otherUid && handleUnstarUser(otherUid);
                                                                },
                                                                className: "p-1 text-amber-400 hover:text-amber-300 transition-colors shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    className: "h-3.5 w-3.5 fill-amber-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, room.id, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 565,
                                                        columnNumber: 23
                                                    }, this);
                                                }),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `mx-4 border-b ${c.border}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 556,
                                            columnNumber: 17
                                        }, this),
                                        regularRooms.map((room, idx)=>{
                                            const isActive = activeRoomId === room.id;
                                            const otherUid = room.type === 'direct' ? room.participants.find((p)=>p !== currentUser?.uid) : null;
                                            const isOn = otherUid ? !!onlineUsers[otherUid]?.online : false;
                                            const isBlocked = otherUid ? blockedUsers.includes(otherUid) : false;
                                            const isStarred = otherUid ? starredUsers.includes(otherUid) : false;
                                            const lastMsg = room.lastMessage;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setActiveRoomId(room.id);
                                                    setShowMobileChat(true);
                                                },
                                                className: `w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${isActive ? isDark ? 'bg-white/8' : 'bg-slate-100' : c.hover} animate-slide-in`,
                                                style: {
                                                    animationDelay: `${idx * 30}ms`
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative shrink-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                avatar: room.avatar,
                                                                name: room.name || 'Chat',
                                                                avatarColor: room.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(room.id),
                                                                size: 48
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OnlineDot, {
                                                                online: isOn,
                                                                isDark: isDark
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 608,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex-1 min-w-0 text-left border-b ${c.border} pb-3`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: `font-semibold text-[14px] truncate ${c.text}`,
                                                                                children: room.name || 'Chat'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 613,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            isBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                                                className: "h-3 w-3 text-red-400 shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 614,
                                                                                columnNumber: 41
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 612,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center shrink-0 gap-1",
                                                                        children: [
                                                                            lastMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `text-[10px] ${lastMsg.createdAt > Date.now() - 60000 ? 'text-emerald-400' : c.muted}`,
                                                                                children: formatTime(lastMsg.createdAt)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 617,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            (()=>{
                                                                                const roomMsgs = messages[room.id] || [];
                                                                                const unreadCount = roomMsgs.filter((m)=>m.senderId !== currentUser?.uid && !m.readBy?.includes(currentUser?.uid || '') && m.type !== 'system').length;
                                                                                return unreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r ${tp.gradient} text-white text-[9px] font-bold px-1 animate-bounce-subtle`,
                                                                                    children: unreadCount > 99 ? '99+' : unreadCount
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 622,
                                                                                    columnNumber: 31
                                                                                }, this) : null;
                                                                            })()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 616,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 611,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1 mt-0.5",
                                                                children: [
                                                                    lastMsg && lastMsg.senderId === currentUser?.uid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TickIndicator, {
                                                                        status: lastMsg.status,
                                                                        color: lastMsg.status === 'read' ? '#53bdeb' : lastMsg.status === 'delivered' ? '#8696a0' : '#8696a0'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 628,
                                                                        columnNumber: 78
                                                                    }, this),
                                                                    lastMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `text-[12px] truncate ${c.muted}`,
                                                                        children: lastMsg.type === 'deleted' ? 'Message deleted' : room.type === 'group' ? `${lastMsg.senderName}: ${lastMsg.content}` : lastMsg.content
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 630,
                                                                        columnNumber: 27
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `text-[12px] ${c.muted}`,
                                                                        children: "No messages yet"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 634,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 627,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 610,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, room.id, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 603,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    ]
                                }, void 0, true);
                            })(),
                            sidebarTab === 'users' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>setShowNewGroup(true),
                                                variant: "outline",
                                                className: `w-full justify-start gap-2 rounded-xl h-10 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-900'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                        className: "h-4 w-4 text-violet-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Create Group Chat"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 648,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        placeholder: "Search by exact username...",
                                                        value: userSearch,
                                                        onChange: (e)=>{
                                                            const val = e.target.value;
                                                            setUserSearch(val);
                                                            if (!val.trim()) {
                                                                setSearchResults([]);
                                                            } else {
                                                                if (userSearchTimeoutRef.current) clearTimeout(userSearchTimeoutRef.current);
                                                                userSearchTimeoutRef.current = setTimeout(()=>{
                                                                    const trimmed = val.trim().toLowerCase();
                                                                    const exactMatch = allUsers.filter((u)=>u.username === trimmed);
                                                                    if (exactMatch.length === 1) {
                                                                        setSearchResults(exactMatch);
                                                                    } else {
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchUsers"])(val.trim(), currentUser.uid).then((results)=>{
                                                                            const filtered = results.filter((u)=>u.username.toLowerCase().startsWith(trimmed) || u.displayName.toLowerCase().startsWith(trimmed.toLowerCase()));
                                                                            setSearchResults(filtered);
                                                                        }).catch(()=>{
                                                                            const local = allUsers.filter((u)=>u.username.toLowerCase().startsWith(trimmed) || u.displayName.toLowerCase().startsWith(trimmed.toLowerCase()));
                                                                            setSearchResults(local);
                                                                        });
                                                                    }
                                                                }, 300);
                                                            }
                                                        },
                                                        className: `pl-10 h-9 rounded-xl text-sm ${c.input} ${c.text} placeholder:text-slate-500 border focus-visible:ring-1 focus-visible:ring-emerald-500/30`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 651,
                                                columnNumber: 17
                                            }, this),
                                            requestError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2 animate-fade-in",
                                                children: requestError
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 684,
                                                columnNumber: 34
                                            }, this),
                                            requestSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-emerald-400 bg-emerald-500/10 rounded-xl px-3 py-2 animate-fade-in",
                                                children: requestSuccess
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 685,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 647,
                                        columnNumber: 15
                                    }, this),
                                    !userSearch.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center justify-center py-16 px-4 animate-fade-in",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-lg ${tp.glow}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "h-7 w-7 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 689,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm ${c.muted} text-center mb-1`,
                                                children: "Search for users"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 692,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-xs ${c.sub} text-center max-w-[220px]`,
                                                children: "Type an exact username to find and send a chat request"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 693,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 688,
                                        columnNumber: 17
                                    }, this) : searchResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center justify-center py-16 px-4 animate-fade-in",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-16 h-16 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center mb-4`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                    className: `h-7 w-7 ${c.muted}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 698,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 697,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm ${c.muted} text-center mb-1`,
                                                children: "No user found"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 700,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-xs ${c.sub} text-center`,
                                                children: "Make sure the username is correct"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 701,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 696,
                                        columnNumber: 17
                                    }, this) : searchResults.map((user)=>{
                                        const isOn = !!onlineUsers[user.uid]?.online;
                                        const p = hasPendingRequest(user.uid);
                                        const ec = hasExistingChat(user.uid);
                                        const isBlk = blockedUsers.includes(user.uid);
                                        const isStarred = starredUsers.includes(user.uid);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex items-center gap-3 px-4 py-3 ${c.hover} transition-colors animate-slide-in`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative shrink-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                            avatar: user.avatar,
                                                            name: user.displayName,
                                                            avatarColor: user.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(user.uid),
                                                            size: 44
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OnlineDot, {
                                                            online: isOn,
                                                            isDark: isDark
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 713,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 711,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `font-medium text-[14px] truncate ${c.text}`,
                                                                    children: user.displayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 717,
                                                                    columnNumber: 25
                                                                }, this),
                                                                isBlk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                                    className: "h-3 w-3 text-red-400 shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 718,
                                                                    columnNumber: 35
                                                                }, this),
                                                                isStarred && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    className: "h-3 w-3 text-amber-400 fill-amber-400 shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 719,
                                                                    columnNumber: 39
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 716,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-[11px] ${c.muted}`,
                                                            children: [
                                                                "@",
                                                                user.username,
                                                                " · ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: isOn ? 'text-emerald-400' : '',
                                                                    children: isOn ? 'online' : 'offline'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 722,
                                                                    columnNumber: 44
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 721,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 715,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "shrink-0 flex items-center gap-1",
                                                    children: [
                                                        isStarred ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleUnstarUser(user.uid),
                                                            className: "p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all",
                                                            title: "Unstar user",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                className: "h-3.5 w-3.5 fill-amber-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 728,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 727,
                                                            columnNumber: 25
                                                        }, this) : ec ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleStarUser(user.uid),
                                                                    className: "p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all",
                                                                    title: "Star user",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                        className: "h-3.5 w-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 733,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 732,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    className: `${isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} text-[10px] rounded-lg px-2 border-0 cursor-pointer`,
                                                                    onClick: ()=>{
                                                                        const room = chatRooms.find((r)=>r.type === 'direct' && r.participants.includes(user.uid));
                                                                        if (room) {
                                                                            setActiveRoomId(room.id);
                                                                            setShowMobileChat(true);
                                                                        }
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                            className: "h-3 w-3 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 737,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Chat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 735,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : p.sent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: `${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'} text-[10px] rounded-lg px-2 border-0`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: "h-3 w-3 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 742,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Sent"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 741,
                                                            columnNumber: 25
                                                        }, this) : p.received ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: `${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'} text-[10px] rounded-lg px-2 border-0`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                                    className: "h-3 w-3 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 746,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Wants chat"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 745,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "sm",
                                                            className: `h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 rounded-lg px-3 shadow-md ${tp.glow}`,
                                                            onClick: ()=>handleSendRequest(user),
                                                            disabled: sendingRequest === user.uid,
                                                            children: sendingRequest === user.uid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 751,
                                                                columnNumber: 58
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 751,
                                                                        columnNumber: 156
                                                                    }, this),
                                                                    "Request"
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 749,
                                                            columnNumber: 25
                                                        }, this),
                                                        isBlk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "sm",
                                                            variant: "outline",
                                                            className: "h-7 text-[11px] gap-1 rounded-lg px-3 text-amber-400 border-amber-500/30 hover:bg-amber-500/10",
                                                            onClick: ()=>handleUnblockUser(user.uid),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"], {
                                                                    className: "h-3 w-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 757,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Unblock"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 755,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, user.uid, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 710,
                                            columnNumber: 19
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 646,
                                columnNumber: 13
                            }, this),
                            sidebarTab === 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: receivedRequests.filter((r)=>r.status === 'pending').length === 0 && sentRequests.filter((r)=>r.status === 'pending').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center py-20 px-4 animate-fade-in",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-4 shadow-lg ${tp.glow}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "h-7 w-7 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 773,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 772,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm ${c.muted} text-center mb-1`,
                                            children: "No chat requests"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 775,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-xs ${c.sub} text-center max-w-[220px]`,
                                            children: "When someone wants to chat with you, their request will appear here"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 776,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 771,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        receivedRequests.filter((r)=>r.status === 'pending').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-[11px] font-bold uppercase tracking-wider ${c.muted} flex items-center gap-1`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                                                className: "h-3 w-3 text-emerald-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 148
                                                            }, this),
                                                            "Incoming (",
                                                            receivedRequests.filter((r)=>r.status === 'pending').length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 782,
                                                        columnNumber: 48
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 21
                                                }, this),
                                                receivedRequests.filter((r)=>r.status === 'pending').map((req)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-3 ${c.border} border-b animate-slide-in`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "shrink-0",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                            avatar: req.fromAvatar,
                                                                            name: req.fromDisplayName,
                                                                            avatarColor: req.fromAvatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(req.fromUid),
                                                                            size: 44
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 787,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 786,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: `font-medium text-[14px] truncate ${c.text}`,
                                                                                        children: req.fromDisplayName
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                                        lineNumber: 791,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                                        lineNumber: 792,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 790,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-[11px] ${c.muted}`,
                                                                                children: [
                                                                                    "@",
                                                                                    req.fromUsername
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 794,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            req.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: `text-[11px] mt-0.5 italic ${c.sub}`,
                                                                                children: [
                                                                                    '"',
                                                                                    req.message,
                                                                                    '"'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 795,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 789,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 785,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mt-2.5 ml-14",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        size: "sm",
                                                                        className: `h-8 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 flex-1 rounded-lg shadow-md ${tp.glow}`,
                                                                        onClick: ()=>handleAccept(req.id, req.fromUid),
                                                                        disabled: acceptingRequest === req.id,
                                                                        children: acceptingRequest === req.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 801,
                                                                            columnNumber: 60
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"], {
                                                                                    className: "h-3 w-3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 801,
                                                                                    columnNumber: 158
                                                                                }, this),
                                                                                "Accept"
                                                                            ]
                                                                        }, void 0, true)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 799,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        size: "sm",
                                                                        variant: "outline",
                                                                        className: "h-8 text-[11px] gap-1 flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10 rounded-lg",
                                                                        onClick: ()=>handleReject(req.id),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserX$3e$__["UserX"], {
                                                                                className: "h-3 w-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                                lineNumber: 805,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            "Reject"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 803,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 798,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, req.id, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 781,
                                            columnNumber: 19
                                        }, this),
                                        receivedRequests.filter((r)=>r.status === 'accepted' && r.chatRoomId).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `mx-4 border-b ${c.border}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 815,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-[11px] font-bold uppercase tracking-wider ${c.muted}`,
                                                        children: "Accepted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 816,
                                                        columnNumber: 48
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 816,
                                                    columnNumber: 21
                                                }, this),
                                                receivedRequests.filter((r)=>r.status === 'accepted' && r.chatRoomId).map((req)=>{
                                                    const roomExists = chatRooms.some((r)=>r.id === req.chatRoomId);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-3 ${c.border} border-b ${roomExists ? 'cursor-pointer ' + c.hover : ''}`,
                                                        onClick: ()=>{
                                                            if (roomExists && req.chatRoomId) {
                                                                handleOpenChatFromRequest(req.chatRoomId);
                                                            }
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                        avatar: req.fromAvatar,
                                                                        name: req.fromDisplayName,
                                                                        avatarColor: req.fromAvatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(req.fromUid),
                                                                        size: 40
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 824,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 823,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `font-medium text-[13px] truncate ${c.text}`,
                                                                            children: req.fromDisplayName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 827,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `text-[11px] ${c.muted}`,
                                                                            children: [
                                                                                "@",
                                                                                req.fromUsername
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 828,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 826,
                                                                    columnNumber: 29
                                                                }, this),
                                                                roomExists ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    size: "sm",
                                                                    className: `h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 rounded-lg px-3 shadow-md ${tp.glow}`,
                                                                    onClick: (e)=>{
                                                                        e.stopPropagation();
                                                                        req.chatRoomId && handleOpenChatFromRequest(req.chatRoomId);
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 832,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        "Chat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 831,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    className: `${isDark ? 'bg-slate-500/15 text-slate-400' : 'bg-slate-100 text-slate-500'} text-[10px] rounded-lg border-0`,
                                                                    children: "Deleted"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 835,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 822,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, req.id, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 820,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 814,
                                            columnNumber: 19
                                        }, this),
                                        sentRequests.filter((r)=>r.status === 'pending').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `mx-4 border-b ${c.border}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 846,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-[11px] font-bold uppercase tracking-wider ${c.muted}`,
                                                        children: [
                                                            "Sent (",
                                                            sentRequests.filter((r)=>r.status === 'pending').length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 48
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 847,
                                                    columnNumber: 21
                                                }, this),
                                                sentRequests.filter((r)=>r.status === 'pending').map((req)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-3 ${c.border} border-b`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                        avatar: req.toAvatar,
                                                                        name: req.toDisplayName,
                                                                        avatarColor: req.toAvatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(req.toUid),
                                                                        size: 40
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 852,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 851,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `font-medium text-[13px] truncate ${c.text}`,
                                                                            children: req.toDisplayName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 855,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                    className: "h-2.5 w-2.5 text-amber-400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 857,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: `text-[11px] ${c.muted}`,
                                                                                    children: [
                                                                                        "@",
                                                                                        req.toUsername,
                                                                                        " · Pending"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 858,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 856,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 854,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors",
                                                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelChatRequest"])(req.id).then(()=>removeRequestFromList(req.id)),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                        className: "h-3.5 w-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 862,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 861,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 850,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, req.id, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 845,
                                            columnNumber: 19
                                        }, this),
                                        sentRequests.filter((r)=>r.status === 'accepted' && r.chatRoomId).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `mx-4 border-b ${c.border}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 872,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-[11px] font-bold uppercase tracking-wider ${c.muted}`,
                                                        children: "Accepted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 873,
                                                        columnNumber: 48
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 873,
                                                    columnNumber: 21
                                                }, this),
                                                sentRequests.filter((r)=>r.status === 'accepted' && r.chatRoomId).map((req)=>{
                                                    const roomExists = chatRooms.some((r)=>r.id === req.chatRoomId);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-3 ${c.border} border-b ${roomExists ? 'cursor-pointer ' + c.hover : ''}`,
                                                        onClick: ()=>{
                                                            if (roomExists && req.chatRoomId) {
                                                                handleOpenChatFromRequest(req.chatRoomId);
                                                            }
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                        avatar: req.toAvatar,
                                                                        name: req.toDisplayName,
                                                                        avatarColor: req.toAvatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(req.toUid),
                                                                        size: 40
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 881,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 880,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `font-medium text-[13px] truncate ${c.text}`,
                                                                            children: req.toDisplayName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 884,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `text-[11px] text-emerald-400`,
                                                                            children: "Request accepted"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 885,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 883,
                                                                    columnNumber: 29
                                                                }, this),
                                                                roomExists ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    size: "sm",
                                                                    className: `h-7 text-[11px] bg-gradient-to-r ${tp.gradient} text-white gap-1 rounded-lg px-3 shadow-md ${tp.glow}`,
                                                                    onClick: (e)=>{
                                                                        e.stopPropagation();
                                                                        req.chatRoomId && handleOpenChatFromRequest(req.chatRoomId);
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                            className: "h-3 w-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 889,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        "Chat"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 888,
                                                                    columnNumber: 31
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    className: `${isDark ? 'bg-slate-500/15 text-slate-400' : 'bg-slate-100 text-slate-500'} text-[10px] rounded-lg border-0`,
                                                                    children: "Deleted"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 892,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 879,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, req.id, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 877,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 871,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 769,
                                columnNumber: 13
                            }, this),
                            sidebarTab === 'settings' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 space-y-4 animate-fade-in",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'} space-y-3`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative cursor-pointer",
                                                    onClick: ()=>setShowAvatarPicker(true),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                            avatar: currentUser?.avatar || null,
                                                            name: currentUser?.displayName || '',
                                                            avatarColor: currentUser?.avatarColor || '',
                                                            size: 56
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 911,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md border-2 ${isDark ? 'border-[#0f1525]' : 'border-white'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                                className: "w-3 h-3 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 913,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 912,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 910,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        editingName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    value: newDisplayName,
                                                                    onChange: (e)=>setNewDisplayName(e.target.value),
                                                                    className: `h-7 text-sm rounded-lg ${c.input} ${c.text} border`,
                                                                    onKeyDown: (e)=>e.key === 'Enter' && newDisplayName.trim() && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                                                                            displayName: newDisplayName.trim()
                                                                        }).then(()=>{
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                                                                                ...currentUser,
                                                                                displayName: newDisplayName.trim()
                                                                            });
                                                                            setEditingName(false);
                                                                        })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 919,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "text-emerald-400 p-1",
                                                                    onClick: ()=>newDisplayName.trim() && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileData"])(currentUser.uid, {
                                                                            displayName: newDisplayName.trim()
                                                                        }).then(()=>{
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setAuth({
                                                                                ...currentUser,
                                                                                displayName: newDisplayName.trim()
                                                                            });
                                                                            setEditingName(false);
                                                                        }),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 920,
                                                                        columnNumber: 310
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 920,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "text-red-400 p-1",
                                                                    onClick: ()=>setEditingName(false),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 921,
                                                                        columnNumber: 100
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 921,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 918,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: `font-semibold text-[15px] ${c.text}`,
                                                                    children: currentUser?.displayName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 925,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setEditingName(true);
                                                                        setNewDisplayName(currentUser?.displayName || '');
                                                                    },
                                                                    className: `${c.muted} hover:text-emerald-400`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 926,
                                                                        columnNumber: 173
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 926,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 924,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5 mt-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                    className: "w-2.5 h-2.5 text-emerald-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 930,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-[12px] ${c.muted}`,
                                                                    children: [
                                                                        "@",
                                                                        currentUser?.username
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 931,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setEditingUsername(true);
                                                                        setNewUsername(currentUser?.username || '');
                                                                        setUsernameError('');
                                                                    },
                                                                    className: `${c.muted} hover:text-emerald-400`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                                        className: "h-2.5 w-2.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 932,
                                                                        columnNumber: 191
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 932,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 929,
                                                            columnNumber: 21
                                                        }, this),
                                                        editingUsername && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    value: newUsername,
                                                                    onChange: (e)=>setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')),
                                                                    className: `h-7 text-sm rounded-lg ${c.input} ${c.text} border`,
                                                                    placeholder: "New username"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 936,
                                                                    columnNumber: 25
                                                                }, this),
                                                                usernameError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] text-red-400",
                                                                    children: usernameError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 937,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            size: "sm",
                                                                            className: `h-6 text-[10px] bg-gradient-to-r ${tp.gradient} text-white rounded-lg px-2`,
                                                                            onClick: handleChangeUsername,
                                                                            children: "Save"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 939,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            size: "sm",
                                                                            variant: "ghost",
                                                                            className: "h-6 text-[10px] text-slate-400",
                                                                            onClick: ()=>setEditingUsername(false),
                                                                            children: "Cancel"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 940,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 938,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 935,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 916,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 909,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 908,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-2 p-3 rounded-xl ${isDark ? 'bg-emerald-500/8' : 'bg-emerald-50'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "h-4 w-4 text-emerald-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 950,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-xs font-medium text-emerald-400`,
                                                        children: "End-to-End Encrypted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 952,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-[10px] ${c.sub}`,
                                                        children: "Messages are encrypted and only readable by chat participants"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 953,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 951,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 949,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAvatarPicker(true),
                                        className: `w-full flex items-center gap-3 p-3 rounded-xl ${c.hover} transition-colors text-left`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                                className: `h-4 w-4 ${c.muted}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 959,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm ${c.text}`,
                                                children: "Change Profile Picture"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 960,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 958,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowPasswordChange(true),
                                        className: `w-full flex items-center gap-3 p-3 rounded-xl ${c.hover} transition-colors text-left`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                className: `h-4 w-4 ${c.muted}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 965,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm ${c.text}`,
                                                children: "Change Password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 966,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 964,
                                        columnNumber: 15
                                    }, this),
                                    blockedUsers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: `text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`,
                                                children: [
                                                    "Blocked Users (",
                                                    blockedUsers.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 972,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: blockedUsers.map((uid)=>{
                                                    const blkUser = allUsers.find((u)=>u.uid === uid);
                                                    if (!blkUser) return null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                avatar: blkUser.avatar,
                                                                name: blkUser.displayName,
                                                                avatarColor: blkUser.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(uid),
                                                                size: 28
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 979,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-sm flex-1 ${c.text}`,
                                                                children: blkUser.displayName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                size: "sm",
                                                                variant: "ghost",
                                                                className: "h-6 text-[10px] text-emerald-400 hover:text-emerald-300",
                                                                onClick: ()=>handleUnblockUser(uid),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"], {
                                                                        className: "h-3 w-3 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                                        lineNumber: 982,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    "Unblock"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 981,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, uid, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 978,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 973,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 971,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: `text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`,
                                                children: "Appearance"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 993,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setTheme({
                                                                mode: 'dark'
                                                            }),
                                                        className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${c.card} ${c.text} border ${c.border}`}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 996,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Dark"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 995,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setTheme({
                                                                mode: 'light'
                                                            }),
                                                        className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${!isDark ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow}` : `${c.card} ${c.text} border ${c.border}`}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 999,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Light"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 998,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 994,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 992,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: `text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`,
                                                children: "Accent Color"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1006,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-2",
                                                children: Object.entries(THEME_PRESETS).map(([key, val])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setTheme({
                                                                preset: key
                                                            }),
                                                        className: `flex items-center gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-medium transition-all duration-200 ${preset === key ? `bg-gradient-to-r ${val.gradient} text-white shadow-md ${val.glow}` : `${c.card} ${c.text} border ${c.border}`}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `w-3.5 h-3.5 rounded-full ${val.primary} shadow-sm`,
                                                                style: {
                                                                    boxShadow: preset === key ? `0 0 8px ${val.hex}40` : 'none'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 1011,
                                                                columnNumber: 23
                                                            }, this),
                                                            val.name
                                                        ]
                                                    }, key, true, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1005,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: `text-[11px] font-bold uppercase tracking-wider mb-2 ${c.muted}`,
                                                children: "Font Size"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1019,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    'small',
                                                    'medium',
                                                    'large'
                                                ].map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setTheme({
                                                                fontSize: size
                                                            }),
                                                        className: `flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-200 ${theme.fontSize === size ? `bg-gradient-to-r ${tp.gradient} text-white shadow-md` : `${c.card} ${c.text} border ${c.border}`}`,
                                                        children: size
                                                    }, size, false, {
                                                        fileName: "[project]/src/components/chat-app.tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1020,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1018,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 906,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/chat-app.tsx",
                        lineNumber: 537,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${!showMobileChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col ${c.bg} transition-colors duration-300`,
                children: !activeRoom ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col items-center justify-center animate-fade-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-24 h-24 rounded-3xl bg-gradient-to-br ${tp.gradient} flex items-center justify-center mb-6 shadow-2xl ${tp.glow} animate-float`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                className: "h-12 w-12 text-white"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1039,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1038,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: `text-xl font-bold ${c.text} mb-2`,
                            children: "FurtherChat"
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1041,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-sm ${c.muted} max-w-[280px] text-center`,
                            children: "Select a conversation to start messaging, or find new users to chat with."
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1042,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-1.5 mt-4 ${c.sub}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1044,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px]",
                                    children: "Messages are end-to-end encrypted"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1045,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1043,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1037,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `px-4 py-3 ${c.headerBg} border-b ${c.border} flex items-center justify-between`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowMobileChat(false);
                                                setActiveRoomId(null);
                                            },
                                            className: `md:hidden p-1.5 rounded-lg ${c.hover} ${c.muted}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1054,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1053,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                    avatar: activeRoom.avatar,
                                                    name: activeRoom.name || 'Chat',
                                                    avatarColor: activeRoom.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(activeRoom.id),
                                                    size: 40
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1057,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OnlineDot, {
                                                    online: otherIsOnline,
                                                    size: "md",
                                                    isDark: isDark
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1058,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1056,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: `font-semibold text-sm ${c.text}`,
                                                            children: activeRoom.name || 'Chat'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1062,
                                                            columnNumber: 21
                                                        }, this),
                                                        isOtherBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                            className: "h-3.5 w-3.5 text-red-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1063,
                                                            columnNumber: 40
                                                        }, this),
                                                        otherUidInActiveRoom && starredUsers.includes(otherUidInActiveRoom) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            className: "h-3.5 w-3.5 text-amber-400 fill-amber-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1064,
                                                            columnNumber: 93
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1061,
                                                    columnNumber: 19
                                                }, this),
                                                activeRoom.type === 'direct' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `text-[11px] ${otherIsOnline ? 'text-emerald-400' : c.muted}`,
                                                    children: isOtherBlocked ? 'Blocked' : activeTyping.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            activeTyping.join(', '),
                                                            " typing",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 1070,
                                                                columnNumber: 59
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : otherIsOnline ? 'Online' : otherLastSeen ? formatLastSeen(otherLastSeen) : otherUidInActiveRoom ? 'Offline' : ''
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1067,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1060,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1052,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-0.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setChatSearchQuery(chatSearchQuery ? '' : ' '),
                                            className: `p-2 rounded-xl ${c.hover} ${c.muted} transition-colors`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1077,
                                                columnNumber: 157
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1077,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setChatActionMenu(!chatActionMenu),
                                            "data-chat-menu": true,
                                            className: `p-2 rounded-xl ${c.hover} ${c.muted} transition-colors`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1078,
                                                columnNumber: 160
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1078,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1076,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1051,
                            columnNumber: 13
                        }, this),
                        chatActionMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-chat-menu": true,
                            className: `absolute top-14 right-4 z-50 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'} border rounded-xl shadow-xl py-1 min-w-[200px] animate-scale-in`,
                            children: [
                                otherUidInActiveRoom && (starredUsers.includes(otherUidInActiveRoom) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        handleUnstarUser(otherUidInActiveRoom);
                                        setChatActionMenu(false);
                                    },
                                    className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} text-amber-400 transition-colors flex items-center gap-2`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "h-3.5 w-3.5 fill-amber-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1089,
                                            columnNumber: 23
                                        }, this),
                                        "Unstar User"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1087,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        handleStarUser(otherUidInActiveRoom);
                                        setChatActionMenu(false);
                                    },
                                    className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1094,
                                            columnNumber: 23
                                        }, this),
                                        "Star User"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1092,
                                    columnNumber: 21
                                }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setClearDeleteConfirm({
                                            roomId: activeRoom.id,
                                            action: 'clear'
                                        });
                                        setChatActionMenu(false);
                                    },
                                    className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1100,
                                            columnNumber: 19
                                        }, this),
                                        "Clear Chat"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1098,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setClearDeleteConfirm({
                                            roomId: activeRoom.id,
                                            action: 'delete'
                                        });
                                        setChatActionMenu(false);
                                    },
                                    className: "w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1104,
                                            columnNumber: 19
                                        }, this),
                                        "Delete Chat"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1102,
                                    columnNumber: 17
                                }, this),
                                otherUidInActiveRoom && (isOtherBlocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        handleUnblockUser(otherUidInActiveRoom);
                                        setChatActionMenu(false);
                                    },
                                    className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} text-emerald-400 transition-colors flex items-center gap-2`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1110,
                                            columnNumber: 23
                                        }, this),
                                        "Unblock User"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1108,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        handleBlockUser(otherUidInActiveRoom);
                                        setChatActionMenu(false);
                                    },
                                    className: "w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1115,
                                            columnNumber: 23
                                        }, this),
                                        "Block User"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1113,
                                    columnNumber: 21
                                }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1084,
                            columnNumber: 15
                        }, this),
                        chatSearchQuery !== '' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-2 border-b border-white/5",
                            "data-chat-search": true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1126,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        ref: chatSearchRef,
                                        placeholder: "Search in chat...",
                                        value: chatSearchQuery === ' ' ? '' : chatSearchQuery,
                                        onChange: (e)=>setChatSearchQuery(e.target.value),
                                        className: `h-8 text-sm rounded-lg pl-9 ${c.input} ${c.text} placeholder:text-slate-500 border`,
                                        autoFocus: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1127,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setChatSearchQuery(''),
                                        className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1130,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1125,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1124,
                            columnNumber: 15
                        }, this),
                        isOtherBlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `px-4 py-3 ${isDark ? 'bg-red-500/8 border-red-500/15' : 'bg-red-50 border-red-100'} border-b flex items-center gap-3`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                    className: "h-4 w-4 text-red-400 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1139,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-red-400 font-medium",
                                            children: "This user is blocked"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1141,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-[10px] ${c.sub}`,
                                            children: "You won't receive messages from blocked users. Unblock to chat again."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1142,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1140,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    size: "sm",
                                    className: "h-7 text-[11px] text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 rounded-lg",
                                    variant: "outline",
                                    onClick: ()=>otherUidInActiveRoom && handleUnblockUser(otherUidInActiveRoom),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlock$3e$__["Unlock"], {
                                            className: "h-3 w-3 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1146,
                                            columnNumber: 19
                                        }, this),
                                        "Unblock"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1144,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1138,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex-1 overflow-y-auto px-4 py-3 ${isDark ? 'chat-wallpaper-dark' : 'chat-wallpaper-light'}`,
                            children: [
                                activeMessages.filter((m)=>!m.deletedFor.includes(currentUser?.uid || '')).filter((m)=>chatSearchQuery && chatSearchQuery !== ' ' ? m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()) : true).map((msg, idx, arr)=>{
                                    const isMine = msg.senderId === currentUser?.uid;
                                    const isDeleted = msg.deletedForEveryone || msg.type === 'deleted';
                                    const isSystem = msg.type === 'system';
                                    const showAvatar = !isMine && !isSystem && (idx === 0 || arr[idx - 1]?.senderId !== msg.senderId);
                                    const prevMsg = idx > 0 ? arr[idx - 1] : null;
                                    const showDateSep = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
                                    if (isSystem) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center my-3 animate-fade-in",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[11px] ${c.muted} ${isDark ? 'bg-white/5' : 'bg-slate-100'} backdrop-blur-sm rounded-lg px-3 py-1`,
                                            children: msg.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1166,
                                            columnNumber: 21
                                        }, this)
                                    }, msg.id, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1165,
                                        columnNumber: 19
                                    }, this);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            showDateSep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center my-4 animate-fade-in",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-[11px] ${c.muted} ${isDark ? 'bg-white/5' : 'bg-slate-100'} backdrop-blur-sm rounded-lg px-3 py-1`,
                                                    children: new Date(msg.createdAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(msg.createdAt).toDateString() === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : new Date(msg.createdAt).toLocaleDateString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1174,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1173,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 ${showAvatar ? 'mt-3' : ''} msg-enter`,
                                                onContextMenu: (e)=>{
                                                    e.preventDefault();
                                                    setContextMenuMessage(msg);
                                                },
                                                onTouchStart: ()=>handleTouchStart(msg),
                                                onTouchEnd: handleTouchEnd,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-end gap-2 max-w-[75%] ${isMine ? 'flex-row-reverse' : ''}`,
                                                    children: [
                                                        !isMine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-7 shrink-0",
                                                            children: showAvatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                                avatar: msg.senderAvatar,
                                                                name: msg.senderName,
                                                                avatarColor: msg.senderAvatarColor,
                                                                size: 28
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 1187,
                                                                columnNumber: 42
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1186,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `group relative`,
                                                            children: [
                                                                msg.replyTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `text-[10px] ${c.muted} px-3 pt-2 pb-1 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-t-2xl border-b ${c.border}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: msg.replyToSender
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 1193,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        ": ",
                                                                        msg.replyToContent
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 1192,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `px-3 py-2 rounded-2xl ${isDeleted ? 'italic' : ''} transition-all duration-200 hover:shadow-md`,
                                                                    style: isMine ? {
                                                                        background: `linear-gradient(135deg, rgba(${tp.primaryRgb},0.22) 0%, rgba(${tp.primaryRgb},0.08) 100%)`,
                                                                        border: `1px solid rgba(${tp.primaryRgb},0.18)`
                                                                    } : isDark ? {
                                                                        background: 'rgba(255,255,255,0.05)',
                                                                        border: '1px solid rgba(255,255,255,0.07)'
                                                                    } : {
                                                                        background: '#ffffff',
                                                                        border: '1px solid #e2e8f0'
                                                                    },
                                                                    children: [
                                                                        !isMine && showAvatar && activeRoom?.type === 'group' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `text-[10px] font-medium mb-0.5`,
                                                                            style: {
                                                                                color: msg.senderAvatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(msg.senderId)
                                                                            },
                                                                            children: msg.senderName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 1207,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        isDeleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `text-[13px] ${c.muted}`,
                                                                            children: "🚫 This message was deleted"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 1210,
                                                                            columnNumber: 29
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: `text-[13px] ${c.text} break-words whitespace-pre-wrap`,
                                                                            children: msg.content
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 1212,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `flex items-center justify-end gap-1 mt-0.5`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `text-[10px] ${c.muted}`,
                                                                                    children: formatTime(msg.createdAt)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 1215,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                isMine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TickIndicator, {
                                                                                    status: msg.status,
                                                                                    color: msg.status === 'read' ? '#53bdeb' : isDark ? '#8696a0' : '#8696a0'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                                    lineNumber: 1216,
                                                                                    columnNumber: 40
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                                            lineNumber: 1214,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                                    lineNumber: 1196,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1190,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1184,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1181,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, msg.id, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1171,
                                        columnNumber: 19
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messageEndRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1152,
                            columnNumber: 13
                        }, this),
                        replyingTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `px-4 py-2 ${isDark ? 'bg-white/5' : 'bg-slate-50'} border-t ${c.border} flex items-center gap-2 animate-slide-up`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-1 h-8 rounded-full bg-gradient-to-b ${tp.gradient}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1231,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-[10px] font-medium ${c.muted}`,
                                            children: replyingTo.senderName
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1233,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-[11px] ${c.sub} truncate`,
                                            children: replyingTo.content
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1234,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1232,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setReplyingTo(null),
                                    className: `${c.muted} hover:text-white`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1236,
                                        columnNumber: 103
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1236,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1230,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `px-3 py-2 ${c.border} border-t`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-end gap-2 ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-2xl px-3 py-1.5`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        ref: emojiBtnRef,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            if (showEmojiPicker) {
                                                setShowEmojiPicker(false);
                                            } else {
                                                setEmojiAnchorRect(emojiBtnRef.current?.getBoundingClientRect() || null);
                                                setShowEmojiPicker(true);
                                            }
                                        },
                                        className: `p-1.5 rounded-lg ${c.hover} ${showEmojiPicker ? 'text-emerald-400' : c.muted} transition-colors shrink-0 mb-0.5`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1244,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1243,
                                        columnNumber: 17
                                    }, this),
                                    showEmojiPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$emoji$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmojiPicker"], {
                                        onSelect: (e)=>setMessageInput((prev)=>prev + e),
                                        onClose: ()=>setShowEmojiPicker(false),
                                        isDark: isDark,
                                        anchorRect: emojiAnchorRect
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1246,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: messageInput,
                                        onChange: (e)=>{
                                            handleTyping(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                                        },
                                        onKeyDown: (e)=>{
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        },
                                        placeholder: "Type a message...",
                                        rows: 1,
                                        className: `flex-1 bg-transparent ${c.text} placeholder:text-slate-500 outline-none resize-none text-sm leading-5 max-h-24 py-1.5`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1247,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSend,
                                        disabled: !messageInput.trim() || sendingMessage || isOtherBlocked,
                                        className: `p-2 rounded-xl bg-gradient-to-r ${tp.gradient} text-white shadow-md ${tp.glow} disabled:opacity-30 transition-all duration-200 shrink-0 mb-0.5 active:scale-90`,
                                        children: sendingMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 133
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1255,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1242,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1241,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1035,
                columnNumber: 7
            }, this),
            contextMenuMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
                onClick: ()=>setContextMenuMessage(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'} border rounded-xl shadow-2xl py-1 min-w-[180px] animate-scale-in`,
                    style: {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    },
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                navigator.clipboard.writeText(contextMenuMessage.content);
                                setContextMenuMessage(null);
                            },
                            className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1273,
                                    columnNumber: 15
                                }, this),
                                "Copy"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1271,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setReplyingTo(contextMenuMessage);
                                setContextMenuMessage(null);
                            },
                            className: `w-full text-left px-4 py-2.5 text-sm ${c.hover} ${c.text} transition-colors flex items-center gap-2`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1277,
                                    columnNumber: 15
                                }, this),
                                "Reply"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1275,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setDeleteConfirm({
                                    msg: contextMenuMessage,
                                    forEveryone: false
                                });
                                setContextMenuMessage(null);
                            },
                            className: "w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1281,
                                    columnNumber: 15
                                }, this),
                                "Delete for Me"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1279,
                            columnNumber: 13
                        }, this),
                        canDeleteForEveryone(contextMenuMessage) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                setDeleteConfirm({
                                    msg: contextMenuMessage,
                                    forEveryone: true
                                });
                                setContextMenuMessage(null);
                            },
                            className: "w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1286,
                                    columnNumber: 17
                                }, this),
                                "Delete for Everyone"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1284,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1268,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1267,
                columnNumber: 9
            }, this),
            deleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: true,
                onOpenChange: ()=>setDeleteConfirm(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: `${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: c.text,
                                children: deleteConfirm.forEveryone ? 'Delete for Everyone?' : 'Delete for Me?'
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1298,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1297,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-sm ${c.muted}`,
                            children: deleteConfirm.forEveryone ? 'This message will be deleted for everyone in this chat. This action cannot be undone.' : 'This message will only be deleted for you. Other participants can still see it.'
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1300,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2 mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    onClick: ()=>setDeleteConfirm(null),
                                    className: c.muted,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>handleDeleteMsg(deleteConfirm.msg, deleteConfirm.forEveryone),
                                    disabled: deletingMsg,
                                    className: "bg-red-500 hover:bg-red-600 text-white",
                                    children: deletingMsg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1309,
                                        columnNumber: 32
                                    }, this) : 'Delete'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1307,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1305,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1296,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1295,
                columnNumber: 9
            }, this),
            clearDeleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: true,
                onOpenChange: ()=>setClearDeleteConfirm(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: `${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: c.text,
                                children: clearDeleteConfirm.action === 'delete' ? 'Delete Chat?' : 'Clear Chat?'
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1321,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1320,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-sm ${c.muted}`,
                            children: clearDeleteConfirm.action === 'delete' ? 'This chat will be removed from your list. You can send a new chat request later if you want to reconnect.' : 'All messages will be cleared for you only. The chat will remain in your list.'
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1323,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2 mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    onClick: ()=>setClearDeleteConfirm(null),
                                    className: c.muted,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1329,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>handleClearChat(clearDeleteConfirm.roomId, clearDeleteConfirm.action),
                                    disabled: clearingChat,
                                    className: "bg-red-500 hover:bg-red-600 text-white",
                                    children: clearingChat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1332,
                                        columnNumber: 33
                                    }, this) : clearDeleteConfirm.action === 'delete' ? 'Delete' : 'Clear'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1330,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1328,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1319,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1318,
                columnNumber: 9
            }, this),
            showPasswordChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: true,
                onOpenChange: setShowPasswordChange,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: `${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: c.text,
                                children: "Change Password"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1344,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1343,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                passwordError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2 animate-fade-in",
                                    children: passwordError
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1347,
                                    columnNumber: 33
                                }, this),
                                passwordSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-emerald-400 bg-emerald-500/10 rounded-xl px-3 py-2 animate-fade-in",
                                    children: "Password changed successfully!"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1348,
                                    columnNumber: 35
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    type: "password",
                                    placeholder: "Current password",
                                    value: currentPassword,
                                    onChange: (e)=>setCurrentPassword(e.target.value),
                                    className: `h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1349,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    type: "password",
                                    placeholder: "New password",
                                    value: newPassword,
                                    onChange: (e)=>setNewPassword(e.target.value),
                                    className: `h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1351,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    type: "password",
                                    placeholder: "Confirm new password",
                                    value: confirmPassword,
                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                    className: `h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1353,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleChangePassword,
                                    disabled: changingPassword,
                                    className: `w-full bg-gradient-to-r ${tp.gradient} text-white h-10 rounded-xl`,
                                    children: changingPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1356,
                                        columnNumber: 37
                                    }, this) : 'Change Password'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1355,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1346,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1342,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1341,
                columnNumber: 9
            }, this),
            showAvatarPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: true,
                onOpenChange: setShowAvatarPicker,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: `${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} max-w-md`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: c.text,
                                children: "Change Profile Picture"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1368,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1367,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center py-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                avatar: currentUser?.avatar || null,
                                                name: currentUser?.displayName || '',
                                                avatarColor: currentUser?.avatarColor || '',
                                                size: 80
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r ${tp.gradient} rounded-full flex items-center justify-center shadow-md`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                    className: "w-3.5 h-3.5 text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1376,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/chat-app.tsx",
                                                lineNumber: 1375,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/chat-app.tsx",
                                        lineNumber: 1373,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1372,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    ref: fileInputRef,
                                    type: "file",
                                    accept: "image/*",
                                    className: "hidden",
                                    onChange: handleAvatarUpload
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1382,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>fileInputRef.current?.click(),
                                    variant: "outline",
                                    className: `w-full h-10 rounded-xl gap-2 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1384,
                                            columnNumber: 17
                                        }, this),
                                        "Upload from Device"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1383,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-xs font-bold uppercase tracking-wider mb-2 ${c.muted}`,
                                            children: "Choose an Avatar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1389,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 gap-3",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BUILT_IN_AVATARS"].map((av)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSelectBuiltInAvatar(av.id),
                                                    className: `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${currentUser?.avatar === av.id ? `bg-gradient-to-r ${tp.gradient} shadow-md ${tp.glow} ring-2 ring-emerald-400/50` : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full overflow-hidden flex items-center justify-center",
                                                            style: {
                                                                background: av.bg
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg",
                                                                children: av.emoji
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/chat-app.tsx",
                                                                lineNumber: 1397,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1396,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-[9px] ${currentUser?.avatar === av.id ? 'text-white' : c.muted}`,
                                                            children: av.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/chat-app.tsx",
                                                            lineNumber: 1399,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, av.id, true, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1392,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1390,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1388,
                                    columnNumber: 15
                                }, this),
                                currentUser?.avatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleRemoveAvatar,
                                    variant: "outline",
                                    className: "w-full h-10 rounded-xl gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1408,
                                            columnNumber: 19
                                        }, this),
                                        "Remove Picture"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1407,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1370,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1366,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1365,
                columnNumber: 9
            }, this),
            showNewGroup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: true,
                onOpenChange: setShowNewGroup,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: `${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                className: c.text,
                                children: "Create Group Chat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/chat-app.tsx",
                                lineNumber: 1421,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1420,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    placeholder: "Group name",
                                    value: groupName,
                                    onChange: (e)=>setGroupName(e.target.value),
                                    className: `h-10 ${c.input} ${c.text} border rounded-xl placeholder:text-slate-500`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1424,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-60 overflow-y-auto space-y-1",
                                    children: allUsers.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedUsers((prev)=>prev.includes(user.uid) ? prev.filter((u)=>u !== user.uid) : [
                                                        ...prev,
                                                        user.uid
                                                    ]),
                                            className: `w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${selectedUsers.includes(user.uid) ? isDark ? 'bg-emerald-500/15' : 'bg-emerald-50' : c.hover}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Avatar, {
                                                    avatar: user.avatar,
                                                    name: user.displayName,
                                                    avatarColor: user.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(user.uid),
                                                    size: 32
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1430,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-sm ${c.text}`,
                                                    children: user.displayName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1431,
                                                    columnNumber: 21
                                                }, this),
                                                selectedUsers.includes(user.uid) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "h-4 w-4 text-emerald-400 ml-auto"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/chat-app.tsx",
                                                    lineNumber: 1432,
                                                    columnNumber: 58
                                                }, this)
                                            ]
                                        }, user.uid, true, {
                                            fileName: "[project]/src/components/chat-app.tsx",
                                            lineNumber: 1428,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1426,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: async ()=>{
                                        if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) return;
                                        const roomId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGroupChatRoom"])(groupName, currentUser.uid, selectedUsers);
                                        setActiveRoomId(roomId);
                                        setShowMobileChat(true);
                                        setShowNewGroup(false);
                                        setGroupName('');
                                        setSelectedUsers([]);
                                    },
                                    disabled: !groupName.trim() || selectedUsers.length === 0,
                                    className: `w-full bg-gradient-to-r ${tp.gradient} text-white h-10 rounded-xl`,
                                    children: "Create Group"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/chat-app.tsx",
                                    lineNumber: 1436,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/chat-app.tsx",
                            lineNumber: 1423,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/chat-app.tsx",
                    lineNumber: 1419,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/chat-app.tsx",
                lineNumber: 1418,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chat-app.tsx",
        lineNumber: 482,
        columnNumber: 5
    }, this);
}
_s(ChatApp, "9mV4ElbBdIm+V63K3ESMeOfS9M8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c4 = ChatApp;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "TickIndicator");
__turbopack_context__.k.register(_c1, "OnlineDot");
__turbopack_context__.k.register(_c2, "Avatar");
__turbopack_context__.k.register(_c3, "TypingDots");
__turbopack_context__.k.register(_c4, "ChatApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2d$app$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chat-app.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Home() {
    _s();
    const { currentUser, setAuth, setView, view, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"])();
    const [initializing, setInitializing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const firebaseReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const savedTheme = localStorage.getItem('chatTheme');
            if (savedTheme) {
                try {
                    setTheme(JSON.parse(savedTheme));
                } catch  {}
            }
        }
    }["Home.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!firebaseReady) {
                setInitializing(false);
                setView('setup');
                return;
            }
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "Home.useEffect.unsubscribe": async (firebaseUser)=>{
                    if (firebaseUser) {
                        try {
                            const { getDoc, doc } = await __turbopack_context__.A("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript, async loader)");
                            const { db } = await __turbopack_context__.A("[project]/src/lib/firebase.ts [app-client] (ecmascript, async loader)");
                            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (userDoc.exists()) {
                                const data = userDoc.data();
                                setAuth({
                                    uid: firebaseUser.uid,
                                    username: data.username,
                                    displayName: data.displayName || data.username,
                                    avatar: data.avatar || null,
                                    avatarColor: data.avatarColor || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarColor"])(firebaseUser.uid),
                                    isOnline: true,
                                    lastSeen: null,
                                    usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null
                                });
                            } else {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].signOut();
                                setView('login');
                            }
                        } catch (err) {
                            console.error(err);
                            setView('login');
                        }
                    } else {
                        localStorage.removeItem('chatUser');
                        setView('login');
                    }
                    setInitializing(false);
                }
            }["Home.useEffect.unsubscribe"]);
            const safety = setTimeout({
                "Home.useEffect.safety": ()=>{
                    setInitializing(false);
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().currentUser) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"].getState().setView('login');
                }
            }["Home.useEffect.safety"], 10000);
            return ({
                "Home.useEffect": ()=>{
                    unsubscribe();
                    clearTimeout(safety);
                }
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        firebaseReady
    ]);
    if (initializing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[120px]"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center relative z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative mx-auto mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-[88px] h-[88px] rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-float",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-11 h-11 text-white",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 58,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 10h.01M12 10h.01M15 10h.01"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 59,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in",
                                    style: {
                                        animationDelay: '0.3s'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 text-white",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 65,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white mb-1",
                            children: "FurtherChat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-1.5 mt-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-400 text-sm",
                                    children: "Loading your secure chat..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 w-48 mx-auto h-1 bg-white/10 rounded-full overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full loading-shimmer",
                                style: {
                                    width: '70%'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    if (!currentUser || view === 'login' || view === 'register') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthForm"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 86,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chat$2d$app$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApp"], {}, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 89,
        columnNumber: 10
    }, this);
}
_s(Home, "qa5dcMvdQ0fiHBWYBJagH24AHeg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppStore"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_89133634._.js.map