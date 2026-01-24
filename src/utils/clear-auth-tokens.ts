/**
 * Utility script to clear all Supabase auth tokens
 * Run this if you encounter persistent refresh token errors
 * 
 * Usage in browser console:
 * import('./clear-auth-tokens').then(m => m.clearAuthTokens())
 */

import { supabase } from '../lib/supabase'

export async function clearAuthTokens(): Promise<void> {
  console.log('🔄 Clearing all Supabase auth tokens...')
  
  try {
    // Sign out from Supabase
    await supabase.auth.signOut({ scope: 'local' })
    console.log('✅ Signed out from Supabase')
  } catch (error) {
    console.warn('⚠️ Error signing out:', error)
  }
  
  // Clear all Supabase-related items from localStorage
  if (typeof window !== 'undefined') {
    try {
      const allKeys = Object.keys(localStorage)
      const supabaseKeys = allKeys.filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase') || 
        key === 'sb-auth-token'
      )
      
      console.log(`📦 Found ${supabaseKeys.length} Supabase keys to remove:`, supabaseKeys)
      
      supabaseKeys.forEach(key => {
        localStorage.removeItem(key)
        console.log(`  ✅ Removed: ${key}`)
      })
      
      console.log('✅ All Supabase tokens cleared from localStorage')
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error)
    }
  }
  
  // Clear sessionStorage as well
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const allKeys = Object.keys(sessionStorage)
      const supabaseKeys = allKeys.filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase')
      )
      
      if (supabaseKeys.length > 0) {
        console.log(`📦 Found ${supabaseKeys.length} Supabase keys in sessionStorage`)
        supabaseKeys.forEach(key => {
          sessionStorage.removeItem(key)
          console.log(`  ✅ Removed from sessionStorage: ${key}`)
        })
      }
    } catch (error) {
      console.error('❌ Error clearing sessionStorage:', error)
    }
  }
  
  console.log('✅ Token cleanup complete! Please refresh the page.')
}

// Auto-run if loaded as a script
if (typeof window !== 'undefined' && window.location.search.includes('clear-tokens=true')) {
  clearAuthTokens().then(() => {
    // Redirect to home after clearing
    setTimeout(() => {
      window.location.href = window.location.origin
    }, 1000)
  })
}
