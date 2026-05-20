'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { isFirebaseConfigured } from '@/lib/firebase'
import { loginUser, registerUser } from '@/lib/firebase-service'
import {
  isAccountLocked, recordFailedAttempt, clearLockout, formatRemainingTime,
} from '@/lib/auth-lockout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Lock, UserPlus, LogIn, AlertTriangle, Clock, Eye, EyeOff } from 'lucide-react'

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

  useEffect(() => { setFirebaseReady(isFirebaseConfigured()) }, [])

  useEffect(() => {
    if (!lockInfo?.locked) { setLockTimer(''); return }
    const interval = setInterval(() => {
      const info = isAccountLocked(username)
      if (info.locked) { setLockTimer(formatRemainingTime(info.remainingMs)) }
      else { setLockInfo({ locked: false, remainingMs: 0, attemptsLeft: 3 }); setLockTimer(''); clearInterval(interval) }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockInfo?.locked, username])

  useEffect(() => {
    if (username.trim()) { setLockInfo(isAccountLocked(username)) }
  }, [username])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    const lockStatus = isAccountLocked(username)
    if (lockStatus.locked) { setLockInfo(lockStatus); setLockTimer(formatRemainingTime(lockStatus.remainingMs)); setError(`Account locked. Try again in ${formatRemainingTime(lockStatus.remainingMs)}`); return }
    setLoading(true); setError('')
    try {
      const user = await loginUser(username, password)
      clearLockout(username); setAuth(user)
    } catch (err: any) {
      const state = recordFailedAttempt(username)
      const lockStatus = isAccountLocked(username)
      setLockInfo(lockStatus)
      if (lockStatus.locked) { setError(`Too many failed attempts. Locked for ${formatRemainingTime(lockStatus.remainingMs)}`) }
      else { const attemptsLeft = 3 - (state.attempts % 3); setError(`Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`) }
    } finally { setLoading(false) }
  }, [username, password, setAuth])

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password || !displayName.trim()) return
    if (username.trim().length < 3) { setError('Username must be at least 3 characters'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (displayName.trim().length < 2) { setError('Display name must be at least 2 characters'); return }
    setLoading(true); setError('')
    try {
      const user = await registerUser(username, password, displayName)
      setAuth(user)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' || err.message === 'Username already taken') { setError('Username already taken') }
      else { setError(err.message || 'Registration failed.') }
    } finally { setLoading(false) }
  }, [username, password, displayName, setAuth])

  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Firebase Setup Required</h2>
          <p className="text-sm text-slate-400 mb-4">This chat app requires Firebase for real-time messaging.</p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-sm text-left">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-sky-400 underline">Firebase Console</a></li>
            <li>Create a new project (free)</li>
            <li>Enable Authentication with Email/Password</li>
            <li>Create a Firestore Database</li>
            <li>Create a Realtime Database</li>
            <li>Add a Web App & copy config</li>
            <li>Edit <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">src/lib/firebase.ts</code></li>
          </ol>
        </div>
      </div>
    )
  }

  const isLogin = view === 'login' || view === 'chat'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center">
            <div className="w-[72px] h-[72px] rounded-[18px] bg-[#00C853] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
                <path d="M25 28h50c5.5 0 10 4.5 10 10v24c0 5.5-4.5 10-10 10H42l-10 12V72H25c-5.5 0-10-4.5-10-10V38c0-5.5 4.5-10 10-10z" fill="white"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-slate-400">
              {isLogin ? 'Sign in to continue to FurtherChat' : 'Sign up to start chatting'}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 space-y-4">
            {lockInfo?.locked && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">Account locked. Try again in <strong>{lockTimer}</strong></p>
              </div>
            )}

            {lockInfo && !lockInfo.locked && lockInfo.attemptsLeft < 3 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300">{lockInfo.attemptsLeft} attempt{lockInfo.attemptsLeft !== 1 ? 's' : ''} remaining before lockout</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs font-medium">Display Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input type="text" placeholder="Your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30" required={!isLogin} />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-medium">Username</Label>
                <div className="relative">
                  <LogIn className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30" required disabled={lockInfo?.locked || false} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30" required disabled={lockInfo?.locked || false} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading || (lockInfo?.locked || false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold h-11 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center pt-1">
              <button onClick={() => { setView(isLogin ? 'register' : 'login'); setError(''); setLockInfo(null) }}
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
              </button>
            </div>

            <div className="flex items-center gap-2 justify-center pt-1">
              <Shield className="h-3.5 w-3.5 text-slate-600" />
              <p className="text-[11px] text-slate-600">Account locks after 3 failed attempts (1min, 2min, 3min...)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
