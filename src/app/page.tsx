'use client'

import { useEffect, useState } from 'react'
import { useAppStore, getAvatarColor } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthForm } from '@/components/auth-form'
import { ChatApp } from '@/components/chat-app'

export default function Home() {
  const { currentUser, setAuth, setView, view, setTheme } = useAppStore()
  const [initializing, setInitializing] = useState(true)
  const firebaseReady = isFirebaseConfigured()

  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme')
    if (savedTheme) { try { setTheme(JSON.parse(savedTheme)) } catch {} }
  }, [])

  useEffect(() => {
    if (!firebaseReady) { setInitializing(false); setView('setup'); return }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { getDoc, doc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setAuth({
              uid: firebaseUser.uid, username: data.username,
              displayName: data.displayName || data.username,
              avatar: data.avatar || null, avatarColor: data.avatarColor || getAvatarColor(firebaseUser.uid),
              isOnline: true, lastSeen: null, usernameChangedAt: data.usernameChangedAt?.toMillis?.() || null,
            })
          } else { await auth.signOut(); setView('login') }
        } catch (err) { console.error(err); setView('login') }
      } else { localStorage.removeItem('chatUser'); setView('login') }
      setInitializing(false)
    })
    const safety = setTimeout(() => { setInitializing(false); if (!useAppStore.getState().currentUser) useAppStore.getState().setView('login') }, 10000)
    return () => { unsubscribe(); clearTimeout(safety) }
  }, [firebaseReady])

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[120px]" />
        
        <div className="text-center relative z-10">
          {/* Logo */}
          <div className="relative mx-auto mb-6">
            <div className="w-[88px] h-[88px] rounded-[22px] bg-[#00C896] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-float">
              <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="38" r="25" fill="white"/>
                <path d="M33 55 L22 76 L44 60 Z" fill="white"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-1">FurtherChat</h1>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-slate-400 text-sm">Loading your secure chat...</p>
          </div>
          
          {/* Loading bar */}
          <div className="mt-6 w-48 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full loading-shimmer" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser || view === 'login' || view === 'register') {
    return <AuthForm />
  }

  return <ChatApp />
}
