'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import { loginUser, registerUser } from '@/lib/firebase-service'
import {
  isAccountLocked,
  recordFailedAttempt,
  clearLockout,
  formatRemainingTime,
} from '@/lib/auth-lockout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock, UserPlus, LogIn, AlertTriangle, Clock, Eye, EyeOff, MessageCircle } from 'lucide-react'

export function AuthForm() {
  const { view, setView, setAuth } = useAppStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockInfo, setLockInfo] = useState<{ locked: boolean; remainingMs: number; attemptsLeft: number } | null>(null)
  const [lockTimer, setLockTimer] = useState<string>('')
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    setFirebaseReady(isFirebaseConfigured())
  }, [])

  // Update lock timer every second
  useEffect(() => {
    if (!lockInfo?.locked) {
      setLockTimer('')
      return
    }

    const interval = setInterval(() => {
      const info = isAccountLocked(username)
      if (info.locked) {
        setLockTimer(formatRemainingTime(info.remainingMs))
      } else {
        setLockInfo({ locked: false, remainingMs: 0, attemptsLeft: 3 })
        setLockTimer('')
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockInfo?.locked, username])

  // Check lock status when username changes
  useEffect(() => {
    if (username.trim()) {
      const info = isAccountLocked(username)
      setLockInfo(info)
    }
  }, [username])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return

    // Check lock status
    const lockStatus = isAccountLocked(username)
    if (lockStatus.locked) {
      setLockInfo(lockStatus)
      setLockTimer(formatRemainingTime(lockStatus.remainingMs))
      setError(`Account is locked. Try again in ${formatRemainingTime(lockStatus.remainingMs)}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await loginUser(username, password)
      clearLockout(username)
      setAuth(user)
    } catch (err: any) {
      const state = recordFailedAttempt(username)
      const lockStatus = isAccountLocked(username)
      setLockInfo(lockStatus)

      if (lockStatus.locked) {
        setError(`Too many failed attempts. Account locked for ${formatRemainingTime(lockStatus.remainingMs)}`)
      } else {
        const attemptsLeft = 3 - (state.attempts % 3)
        setError(`Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before lockout.`)
      }
    } finally {
      setLoading(false)
    }
  }, [username, password, setAuth])

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password || !displayName.trim()) return

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await registerUser(username, password, displayName)
      setAuth(user)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Username already taken')
      } else if (err.message === 'Username already taken') {
        setError('Username already taken')
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [username, password, displayName, setAuth])

  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <Card className="w-full max-w-md border-amber-500/30 bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-white">Firebase Setup Required</CardTitle>
            <CardDescription className="text-slate-400">
              This chat app requires Firebase for real-time messaging and authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-slate-300">
              <p className="font-medium text-amber-400">Follow these steps to set up Firebase:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-400 underline hover:text-blue-300">Firebase Console</a></li>
                <li>Create a new project (free)</li>
                <li>Enable <strong>Authentication</strong> with Email/Password</li>
                <li>Create a <strong>Firestore Database</strong></li>
                <li>Create a <strong>Realtime Database</strong></li>
                <li>Add a Web App & copy the config</li>
                <li>Set environment variables or edit <code className="bg-slate-800 px-1 rounded">src/lib/firebase.ts</code></li>
              </ol>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-mono text-slate-400">
              <p>NEXT_PUBLIC_FIREBASE_API_KEY=your_key</p>
              <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</p>
              <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id</p>
              <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com</p>
              <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</p>
              <p>NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id</p>
              <p>NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLogin = view === 'login' || view === 'chat'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-black/40">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {isLogin ? 'Sign in to continue chatting' : 'Join the conversation today'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Lockout Warning */}
          {lockInfo?.locked && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <Clock className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                Account locked due to too many failed attempts. Try again in <strong>{lockTimer}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Attempts Warning */}
          {lockInfo && !lockInfo.locked && lockInfo.attemptsLeft < 3 && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <Shield className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-300">
                {lockInfo.attemptsLeft} attempt{lockInfo.attemptsLeft !== 1 ? 's' : ''} remaining before account lockout
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {/* Display Name (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-slate-300 text-sm font-medium">Display Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300 text-sm font-medium">Username</Label>
              <div className="relative">
                <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="pl-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  required
                  disabled={lockInfo?.locked || false}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  required
                  disabled={lockInfo?.locked || false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || (lockInfo?.locked || false)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-2.5 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setView(isLogin ? 'register' : 'login')
                setError('')
                setLockInfo(null)
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Security notice */}
          <div className="flex items-center gap-2 justify-center pt-1">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <p className="text-xs text-slate-500">
              Account locks after 3 failed attempts (1min, 2min, 3min...)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
