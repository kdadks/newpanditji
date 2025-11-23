import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePageSEO } from '../../hooks/usePageSEO'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { PlayCircle, Images, Sparkle, Funnel, SquaresFour, List } from '@phosphor-icons/react'
import { videos as defaultVideos } from '../../lib/data'

interface Photo {
  id: string
  url: string
  title: string
  category: string
}

interface Video {
  id: string
  title: string
  category: 'educational' | 'poetry' | 'charity' | 'podcast'
  url: string
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

  const [adminVideos] = useLocalStorage<Video[]>('admin-videos', defaultVideos as Video[])
  const [adminPhotos] = useLocalStorage<Photo[]>('admin-photos', defaultPhotos)
  const videos = adminVideos || defaultVideos
  const photos = (adminPhotos && adminPhotos.length > 0) ? adminPhotos : defaultPhotos
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<'all' | 'educational' | 'poetry' | 'charity' | 'podcast'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('videos')

  const filteredVideos = selectedVideoCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedVideoCategory)

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  const categoryColors = {
    educational: 'bg-blue-100 text-blue-800 border-blue-200',
    poetry: 'bg-purple-100 text-purple-800 border-purple-200',
    charity: 'bg-green-100 text-green-800 border-green-200',
    podcast: 'bg-orange-100 text-orange-800 border-orange-200'
  }

  return (
    <div className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkle size={16} weight="fill" />
            Sacred Moments & Wisdom
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
            Our <span className="text-primary">Gallery</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our collection of ceremony memories, educational content, and spiritual insights
            that capture the essence of Hindu traditions and wisdom.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{videos.length}+</div>
            <div className="text-sm text-muted-foreground">Educational Videos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{photos.length}</div>
            <div className="text-sm text-muted-foreground">Ceremony Photos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Spiritual Support</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 sm:mb-0">
              <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
                <PlayCircle size={18} />
                Videos
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2">
                <Images size={18} />
                Photos
              </TabsTrigger>
            </TabsList>

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
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredVideos.map((video, index) => (
                <Card key={video.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/80 hover:scale-105">
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryColors[video.category]} border`}>
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
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto">
                          Watch →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            {!photos || photos.length === 0 ? (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-muted/50 to-muted/20">
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
    </div>
  )
}
