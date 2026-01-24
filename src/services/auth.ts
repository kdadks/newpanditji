/**
 * Supabase Authentication Service
 * Handles admin authentication using Supabase Auth
 */

import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// Auth user type with role
export interface AuthUser {
  id: string
  email: string
  role: 'owner' | 'admin'
}

// Session state type
interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
}

// Create a simple state container
let authState: AuthState = {
  user: null,
  session: null,
  loading: true
}

// Listeners for auth state changes
type AuthStateListener = (state: AuthState) => void
const listeners: Set<AuthStateListener> = new Set()

// Notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(authState))
}

// Transform Supabase user to AuthUser
const transformUser = (user: User | null): AuthUser | null => {
  if (!user) return null
  return {
    id: user.id,
    email: user.email || '',
    role: 'owner' // Super admin only - no public signup
  }
}

// Initialize auth state from Supabase session
const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // If there's an error (like invalid refresh token), clear the session
    if (error) {
      console.warn('Session error, clearing auth state:', error.message)
      await clearAllAuthData()
      authState = { user: null, session: null, loading: false }
      notifyListeners()
      return
    }
    
    authState = {
      user: transformUser(session?.user ?? null),
      session: session,
      loading: false
    }
    notifyListeners()
  } catch (error: any) {
    console.error('Error initializing auth:', error)
    // Handle specific refresh token errors
    if (error?.message?.includes('refresh') || error?.message?.includes('Invalid Refresh Token')) {
      console.warn('Invalid refresh token detected, clearing all auth data')
      await clearAllAuthData()
    } else {
      // Clear any invalid session data
      await supabase.auth.signOut().catch(() => {})
    }
    authState = { user: null, session: null, loading: false }
    notifyListeners()
  }
}

// Helper function to clear all auth-related data
const clearAllAuthData = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut({ scope: 'local' })
  } catch (e) {
    console.warn('Error during signOut:', e)
  }
  
  // Clear all Supabase-related items from localStorage
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('supabase') || key === 'sb-auth-token'
      )
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.warn('Could not remove key:', key)
        }
      })
    } catch (e) {
      console.warn('Error clearing localStorage:', e)
    }
  }
}

// Set up auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  // Handle sign out event
  if (event === 'SIGNED_OUT') {
    authState = {
      user: null,
      session: null,
      loading: false
    }
    notifyListeners()
    return
  }
  
  // Handle token refresh error - clear session
  if (event === 'TOKEN_REFRESHED' && !session) {
    console.warn('Token refresh failed, clearing session')
    await clearAllAuthData()
    authState = {
      user: null,
      session: null,
      loading: false
    }
    notifyListeners()
    return
  }
  
  // Handle USER_UPDATED event with no session (indicates token issue)
  if (event === 'USER_UPDATED' && !session) {
    console.warn('User updated with no session, clearing auth data')
    await clearAllAuthData()
    authState = {
      user: null,
      session: null,
      loading: false
    }
    notifyListeners()
    return
  }
  
  authState = {
    user: transformUser(session?.user ?? null),
    session: session,
    loading: false
  }
  notifyListeners()
})

// Initialize on module load
initializeAuth()

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error.message)
        return false
      }

      return !!data.user
    } catch (error) {
      console.error('Login exception:', error)
      return false
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Get current authenticated user
   */
  user(): AuthUser | null {
    return authState.user
  }

  /**
   * Get current session
   */
  session(): Session | null {
    return authState.session
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authState.user !== null
  }

  /**
   * Check if user has owner role
   */
  isOwner(): boolean {
    return authState.user?.role === 'owner'
  }

  /**
   * Check if auth is still loading
   */
  isLoading(): boolean {
    return authState.loading
  }

  /**
   * Manually clear any invalid session data
   * Useful when encountering refresh token errors
   */
  async clearSession(): Promise<void> {
    try {
      await clearAllAuthData()
      authState = { user: null, session: null, loading: false }
      notifyListeners()
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: AuthStateListener): () => void {
    listeners.add(listener)
    // Immediately call listener with current state
    listener(authState)
    // Return unsubscribe function
    return () => {
      listeners.delete(listener)
    }
  }

  /**
   * Request password reset email
   */
  async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin?reset=true`
      })
      return !error
    } catch (error) {
      console.error('Password reset error:', error)
      return false
    }
  }

  /**
   * Update user password (when logged in)
   */
  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return !error
    } catch (error) {
      console.error('Update password error:', error)
      return false
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
