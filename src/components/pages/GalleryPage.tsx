import { useState } from 'react'
import { usePageSEO } from '../../hooks/usePageSEO'
import { useVideos, type Video } from '../../hooks/useVideos'
import { usePhotos } from '../../hooks/usePhotos'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { PlayCircle, Images, Sparkle, Funnel, SquaresFour, List, CircleNotch } from '@phosphor-icons/react'
import { videos as defaultVideos } from '../../lib/data'

interface Photo {
  id: string
  url: string
  title: string
  category: string
}

const defaultPhotos: Photo[] = [
  {
    id: '1',
    url: '/images/Raj 1.jpg',
    title: 'Sacred Ceremony Moment',
    category: 'ceremony'
  },
  {
    id: '2',
    url: '/images/Raj 2.jpg',
    title: 'Spiritual Guidance',
    category: 'ceremony'
  },
  {
    id: '3',
    url: '/images/Raj 3.jpg',
    title: 'Traditional Rituals',
    category: 'ceremony'
  },
  {
    id: '4',
    url: '/images/Pooja 1.jpg',
    title: 'Pooja Ceremony',
    category: 'pooja'
  },
  {
    id: '5',
    url: '/images/Pooja 2.jpg',
    title: 'Divine Offerings',
    category: 'pooja'
  },
  {
    id: '6',
    url: '/images/Pooja 3.jpg',
    title: 'Sacred Worship',
    category: 'pooja'
  }
]

export default function GalleryPage() {
  usePageSEO({
    title: 'Hindu Ceremony Photos & Pooja Videos | Religious Rituals Gallery Ireland',
    description: 'View gallery of Hindu ceremonies, pooja rituals, and spiritual services. Photos and videos of authentic Hindu traditions performed in Ireland and UK.',
    keywords: 'Hindu ceremonies photos, pooja videos, ritual gallery, Hindu services, spiritual events, religious ceremonies Ireland',
    canonicalUrl: 'https://panditrajesh.ie/gallery'
  })

  const { videos: dbVideos, isLoading: loadingVideos } = useVideos()
  const { photos: dbPhotos, isLoading: loadingPhotos } = usePhotos()
  
  // Use database data if available, otherwise fall back to defaults
  const videos = (dbVideos && dbVideos.length > 0) ? dbVideos : defaultVideos as Video[]
  const photos = (dbPhotos && dbPhotos.length > 0) ? dbPhotos : defaultPhotos
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<'all' | Video['category']>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('videos')

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

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section with Sunrise Effect */}
      <section className="relative pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden">
        {/* Background decoration with animated rolling images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex gap-0 animate-scroll-left w-max h-full">
            {['/images/Raj 1.jpg', '/images/Raj 2.jpg', '/images/Pooja 1.jpg', '/images/Golden Temples of Devotion.png'].map((img, index) => (
              <img
                key={`bg-1-${index}`}
                src={img}
                alt=""
                className="h-full w-auto object-contain opacity-40 shrink-0"
                loading="lazy"
                decoding="async"
              />
            ))}
            {['/images/Raj 1.jpg', '/images/Raj 2.jpg', '/images/Pooja 1.jpg', '/images/Golden Temples of Devotion.png'].map((img, index) => (
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-700 via-amber-700 to-orange-800 text-white px-6 py-3 rounded-full text-base font-semibold mb-6 shadow-2xl shadow-orange-800/40 backdrop-blur-sm border border-orange-600/30 tracking-wide" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.05em' }}>
              <Images size={18} weight="fill" className="animate-pulse" />
              Divine Moments
            </div>

            <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl mb-6 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-fade-in-up animation-delay-200 animate-breathe">
              Sacred <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">Gallery</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
              Immerse yourself in the divine beauty of Hindu ceremonies, pooja rituals, and spiritual moments captured in sacred time
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setActiveTab('videos')}
                className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white hover:from-slate-800 hover:via-slate-900 hover:to-black shadow-2xl hover:shadow-3xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 border-2 border-slate-600/40"
              >
                <PlayCircle size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                Watch Sacred Videos
              </Button>
              <Button
                size="lg"
                onClick={() => setActiveTab('photos')}
                className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-700 via-amber-700 to-orange-800 text-white hover:from-orange-800 hover:via-amber-800 hover:to-orange-900 shadow-2xl hover:shadow-3xl shadow-orange-800/50 transition-all duration-300 hover:scale-105 border-2 border-orange-600/40"
              >
                <Images size={24} className="mr-3 group-hover:scale-110 transition-transform" weight="fill" />
                View Divine Photos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">200+</div>
              <div className="text-sm text-muted-foreground font-medium">Ceremonies</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/5 backdrop-blur-sm border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Videos</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-sm text-muted-foreground font-medium">Photos</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/5 backdrop-blur-sm border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">15+</div>
              <div className="text-sm text-muted-foreground font-medium">Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Enhanced Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation with Enhanced Design */}
            <div className="flex flex-col items-center mb-12">
              <TabsList className="grid w-full max-w-lg grid-cols-2 h-14 p-1 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 shadow-lg backdrop-blur-sm">
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-3 px-8 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <PlayCircle size={20} weight="fill" />
                  Sacred Videos
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                    {videos.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent/80 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-3 px-8 py-3 text-base font-semibold transition-all duration-300 hover:scale-105 rounded-lg"
                >
                  <Images size={20} weight="fill" />
                  Divine Photos
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                    {photos.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 mt-6 p-1 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm">
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

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <SquaresFour size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List size={16} />
              </Button>
            </div>

          <TabsContent value="videos" className="space-y-8">
            {/* Video Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
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
              <div className="flex justify-center items-center py-12">
                <CircleNotch className="animate-spin text-primary" size={48} />
              </div>
            ) : (
            <div className={`grid gap-6 overflow-hidden ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-6">
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
              <div className="flex justify-center items-center py-12">
                <CircleNotch className="animate-spin text-primary" size={48} />
              </div>
            ) : !photos || photos.length === 0 ? (
              <Card className="border-0 shadow-xl bg-linear-to-br from-muted/50 to-muted/20">
                <CardContent className="p-12 md:p-16 text-center">
                  <div className="relative mb-8">
                    <Images className="mx-auto text-muted-foreground" size={80} />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full">
                      <Sparkle size={16} weight="fill" />
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-2xl mb-4">Photo Gallery Coming Soon</h3>

                  <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                    We're carefully curating a beautiful collection of ceremony photographs that capture
                    the sacred moments and spiritual essence of Hindu traditions. These images will showcase
                    the beauty and depth of our ceremonial work.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="px-6" onClick={() => setActiveTab('videos')}>
                      <PlayCircle className="mr-2" size={18} />
                      Browse Videos Instead
                    </Button>
                    <Button variant="ghost" className="px-6">
                      Get Notified When Ready
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Rolling Photo Gallery */}
                <div className="mb-8 overflow-hidden">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-center">
                    Moments of <span className="text-primary">Devotion & Service</span>
                  </h2>
                  <div className="relative w-full h-64 md:h-80 lg:h-96">
                    <div className="absolute inset-0 flex gap-4">
                      <div className="flex gap-4 animate-scroll-left">
                        {photos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.title}
                            className="h-64 md:h-80 lg:h-96 w-auto object-cover rounded-lg shadow-lg"
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                        {/* Duplicate for seamless loop */}
                        {photos.map((photo) => (
                          <img
                            key={`${photo.id}-duplicate`}
                            src={photo.url}
                            alt={photo.title}
                            className="h-64 md:h-80 lg:h-96 w-auto object-cover rounded-lg shadow-lg"
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </section>
    </div>
  )
}
