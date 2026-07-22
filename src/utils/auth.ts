// ==================== AUTH SERVICE ====================
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'seller' | 'admin'
  avatar?: string
  coins: number
  membership: 'basic' | 'prime' | 'premium'
  created_at: string
  updated_at: string
}

let currentProfile: Profile | null = null
let authListeners: ((profile: Profile | null) => void)[] = []

// ============================================================
// INIT: Listen for auth state changes
// ============================================================
export function initAuth(): Promise<Profile | null> {
  return new Promise((resolve) => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        currentProfile = profile
        authListeners.forEach(fn => fn(profile))
        resolve(profile)
      } else {
        currentProfile = null
        authListeners.forEach(fn => fn(null))
        resolve(null)
      }
    })

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          currentProfile = profile
          authListeners.forEach(fn => fn(profile))
          resolve(profile)
        })
      } else {
        resolve(null)
      }
    })
  })
}

// ============================================================
// LISTENERS
// ============================================================
export function onAuthChange(fn: (profile: Profile | null) => void): () => void {
  authListeners.push(fn)
  return () => { authListeners = authListeners.filter(l => l !== fn) }
}

// ============================================================
// FETCH PROFILE
// ============================================================
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('[Auth] Failed to fetch profile:', error)
    return null
  }
  return data as Profile
}

// ============================================================
// REGISTER
// ============================================================
export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) return { success: false, error: error.message }
  if (!data.user) return { success: false, error: 'Registration failed' }

  // Profile is auto-created by trigger, but fetch it
  const profile = await fetchProfile(data.user.id)
  currentProfile = profile
  authListeners.forEach(fn => fn(profile))
  return { success: true, profile: profile! }
}

// ============================================================
// LOGIN
// ============================================================
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { success: false, error: error.message }
  if (!data.user) return { success: false, error: 'Login failed' }

  const profile = await fetchProfile(data.user.id)
  currentProfile = profile
  authListeners.forEach(fn => fn(profile))
  return { success: true, profile: profile! }
}

// ============================================================
// LOGOUT
// ============================================================
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
  currentProfile = null
  authListeners.forEach(fn => fn(null))
  window.location.href = '/'
}

// ============================================================
// GETTERS
// ============================================================
export function getCurrentProfile(): Profile | null {
  return currentProfile
}

export function isLoggedIn(): boolean {
  return !!currentProfile
}

export function isAdmin(): boolean {
  return currentProfile?.role === 'admin'
}

export function isSeller(): boolean {
  return currentProfile?.role === 'seller'
}

export async function refreshProfile(): Promise<Profile | null> {
  if (!currentProfile) return null
  const profile = await fetchProfile(currentProfile.id)
  currentProfile = profile
  authListeners.forEach(fn => fn(profile))
  return profile
}

// ============================================================
// UPDATE PROFILE
// ============================================================
export async function updateProfile(
  updates: Partial<Pick<Profile, 'name' | 'phone' | 'avatar'>>
): Promise<{ success: boolean; error?: string }> {
  if (!currentProfile) return { success: false, error: 'Not logged in' }

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', currentProfile.id)

  if (error) return { success: false, error: error.message }

  await refreshProfile()
  return { success: true }
}

// ============================================================
// PASSWORD RESET
// ============================================================
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?tab=reset`,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ============================================================
// ADMIN: Make user admin (call from Supabase SQL editor)
// ============================================================
// UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
