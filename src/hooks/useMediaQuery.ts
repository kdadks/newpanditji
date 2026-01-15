'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect mobile devices and disable heavy animations
 * Prevents performance issues on mobile by checking screen width
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])
  
  return isMobile
}

/**
 * Hook to check if user prefers reduced motion (accessibility)
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }
    
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  
  return prefersReducedMotion
}

/**
 * Combined hook to check if animations should be disabled
 * Returns true if animations should be disabled (mobile OR reduced motion preference)
 */
export function useDisableAnimations(): boolean {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  
  return isMobile || prefersReducedMotion
}
