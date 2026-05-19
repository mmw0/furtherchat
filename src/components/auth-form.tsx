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
      <div className="min-h-screen flex items-center justify-center bg-[#0b141a] p-4">
        <div className="w-full max-w-md bg-[#1f2c34] rounded-2xl border border-[#2a3942] overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#e9edef] mb-2">Firebase Setup Required</h2>
            <p className="text-sm text-[#8696a0] mb-4">This chat app requires Firebase for real-time messaging.</p>
          </div>
          <div className="px-6 pb-6 space-y-3 text-sm text-[#e9edef]">
            <p className="font-medium text-amber-400">Setup steps:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-[#8696a0]">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-400 underline">Firebase Console</a></li>
              <li>Create a new project (free)</li>
              <li>Enable Authentication with Email/Password</li>
              <li>Create a Firestore Database</li>
              <li>Create a Realtime Database</li>
              <li>Add a Web App & copy config</li>
              <li>Edit <code className="bg-[#2a3942] px-1 rounded text-xs">src/lib/firebase.ts</code></li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  const isLogin = view === 'login' || view === 'chat'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b141a] p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#111b21] rounded-2xl border border-[#2a3942] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center">
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25" style={{ width: 72, height: 72 }}>
              <MessageCircle className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e9edef] mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-[#8696a0]">
              {isLogin ? 'Sign in to continue to FurtherChat' : 'Sign up to start chatting'}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 space-y-4">
            {/* Lockout Warning */}
            {lockInfo?.locked && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">Account locked. Try again in <strong>{lockTimer}</strong></p>
              </div>
            )}

            {/* Attempts Warning */}
            {lockInfo && !lockInfo.locked && lockInfo.attemptsLeft < 3 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300">{lockInfo.attemptsLeft} attempt{lockInfo.attemptsLeft !== 1 ? 's' : ''} remaining before lockout</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {/* Display Name (Register only) */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label className="text-[#8696a0] text-xs font-medium">Display Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                    <Input type="text" placeholder="Your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-11 h-11 bg-[#2a3942] border-0 text-[#e9edef] placeholder:text-[#667781] rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30" required={!isLogin} />
                  </div>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <Label className="text-[#8696a0] text-xs font-medium">Username</Label>
                <div className="relative">
                  <LogIn className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                  <Input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="pl-11 h-11 bg-[#2a3942] border-0 text-[#e9edef] placeholder:text-[#667781] rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30" required disabled={lockInfo?.locked || false} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-[#8696a0] text-xs font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-11 bg-[#2a3942] border-0 text-[#e9edef] placeholder:text-[#667781] rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500/30" required disabled={lockInfo?.locked || false} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-[#e9edef] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading || (lockInfo?.locked || false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium h-11 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center pt-1">
              <button onClick={() => { setView(isLogin ? 'register' : 'login'); setError(''); setLockInfo(null) }}
                className="text-sm text-[#8696a0] hover:text-emerald-400 transition-colors">
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Security notice */}
            <div className="flex items-center gap-2 justify-center pt-1">
              <Shield className="h-3.5 w-3.5 text-[#667781]" />
              <p className="text-[11px] text-[#667781]">Account locks after 3 failed attempts (1min, 2min, 3min...)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
