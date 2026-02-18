import { useState, useEffect } from 'react'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import { useVideos, type Video } from '../../hooks/useVideos'
import { usePhotos } from '../../hooks/usePhotos'
import { useGalleryContent } from '../../hooks/useCmsContent'
import { supabase } from '../../lib/supabase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { PlayCircle, Images, Sparkle, Funnel, SquaresFour, List, CircleNotch, X, CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react'
import { renderHighlightedTitle } from '../../utils/renderHighlight'

interface Photo {
  id: string
  url: string
  title: string
  category: string
}

export default function GalleryPage() {
  usePageMetadata('gallery')

  const { content: galleryContent, isLoading: loadingGalleryContent } = useGalleryContent()
  const { videos, isLoading: loadingVideos } = useVideos()

  // ── Published gallery categories ──────────────────────────────────────────
  // Loaded from site_metadata; empty set = no filter applied (show all).
  const [publishedCats, setPublishedCats] = useState<string[]>([])
  const [loadingPublished, setLoadingPublished] = useState(true)

  useEffect(() => {
    supabase
      .from('site_metadata')
      .select('setting_value')
      .eq('setting_key', 'gallery_published_categories')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.setting_value) {
          try { setPublishedCats(JSON.parse(data.setting_value)) } catch { /* ignore */ }
        }
        setLoadingPublished(false)
      })
  }, [])

  const [photoPage, setPhotoPage] = useState(1)
  const photoPageSize = 24

  // Show only published categories; if none configured show all
  const photosCategories: string[] | undefined =
    publishedCats.length > 0 ? publishedCats : undefined

  const { photos, isLoading: loadingPhotos, total: totalPhotos, totalPages: photoTotalPages } = usePhotos({
    page: photoPage,
    limit: photoPageSize,
    categories: photosCategories
  })
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<'all' | Video['category']>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('videos')
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title: string } | null>(null)

  // Reset to page 1 when published set changes
  useEffect(() => {
    setPhotoPage(1)
  }, [publishedCats])

  const filteredVideos = selectedVideoCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedVideoCategory)

  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return ''
    
    // Handle various YouTube URL formats
    let videoId = ''
    
    // youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    }
    // youtube.com/watch?v=VIDEO_ID
    else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    }
    // youtube.com/embed/VIDEO_ID
    else if (url.includes('/embed/')) {
      videoId = url.split('/embed/')[1]?.split('?')[0] || ''
    }
    // youtube.com/v/VIDEO_ID
    else if (url.includes('/v/')) {
      videoId = url.split('/v/')[1]?.split('?')[0] || ''
    }
    // youtube.com/shorts/VIDEO_ID
    else if (url.includes('/shorts/')) {
      videoId = url.split('/shorts/')[1]?.split('?')[0] || ''
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  const categoryColors: Record<string, string> = {
    educational: 'bg-blue-100 text-blue-800 border-blue-200',
    poetry: 'bg-purple-100 text-purple-800 border-purple-200',
    charity: 'bg-green-100 text-green-800 border-green-200',
    podcast: 'bg-orange-100 text-orange-800 border-orange-200',
    ceremony: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Show loading state while fetching content to prevent flash of placeholder text
  if (loadingGalleryContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {galleryContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-1-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
            {galleryContent.hero.backgroundImages.map((img, index) => (
              <img
                key={`bg-2-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>

        {/* Sunrise gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-orange-900/60 via-amber-600/30 to-sky-700/40"></div>

        {/* Sun glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-radial from-amber-300/50 via-orange-400/30 to-transparent animate-sunrise-glow"></div>

        {/* Light rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-full h-full opacity-30 animate-sunrise-rays" style={{background: 'conic-gradient(from 180deg, transparent 0deg, rgba(251, 191, 36, 0.4) 10deg, transparent 20deg, transparent 30deg, rgba(251, 191, 36, 0.3) 40deg, transparent 50deg, transparent 60deg, rgba(251, 191, 36, 0.4) 70deg, transparent 80deg, transparent 90deg, rgba(251, 191, 36, 0.3) 100deg, transparent 110deg, transparent 120deg, rgba(251, 191, 36, 0.4) 130deg, transparent 140deg, transparent 150deg, rgba(251, 191, 36, 0.3) 160deg, transparent 170deg, transparent 180deg)'}}></div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <Images size={18} weight="fill" className="animate-pulse" />
              {galleryContent.hero.badge}
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              {renderHighlightedTitle(galleryContent.hero.title)}
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              {galleryContent.hero.subtitle}
            </p>

            {/* Stats - Compact inline version */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8">
              {galleryContent.hero.statistics?.map((stat, index) => (
                <span key={index} className="text-base md:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[110px] text-center" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  <span className="font-extrabold text-transparent bg-linear-to-br from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-xl md:text-2xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">{stat.value}</span>{' '}
                  <span className="font-semibold text-white/95">{stat.label}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {galleryContent.hero.ctaButtons?.map((btn, index) => (
                <Button
                  key={index}
                  size="lg"
                  onClick={() => {
                    if (btn.link === '#videos') setActiveTab('videos')
                    else if (btn.link === '#photos') setActiveTab('photos')
                    else if (btn.link.startsWith('#')) {
                      const el = document.querySelector(btn.link)
                      el?.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      window.location.href = btn.link
                    }
                  }}
                  className={`group px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 ${
                    btn.variant === 'outline' 
                      ? 'bg-linear-to-r from-slate-700 via-slate-800 to-slate-900 text-white hover:from-slate-800 hover:via-slate-900 hover:to-black shadow-slate-900/50 border-slate-600/40'
                      : 'bg-linear-to-r from-orange-700 via-amber-700 to-orange-800 text-white hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 shadow-orange-800/50 border-orange-600/40'
                  }`}
                >
                  {btn.variant === 'outline' ? (
                    <PlayCircle size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                  ) : (
                    <Images size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                  )}
                  {btn.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Content */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Enhanced Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation with Enhanced Design - Mobile Optimized */}
            <div className="flex flex-col items-center mb-7">
              <TabsList className="grid w-full max-w-lg grid-cols-2 h-auto sm:h-14 p-1 bg-linear-to-r from-primary/5 to-accent/5 border border-primary/10 shadow-lg backdrop-blur-sm">
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-8 py-2 sm:py-3 text-xs sm:text-base font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <PlayCircle size={18} className="sm:size-5" weight="fill" />
                    <span className="text-xs sm:text-base">Sacred Videos</span>
                  </div>
                  <Badge variant="secondary" className="sm:ml-2 bg-orange-800 data-[state=active]:bg-orange-900 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 font-bold shadow-sm">
                    {videos.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-linear-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-2 sm:px-8 py-2 sm:py-3 text-xs sm:text-base font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Images size={18} className="sm:size-5" weight="fill" />
                    <span className="text-xs sm:text-base">Divine Photos</span>
                  </div>
                  <Badge variant="secondary" className="sm:ml-2 bg-amber-800 data-[state=active]:bg-amber-900 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 font-bold shadow-sm">
                    {totalPhotos}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 mt-4 p-1 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-4 py-2"
                >
                  <SquaresFour size={16} className="mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2"
                >
                  <List size={16} className="mr-2" />
                  List
                </Button>
              </div>
            </div>

          <TabsContent value="videos" className="space-y-5">
            {/* Video Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              <Button
                variant={selectedVideoCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('all')}
                className="rounded-full"
              >
                <Funnel size={14} className="mr-2" />
                All Videos ({videos.length})
              </Button>
              <Button
                variant={selectedVideoCategory === 'educational' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('educational')}
                className="rounded-full"
              >
                Educational ({videos.filter(v => v.category === 'educational').length})
              </Button>
              <Button
                variant={selectedVideoCategory === 'ceremony' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('ceremony')}
                className="rounded-full"
              >
                Ceremony ({videos.filter(v => v.category === 'ceremony').length})
              </Button>
              <Button
                variant={selectedVideoCategory === 'poetry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('poetry')}
                className="rounded-full"
              >
                Poetry ({videos.filter(v => v.category === 'poetry').length})
              </Button>
              <Button
                variant={selectedVideoCategory === 'charity' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('charity')}
                className="rounded-full"
              >
                Charity ({videos.filter(v => v.category === 'charity').length})
              </Button>
              <Button
                variant={selectedVideoCategory === 'podcast' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedVideoCategory('podcast')}
                className="rounded-full"
              >
                Podcasts ({videos.filter(v => v.category === 'podcast').length})
              </Button>
            </div>

            {/* Videos Grid */}
            {loadingVideos ? (
              <div className="flex justify-center items-center py-7">
                <CircleNotch className="animate-spin text-primary" size={48} />
              </div>
            ) : (
            <div className={`grid gap-4 overflow-hidden ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredVideos.map((video, index) => {
                const embedUrl = getYouTubeEmbedUrl(video.url)
                const videoId = embedUrl ? embedUrl.split('/embed/')[1] : ''
                const thumbnailUrl = video.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '')
                
                return (
                <Card key={video.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-linear-to-br from-card to-card/80">
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden cursor-pointer" onClick={() => video.url && window.open(video.url, '_blank')}>
                      {thumbnailUrl ? (
                        <>
                          <img 
                            src={thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                            <div className="bg-red-600 rounded-full p-4 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                              <PlayCircle size={40} weight="fill" className="text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <PlayCircle size={48} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryColors[video.category] || 'bg-gray-100 text-gray-800 border-gray-200'} border`}>
                          {video.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 bg-linear-to-r from-orange-600 to-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border border-orange-400/30">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <PlayCircle size={14} className="text-primary" />
                          Watch on YouTube
                        </div>
                        <button 
                          className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium transition-colors duration-200"
                          onClick={() => video.url && window.open(video.url, '_blank')}
                        >
                          Watch →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
            )}
          </TabsContent>

          <TabsContent value="photos">

            {loadingPhotos ? (
              <div className="flex justify-center items-center py-7">
                <CircleNotch className="animate-spin text-primary" size={48} />
              </div>
            ) : !photos || photos.length === 0 ? (
              <Card className="border-0 shadow-xl bg-linear-to-br from-muted/50 to-muted/20">
                <CardContent className="p-7 md:p-10 text-center">
                  <div className="relative mb-8">
                    <Images className="mx-auto text-muted-foreground" size={80} />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full">
                      <Sparkle size={16} weight="fill" />
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-2xl mb-4">
                    Photo Gallery Coming Soon
                  </h3>

                  <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                    We're carefully curating a beautiful collection of ceremony photographs that capture the sacred moments and spiritual essence of Hindu traditions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="px-6" onClick={() => setActiveTab('videos')}>
                      <PlayCircle className="mr-2" size={18} />
                      Browse Videos Instead
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Photo Grid / List */}
                <div className={`grid gap-3 md:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {photos.map((photo) => (
                    viewMode === 'grid' ? (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                      onClick={() => setLightboxPhoto({ url: photo.url, title: photo.title })}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 text-primary p-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <MagnifyingGlass size={24} weight="bold" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium truncate drop-shadow-lg">{photo.title}</p>
                      </div>
                    </div>
                    ) : (
                    <Card
                      key={photo.id}
                      className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setLightboxPhoto({ url: photo.url, title: photo.title })}
                    >
                      <CardContent className="p-0 flex flex-row items-center gap-4">
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 overflow-hidden rounded-l-xl">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30">
                            <div className="bg-white/90 text-primary p-2 rounded-full shadow-xl">
                              <MagnifyingGlass size={20} weight="bold" />
                            </div>
                          </div>
                        </div>
                        <div className="py-3 pr-4 flex-1 min-w-0">
                          <h3 className="font-heading font-semibold text-base mb-1 group-hover:text-primary transition-colors truncate">
                            {photo.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {photoTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPhotoPage(p => Math.max(1, p - 1))}
                      disabled={photoPage <= 1}
                    >
                      <CaretLeft size={16} className="mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(photoTotalPages, 7) }, (_, i) => {
                        let page: number
                        if (photoTotalPages <= 7) {
                          page = i + 1
                        } else if (photoPage <= 4) {
                          page = i + 1
                        } else if (photoPage >= photoTotalPages - 3) {
                          page = photoTotalPages - 6 + i
                        } else {
                          page = photoPage - 3 + i
                        }
                        return (
                          <Button
                            key={page}
                            variant={photoPage === page ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setPhotoPage(page)}
                            className="w-9 h-9 p-0"
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPhotoPage(p => Math.min(photoTotalPages, p + 1))}
                      disabled={photoPage >= photoTotalPages}
                    >
                      Next
                      <CaretRight size={16} className="ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => setLightboxPhoto(null)}
          >
            <X size={32} weight="bold" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {lightboxPhoto.title && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm">
                {lightboxPhoto.title}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
