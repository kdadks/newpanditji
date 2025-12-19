'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface AnalyticsSummary {
  id: string
  date: string
  total_page_views: number
  unique_visitors: number
  total_sessions: number
  avg_session_duration_seconds: number | null
  bounce_rate: number | null
  top_pages: Record<string, number> | null
  traffic_sources: Record<string, number> | null
  device_breakdown: Record<string, number> | null
  browser_breakdown: Record<string, number> | null
  top_countries: Record<string, number> | null
  top_referrers: Record<string, number> | null
}

export interface PopularPage {
  page_slug: string
  page_title: string | null
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
}

export interface TopReferrer {
  referrer_domain: string
  total_visits: number
  last_visit: string
}

export interface PageView {
  id: string
  page_slug: string
  page_title: string | null
  referrer_url: string | null
  referrer_domain: string | null
  country: string | null
  city: string | null
  device_type: string | null
  viewed_at: string
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
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }

  return data || []
}

// Fetch popular pages by aggregating page_views
async function fetchPopularPages(): Promise<PopularPage[]> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('page_slug, page_title, session_id, viewed_at')
      .order('viewed_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('Error fetching page views for popular pages:', error)
      return []
    }

    // Aggregate by page_slug
    const pageStats = new Map<string, { 
      page_title: string | null
      view_count: number
      sessions: Set<string>
      last_viewed: string 
    }>()

    for (const view of data || []) {
      const existing = pageStats.get(view.page_slug)
      if (existing) {
        existing.view_count++
        if (view.session_id) existing.sessions.add(view.session_id)
        if (view.viewed_at > existing.last_viewed) {
          existing.last_viewed = view.viewed_at
        }
      } else {
        pageStats.set(view.page_slug, {
          page_title: view.page_title,
          view_count: 1,
          sessions: view.session_id ? new Set([view.session_id]) : new Set(),
          last_viewed: view.viewed_at
        })
      }
    }

    return Array.from(pageStats.entries())
      .map(([page_slug, stats]) => ({
        page_slug,
        page_title: stats.page_title,
        view_count: stats.view_count,
        unique_visitors: stats.sessions.size,
        last_viewed: stats.last_viewed
      }))
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 10)
  } catch (err) {
    console.error('Error in fetchPopularPages:', err)
    return []
  }
}

// Fetch popular services - placeholder since service_views may not exist
async function fetchPopularServices(): Promise<PopularService[]> {
  // Return empty array - service tracking can be implemented later
  return []
}

// Fetch location statistics by aggregating page_views
async function fetchLocationStats(): Promise<LocationStat[]> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('country, session_id')
      .not('country', 'is', null)
      .limit(1000)

    if (error) {
      console.error('Error fetching location stats:', error)
      return []
    }

    // Aggregate by country
    const countryStats = new Map<string, { 
      visit_count: number
      sessions: Set<string>
    }>()

    for (const view of data || []) {
      if (!view.country) continue
      const existing = countryStats.get(view.country)
      if (existing) {
        existing.visit_count++
        if (view.session_id) existing.sessions.add(view.session_id)
      } else {
        countryStats.set(view.country, {
          visit_count: 1,
          sessions: view.session_id ? new Set([view.session_id]) : new Set()
        })
      }
    }

    return Array.from(countryStats.entries())
      .map(([country, stats]) => ({
        country,
        visit_count: stats.visit_count,
        unique_visitors: stats.sessions.size
      }))
      .sort((a, b) => b.visit_count - a.visit_count)
      .slice(0, 20)
  } catch (err) {
    console.error('Error in fetchLocationStats:', err)
    return []
  }
}

// Fetch top referrers by aggregating page_views
async function fetchTopReferrers(): Promise<TopReferrer[]> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('referrer_domain, viewed_at')
      .not('referrer_domain', 'is', null)
      .order('viewed_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('Error fetching top referrers:', error)
      return []
    }

    // Aggregate by referrer_domain
    const referrerStats = new Map<string, { 
      total_visits: number
      last_visit: string 
    }>()

    for (const view of data || []) {
      if (!view.referrer_domain) continue
      const existing = referrerStats.get(view.referrer_domain)
      if (existing) {
        existing.total_visits++
        if (view.viewed_at > existing.last_visit) {
          existing.last_visit = view.viewed_at
        }
      } else {
        referrerStats.set(view.referrer_domain, {
          total_visits: 1,
          last_visit: view.viewed_at
        })
      }
    }

    return Array.from(referrerStats.entries())
      .map(([referrer_domain, stats]) => ({
        referrer_domain,
        total_visits: stats.total_visits,
        last_visit: stats.last_visit
      }))
      .sort((a, b) => b.total_visits - a.total_visits)
      .slice(0, 10)
  } catch (err) {
    console.error('Error in fetchTopReferrers:', err)
    return []
  }
}

// Fetch recent page views
async function fetchRecentPageViews(limit: number = 50): Promise<PageView[]> {
  const { data, error } = await supabase
    .from('page_views')
    .select('id, page_slug, page_title, referrer_url, referrer_domain, country, city, device_type, viewed_at')
    .order('viewed_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent page views:', error)
    return []
  }

  return data || []
}

// Get total stats
async function fetchTotalStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  try {
    const [pageViewsResult, uniqueVisitorsResult] = await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', thirtyDaysAgo.toISOString()),

      supabase
        .from('page_views')
        .select('session_id')
        .gte('viewed_at', thirtyDaysAgo.toISOString())
    ])

    const uniqueSessions = new Set(
      (uniqueVisitorsResult.data || []).map(v => v.session_id).filter(Boolean)
    ).size

    return {
      totalPageViews: pageViewsResult.count || 0,
      totalServiceViews: 0, // Service views tracking not implemented
      uniqueVisitors: uniqueSessions,
    }
  } catch (err) {
    console.error('Error in fetchTotalStats:', err)
    return {
      totalPageViews: 0,
      totalServiceViews: 0,
      uniqueVisitors: 0,
    }
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
