'use client'

import { useState, useEffect } from 'react'
import { authService, type AuthUser } from '../services/auth'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isOwner: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
}

/**
 * React hook for Supabase authentication
 * Provides reactive auth state and auth methods
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize auth state
    setUser(authService.user())
    setLoading(authService.isLoading())

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      setUser(state.user)
      setLoading(state.loading)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    return await authService.login(email, password)
  }

  const logout = async (): Promise<void> => {
    await authService.logout()
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    return await authService.resetPassword(email)
  }

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    isOwner: user?.role === 'owner',
    login,
    logout,
    resetPassword
  }
}
