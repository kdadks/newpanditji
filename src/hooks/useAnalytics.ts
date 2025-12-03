import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface AnalyticsSummary {
  date: string
  total_views: number
  unique_sessions: number
  countries_count: number
  mobile_views: number
  desktop_views: number
  tablet_views: number
}

export interface PopularPage {
  page_path: string
  page_title: string
  view_count: number
  unique_visitors: number
  last_viewed: string
}

export interface PopularService {
  service_id: string
  service_name: string
  view_count: number
  unique_visitors: number
  last_viewed: string
}

export interface LocationStat {
  country: string
  visit_count: number
  unique_visitors: number
  cities_count: number
}

export interface TopReferrer {
  source_domain: string
  total_visits: number
  last_visit: string
}

export interface PageView {
  id: string
  page_path: string
  page_title: string | null
  referrer: string | null
  country: string | null
  city: string | null
  device_type: string | null
  created_at: string
}

// Fetch analytics summary for the last 30 days
async function fetchAnalyticsSummary(): Promise<AnalyticsSummary[]> {
  const { data, error } = await supabase
    .from('analytics_summary')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  if (error) {
    console.error('Error fetching analytics summary:', error)
    throw error
  }

  return data || []
}

// Fetch popular pages
async function fetchPopularPages(): Promise<PopularPage[]> {
  const { data, error } = await supabase
    .from('popular_pages')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching popular pages:', error)
    throw error
  }

  return data || []
}

// Fetch popular services
async function fetchPopularServices(): Promise<PopularService[]> {
  const { data, error } = await supabase
    .from('popular_services')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching popular services:', error)
    throw error
  }

  return data || []
}

// Fetch location statistics
async function fetchLocationStats(): Promise<LocationStat[]> {
  const { data, error } = await supabase
    .from('location_stats')
    .select('*')
    .limit(20)

  if (error) {
    console.error('Error fetching location stats:', error)
    throw error
  }

  return data || []
}

// Fetch top referrers
async function fetchTopReferrers(): Promise<TopReferrer[]> {
  const { data, error } = await supabase
    .from('top_referrers')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching top referrers:', error)
    throw error
  }

  return data || []
}

// Fetch recent page views
async function fetchRecentPageViews(limit: number = 50): Promise<PageView[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('id, page_path, page_title, referrer, country, city, device_type, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent page views:', error)
    throw error
  }

  return data || []
}

// Get total stats
async function fetchTotalStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [pageViewsResult, serviceViewsResult, uniqueVisitorsResult] = await Promise.all([
    supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString()),

    supabase
      .from('service_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString()),

    supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
  ])

  const uniqueSessions = new Set(
    (uniqueVisitorsResult.data || []).map(v => v.session_id).filter(Boolean)
  ).size

  return {
    totalPageViews: pageViewsResult.count || 0,
    totalServiceViews: serviceViewsResult.count || 0,
    uniqueVisitors: uniqueSessions,
  }
}

// Hook for analytics summary
export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary[]>({
    queryKey: ['analytics', 'summary'],
    queryFn: fetchAnalyticsSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for popular pages
export function usePopularPages() {
  return useQuery<PopularPage[]>({
    queryKey: ['analytics', 'popular-pages'],
    queryFn: fetchPopularPages,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for popular services
export function usePopularServices() {
  return useQuery<PopularService[]>({
    queryKey: ['analytics', 'popular-services'],
    queryFn: fetchPopularServices,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for location stats
export function useLocationStats() {
  return useQuery<LocationStat[]>({
    queryKey: ['analytics', 'location-stats'],
    queryFn: fetchLocationStats,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for top referrers
export function useTopReferrers() {
  return useQuery<TopReferrer[]>({
    queryKey: ['analytics', 'top-referrers'],
    queryFn: fetchTopReferrers,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for recent page views
export function useRecentPageViews(limit: number = 50) {
  return useQuery<PageView[]>({
    queryKey: ['analytics', 'recent-views', limit],
    queryFn: () => fetchRecentPageViews(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hook for total stats
export function useTotalStats() {
  return useQuery({
    queryKey: ['analytics', 'total-stats'],
    queryFn: fetchTotalStats,
    staleTime: 5 * 60 * 1000,
  })
}
