import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Card, CardContent } from '../ui/card'
import { PlayCircle, Images } from '@phosphor-icons/react'
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

export default function GalleryPage() {
  const [adminVideos] = useKV<Video[]>('admin-videos', defaultVideos as Video[])
  const [adminPhotos] = useKV<Photo[]>('admin-photos', [])
  const videos = adminVideos || defaultVideos
  const photos = adminPhotos || []
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<'all' | 'educational' | 'poetry' | 'charity' | 'podcast'>('all')

  const filteredVideos = selectedVideoCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedVideoCategory)

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <div className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of ceremony photos and educational videos
          </p>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PlayCircle className="mr-2" size={20} />
              Videos
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Images className="mr-2" size={20} />
              Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-8">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedVideoCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All Videos
              </button>
              <button
                onClick={() => setSelectedVideoCategory('educational')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoCategory === 'educational'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Educational
              </button>
              <button
                onClick={() => setSelectedVideoCategory('poetry')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoCategory === 'poetry'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Poetry
              </button>
              <button
                onClick={() => setSelectedVideoCategory('charity')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoCategory === 'charity'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Charity Work
              </button>
              <button
                onClick={() => setSelectedVideoCategory('podcast')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoCategory === 'podcast'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Podcasts
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVideos.map(video => (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-lg mb-1">{video.title}</h3>
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {video.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            {!photos || photos.length === 0 ? (
              <div className="text-center py-16">
                <Images className="mx-auto mb-4 text-muted-foreground" size={64} />
                <h3 className="font-heading font-semibold text-2xl mb-2">Photo Gallery Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We are currently curating a beautiful collection of ceremony photos. Please check back soon or view our video content.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-lg mb-1">{photo.title}</h3>
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {photo.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
