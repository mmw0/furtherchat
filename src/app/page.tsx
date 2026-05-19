'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthForm } from '@/components/auth-form'
import { ChatApp } from '@/components/chat-app'

export default function Home() {
  const { currentUser, setAuth, setView, view, theme, setTheme } = useAppStore()
  const [initializing, setInitializing] = useState(true)
  const firebaseReady = isFirebaseConfigured()

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    if (!firebaseReady) {
      setInitializing(false)
      setView('setup')
      return
    }

    // Check Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get user data
        try {
          const { getDoc, doc } = await import('firebase/firestore')
          const { db } = await import('@/lib/firebase')
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setAuth({
              uid: firebaseUser.uid,
              username: data.username,
              displayName: data.displayName || data.username,
              avatar: data.avatar || null,
              isOnline: true,
              lastSeen: null,
            })
          } else {
            // User doc doesn't exist, sign out
            await auth.signOut()
            setView('login')
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
          setView('login')
        }
      } else {
        // Check localStorage for cached user
        const savedUser = localStorage.getItem('chatUser')
        if (savedUser) {
          localStorage.removeItem('chatUser')
        }
        setView('login')
      }
      setInitializing(false)
    })

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      setInitializing(false)
      if (!useAppStore.getState().currentUser) {
        useAppStore.getState().setView('login')
      }
    }, 10000)

    return () => {
      unsubscribe()
      clearTimeout(safetyTimeout)
    }
  }, [firebaseReady])

  // Loading screen
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-emerald-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">Loading FurtherChat...</p>
        </div>
      </div>
    )
  }

  // Show auth form for login/register
  if (!currentUser || view === 'login' || view === 'register') {
    return <AuthForm />
  }

  // Show chat app
  return <ChatApp />
}
