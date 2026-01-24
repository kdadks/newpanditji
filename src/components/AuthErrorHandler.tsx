'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { authService } from '@/services/auth'

/**
 * Global error handler for Supabase auth errors
 * Catches refresh token errors and clears invalid sessions
 */
export function AuthErrorHandler() {
  useEffect(() => {
    // Handle auth errors globally
    const handleAuthError = async (error: any) => {
      if (!error) return

      const errorMessage = error?.message || String(error)
      
      // Check for refresh token errors
      if (
        errorMessage.includes('refresh') ||
        errorMessage.includes('Invalid Refresh Token') ||
        errorMessage.includes('Refresh Token Not Found') ||
        errorMessage.includes('invalid_grant')
      ) {
        console.warn('Auth error detected, clearing session:', errorMessage)
        await authService.clearSession()
      }
    }

    // Listen for unhandled promise rejections from Supabase
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (error?.name === 'AuthApiError' || error?.constructor?.name === 'AuthApiError') {
        handleAuthError(error)
        // Prevent the error from appearing in console if it's a token error
        if (
          error?.message?.includes('refresh') ||
          error?.message?.includes('Invalid Refresh Token')
        ) {
          event.preventDefault()
        }
      }
    }

    // Listen for console errors (fallback)
    const originalError = console.error
    console.error = (...args: any[]) => {
      const errorStr = args.join(' ')
      if (
        errorStr.includes('AuthApiError') &&
        (errorStr.includes('refresh') || errorStr.includes('Invalid Refresh Token'))
      ) {
        handleAuthError(errorStr)
        return // Suppress the error log
      }
      originalError.apply(console, args)
    }

    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
      console.error = originalError
    }
  }, [])

  return null
}
