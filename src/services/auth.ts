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
    const { data: { session } } = await supabase.auth.getSession()
    authState = {
      user: transformUser(session?.user ?? null),
      session: session,
      loading: false
    }
    notifyListeners()
  } catch (error) {
    console.error('Error initializing auth:', error)
    authState = { user: null, session: null, loading: false }
    notifyListeners()
  }
}

// Set up auth state change listener
supabase.auth.onAuthStateChange((_event, session) => {
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
