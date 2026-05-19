// ============================================================
// ACCOUNT LOCKOUT SYSTEM
// Progressive lockout: 3 failures = 1min, 6 failures = 2min,
// 9 failures = 3min, etc.
// ============================================================

interface LockoutState {
  attempts: number
  lockedUntil: number | null
  lastAttemptAt: number | null
}

const LOCKOUT_KEY = 'chatapp_lockout_'
const MAX_ATTEMPTS_BEFORE_LOCK = 3
const BASE_LOCK_DURATION_MS = 60 * 1000 // 1 minute base

function getLockoutKey(username: string): string {
  return LOCKOUT_KEY + username.toLowerCase().trim()
}

export function getLockoutState(username: string): LockoutState {
  if (typeof window === 'undefined') return { attempts: 0, lockedUntil: null, lastAttemptAt: null }
  
  try {
    const stored = localStorage.getItem(getLockoutKey(username))
    if (!stored) return { attempts: 0, lockedUntil: null, lastAttemptAt: null }
    return JSON.parse(stored)
  } catch {
    return { attempts: 0, lockedUntil: null, lastAttemptAt: null }
  }
}

function saveLockoutState(username: string, state: LockoutState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getLockoutKey(username), JSON.stringify(state))
}

export function recordFailedAttempt(username: string): LockoutState {
  const current = getLockoutState(username)
  const now = Date.now()
  
  // Reset if lockout period has passed
  if (current.lockedUntil && now >= current.lockedUntil) {
    current.attempts = 0
    current.lockedUntil = null
  }
  
  const newState: LockoutState = {
    attempts: current.attempts + 1,
    lockedUntil: current.lockedUntil,
    lastAttemptAt: now,
  }
  
  // Check if we've hit the threshold for a new lockout
  const lockoutCycle = Math.floor(newState.attempts / MAX_ATTEMPTS_BEFORE_LOCK)
  if (newState.attempts % MAX_ATTEMPTS_BEFORE_LOCK === 0 && lockoutCycle > 0) {
    // Progressive lockout: 1min, 2min, 3min, etc.
    const lockDuration = lockoutCycle * BASE_LOCK_DURATION_MS
    newState.lockedUntil = now + lockDuration
  }
  
  saveLockoutState(username, newState)
  return newState
}

export function clearLockout(username: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getLockoutKey(username))
}

export function isAccountLocked(username: string): { locked: boolean; remainingMs: number; attemptsLeft: number } {
  const state = getLockoutState(username)
  const now = Date.now()
  
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingMs = state.lockedUntil - now
    const attemptsInCycle = state.attempts % MAX_ATTEMPTS_BEFORE_LOCK
    return {
      locked: true,
      remainingMs,
      attemptsLeft: MAX_ATTEMPTS_BEFORE_LOCK - attemptsInCycle,
    }
  }
  
  // If lockout expired, reset
  if (state.lockedUntil && now >= state.lockedUntil) {
    saveLockoutState(username, { attempts: 0, lockedUntil: null, lastAttemptAt: null })
  }
  
  const attemptsInCycle = state.attempts % MAX_ATTEMPTS_BEFORE_LOCK
  return {
    locked: false,
    remainingMs: 0,
    attemptsLeft: MAX_ATTEMPTS_BEFORE_LOCK - attemptsInCycle,
  }
}

export function formatRemainingTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}
