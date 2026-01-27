import { useState } from 'react'
import {
  ChartBar,
  Globe,
  Eye,
  TrendUp,
  Users,
  DeviceMobile,
  Desktop,
  MapPin,
  ArrowRight,
  Spinner,
  Cookie,
  ShieldCheck
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  useAnalyticsSummary,
  usePopularPages,
  usePopularServices,
  useLocationStats,
  useTopReferrers,
  useRecentPageViews,
  useTotalStats,
  useConsentStats,
} from '../../hooks/useAnalytics'

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary()
  const { data: popularPages, isLoading: pagesLoading } = usePopularPages()
  const { data: popularServices, isLoading: servicesLoading } = usePopularServices()
  const { data: locationStats, isLoading: locationLoading } = useLocationStats()
  const { data: topReferrers, isLoading: referrersLoading } = useTopReferrers()
  const { data: recentViews, isLoading: recentLoading } = useRecentPageViews(20)
  const { data: totalStats, isLoading: totalStatsLoading } = useTotalStats()
  const { data: consentStats, isLoading: consentLoading } = useConsentStats()

  if (summaryLoading && totalStatsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="animate-spin text-primary" size={32} />
        <span className="ml-2 text-muted-foreground">Loading analytics...</span>
      </div>
    )
  }

  // Calculate totals from summary
  const totalViews = summary?.reduce((sum, day) => sum + (day.total_page_views || 0), 0) || 0
  const totalSessions = summary?.reduce((sum, day) => sum + (day.total_sessions || 0), 0) || 0
  
  // Device breakdown from summary
  const deviceBreakdown = summary?.reduce((acc, day) => {
    if (day.device_breakdown) {
      Object.entries(day.device_breakdown).forEach(([device, count]) => {
        acc[device] = (acc[device] || 0) + (count as number)
      })
    }
    return acc
  }, {} as Record<string, number>) || {}
  
  const totalDeviceViews = Object.values(deviceBreakdown).reduce((sum, count) => sum + count, 0) || 1
  const mobilePercentage = Math.round(((deviceBreakdown.mobile || 0) / totalDeviceViews) * 100)
  const desktopPercentage = Math.round(((deviceBreakdown.desktop || 0) / totalDeviceViews) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-heading">Analytics Dashboard</CardTitle>
              <CardDescription className="mt-2">
                Website traffic, visitor insights, and performance metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Page Views</p>
                <p className="text-3xl font-bold mt-2">{totalStats?.totalPageViews.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye size={24} className="text-blue-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-3xl font-bold mt-2">{totalStats?.uniqueVisitors.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users size={24} className="text-green-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Views */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Service Views</p>
                <p className="text-3xl font-bold mt-2">{totalStats?.totalServiceViews.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendUp size={24} className="text-purple-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countries Reached */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries</p>
                <p className="text-3xl font-bold mt-2">{locationStats?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Unique locations</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Globe size={24} className="text-orange-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Device Breakdown</CardTitle>
          <CardDescription>Visitor device preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <DeviceMobile size={32} className="text-blue-600" weight="fill" />
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="text-2xl font-bold">{mobilePercentage}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <Desktop size={32} className="text-green-600" weight="fill" />
              <div>
                <p className="text-sm text-muted-foreground">Desktop</p>
                <p className="text-2xl font-bold">{desktopPercentage}%</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <ChartBar size={32} className="text-purple-600" weight="fill" />
              <div>
                <p className="text-sm text-muted-foreground">Tablet</p>
                <p className="text-2xl font-bold">{100 - mobilePercentage - desktopPercentage}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Consent Statistics (GDPR Compliance) */}
      <Card className="border-orange-200 bg-linear-to-br from-orange-50/50 to-amber-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cookie size={24} className="text-orange-600" weight="fill" />
            <div>
              <CardTitle className="text-lg">GDPR Cookie Consent</CardTitle>
              <CardDescription>User consent preferences breakdown</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {consentLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="animate-spin text-primary" size={24} />
            </div>
          ) : consentStats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-4 p-4 bg-white/80 rounded-lg border border-orange-200 shadow-sm">
                  <ShieldCheck size={32} className="text-orange-600" weight="fill" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Consents</p>
                    <p className="text-2xl font-bold">{consentStats.totalConsents.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <ChartBar size={32} className="text-blue-600" weight="fill" />
                  <div>
                    <p className="text-sm text-muted-foreground">Analytics</p>
                    <p className="text-2xl font-bold">{consentStats.analyticsPercentage}%</p>
                    <p className="text-xs text-muted-foreground">{consentStats.analyticsAccepted} users</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <Globe size={32} className="text-purple-600" weight="fill" />
                  <div>
                    <p className="text-sm text-muted-foreground">Marketing</p>
                    <p className="text-2xl font-bold">{consentStats.marketingPercentage}%</p>
                    <p className="text-xs text-muted-foreground">{consentStats.marketingAccepted} users</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <Users size={32} className="text-green-600" weight="fill" />
                  <div>
                    <p className="text-sm text-muted-foreground">Preferences</p>
                    <p className="text-2xl font-bold">{consentStats.preferencesPercentage}%</p>
                    <p className="text-xs text-muted-foreground">{consentStats.preferencesAccepted} users</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-white/60 border border-orange-200 rounded-lg p-4">
                <p className="flex items-center gap-2">
                  <Cookie size={16} className="text-orange-600" />
                  <strong>GDPR Compliance:</strong> Only users who have consented to analytics cookies are being tracked.
                </p>
              </div>
            </>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No consent data available</p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Popular Pages
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Services
          </TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Locations
          </TabsTrigger>
          <TabsTrigger value="referrers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Referrers
          </TabsTrigger>
        </TabsList>

        {/* Popular Pages */}
        <TabsContent value="pages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Pages (Last 30 Days)</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              {pagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="animate-spin text-primary" size={24} />
                </div>
              ) : popularPages && popularPages.length > 0 ? (
                <div className="space-y-3">
                  {popularPages.map((page, index) => (
                    <div key={page.page_slug} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="secondary" className="font-mono">
                          #{index + 1}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{page.page_title || page.page_slug}</p>
                          <p className="text-xs text-muted-foreground">{page.page_slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-semibold">{page.view_count.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{page.unique_visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">visitors</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No page data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Popular Services */}
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Services (Last 30 Days)</CardTitle>
              <CardDescription>Most viewed services</CardDescription>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="animate-spin text-primary" size={24} />
                </div>
              ) : popularServices && popularServices.length > 0 ? (
                <div className="space-y-3">
                  {popularServices.map((service, index) => (
                    <div key={service.service_id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="secondary" className="font-mono">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium flex-1">{service.service_name}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-semibold">{service.view_count.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">views</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{service.unique_visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">visitors</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No service data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Statistics */}
        <TabsContent value="locations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin size={20} weight="fill" />
                Visitor Locations
              </CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent>
              {locationLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="animate-spin text-primary" size={24} />
                </div>
              ) : locationStats && locationStats.length > 0 ? (
                <div className="space-y-3">
                  {locationStats.map((location, index) => (
                    <div key={location.country} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="secondary" className="font-mono">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium flex-1">{location.country}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-semibold">{location.visit_count.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">visits</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{location.unique_visitors.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">visitors</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No location data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Referrers */}
        <TabsContent value="referrers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRight size={20} weight="fill" />
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {referrersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="animate-spin text-primary" size={24} />
                </div>
              ) : topReferrers && topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {topReferrers.map((referrer, index) => (
                    <div key={referrer.referrer_domain} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="secondary" className="font-mono">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium flex-1">{referrer.referrer_domain || 'Direct Traffic'}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-semibold">{referrer.total_visits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">visits</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No referrer data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Page Views</CardTitle>
          <CardDescription>Latest visitor activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="animate-spin text-primary" size={24} />
            </div>
          ) : recentViews && recentViews.length > 0 ? (
            <div className="space-y-2">
              {recentViews.map((view) => (
                <div key={view.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg text-sm">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="text-xs">
                      {view.device_type || 'unknown'}
                    </Badge>
                    <p className="flex-1 truncate">{view.page_title || view.page_slug}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {view.country && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {view.city ? `${view.city}, ${view.country}` : view.country}
                      </span>
                    )}
                    <span>{new Date(view.viewed_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
