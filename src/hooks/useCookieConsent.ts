'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const CONSENT_COOKIE_NAME = 'cookie_consent_id'
const CONSENT_EXPIRY_DAYS = 365

/**
 * Generate a unique consent ID
 */
function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get consent ID from cookie or generate new one
 */
function getConsentId(): string {
  if (typeof document === 'undefined') return ''

  const cookies = document.cookie.split(';')
  const consentCookie = cookies.find(c => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (consentCookie) {
    return consentCookie.split('=')[1].trim()
  }

  return generateConsentId()
}

/**
 * Set consent ID cookie
 */
function setConsentIdCookie(consentId: string): void {
  if (typeof document === 'undefined') return

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

  document.cookie = `${CONSENT_COOKIE_NAME}=${consentId}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax; Secure`
}

/**
 * Get consent from localStorage
 */
function getStoredConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('cookie_consent')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error('Failed to parse stored consent:', err)
  }

  return null
}

/**
 * Save consent to localStorage
 */
function setStoredConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('cookie_consent', JSON.stringify(consent))
  } catch (err) {
    console.error('Failed to store consent:', err)
  }
}

/**
 * Save consent to database
 */
async function saveConsentToDatabase(consentId: string, consent: CookieConsent): Promise<void> {
  try {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

    await supabase.from('user_cookie_consents').insert({
      consent_id: consentId,
      necessary_cookies: consent.necessary,
      analytics_cookies: consent.analytics,
      marketing_cookies: consent.marketing,
      preferences_cookies: consent.preferences,
      ip_address: null, // IP will be captured server-side if needed
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      consent_version: '1.0',
      consented_at: new Date().toISOString(),
      expires_at: expiryDate.toISOString()
    })
  } catch (err) {
    console.error('Failed to save consent to database:', err)
  }
}

/**
 * Hook to manage cookie consent
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if consent already exists
    const storedConsent = getStoredConsent()

    if (storedConsent) {
      setConsent(storedConsent)
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }

    setIsLoading(false)
  }, [])

  const acceptAll = async () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }

    const consentId = getConsentId()
    setConsentIdCookie(consentId)
    setStoredConsent(newConsent)
    setConsent(newConsent)
    setShowBanner(false)

    await saveConsentToDatabase(consentId, newConsent)
  }

  const acceptNecessary = async () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }

    const consentId = getConsentId()
    setConsentIdCookie(consentId)
    setStoredConsent(newConsent)
    setConsent(newConsent)
    setShowBanner(false)

    await saveConsentToDatabase(consentId, newConsent)
  }

  const acceptCustom = async (customConsent: CookieConsent) => {
    // Necessary cookies are always required
    const newConsent: CookieConsent = {
      ...customConsent,
      necessary: true
    }

    const consentId = getConsentId()
    setConsentIdCookie(consentId)
    setStoredConsent(newConsent)
    setConsent(newConsent)
    setShowBanner(false)

    await saveConsentToDatabase(consentId, newConsent)
  }

  const resetConsent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookie_consent')
      document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
    setConsent(null)
    setShowBanner(true)
  }

  return {
    consent,
    isLoading,
    showBanner,
    hasConsent: consent !== null,
    acceptAll,
    acceptNecessary,
    acceptCustom,
    resetConsent
  }
}

/**
 * Check if specific cookie type is allowed
 */
export function isCookieAllowed(type: keyof CookieConsent): boolean {
  if (typeof window === 'undefined') return false

  const stored = getStoredConsent()
  if (!stored) return false

  return stored[type] === true
}

/**
 * Check if analytics cookies are allowed
 */
export function canTrackAnalytics(): boolean {
  return isCookieAllowed('analytics')
}
