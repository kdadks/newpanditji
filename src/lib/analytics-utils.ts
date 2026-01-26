/**
 * Analytics Utilities
 * Helper functions for analytics tracking
 */

/**
 * Check if we should track analytics
 * Returns false for localhost/development environments
 * Returns true for production environments
 */
export function shouldTrackAnalytics(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const hostname = window.location.hostname

  // Don't track in development/localhost
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local') ||
    hostname.includes('localhost')

  // Also check for common development indicators
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    hostname.includes('dev') ||
    hostname.includes('staging') ||
    hostname.includes('test')

  return !isLocalhost && !isDevelopment
}

/**
 * Get the environment name
 */
export function getEnvironment(): 'production' | 'development' | 'localhost' {
  if (typeof window === 'undefined') {
    return 'development'
  }

  const hostname = window.location.hostname

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost'
  }

  if (process.env.NODE_ENV === 'production') {
    return 'production'
  }

  return 'development'
}
