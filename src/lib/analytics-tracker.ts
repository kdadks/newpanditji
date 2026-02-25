import { supabase } from './supabase'

// Generate a session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Detect device type
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet'
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile'
  }
  if (userAgent.includes('windows') || userAgent.includes('mac') || userAgent.includes('linux')) {
    return 'desktop'
  }
  return 'unknown'
}

// Get browser name
function getBrowser(): string {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

// Get OS name
function getOS(): string {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'MacOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS'
  return 'Unknown'
}

const LOCATION_CACHE_KEY = 'analytics_location_cache'

interface LocationData {
  country: string | null
  city: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
  ip_address: string | null
}

// Get location data (using a free IP geolocation service).
// Result is cached in sessionStorage for the lifetime of the browser session
// so ipapi.co is called at most once per session (free tier: 1,000 req/day).
async function getLocationData(): Promise<LocationData> {
  try {
    const cached = sessionStorage.getItem(LOCATION_CACHE_KEY)
    if (cached) {
      return JSON.parse(cached) as LocationData
    }
  } catch {
    // sessionStorage unavailable — fall through to fetch
  }

  const empty: LocationData = {
    country: null, city: null, region: null,
    latitude: null, longitude: null, ip_address: null,
  }

  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    const result: LocationData = {
      country: data.country_name || null,
      city: data.city || null,
      region: data.region || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      ip_address: data.ip || null,
    }
    try {
      sessionStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(result))
    } catch {
      // Ignore storage quota errors
    }
    return result
  } catch (error) {
    console.error('Error fetching location data:', error)
    return empty
  }
}

// Track page view
export async function trackPageView(pagePath: string, pageTitle?: string) {
  try {
    const locationData = await getLocationData()

    // Extract domain from referrer if it exists
    let referrerDomain = null
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer)
        referrerDomain = referrerUrl.hostname
      } catch (e) {
        // Invalid referrer URL
      }
    }

    await supabase.from('page_views').insert({
      page_slug: pagePath,
      page_title: pageTitle || document.title,
      referrer_url: document.referrer || null,
      referrer_domain: referrerDomain,
      user_agent: navigator.userAgent,
      ip_address: locationData.ip_address,
      country: locationData.country,
      city: locationData.city,
      region: locationData.region,
      device_type: getDeviceType(),
      browser: getBrowser(),
      operating_system: getOS(),
      session_id: getSessionId(),
    })

    // Track referrer source if exists
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer)
        const domain = referrerUrl.hostname

        const { error } = await supabase.rpc('upsert_referrer_source', {
          p_source_url: document.referrer,
          p_source_domain: domain,
        })
        
        if (error) {
          // Fallback if RPC doesn't exist - ignore errors
          await supabase.from('referrer_sources').insert({
            source_url: document.referrer,
            source_domain: domain,
          })
        }
      } catch {
        // Ignore referrer tracking errors
      }
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Track service view
export async function trackServiceView(serviceId: string, serviceName: string) {
  try {
    const locationData = await getLocationData()

    await supabase.from('service_views').insert({
      service_id: serviceId,
      service_name: serviceName,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      ip_address: locationData.ip_address,
      country: locationData.country,
      city: locationData.city,
      region: locationData.region,
      device_type: getDeviceType(),
      session_id: getSessionId(),
    })
  } catch (error) {
    console.error('Error tracking service view:', error)
  }
}

// Custom event tracking (optional - for future use)
export async function trackEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    console.log('Custom event tracked:', eventName, eventData)
    // You can extend this to track custom events if needed
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}
